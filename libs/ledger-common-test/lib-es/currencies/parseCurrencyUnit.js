import { BigNumber } from "bignumber.js";
// parse a value that was formatted with formatCurrencyUnit
// NB this function parse a subset of formats because it it locale independant.
// make sure you have at least following options set on the formatter:
// - useGrouping: true
// - showCode: false
export var parseCurrencyUnit = function (unit, valueString) {
    var str = valueString.replace(/,/g, ".");
    var value = new BigNumber(str);
    if (value.isNaN())
        return new BigNumber(0);
    return value.times(new BigNumber(10).pow(unit.magnitude)).integerValue();
};
//# sourceMappingURL=parseCurrencyUnit.js.map