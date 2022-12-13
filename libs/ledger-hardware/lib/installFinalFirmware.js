"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.fetchNextFirmware = void 0;
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var Manager_1 = __importDefault(require("../api/Manager"));
var getDeviceInfo_1 = __importDefault(require("./getDeviceInfo"));
var manager_1 = require("../manager");
var fetchNextFirmware = function (deviceInfo) {
    return (0, rxjs_1.from)(Manager_1["default"].getDeviceVersion(deviceInfo.targetId, (0, manager_1.getProviderId)(deviceInfo))).pipe((0, operators_1.mergeMap)(function (device) {
        return (0, rxjs_1.from)(Manager_1["default"].getCurrentOSU({
            deviceId: device.id,
            version: deviceInfo.version,
            provider: (0, manager_1.getProviderId)(deviceInfo)
        }));
    }), (0, operators_1.mergeMap)(function (firmware) {
        return (0, rxjs_1.from)(Manager_1["default"].getFinalFirmwareById(firmware.next_se_firmware_final_version));
    }));
};
exports.fetchNextFirmware = fetchNextFirmware;
exports["default"] = (function (transport) {
    return (0, rxjs_1.from)((0, getDeviceInfo_1["default"])(transport)).pipe((0, operators_1.mergeMap)(function (deviceInfo) {
        return (0, exports.fetchNextFirmware)(deviceInfo).pipe((0, operators_1.mergeMap)(function (nextFirmware) {
            return (0, rxjs_1.concat)((0, rxjs_1.of)({
                type: "install",
                step: "firmware"
            }), Manager_1["default"].install(transport, "firmware", {
                targetId: deviceInfo.targetId,
                firmware: nextFirmware.firmware,
                firmwareKey: nextFirmware.firmware_key,
                perso: nextFirmware.perso
            }));
        }));
    }));
});
//# sourceMappingURL=installFinalFirmware.js.map