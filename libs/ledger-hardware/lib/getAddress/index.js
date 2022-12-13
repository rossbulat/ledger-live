"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var invariant_1 = __importDefault(require("invariant"));
var errors_1 = require("@ledgerhq/errors");
var logs_1 = require("@ledgerhq/logs");
var hw_getAddress_1 = __importDefault(require("../../generated/hw-getAddress"));
var dispatch = function (transport, opts) {
    var currency = opts.currency, verify = opts.verify;
    var getAddress = hw_getAddress_1["default"][currency.family];
    (0, invariant_1["default"])(getAddress, "getAddress is not implemented for ".concat(currency.id));
    return getAddress(transport, opts)
        .then(function (result) {
        (0, logs_1.log)("hw", "getAddress ".concat(currency.id, " on ").concat(opts.path), result);
        return result;
    })["catch"](function (e) {
        (0, logs_1.log)("hw", "getAddress ".concat(currency.id, " on ").concat(opts.path, " FAILED ").concat(String(e)));
        if (e && e.name === "TransportStatusError") {
            if (e.statusCode === 0x6b00 && verify) {
                throw new errors_1.DeviceAppVerifyNotSupported();
            }
            if (e.statusCode === 0x6985 || e.statusCode === 0x5501) {
                throw new errors_1.UserRefusedAddress();
            }
        }
        throw e;
    });
};
exports["default"] = dispatch;
//# sourceMappingURL=index.js.map