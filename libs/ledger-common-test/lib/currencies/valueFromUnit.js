"use strict";
exports.__esModule = true;
exports.valueFromUnit = void 0;
var bignumber_js_1 = require("bignumber.js");
/**
 * convert a value in a given unit to a normalized value
 * For instance, for 1 BTC, valueFromUnit(1, btcUnit) returns 100000000
 * @memberof countervalue
 */
var valueFromUnit = function (valueInUnit, unit) {
    return valueInUnit.times(new bignumber_js_1.BigNumber(10).pow(unit.magnitude));
};
exports.valueFromUnit = valueFromUnit;
//# sourceMappingURL=valueFromUnit.js.map