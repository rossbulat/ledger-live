"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.getLatestAvailableFirmwareFromDeviceId = void 0;
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var manager_1 = __importDefault(require("../manager"));
var deviceAccess_1 = require("./deviceAccess");
var getDeviceInfo_1 = __importDefault(require("./getDeviceInfo"));
/**
 * Get the latest available firmware for a device only from its id
 * @param deviceId A device id, or an empty string if device is usb plugged
 * @returns An Observable pushing objects containing:
 * - firmwareUpdateContext A FirmwareUpdateContext if found, or null or undefined otherwise
 */
var getLatestAvailableFirmwareFromDeviceId = function (_a) {
    var deviceId = _a.deviceId;
    return (0, deviceAccess_1.withDevice)(deviceId)(function (t) {
        return (0, rxjs_1.from)((0, getDeviceInfo_1["default"])(t)).pipe((0, operators_1.mergeMap)(function (deviceInfo) {
            return (0, rxjs_1.from)(manager_1["default"].getLatestFirmwareForDevice(deviceInfo)).pipe((0, operators_1.map)(function (firmwareUpdateContext) { return ({ firmwareUpdateContext: firmwareUpdateContext }); }));
        }));
    });
};
exports.getLatestAvailableFirmwareFromDeviceId = getLatestAvailableFirmwareFromDeviceId;
//# sourceMappingURL=getLatestAvailableFirmwareFromDeviceId.js.map