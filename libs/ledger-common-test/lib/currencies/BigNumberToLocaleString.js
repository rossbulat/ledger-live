"use strict";
exports.__esModule = true;
exports.toLocaleString = void 0;
// Implement a subset of Number#toLocaleString for BigNumber.js
// https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Number/toLocaleString
var bignumber_js_1 = require("bignumber.js");
var localeUtility_1 = require("./localeUtility");
// FIXME later, might want to expose this format!
var getFormatForLocale = function (locale) {
    var _a = (0, localeUtility_1.getSeparators)(locale), decimal = _a.decimal, thousands = _a.thousands;
    var opts = {
        decimalSeparator: ".",
        groupSeparator: ",",
        groupSize: 3,
        secondaryGroupSize: 0,
        fractionGroupSeparator: "\xA0",
        // non-breaking space
        fractionGroupSize: 0
    };
    if (typeof decimal === "string")
        opts.decimalSeparator = decimal;
    if (typeof thousands === "string")
        opts.groupSeparator = thousands;
    return opts;
};
var toLocaleString = function (n, localeInput, options) {
    if (options === void 0) { options = {}; }
    var locale = localeInput;
    if (!locale)
        locale = "en";
    var minimumFractionDigits = "minimumFractionDigits" in options
        ? options.minimumFractionDigits
        : 0;
    var maximumFractionDigits = "maximumFractionDigits" in options
        ? options.maximumFractionDigits
        : Math.max(minimumFractionDigits, 3);
    var useGrouping = "useGrouping" in options ? options.useGrouping : true;
    var format = getFormatForLocale(locale);
    if (!useGrouping) {
        format.groupSeparator = "";
    }
    var BN = bignumber_js_1.BigNumber.clone({
        FORMAT: format
    });
    var bn = new BN(n);
    var maxDecimals = bn.toFormat(maximumFractionDigits, bignumber_js_1.BigNumber.ROUND_FLOOR);
    if (maximumFractionDigits !== minimumFractionDigits) {
        var minDecimals = bn.toFormat(minimumFractionDigits, bignumber_js_1.BigNumber.ROUND_FLOOR);
        var i = maxDecimals.length;
        // cleanup useless '0's from the right until the minimumFractionDigits
        while (i > minDecimals.length) {
            if (maxDecimals[i - 1] !== "0") {
                if (maxDecimals[i - 1] === format.decimalSeparator) {
                    i--;
                }
                break; // we reach decimal. stop now.
            }
            i--;
        }
        return maxDecimals.slice(0, i);
    }
    return maxDecimals;
};
exports.toLocaleString = toLocaleString;
//# sourceMappingURL=BigNumberToLocaleString.js.map