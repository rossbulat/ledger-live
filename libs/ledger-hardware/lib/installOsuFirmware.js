"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var Manager_1 = __importDefault(require("../api/Manager"));
exports["default"] = (function (transport, targetId, firmware) {
    var params = {
        targetId: targetId,
        firmware: firmware.firmware,
        perso: firmware.perso,
        firmwareKey: firmware.firmware_key
    };
    return Manager_1["default"].install(transport, "firmware", params, true);
});
//# sourceMappingURL=installOsuFirmware.js.map