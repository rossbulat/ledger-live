import type { Unit } from "@ledgerhq/types-cryptoassets";
import { BigNumber } from "bignumber.js";
/**
 * convert a value in a given unit to a normalized value
 * For instance, for 1 BTC, valueFromUnit(1, btcUnit) returns 100000000
 * @memberof countervalue
 */
export declare const valueFromUnit: (valueInUnit: BigNumber, unit: Unit) => BigNumber;
//# sourceMappingURL=valueFromUnit.d.ts.map