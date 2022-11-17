import { BigNumber } from "bignumber.js";
import { COSMOS_MAX_DELEGATIONS } from "../logic";
import { DEFAULT_GAS, MIN_GAS_FEE } from "./js-getFeesForTransaction";
var OSMOSIS_MIN_SAFE = new BigNumber(10000); // 10000 uosmo, setting a reasonable floor
var OSMOSIS_MIN_FEES = new BigNumber(MIN_GAS_FEE * DEFAULT_GAS);
export function canDelegate(account) {
    var maxSpendableBalance = getMaxDelegationAvailable(account, 1);
    return maxSpendableBalance.gt(0);
}
export function getMaxDelegationAvailable(account, validatorsLength) {
    var numberOfDelegations = Math.min(COSMOS_MAX_DELEGATIONS, validatorsLength || 1);
    var spendableBalance = account.spendableBalance;
    return spendableBalance
        .minus(OSMOSIS_MIN_FEES.multipliedBy(numberOfDelegations))
        .minus(OSMOSIS_MIN_SAFE);
}
//# sourceMappingURL=logic.js.map