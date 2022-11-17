"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.inferFamilyFromAccountId = exports.getWalletName = exports.decodeAccountId = exports.decodeTokenAccountId = exports.encodeTokenAccountId = exports.encodeAccountId = void 0;
var memoize_1 = __importDefault(require("lodash/memoize"));
var invariant_1 = __importDefault(require("invariant"));
var derivation_1 = require("../derivation");
var currencies_1 = require("../currencies");
var cryptoassets_1 = require("@ledgerhq/cryptoassets");
function ensureNoColon(value, ctx) {
    (0, invariant_1["default"])(!value.includes(":"), "AccountId '%s' component must not use colon", ctx);
    return value;
}
function encodeAccountId(_a) {
    var type = _a.type, version = _a.version, currencyId = _a.currencyId, xpubOrAddress = _a.xpubOrAddress, derivationMode = _a.derivationMode;
    return "".concat(ensureNoColon(type, "type"), ":").concat(ensureNoColon(version, "version"), ":").concat(ensureNoColon(currencyId, "currencyId"), ":").concat(ensureNoColon(xpubOrAddress, "xpubOrAddress"), ":").concat(ensureNoColon(derivationMode, "derivationMode"));
}
exports.encodeAccountId = encodeAccountId;
function encodeTokenAccountId(accountId, token) {
    return accountId + "+" + encodeURIComponent(token.id);
}
exports.encodeTokenAccountId = encodeTokenAccountId;
function decodeTokenAccountId(id) {
    var _a = __read(id.split("+"), 2), accountId = _a[0], tokenId = _a[1];
    var decodedTokenId = decodeURIComponent(tokenId);
    var token = (0, currencies_1.findTokenById)(decodedTokenId);
    if (!token) {
        var currencyId = decodeAccountId(accountId).currencyId;
        token = (0, cryptoassets_1.findTokenByAddressInCurrency)(decodedTokenId, currencyId);
    }
    return {
        accountId: accountId,
        token: token
    };
}
exports.decodeTokenAccountId = decodeTokenAccountId;
function decodeAccountId(accountId) {
    (0, invariant_1["default"])(typeof accountId === "string", "accountId is not a string");
    var splitted = accountId.split(":");
    (0, invariant_1["default"])(splitted.length === 5, "invalid size for accountId");
    var _a = __read(splitted, 5), type = _a[0], version = _a[1], currencyId = _a[2], xpubOrAddress = _a[3], derivationMode = _a[4];
    return {
        type: type,
        version: version,
        currencyId: currencyId,
        xpubOrAddress: xpubOrAddress,
        derivationMode: (0, derivation_1.asDerivationMode)(derivationMode)
    };
}
exports.decodeAccountId = decodeAccountId;
// you can pass account because type is shape of Account
// wallet name is a lib-core concept that usually identify a pool of accounts with the same (seed, cointype, derivation scheme) config.
function getWalletName(_a) {
    var seedIdentifier = _a.seedIdentifier, derivationMode = _a.derivationMode, currency = _a.currency;
    return "".concat(seedIdentifier, "_").concat(currency.id, "_").concat(derivationMode);
}
exports.getWalletName = getWalletName;
exports.inferFamilyFromAccountId = (0, memoize_1["default"])(function (accountId) {
    try {
        var currencyId = decodeAccountId(accountId).currencyId;
        return (0, currencies_1.getCryptoCurrencyById)(currencyId).family;
    }
    catch (e) {
        return null;
    }
});
//# sourceMappingURL=accountId.js.map