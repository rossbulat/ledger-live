"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.getSeparators = exports.suffixFormat = exports.prefixFormat = void 0;
var memoize_1 = __importDefault(require("lodash/memoize"));
var options = {
    style: "currency",
    currency: "USD"
};
var localeNotAvailable = (1.2).toLocaleString("en", options) !== "$1.20";
var getFallback = function (locale) {
    return staticFallback[Object.keys(staticFallback).includes(locale) ? locale : "en"];
};
var staticFallback = {
    en: ["-$1.00", "10,000.2"],
    es: ["-1,00 US$", "10.000,2"],
    fr: ["-1,00 $US", "10 000,2"],
    ja: ["-US$1.00", "10,000.2"],
    ko: ["-US$1.00", "10,000.2"],
    ru: ["-1,00 $", "10 000,2"],
    zh: ["-US$1.00", "10,000.2"]
};
exports.prefixFormat = ["sign", "code", "value"];
exports.suffixFormat = ["sign", "value", "separator", "code"];
exports.getSeparators = (0, memoize_1["default"])(function (locale) {
    var res = localeNotAvailable
        ? getFallback(locale)[1]
        : (10000.2).toLocaleString(locale);
    var decimal;
    var thousands;
    for (var i = 0; i < res.length; i++) {
        var c = res[i];
        if (/[0-9]/.test(c))
            continue;
        if (!thousands) {
            thousands = c;
        }
        else {
            decimal = c;
        }
    }
    return {
        decimal: decimal,
        thousands: thousands
    };
});
//# sourceMappingURL=localeUtility.js.map