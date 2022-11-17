import memoize from "lodash/memoize";
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
export var prefixFormat = ["sign", "code", "value"];
export var suffixFormat = ["sign", "value", "separator", "code"];
export var getSeparators = memoize(function (locale) {
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