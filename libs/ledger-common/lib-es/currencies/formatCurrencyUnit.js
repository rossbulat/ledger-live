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
import { BigNumber } from "bignumber.js";
import { prefixFormat, suffixFormat } from "./localeUtility";
import { toLocaleString } from "./BigNumberToLocaleString";
var nonBreakableSpace = " ";
var defaultFormatOptions = {
    locale: "en-EN",
    // show the currency code
    showCode: false,
    // always show the sign, even if it's a positive value
    alwaysShowSign: false,
    // override showAllDigits of the unit
    showAllDigits: false,
    // disable the feature that only show significant digits
    // and removes the negligible extra digits.
    // (rounding is dynamically applied based on the value. higher value means more rounding)
    disableRounding: false,
    // enable or not the thousands grouping (e.g; 1,234.00)
    useGrouping: true,
    // this allow to increase the number of digits displayed
    // even if the currency don't allow more than this (sub-cent)
    // a value of 1 can display USD 0.006 for instance. 2 can display USD 0.0065
    // NB even if you set 3, USD 4.50 will be display as USD 4.50 , not 4.5000 (extra zeros are not displayed)
    subMagnitude: 0,
    // discrete mode will hide amounts
    discreet: false,
    joinFragmentsSeparator: ""
};
export function formatCurrencyUnitFragment(unit, value, _options) {
    if (!BigNumber.isBigNumber(value)) {
        console.warn("formatCurrencyUnit called with value=", value);
        return [];
    }
    if (value.isNaN()) {
        console.warn("formatCurrencyUnit called with NaN value!");
        return [];
    }
    if (!value.isFinite()) {
        console.warn("formatCurrencyUnit called with infinite value=", value);
        return [];
    }
    var options = {};
    for (var k in _options) {
        // sanitize the undefined value
        if (_options[k] !== undefined) {
            options[k] = _options[k];
        }
    }
    var _a = __assign(__assign(__assign({}, defaultFormatOptions), unit), options), showCode = _a.showCode, alwaysShowSign = _a.alwaysShowSign, showAllDigits = _a.showAllDigits, locale = _a.locale, disableRounding = _a.disableRounding, useGrouping = _a.useGrouping, subMagnitude = _a.subMagnitude, discreet = _a.discreet;
    var magnitude = unit.magnitude, code = unit.code;
    var floatValue = value.div(new BigNumber(10).pow(magnitude));
    var floatValueAbs = floatValue.abs();
    var minimumFractionDigits = showAllDigits ? magnitude : 0;
    var maximumFractionDigits = disableRounding
        ? magnitude + subMagnitude
        : Math.max(minimumFractionDigits, Math.max(0, // dynamic max number of digits based on the value itself. to only show significant part
        Math.min(4 - Math.round(Math.log10(floatValueAbs.toNumber())), magnitude + subMagnitude, 8)));
    var fragValueByKind = {
        sign: alwaysShowSign || floatValue.isNegative()
            ? floatValue.isNegative()
                ? "-"
                : "+"
            : null,
        code: showCode ? code : null,
        value: discreet
            ? "***"
            : toLocaleString(floatValueAbs, locale, {
                maximumFractionDigits: maximumFractionDigits,
                minimumFractionDigits: minimumFractionDigits,
                useGrouping: useGrouping
            }),
        separator: nonBreakableSpace
    };
    var frags = [];
    var nonSepIndex = -1;
    var sepConsumed = true;
    (unit.prefixCode ? prefixFormat : suffixFormat).forEach(function (kind) {
        var v = fragValueByKind[kind];
        if (!v)
            return;
        var isSep = kind === "separator";
        if (sepConsumed && isSep)
            return;
        sepConsumed = isSep;
        if (!isSep)
            nonSepIndex = frags.length;
        frags.push({
            kind: kind,
            value: v
        });
    });
    frags.splice(nonSepIndex + 1); // remove extra space at the end
    return frags;
}
// simplification of formatCurrencyUnitFragment if no fragmented styles is needed
export function formatCurrencyUnit(unit, value, options) {
    var joinFragmentsSeparator = (options && options.joinFragmentsSeparator) ||
        defaultFormatOptions.joinFragmentsSeparator;
    return formatCurrencyUnitFragment(unit, value, options)
        .map(function (f) { return f.value; })
        .join(joinFragmentsSeparator);
}
//# sourceMappingURL=formatCurrencyUnit.js.map