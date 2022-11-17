var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
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
import querystring from "querystring";
import { BigNumber } from "bignumber.js";
import { findCryptoCurrencyByScheme } from "@ledgerhq/cryptoassets";
export function encodeURIScheme(data) {
    var currency = data.currency, address = data.address, amount = data.amount, specificFields = __rest(data, ["currency", "address", "amount"]);
    var query = __assign({}, specificFields);
    if (!currency)
        return address;
    if (amount) {
        var magnitude = currency.units[0].magnitude;
        query.amount = amount.div(new BigNumber(10).pow(magnitude)).toNumber();
    }
    var queryStr = querystring.stringify(query);
    return currency.scheme + ":" + address + (queryStr ? "?" + queryStr : "");
}
var convertedValue = function (value, currency) {
    var float = new BigNumber(value);
    if (!float.isNaN() && float.gt(0)) {
        var magnitude = currency.units[0].magnitude;
        return float.times(new BigNumber(10).pow(magnitude));
    }
};
export function decodeURIScheme(str) {
    var m = str.match(/(([a-zA-Z]+):)?([^?]+)(\?(.+))?/);
    if (!m) {
        // as a fallback we'll fallback str to be an address
        return {
            address: str
        };
    }
    var _a = __read(m, 6), scheme = _a[2], address = _a[3], queryStr = _a[5];
    var query = queryStr
        ? querystring.parse(queryStr)
        : {};
    var currency = findCryptoCurrencyByScheme(scheme);
    if (!currency) {
        return {
            address: address
        };
    }
    var data = {
        currency: currency,
        address: address
    };
    var _b = __assign({}, query), amount = _b.amount, specificFields = __rest(_b, ["amount"]);
    if (currency.id === "ethereum") {
        if (specificFields.value) {
            data.amount = new BigNumber(specificFields.value);
            if (data.amount.isNegative()) {
                data.amount = new BigNumber(0);
            }
            delete specificFields.value;
        }
        if (specificFields.gas) {
            data.userGasLimit = new BigNumber(specificFields.gas);
            if (data.userGasLimit.isNegative()) {
                data.userGasLimit = new BigNumber(0);
            }
            delete specificFields.gas;
        }
        if (specificFields.gasPrice) {
            data.gasPrice = new BigNumber(specificFields.gasPrice);
            if (data.gasPrice.isNegative()) {
                data.gasPrice = new BigNumber(0);
            }
            delete specificFields.gasPrice;
        }
    }
    Object.assign(data, specificFields);
    if (amount) {
        var cValue = convertedValue(amount, currency);
        if (cValue) {
            data.amount = cValue;
        }
    }
    return data;
}
//# sourceMappingURL=CurrencyURIScheme.js.map