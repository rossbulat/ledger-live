"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var Manager_1 = __importDefault(require("../api/Manager"));
var manager_1 = require("../manager");
exports["default"] = (function (transport, deviceInfo) {
    return (0, rxjs_1.from)(Manager_1["default"].getDeviceVersion(deviceInfo.targetId, (0, manager_1.getProviderId)(deviceInfo))).pipe((0, operators_1.switchMap)(function (deviceVersion) {
        return (0, rxjs_1.from)(Manager_1["default"].getCurrentFirmware({
            deviceId: deviceVersion.id,
            version: deviceInfo.version,
            provider: (0, manager_1.getProviderId)(deviceInfo)
        }));
    }), (0, operators_1.switchMap)(function (firmware) {
        return Manager_1["default"].genuineCheck(transport, {
            targetId: deviceInfo.targetId,
            perso: firmware.perso
        });
    }));
});
//# sourceMappingURL=genuineCheck.js.map