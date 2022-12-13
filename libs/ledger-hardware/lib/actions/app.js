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
exports.createAction = exports.setDeviceMode = exports.currentMode = void 0;
var invariant_1 = __importDefault(require("invariant"));
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var isEqual_1 = __importDefault(require("lodash/isEqual"));
var react_1 = require("react");
var logs_1 = require("@ledgerhq/logs");
var devices_1 = require("@ledgerhq/devices");
var derivation_1 = require("../../derivation");
var observable_1 = require("../../observable");
var account_1 = require("../../account");
var apps_1 = require("../../apps");
var errors_1 = require("../../errors");
var account_2 = __importDefault(require("../../generated/account"));
var mapResult = function (_a) {
    var opened = _a.opened, device = _a.device, appAndVersion = _a.appAndVersion, displayUpgradeWarning = _a.displayUpgradeWarning;
    return opened && device && !displayUpgradeWarning
        ? {
            device: device,
            appAndVersion: appAndVersion
        }
        : null;
};
var getInitialState = function (device, request) { return ({
    isLoading: !!device,
    requestQuitApp: false,
    requestOpenApp: null,
    unresponsive: false,
    isLocked: false,
    requiresAppInstallation: null,
    allowOpeningRequestedWording: null,
    allowOpeningGranted: false,
    allowManagerRequestedWording: null,
    allowManagerGranted: false,
    device: null,
    deviceInfo: null,
    latestFirmware: null,
    opened: false,
    appAndVersion: null,
    error: null,
    derivation: null,
    displayUpgradeWarning: false,
    installingApp: false,
    listingApps: false,
    request: request,
    currentAppOp: undefined,
    installQueue: [],
    itemProgress: 0
}); };
var reducer = function (state, e) {
    switch (e.type) {
        case "unresponsiveDevice":
            return __assign(__assign({}, state), { unresponsive: true });
        case "lockedDevice":
            return __assign(__assign({}, state), { isLocked: true });
        // This event does not set isLocked and unresponsive properties, as
        // by itself it does not request anything from the device
        case "device-update-last-seen":
            return __assign(__assign({}, state), { deviceInfo: e.deviceInfo, latestFirmware: e.latestFirmware });
        case "disconnected":
            return __assign(__assign({}, getInitialState(null, state.request)), { isLoading: !!e.expected });
        case "deviceChange":
            return __assign(__assign({}, getInitialState(e.device, state.request)), { device: e.device });
        case "stream-install":
            return {
                isLoading: false,
                requestQuitApp: false,
                requiresAppInstallation: null,
                allowOpeningRequestedWording: null,
                allowOpeningGranted: true,
                allowManagerRequestedWording: null,
                allowManagerGranted: true,
                device: state.device,
                opened: false,
                appAndVersion: null,
                error: null,
                derivation: null,
                displayUpgradeWarning: false,
                unresponsive: false,
                isLocked: false,
                installingApp: true,
                progress: e.progress || 0,
                requestOpenApp: null,
                listingApps: false,
                request: state.request,
                currentAppOp: e.currentAppOp,
                itemProgress: e.itemProgress || 0,
                installQueue: e.installQueue || []
            };
        case "listing-apps":
            return __assign(__assign({}, state), { listingApps: true, unresponsive: false, isLocked: false });
        case "error":
            return __assign(__assign({}, getInitialState(e.device, state.request)), { device: e.device || null, error: e.error, isLoading: false, listingApps: false, request: state.request });
        case "ask-open-app":
            return {
                isLoading: false,
                requestQuitApp: false,
                requiresAppInstallation: null,
                allowOpeningRequestedWording: null,
                allowOpeningGranted: false,
                allowManagerRequestedWording: null,
                allowManagerGranted: false,
                device: state.device,
                opened: false,
                appAndVersion: null,
                error: null,
                derivation: null,
                displayUpgradeWarning: false,
                unresponsive: false,
                isLocked: false,
                requestOpenApp: e.appName,
                request: state.request
            };
        case "ask-quit-app":
            return {
                isLoading: false,
                requestOpenApp: null,
                requiresAppInstallation: null,
                allowOpeningRequestedWording: null,
                allowOpeningGranted: false,
                allowManagerRequestedWording: null,
                allowManagerGranted: false,
                device: state.device,
                opened: false,
                appAndVersion: null,
                error: null,
                derivation: null,
                displayUpgradeWarning: false,
                unresponsive: false,
                isLocked: false,
                requestQuitApp: true,
                request: state.request
            };
        case "device-permission-requested":
            return {
                isLoading: false,
                requestQuitApp: false,
                requestOpenApp: null,
                requiresAppInstallation: null,
                device: state.device,
                opened: false,
                appAndVersion: null,
                error: null,
                derivation: null,
                displayUpgradeWarning: false,
                unresponsive: false,
                isLocked: false,
                allowOpeningGranted: false,
                allowOpeningRequestedWording: null,
                allowManagerGranted: false,
                allowManagerRequestedWording: e.wording,
                request: state.request
            };
        case "device-permission-granted":
            return {
                isLoading: false,
                requestQuitApp: false,
                requestOpenApp: null,
                requiresAppInstallation: null,
                device: state.device,
                opened: false,
                appAndVersion: null,
                error: null,
                derivation: null,
                displayUpgradeWarning: false,
                unresponsive: false,
                isLocked: false,
                allowOpeningGranted: true,
                allowOpeningRequestedWording: null,
                allowManagerGranted: true,
                allowManagerRequestedWording: null,
                request: state.request
            };
        case "app-not-installed":
            return {
                requestQuitApp: false,
                requestOpenApp: null,
                device: state.device,
                opened: false,
                appAndVersion: null,
                error: null,
                derivation: null,
                displayUpgradeWarning: false,
                isLoading: false,
                unresponsive: false,
                isLocked: false,
                allowOpeningGranted: false,
                allowOpeningRequestedWording: null,
                allowManagerGranted: false,
                allowManagerRequestedWording: null,
                requiresAppInstallation: {
                    appNames: e.appNames,
                    appName: e.appName
                },
                request: state.request
            };
        case "opened":
            return {
                requestQuitApp: false,
                requestOpenApp: null,
                requiresAppInstallation: null,
                allowOpeningGranted: false,
                allowOpeningRequestedWording: null,
                allowManagerGranted: false,
                allowManagerRequestedWording: null,
                device: state.device,
                error: null,
                isLoading: false,
                unresponsive: false,
                isLocked: false,
                opened: true,
                appAndVersion: e.app,
                derivation: e.derivation,
                request: state.request,
                displayUpgradeWarning: state.device && e.app
                    ? (0, apps_1.shouldUpgrade)(state.device.modelId, e.app.name, e.app.version)
                    : false
            };
    }
    return state;
};
function inferCommandParams(appRequest) {
    var derivationMode;
    var derivationPath;
    var account = appRequest.account, requireLatestFirmware = appRequest.requireLatestFirmware;
    var appName = appRequest.appName, currency = appRequest.currency, dependencies = appRequest.dependencies;
    if (!currency && account) {
        currency = account.currency;
    }
    if (!appName && currency) {
        appName = currency.managerAppName;
    }
    (0, invariant_1["default"])(appName, "appName or currency or account is missing");
    if (dependencies) {
        dependencies = dependencies.map(function (d) { return inferCommandParams(d).appName; });
    }
    if (!currency) {
        return { appName: appName, dependencies: dependencies, requireLatestFirmware: requireLatestFirmware };
    }
    var extra;
    if (account) {
        derivationMode = account.derivationMode;
        derivationPath = account.freshAddressPath;
        var m = account_2["default"][account.currency.family];
        if (m && m.injectGetAddressParams) {
            extra = m.injectGetAddressParams(account);
        }
    }
    else {
        var modes = (0, derivation_1.getDerivationModesForCurrency)(currency);
        derivationMode = modes[modes.length - 1];
        derivationPath = (0, derivation_1.runDerivationScheme)((0, derivation_1.getDerivationScheme)({
            currency: currency,
            derivationMode: derivationMode
        }), currency);
    }
    return {
        appName: appName,
        dependencies: dependencies,
        requireLatestFirmware: requireLatestFirmware,
        requiresDerivation: __assign({ derivationMode: derivationMode, path: derivationPath, currencyId: currency.id }, extra)
    };
}
var DISCONNECT_DEBOUNCE = 5000;
var implementations = {
    // in this paradigm, we know that deviceSubject is reflecting the device events
    // so we just trust deviceSubject to reflect the device context (switch between apps, dashboard,...)
    event: function (_a) {
        var deviceSubject = _a.deviceSubject, connectApp = _a.connectApp, params = _a.params;
        return deviceSubject.pipe(
        // debounce a bit the disconnect events that we don't need
        (0, operators_1.debounce)(function (device) { return (0, rxjs_1.timer)(!device ? DISCONNECT_DEBOUNCE : 0); }), (0, operators_1.switchMap)(function (device) {
            return (0, rxjs_1.concat)((0, rxjs_1.of)({
                type: "deviceChange",
                device: device
            }), connectApp(device, params));
        }));
    },
    // in this paradigm, we can't observe directly the device, so we have to poll it
    polling: function (_a) {
        var deviceSubject = _a.deviceSubject, params = _a.params, connectApp = _a.connectApp;
        return rxjs_1.Observable.create(function (o) {
            var POLLING = 2000;
            var INIT_DEBOUNCE = 5000;
            var DEVICE_POLLING_TIMEOUT = 20000;
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
                (0, logs_1.log)("app/polling", "device init timeout");
            }, INIT_DEBOUNCE);
            var connectSub;
            var loopT;
            var disconnectT;
            var device = null; // used as internal state for polling
            function loop() {
                if (!pollingOnDevice) {
                    loopT = setTimeout(loop, POLLING);
                    return;
                }
                (0, logs_1.log)("app/polling", "polling loop");
                connectSub = connectApp(pollingOnDevice, params)
                    .pipe((0, operators_1.timeout)(DEVICE_POLLING_TIMEOUT), (0, operators_1.catchError)(function (err) {
                    var productName = (0, devices_1.getDeviceModel)(pollingOnDevice.modelId).productName;
                    return err instanceof rxjs_1.TimeoutError
                        ? (0, rxjs_1.of)({
                            type: "error",
                            error: new errors_1.ConnectAppTimeout(undefined, {
                                productName: productName
                            })
                        })
                        : (0, rxjs_1.throwError)(err);
                }))
                    .subscribe({
                    next: function (event) {
                        if (initT) {
                            clearTimeout(initT);
                            initT = null;
                        }
                        if (disconnectT) {
                            // any connect app event unschedule the disconnect debounced event
                            disconnectT = null;
                            clearTimeout(disconnectT);
                        }
                        if (event.type === "unresponsiveDevice") {
                            return; // ignore unresponsive case which happens for polling
                        }
                        else if (event.type === "disconnected") {
                            // the disconnect event is delayed to debounce the reconnection that happens when switching apps
                            disconnectT = setTimeout(function () {
                                disconnectT = null;
                                // a disconnect will locally be remembered via locally setting device to null...
                                device = null;
                                o.next(event);
                                (0, logs_1.log)("app/polling", "device disconnect timeout");
                            }, DISCONNECT_DEBOUNCE);
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
                        // poll again in some time
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
exports.currentMode = "event";
function setDeviceMode(mode) {
    exports.currentMode = mode;
}
exports.setDeviceMode = setDeviceMode;
var createAction = function (connectAppExec) {
    var useHook = function (device, appRequest) {
        var dependenciesResolvedRef = (0, react_1.useRef)(false);
        var latestFirmwareResolvedRef = (0, react_1.useRef)(false);
        var outdatedAppRef = (0, react_1.useRef)();
        var connectApp = (0, react_1.useCallback)(function (device, params) {
            return !device
                ? rxjs_1.EMPTY
                : connectAppExec(__assign(__assign({ modelId: device.modelId, devicePath: device.deviceId }, params), { dependencies: dependenciesResolvedRef.current
                        ? undefined
                        : params.dependencies, requireLatestFirmware: latestFirmwareResolvedRef.current
                        ? undefined
                        : params.requireLatestFirmware, outdatedApp: outdatedAppRef.current })).pipe((0, operators_1.tap)(function (e) {
                    if (e.type === "dependencies-resolved") {
                        dependenciesResolvedRef.current = true;
                    }
                    else if (e.type === "latest-firmware-resolved") {
                        latestFirmwareResolvedRef.current = true;
                    }
                    else if (e.type === "has-outdated-app") {
                        outdatedAppRef.current = e.outdatedApp;
                    }
                }), (0, operators_1.catchError)(function (error) {
                    return (0, rxjs_1.of)({
                        type: "error",
                        error: error
                    });
                }));
        }, []);
        // repair modal will interrupt everything and be rendered instead of the background content
        var _a = __read((0, react_1.useState)(function () { return getInitialState(device); }), 2), state = _a[0], setState = _a[1];
        var _b = __read((0, react_1.useState)(0), 2), resetIndex = _b[0], setResetIndex = _b[1];
        var deviceSubject = (0, observable_1.useReplaySubject)(device);
        var params = (0, react_1.useMemo)(function () { return inferCommandParams(appRequest); }, // for now i don't have better
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [
            appRequest.appName,
            appRequest.account && appRequest.account.id,
            appRequest.currency && appRequest.currency.id,
        ]);
        (0, react_1.useEffect)(function () {
            if (state.opened)
                return;
            var impl = implementations[exports.currentMode];
            var sub = impl({
                deviceSubject: deviceSubject,
                connectApp: connectApp,
                params: params
            })
                .pipe((0, operators_1.tap)(function (e) { return (0, logs_1.log)("actions-app-event", e.type, e); }), // tap(e => console.log("connectApp event", e)),
            // we gather all events with a reducer into the UI state
            (0, operators_1.scan)(reducer, getInitialState()), // tap((s) => console.log("connectApp state", s)),
            // we debounce the UI state to not blink on the UI
            (0, operators_1.debounce)(function (s) {
                if (s.allowOpeningRequestedWording ||
                    s.allowOpeningGranted ||
                    s.deviceInfo) {
                    // no debounce for allow event
                    return rxjs_1.EMPTY;
                }
                // default debounce (to be tweak)
                return (0, rxjs_1.interval)(2000);
            }), (0, operators_1.takeWhile)(function (s) { return !s.requiresAppInstallation && !s.error; }, true)) // the state simply goes into a React state
                .subscribe(setState);
            // FIXME shouldn't we handle errors?! (is an error possible?)
            return function () {
                sub.unsubscribe();
            };
        }, [params, deviceSubject, state.opened, resetIndex, connectApp]);
        var onRetry = (0, react_1.useCallback)(function () {
            // After an error we can't guarantee dependencies are resolved
            dependenciesResolvedRef.current = false;
            latestFirmwareResolvedRef.current = false;
            setResetIndex(function (i) { return i + 1; });
            setState(getInitialState(device));
        }, [device]);
        var passWarning = (0, react_1.useCallback)(function () {
            setState(function (currState) { return (__assign(__assign({}, currState), { displayUpgradeWarning: false })); });
        }, []);
        return __assign(__assign({}, state), { inWrongDeviceForAccount: state.derivation && appRequest.account
                ? state.derivation.address !== appRequest.account.freshAddress &&
                    state.derivation.address !== appRequest.account.seedIdentifier // Use-case added for Hedera
                    ? {
                        accountName: (0, account_1.getAccountName)(appRequest.account)
                    }
                    : null
                : null, onRetry: onRetry, passWarning: passWarning });
    };
    return {
        useHook: useHook,
        mapResult: mapResult
    };
};
exports.createAction = createAction;
//# sourceMappingURL=app.js.map