"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var logs_1 = require("@ledgerhq/logs");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var errors_1 = require("@ledgerhq/errors");
var getDeviceInfo_1 = __importDefault(require("./getDeviceInfo"));
var installOsuFirmware_1 = __importDefault(require("./installOsuFirmware"));
var deviceAccess_1 = require("./deviceAccess");
var waitEnd = (0, rxjs_1.of)({
    type: "wait"
}).pipe((0, operators_1.delay)(3000));
var checkId = function (deviceId, _a) {
    var osu = _a.osu;
    (0, logs_1.log)("hw", "firmwareUpdate-prepare");
    return (0, deviceAccess_1.withDevice)(deviceId)(function (transport) {
        return (0, rxjs_1.from)((0, getDeviceInfo_1["default"])(transport));
    }).pipe((0, operators_1.mergeMap)(function (deviceInfo // if in bootloader or OSU we'll directly jump to MCU step
    ) {
        return deviceInfo.isBootloader || deviceInfo.isOSU
            ? (0, rxjs_1.throwError)(new errors_1.DeviceOnDashboardExpected())
            : (0, rxjs_1.concat)((0, deviceAccess_1.withDevice)(deviceId)(function (transport) {
                return (0, installOsuFirmware_1["default"])(transport, deviceInfo.targetId, osu);
            }), waitEnd // the device is likely rebooting now, we give it some time
            );
    }), (0, operators_1.filter)(function (e) { return e.type === "bulk-progress"; }), (0, operators_1.map)(function (e) { return ({
        progress: e.progress,
        displayedOnDevice: e.index >= e.total - 1
    }); }));
};
exports["default"] = checkId;
//# sourceMappingURL=firmwareUpdate-prepare.js.map