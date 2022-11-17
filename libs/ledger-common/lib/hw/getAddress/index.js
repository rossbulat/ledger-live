"use strict";
exports.__esModule = true;
var errors_1 = require("@ledgerhq/errors");
var logs_1 = require("@ledgerhq/logs");
var getAddressWrapper = function (getAddressFn) { return function (transport, opts) {
    var currency = opts.currency, path = opts.path, verify = opts.verify;
    return getAddressFn(transport, opts)
        .then(function (result) {
        (0, logs_1.log)("hw", "getAddress ".concat(currency.id, " on ").concat(path), result);
        return result;
    })["catch"](function (e) {
        (0, logs_1.log)("hw", "getAddress ".concat(currency.id, " on ").concat(path, " FAILED ").concat(String(e)));
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
}; };
exports["default"] = getAddressWrapper;
//# sourceMappingURL=index.js.map