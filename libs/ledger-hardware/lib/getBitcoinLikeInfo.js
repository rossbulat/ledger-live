"use strict";
exports.__esModule = true;
// Returns null if getBitcoinLikeInfo is not supported. there are breaking changes in the version after firmware 1.2
var getBitcoinLikeInfo = function (transport) {
    return transport.send(0xe0, 0x16, 0x00, 0x00).then(function (res) {
        var P2PKH = res.readUInt16BE(0);
        var P2SH = res.readUInt16BE(2);
        try {
            var message = res.slice(5, res.readUInt8(4));
            var short = res.slice(5 + message.length + 1, res.readUInt8(5 + message.length));
            return {
                P2PKH: P2PKH,
                P2SH: P2SH,
                message: message,
                short: short
            };
        }
        catch (e) {
            // in such case, we are in an old firmware we no longer support
            return null;
        }
    });
};
exports["default"] = getBitcoinLikeInfo;
//# sourceMappingURL=getBitcoinLikeInfo.js.map