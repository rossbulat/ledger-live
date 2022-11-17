import { DeviceAppVerifyNotSupported, UserRefusedAddress, } from "@ledgerhq/errors";
import { log } from "@ledgerhq/logs";
var getAddressWrapper = function (getAddressFn) { return function (transport, opts) {
    var currency = opts.currency, path = opts.path, verify = opts.verify;
    return getAddressFn(transport, opts)
        .then(function (result) {
        log("hw", "getAddress ".concat(currency.id, " on ").concat(path), result);
        return result;
    })["catch"](function (e) {
        log("hw", "getAddress ".concat(currency.id, " on ").concat(path, " FAILED ").concat(String(e)));
        if (e && e.name === "TransportStatusError") {
            if (e.statusCode === 0x6b00 && verify) {
                throw new DeviceAppVerifyNotSupported();
            }
            if (e.statusCode === 0x6985 || e.statusCode === 0x5501) {
                throw new UserRefusedAddress();
            }
        }
        throw e;
    });
}; };
export default getAddressWrapper;
//# sourceMappingURL=index.js.map