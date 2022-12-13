"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.getDeviceRunningMode = void 0;
var errors_1 = require("@ledgerhq/errors");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var deviceAccess_1 = require("./deviceAccess");
var getDeviceInfo_1 = __importDefault(require("./getDeviceInfo"));
/**
 * Get the mode in which is device is: bootloader, main, locked device, maybe disconnected or locked device
 * It will retry on all errors from getDeviceInfo, except the ones that implies that the device is
 * disconnected (number of retry can be tweaked) or locked.
 *
 * Note: If no device is found, the current Transport implementations throw a CantOpenDevice error
 * And if the device was cold started and not yet unlocked, the current Transport implementations
 * don't see the device yet, and also throw a CantOpenDevice error.
 *
 * Does NOT handle recovery mode for now.
 * @param deviceId A device id
 * @param unresponsiveTimeoutMs Time in ms of the timeout before considering the device unresponsive
 * @param cantOpenDeviceRetryLimit Number of received CantOpenDevice errors while retrying before considering
 *   the device as maybe disconnected or cold-started-locked
 * @returns An object GetDeviceRunningModeEvent
 */
var getDeviceRunningMode = function (_a) {
    var deviceId = _a.deviceId, _b = _a.unresponsiveTimeoutMs, unresponsiveTimeoutMs = _b === void 0 ? 5000 : _b, _c = _a.cantOpenDeviceRetryLimit, cantOpenDeviceRetryLimit = _c === void 0 ? 3 : _c;
    return new rxjs_1.Observable(function (o) {
        var cantOpenDeviceRetryCount = 0;
        (0, deviceAccess_1.withDevice)(deviceId)(function (transport) { return (0, rxjs_1.from)((0, getDeviceInfo_1["default"])(transport)); })
            .pipe((0, operators_1.timeout)(unresponsiveTimeoutMs), (0, operators_1.retryWhen)((0, deviceAccess_1.retryWhileErrors)(function (e) {
            // Does not retry on locked-device error
            if (isLockedDeviceError(e)) {
                return false;
            }
            if (e instanceof errors_1.CantOpenDevice) {
                if (cantOpenDeviceRetryCount < cantOpenDeviceRetryLimit) {
                    cantOpenDeviceRetryCount++;
                    return true;
                }
                return false;
            }
            // Retries on any other kind of errors
            return true;
        })))
            .subscribe({
            next: function (deviceInfo) {
                if (deviceInfo.isBootloader) {
                    o.next({ type: "bootloaderMode", deviceInfo: deviceInfo });
                }
                else {
                    o.next({ type: "mainMode", deviceInfo: deviceInfo });
                }
                o.complete();
            },
            error: function (e) {
                if (isLockedDeviceError(e)) {
                    o.next({ type: "lockedDevice" });
                    o.complete();
                }
                else if (e instanceof errors_1.CantOpenDevice) {
                    o.next({ type: "disconnectedOrlockedDevice" });
                    o.complete();
                }
                else {
                    o.error(e);
                }
            },
            complete: function () { return o.complete(); }
        });
    });
};
exports.getDeviceRunningMode = getDeviceRunningMode;
var isLockedDeviceError = function (e) {
    return ((e &&
        e instanceof errors_1.TransportStatusError &&
        // @ts-expect-error typescript not checking agains the instanceof
        e.statusCode === errors_1.StatusCodes.LOCKED_DEVICE) ||
        e instanceof rxjs_1.TimeoutError);
};
//# sourceMappingURL=getDeviceRunningMode.js.map