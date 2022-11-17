import { BigNumber } from "bignumber.js";
import { CosmosOperationMode } from "../types";
export declare const DEFAULT_FEES = 0;
export declare const MIN_GAS_FEE = 0.0025;
export declare const DEFAULT_GAS = 100000;
/**
 * Fetch the transaction fees for a transaction
 */
declare const getEstimatedFees: (mode: string) => Promise<BigNumber>;
/**
 * Fetch the gas for a transaction
 */
export declare const getEstimatedGas: (mode: CosmosOperationMode) => Promise<BigNumber>;
export default getEstimatedFees;
//# sourceMappingURL=js-getFeesForTransaction.d.ts.map