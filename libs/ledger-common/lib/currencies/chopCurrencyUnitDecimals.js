"use strict";
// remove the extra decimals that can't be represented in unit
// this function will preserve the string characters
// for instance EUR 1230.00234 will be transformed to EUR 1230.00
// NB this function parse a subset of formats because it it locale independent.
// make sure you have at least following options set on the formatter:
exports.__esModule = true;
exports.chopCurrencyUnitDecimals = void 0;
// - useGrouping: true
var chopCurrencyUnitDecimals = function (unit, valueString) {
    var str = "";
    var decimals = -1;
    for (var i = 0; i < valueString.length; i++) {
        var c = valueString[i];
        if (decimals >= 0 && /[0-9]/.test(c)) {
            decimals++;
            if (decimals > unit.magnitude) {
                continue;
            }
        }
        else if (c === "," || c === ".") {
            decimals = 0;
        }
        str += c;
    }
    return str;
};
exports.chopCurrencyUnitDecimals = chopCurrencyUnitDecimals;
//# sourceMappingURL=chopCurrencyUnitDecimals.js.map