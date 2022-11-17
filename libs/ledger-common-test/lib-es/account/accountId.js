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
import memoize from "lodash/memoize";
import invariant from "invariant";
import { asDerivationMode } from "../derivation";
import { getCryptoCurrencyById, findTokenById } from "../currencies";
import { findTokenByAddressInCurrency } from "@ledgerhq/cryptoassets";
function ensureNoColon(value, ctx) {
    invariant(!value.includes(":"), "AccountId '%s' component must not use colon", ctx);
    return value;
}
export function encodeAccountId(_a) {
    var type = _a.type, version = _a.version, currencyId = _a.currencyId, xpubOrAddress = _a.xpubOrAddress, derivationMode = _a.derivationMode;
    return "".concat(ensureNoColon(type, "type"), ":").concat(ensureNoColon(version, "version"), ":").concat(ensureNoColon(currencyId, "currencyId"), ":").concat(ensureNoColon(xpubOrAddress, "xpubOrAddress"), ":").concat(ensureNoColon(derivationMode, "derivationMode"));
}
export function encodeTokenAccountId(accountId, token) {
    return accountId + "+" + encodeURIComponent(token.id);
}
export function decodeTokenAccountId(id) {
    var _a = __read(id.split("+"), 2), accountId = _a[0], tokenId = _a[1];
    var decodedTokenId = decodeURIComponent(tokenId);
    var token = findTokenById(decodedTokenId);
    if (!token) {
        var currencyId = decodeAccountId(accountId).currencyId;
        token = findTokenByAddressInCurrency(decodedTokenId, currencyId);
    }
    return {
        accountId: accountId,
        token: token
    };
}
export function decodeAccountId(accountId) {
    invariant(typeof accountId === "string", "accountId is not a string");
    var splitted = accountId.split(":");
    invariant(splitted.length === 5, "invalid size for accountId");
    var _a = __read(splitted, 5), type = _a[0], version = _a[1], currencyId = _a[2], xpubOrAddress = _a[3], derivationMode = _a[4];
    return {
        type: type,
        version: version,
        currencyId: currencyId,
        xpubOrAddress: xpubOrAddress,
        derivationMode: asDerivationMode(derivationMode)
    };
}
// you can pass account because type is shape of Account
// wallet name is a lib-core concept that usually identify a pool of accounts with the same (seed, cointype, derivation scheme) config.
export function getWalletName(_a) {
    var seedIdentifier = _a.seedIdentifier, derivationMode = _a.derivationMode, currency = _a.currency;
    return "".concat(seedIdentifier, "_").concat(currency.id, "_").concat(derivationMode);
}
export var inferFamilyFromAccountId = memoize(function (accountId) {
    try {
        var currencyId = decodeAccountId(accountId).currencyId;
        return getCryptoCurrencyById(currencyId).family;
    }
    catch (e) {
        return null;
    }
});
//# sourceMappingURL=accountId.js.map