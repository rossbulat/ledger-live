import { BigNumber } from "bignumber.js";
/**
 * convert a value in a given unit to a normalized value
 * For instance, for 1 BTC, valueFromUnit(1, btcUnit) returns 100000000
 * @memberof countervalue
 */
export var valueFromUnit = function (valueInUnit, unit) {
    return valueInUnit.times(new BigNumber(10).pow(unit.magnitude));
};
//# sourceMappingURL=valueFromUnit.js.map