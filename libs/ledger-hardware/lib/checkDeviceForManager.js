"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var rxjs_1 = require("rxjs");
var errors_1 = require("@ledgerhq/errors");
var genuineCheck_1 = __importDefault(require("./genuineCheck"));
exports["default"] = (function (transport, deviceInfo) {
    return deviceInfo.isOSU || deviceInfo.managerAllowed
        ? (0, rxjs_1.of)({
            type: "result",
            payload: "0000"
        })
        : deviceInfo.isBootloader
            ? (0, rxjs_1.throwError)(new errors_1.UnexpectedBootloader())
            : (0, genuineCheck_1["default"])(transport, deviceInfo);
});
//# sourceMappingURL=checkDeviceForManager.js.map