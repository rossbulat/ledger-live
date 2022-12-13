"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.createAction = void 0;
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var react_1 = require("react");
var logs_1 = require("@ledgerhq/logs");
var observable_1 = require("../../observable");
var isEqual_1 = __importDefault(require("lodash/isEqual"));
var errors_1 = require("../../errors");
var app_1 = require("./app");
var errors_2 = require("@ledgerhq/errors");
var devices_1 = require("@ledgerhq/devices");
var mapResult = function (_a) {
    var imageHash = _a.imageHash;
    return ({ imageHash: imageHash });
};
var getInitialState = function (device) { return ({
    isLoading: !!device,
    requestQuitApp: false,
    unresponsive: false,
    device: device,
    deviceInfo: null,
    error: null
}); };
var reducer = function (state, e) {
    switch (e.type) {
        case "unresponsiveDevice":
            return __assign(__assign({}, state), { unresponsive: true, isLoading: false });
        case "deviceChange":
            return getInitialState(e.device);
        case "error":
            return __assign(__assign({}, getInitialState(state.device)), { error: e.error, isLoading: false });
        case "appDetected":
            return __assign(__assign({}, state), { unresponsive: false, requestQuitApp: true, isLoading: false });
        case "loadImagePermissionRequested":
            return __assign(__assign({}, state), { unresponsive: false, imageLoadRequested: true, isLoading: false });
        case "commitImagePermissionRequested":
            return __assign(__assign({}, state), { unresponsive: false, imageCommitRequested: true, loadingImage: false, isLoading: false });
        case "imageLoaded":
            return __assign(__assign({}, state), { unresponsive: false, imageLoadRequested: false, imageCommitRequested: false, isLoading: false, loadingImage: false, imageLoaded: true });
        case "progress":
            return __assign(__assign({}, state), { unresponsive: false, imageLoadRequested: false, imageCommitRequested: false, isLoading: false, loadingImage: true, progress: e.progress });
    }
};
var implementations = {
    // in this paradigm, we know that deviceSubject is reflecting the device events
    // so we just trust deviceSubject to reflect the device context (switch between apps, dashboard,...)
    event: function (_a) {
        var deviceSubject = _a.deviceSubject, loadImage = _a.loadImage, language = _a.language;
        return deviceSubject.pipe((0, operators_1.debounceTime)(1000), (0, operators_1.switchMap)(function (d) { return loadImage(d, language); }));
    },
    // in this paradigm, we can't observe directly the device, so we have to poll it
    polling: function (_a) {
        var deviceSubject = _a.deviceSubject, loadImage = _a.loadImage, language = _a.language;
        return new rxjs_1.Observable(function (o) {
            var POLLING = 2000;
            var INIT_DEBOUNCE = 5000;
            var DISCONNECT_DEBOUNCE = 5000;
            var DEVICE_POLLING_TIMEOUT = 60000;
            // this pattern allows to actually support events based (like if deviceSubject emits new device changes) but inside polling paradigm
            var pollingOnDevice;
            var sub = deviceSubject.subscribe(function (d) {
                if (d) {
                    pollingOnDevice = d;
                }
            });
            var initT = setTimeout(function () {
                // initial timeout to unset the device if it's still not connected
                o.next({
                    type: "deviceChange",
                    device: null
                });
                device = null;
                (0, logs_1.log)("actions-load-fts-image-event/polling", "device init timeout");
            }, INIT_DEBOUNCE);
            var connectSub;
            var loopT;
            var disconnectT;
            var device = null; // used as internal state for polling
            var stopDevicePollingError = null;
            function loop() {
                stopDevicePollingError = null;
                if (!pollingOnDevice) {
                    loopT = setTimeout(loop, POLLING);
                    return;
                }
                (0, logs_1.log)("actions-load-fts-image-event/polling", "polling loop");
                connectSub = loadImage(pollingOnDevice, language)
                    .pipe((0, operators_1.timeout)(DEVICE_POLLING_TIMEOUT), (0, operators_1.catchError)(function (err) {
                    var productName = (0, devices_1.getDeviceModel)(pollingOnDevice.modelId).productName;
                    return err instanceof rxjs_1.TimeoutError
                        ? (0, rxjs_1.of)({
                            type: "error",
                            error: new errors_1.ConnectManagerTimeout(undefined, {
                                productName: productName
                            })
                        })
                        : (0, rxjs_1.throwError)(err);
                }))
                    .subscribe({
                    next: function (event) {
                        if (initT && device) {
                            clearTimeout(initT);
                            initT = null;
                        }
                        if (disconnectT) {
                            // any connect app event unschedule the disconnect debounced event
                            clearTimeout(disconnectT);
                            disconnectT = null;
                        }
                        if (event.type === "error" && event.error) {
                            if (event.error instanceof errors_2.DisconnectedDevice ||
                                event.error instanceof errors_2.DisconnectedDeviceDuringOperation) {
                                // disconnect on manager actions seems to trigger a type "error" instead of "disconnect"
                                // the disconnect event is delayed to debounce the reconnection that happens when switching apps
                                disconnectT = setTimeout(function () {
                                    disconnectT = null;
                                    // a disconnect will locally be remembered via locally setting device to null...
                                    device = null;
                                    o.next(event);
                                    (0, logs_1.log)("actions-load-fts-image-event/polling", "device disconnect timeout");
                                }, DISCONNECT_DEBOUNCE);
                            }
                            else {
                                // These error events should stop polling
                                stopDevicePollingError = event.error;
                                // clear all potential polling loops
                                if (loopT) {
                                    clearTimeout(loopT);
                                    loopT = null;
                                }
                                // send in the event for the UI immediately
                                o.next(event);
                            }
                        }
                        else if (event.type === "unresponsiveDevice") {
                            return; // ignore unresponsive case which happens for polling
                        }
                        else {
                            if (device !== pollingOnDevice) {
                                // ...but any time an event comes back, it means our device was responding and need to be set back on in polling context
                                device = pollingOnDevice;
                                o.next({
                                    type: "deviceChange",
                                    device: device
                                });
                            }
                            o.next(event);
                        }
                    },
                    complete: function () {
                        // start a new polling if available
                        if (!stopDevicePollingError)
                            loopT = setTimeout(loop, POLLING);
                    },
                    error: function (e) {
                        o.error(e);
                    }
                });
            }
            // delay a bit the first loop run in order to be async and wait pollingOnDevice
            loopT = setTimeout(loop, 0);
            return function () {
                if (initT)
                    clearTimeout(initT);
                if (disconnectT)
                    clearTimeout(disconnectT);
                if (connectSub)
                    connectSub.unsubscribe();
                sub.unsubscribe();
                clearTimeout(loopT);
            };
        }).pipe((0, operators_1.distinctUntilChanged)(isEqual_1["default"]));
    }
};
var createAction = function (loadImageExec) {
    var loadImage = function (device, hexImage) {
        return (0, rxjs_1.concat)((0, rxjs_1.of)({
            type: "deviceChange",
            device: device
        }), !device
            ? rxjs_1.EMPTY
            : loadImageExec({
                deviceId: device.deviceId,
                hexImage: hexImage
            }).pipe((0, operators_1.catchError)(function (error) {
                return (0, rxjs_1.of)({
                    type: "error",
                    error: error
                });
            })));
    };
    var useHook = function (device, hexImage) {
        var _a = __read((0, react_1.useState)(function () { return getInitialState(device); }), 2), state = _a[0], setState = _a[1];
        var deviceSubject = (0, observable_1.useReplaySubject)(device);
        (0, react_1.useEffect)(function () {
            if (state.imageLoaded)
                return;
            var impl = implementations[app_1.currentMode]({
                deviceSubject: deviceSubject,
                loadImage: loadImage,
                language: hexImage
            });
            var sub = impl
                .pipe(
            // debounce a bit the connect/disconnect event that we don't need
            (0, operators_1.tap)(function (e) { return (0, logs_1.log)("actions-load-fts-image-event", e.type, e); }), 
            // we gather all events with a reducer into the UI state
            (0, operators_1.scan)(reducer, getInitialState()), 
            // we debounce the UI state to not blink on the UI
            (0, operators_1.debounce)(function (s) {
                if (s.loadingImage ||
                    s.imageLoadRequested ||
                    s.imageCommitRequested) {
                    return rxjs_1.EMPTY;
                }
                // default debounce (to be tweak)
                return (0, rxjs_1.interval)(1500);
            })) // the state simply goes into a React state
                .subscribe(setState);
            return function () {
                sub.unsubscribe();
            };
        }, [deviceSubject, hexImage, state.imageLoaded]);
        return __assign({}, state);
    };
    return {
        useHook: useHook,
        mapResult: mapResult
    };
};
exports.createAction = createAction;
//# sourceMappingURL=ftsLoadImage.js.map