"use strict";
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
exports.__esModule = true;
exports.useGenuineCheck = void 0;
var react_1 = require("react");
var errors_1 = require("@ledgerhq/errors");
var getGenuineCheckFromDeviceId_1 = require("../getGenuineCheckFromDeviceId");
var SOCKET_EVENT_PAYLOAD_GENUINE = "0000";
/**
 * Hook to check that a device is genuine
 * It replaces a DeviceAction if we're only interested in getting the genuine check
 * @param getGenuineCheckFromDeviceId An optional function to get a genuine check for a given device id,
 * by default set to live-common/hw/getGenuineCheckFromDeviceId.
 * This dependency injection is needed for LLD to have the hook working on the internal thread
 * @param isHookEnabled A boolean to enable (true, default value) or disable (false) the hook
 * @param deviceId A device id, or an empty string if device is usb plugged
 * @param lockedDeviceTimeoutMs Time of no response from device after which the device is considered locked, in ms. Default 1000ms.
 * @returns An object containing:
 * - genuineState: the current GenuineState
 * - devicePermissionState: the current DevicePermissionState
 * - error: any error that occurred during the genuine check, or null
 */
var useGenuineCheck = function (_a) {
    var _b = _a.getGenuineCheckFromDeviceId, getGenuineCheckFromDeviceId = _b === void 0 ? getGenuineCheckFromDeviceId_1.getGenuineCheckFromDeviceId : _b, _c = _a.isHookEnabled, isHookEnabled = _c === void 0 ? true : _c, deviceId = _a.deviceId, _d = _a.lockedDeviceTimeoutMs, lockedDeviceTimeoutMs = _d === void 0 ? 1000 : _d;
    var _e = __read((0, react_1.useState)("unchecked"), 2), genuineState = _e[0], setGenuineState = _e[1];
    var _f = __read((0, react_1.useState)("unrequested"), 2), devicePermissionState = _f[0], setDevicePermissionState = _f[1];
    var _g = __read((0, react_1.useState)(null), 2), error = _g[0], setError = _g[1];
    var resetGenuineCheckState = (0, react_1.useCallback)(function () {
        setDevicePermissionState("unrequested");
        setGenuineState("unchecked");
    }, []);
    (0, react_1.useEffect)(function () {
        if (!isHookEnabled) {
            return;
        }
        var sub = getGenuineCheckFromDeviceId({
            deviceId: deviceId,
            lockedDeviceTimeoutMs: lockedDeviceTimeoutMs
        }).subscribe({
            next: function (_a) {
                var socketEvent = _a.socketEvent, deviceIsLocked = _a.deviceIsLocked;
                if (socketEvent) {
                    switch (socketEvent.type) {
                        case "device-permission-requested":
                            setDevicePermissionState("requested");
                            break;
                        case "device-permission-granted":
                            setDevicePermissionState("granted");
                            break;
                        case "result":
                            if (socketEvent.payload === SOCKET_EVENT_PAYLOAD_GENUINE) {
                                setGenuineState("genuine");
                            }
                            else {
                                setGenuineState("non-genuine");
                            }
                            break;
                    }
                }
                else {
                    // If no socketEvent, the device is locked or has been unlocked
                    if (deviceIsLocked) {
                        setDevicePermissionState("unlock-needed");
                    }
                    else {
                        setDevicePermissionState("unlocked");
                    }
                }
            },
            error: function (e) {
                if (e instanceof errors_1.UserRefusedAllowManager) {
                    setDevicePermissionState("refused");
                }
                else if (e instanceof Error) {
                    // Probably an error of type DisconnectedDeviceDuringOperation or something else
                    setError(e);
                }
                else {
                    setError(new Error("Unknown error: ".concat(e)));
                }
            }
        });
        return function () {
            sub.unsubscribe();
        };
    }, [
        isHookEnabled,
        deviceId,
        lockedDeviceTimeoutMs,
        getGenuineCheckFromDeviceId,
    ]);
    return {
        genuineState: genuineState,
        devicePermissionState: devicePermissionState,
        error: error,
        resetGenuineCheckState: resetGenuineCheckState
    };
};
exports.useGenuineCheck = useGenuineCheck;
//# sourceMappingURL=useGenuineCheck.js.map