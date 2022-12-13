"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.getGenuineCheckFromDeviceId = void 0;
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var getDeviceInfo_1 = __importDefault(require("./getDeviceInfo"));
var deviceAccess_1 = require("./deviceAccess");
var genuineCheck_1 = __importDefault(require("./genuineCheck"));
/**
 * Get a genuine check for a device only from its id
 * @param deviceId A device id, or an empty string if device is usb plugged
 * @param lockedDeviceTimeoutMs Time of no response from device after which the device is considered locked, in ms. Default 1000ms.
 * @returns An Observable pushing objects containing:
 * - socketEvent: a SocketEvent giving the current status of the genuine check,
 *     null if the genuine check process did not reach any state yet
 * - deviceIsLocked: a boolean set to true if the device is currently locked, false otherwise
 */
var getGenuineCheckFromDeviceId = function (_a) {
    var deviceId = _a.deviceId, _b = _a.lockedDeviceTimeoutMs, lockedDeviceTimeoutMs = _b === void 0 ? 1000 : _b;
    return new rxjs_1.Observable(function (o) {
        // In order to know if a device is locked or not.
        // As we're not timing out inside the genuineCheckObservable flow (with rxjs timeout for ex)
        // once the device is unlock, getDeviceInfo should return the device info and
        // the flow will continue. No need to handle a retry strategy
        var lockedDeviceTimeout = setTimeout(function () {
            o.next({ socketEvent: null, deviceIsLocked: true });
        }, lockedDeviceTimeoutMs);
        // withDevice handles the unsubscribing cleaning when leaving the useEffect
        (0, deviceAccess_1.withDevice)(deviceId)(function (t) {
            return (0, rxjs_1.from)((0, getDeviceInfo_1["default"])(t)).pipe((0, operators_1.mergeMap)(function (deviceInfo) {
                clearTimeout(lockedDeviceTimeout);
                o.next({ socketEvent: null, deviceIsLocked: false });
                return (0, genuineCheck_1["default"])(t, deviceInfo);
            }));
        }).subscribe({
            next: function (socketEvent) {
                o.next({ socketEvent: socketEvent, deviceIsLocked: false });
            },
            error: function (e) {
                o.error(e);
            }
        });
    });
};
exports.getGenuineCheckFromDeviceId = getGenuineCheckFromDeviceId;
//# sourceMappingURL=getGenuineCheckFromDeviceId.js.map