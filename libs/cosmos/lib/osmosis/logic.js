"use strict";
exports.__esModule = true;
exports.getMaxDelegationAvailable = exports.canDelegate = void 0;
var bignumber_js_1 = require("bignumber.js");
var logic_1 = require("../logic");
var js_getFeesForTransaction_1 = require("./js-getFeesForTransaction");
var OSMOSIS_MIN_SAFE = new bignumber_js_1.BigNumber(10000); // 10000 uosmo, setting a reasonable floor
var OSMOSIS_MIN_FEES = new bignumber_js_1.BigNumber(js_getFeesForTransaction_1.MIN_GAS_FEE * js_getFeesForTransaction_1.DEFAULT_GAS);
function canDelegate(account) {
    var maxSpendableBalance = getMaxDelegationAvailable(account, 1);
    return maxSpendableBalance.gt(0);
}
exports.canDelegate = canDelegate;
function getMaxDelegationAvailable(account, validatorsLength) {
    var numberOfDelegations = Math.min(logic_1.COSMOS_MAX_DELEGATIONS, validatorsLength || 1);
    var spendableBalance = account.spendableBalance;
    return spendableBalance
        .minus(OSMOSIS_MIN_FEES.multipliedBy(numberOfDelegations))
        .minus(OSMOSIS_MIN_SAFE);
}
exports.getMaxDelegationAvailable = getMaxDelegationAvailable;
//# sourceMappingURL=logic.js.map