"use strict";
exports.__esModule = true;
exports.parseCurrencyUnit = void 0;
var bignumber_js_1 = require("bignumber.js");
// parse a value that was formatted with formatCurrencyUnit
// NB this function parse a subset of formats because it it locale independant.
// make sure you have at least following options set on the formatter:
// - useGrouping: true
// - showCode: false
var parseCurrencyUnit = function (unit, valueString) {
    var str = valueString.replace(/,/g, ".");
    var value = new bignumber_js_1.BigNumber(str);
    if (value.isNaN())
        return new bignumber_js_1.BigNumber(0);
    return value.times(new bignumber_js_1.BigNumber(10).pow(unit.magnitude)).integerValue();
};
exports.parseCurrencyUnit = parseCurrencyUnit;
//# sourceMappingURL=parseCurrencyUnit.js.map