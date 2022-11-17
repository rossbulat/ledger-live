"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var bignumber_js_1 = require("bignumber.js");
var preloadedData_mock_1 = __importDefault(require("./preloadedData.mock"));
var helpers_1 = require("../../mock/helpers");
var validators = preloadedData_mock_1["default"].validators;
function setCosmosResources(account, delegations, unbondingBalance, unbondings, redelegations) {
    var _a, _b, _c, _d;
    if (unbondingBalance === void 0) { unbondingBalance = new bignumber_js_1.BigNumber(0); }
    /** format cosmosResources given the new delegations */
    account.cosmosResources = {
        delegations: delegations,
        delegatedBalance: delegations.reduce(function (sum, _a) {
            var amount = _a.amount;
            return sum.plus(amount);
        }, new bignumber_js_1.BigNumber(0)),
        pendingRewardsBalance: delegations.reduce(function (sum, _a) {
            var pendingRewards = _a.pendingRewards;
            return sum.plus(pendingRewards);
        }, new bignumber_js_1.BigNumber(0)),
        unbondingBalance: account.cosmosResources
            ? account.cosmosResources.unbondingBalance.plus(unbondingBalance)
            : unbondingBalance,
        withdrawAddress: account.id,
        unbondings: (_b = unbondings !== null && unbondings !== void 0 ? unbondings : (_a = account.cosmosResources) === null || _a === void 0 ? void 0 : _a.unbondings) !== null && _b !== void 0 ? _b : [],
        redelegations: (_d = redelegations !== null && redelegations !== void 0 ? redelegations : (_c = account.cosmosResources) === null || _c === void 0 ? void 0 : _c.redelegations) !== null && _d !== void 0 ? _d : []
    };
    return account;
}
function setOperationFeeValue(operation, base) {
    operation.fee = new bignumber_js_1.BigNumber(Math.round(base.toNumber() * 0.001));
    operation.value = operation.fee;
    return operation;
}
function genBaseOperation(account, rng, type, index) {
    var ops = account.operations;
    var address = (0, helpers_1.genAddress)(account.currency, rng);
    var lastOp = ops[index];
    var date = new Date((lastOp ? lastOp.date.valueOf() : Date.now()) -
        rng.nextInt(0, 100000000 * rng.next() * rng.next()));
    var hash = (0, helpers_1.genHex)(64, rng);
    /** generate given operation */
    return {
        id: String("mock_op_".concat(ops.length, "_").concat(type, "_").concat(account.id)),
        hash: hash,
        type: type,
        value: new bignumber_js_1.BigNumber(0),
        fee: new bignumber_js_1.BigNumber(0),
        senders: [address],
        recipients: [address],
        blockHash: (0, helpers_1.genHex)(64, rng),
        blockHeight: account.blockHeight - Math.floor((Date.now() - date.valueOf()) / 900000),
        accountId: account.id,
        date: date,
        extra: {}
    };
}
/**
 * Generates a cosmos delegation operation updating both operations list and account cosmos resources
 * @memberof cosmos/mock
 * @param {CosmosAccount} account
 * @param {Prando} rng
 */
function addDelegationOperation(account, rng) {
    var spendableBalance = account.spendableBalance;
    var cosmosResources = account.cosmosResources
        ? account.cosmosResources
        : {
            delegations: [],
            delegatedBalance: new bignumber_js_1.BigNumber(0),
            pendingRewardsBalance: new bignumber_js_1.BigNumber(0),
            unbondingBalance: new bignumber_js_1.BigNumber(0),
            withdrawAddress: "",
            unbondings: [],
            redelegations: []
        };
    if (spendableBalance.isZero())
        return account;
    /** select position on the operation stack where we will insert the new delegation */
    var opIndex = rng.next(0, 10);
    var delegationOp = genBaseOperation(account, rng, "DELEGATE", opIndex);
    var feeOp = genBaseOperation(account, rng, "FEES", opIndex);
    var value = spendableBalance.plus(cosmosResources.delegatedBalance);
    /** select between 3 to 5 validators and split the amount evenly */
    var delegatedValidators = Array.from({
        length: rng.nextInt(3, 5)
    })
        .map(function () { return rng.nextArrayItem(validators); })
        .filter(function (validator, index, arr) {
        return arr.findIndex(function (v) { return v.validatorAddress === validator.validatorAddress; }) === index;
    })
        .map(function (_a, i, arr) {
        var validatorAddress = _a.validatorAddress;
        return ({
            address: validatorAddress,
            amount: new bignumber_js_1.BigNumber(Math.round(value.toNumber() * rng.next(0.1, 1 / arr.length)))
        });
    });
    delegationOp.extra = {
        validators: delegatedValidators
    };
    /** format delegations and randomize rewards and status */
    var delegations = delegatedValidators.map(function (_a) {
        var address = _a.address, amount = _a.amount;
        return ({
            validatorAddress: address,
            amount: amount,
            pendingRewards: rng.nextBoolean()
                ? new bignumber_js_1.BigNumber(Math.round(amount.toNumber() * 0.01))
                : new bignumber_js_1.BigNumber(0),
            status: rng.next() > 0.33 ? "bonded" : "unbonded"
        });
    });
    setCosmosResources(account, delegations, undefined, undefined, undefined);
    setOperationFeeValue(delegationOp, account.cosmosResources
        ? account.cosmosResources.delegatedBalance
        : new bignumber_js_1.BigNumber(0));
    setOperationFeeValue(feeOp, account.cosmosResources
        ? account.cosmosResources.delegatedBalance
        : new bignumber_js_1.BigNumber(0));
    postSyncAccount(account);
    account.operations.splice(opIndex, 0, delegationOp, feeOp);
    account.operationsCount += 2;
    return account;
}
/**
 * Generates a cosmos redelegation operation updating both operations list and account cosmos resources
 * @memberof cosmos/mock
 * @param {CosmosAccount} account
 * @param {Prando} rng
 */
function addRedelegationOperation(account, rng) {
    var cosmosResources = account.cosmosResources
        ? account.cosmosResources
        : {
            delegations: [],
            delegatedBalance: new bignumber_js_1.BigNumber(0),
            pendingRewardsBalance: new bignumber_js_1.BigNumber(0),
            unbondingBalance: new bignumber_js_1.BigNumber(0),
            withdrawAddress: "",
            unbondings: [],
            redelegations: []
        };
    if (!cosmosResources.delegations.length)
        return account;
    /** select position on the operation stack where we will insert the new delegation */
    var opIndex = rng.next(0, 10);
    var redelegationOp = genBaseOperation(account, rng, "REDELEGATE", opIndex);
    var fromDelegation = rng.nextArrayItem(cosmosResources.delegations);
    var amount = new bignumber_js_1.BigNumber(Math.round(fromDelegation.amount.toNumber() * rng.next(0.1, 1)));
    var toDelegation = rng.nextArrayItem(validators);
    redelegationOp.extra = {
        validator: {
            address: toDelegation.validatorAddress,
            amount: amount
        },
        sourceValidator: fromDelegation.validatorAddress
    };
    var delegations = cosmosResources.delegations
        .filter(function (_a) {
        var validatorAddress = _a.validatorAddress;
        return validatorAddress === fromDelegation.validatorAddress;
    })
        .concat([
        {
            validatorAddress: toDelegation.validatorAddress,
            amount: amount,
            pendingRewards: rng.nextBoolean()
                ? new bignumber_js_1.BigNumber(Math.round(amount.toNumber() * 0.01))
                : new bignumber_js_1.BigNumber(0),
            status: rng.next() > 0.33 ? "bonded" : "unbonded"
        },
    ]);
    setCosmosResources(account, delegations, undefined, undefined, [
        {
            validatorSrcAddress: fromDelegation.validatorAddress,
            validatorDstAddress: toDelegation.validatorAddress,
            amount: amount,
            completionDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000)
        },
    ]);
    setOperationFeeValue(redelegationOp, amount);
    account.operations.splice(opIndex, 0, redelegationOp);
    account.operationsCount++;
    return account;
}
/**
 * Generates a cosmos redelegation operation updating both operations list and account cosmos resources
 * @memberof cosmos/mock
 * @param {CosmosAccount} account
 * @param {Prando} rng
 */
function addClaimRewardsOperation(account, rng) {
    var cosmosResources = account.cosmosResources
        ? account.cosmosResources
        : {
            delegations: [],
            delegatedBalance: new bignumber_js_1.BigNumber(0),
            pendingRewardsBalance: new bignumber_js_1.BigNumber(0),
            unbondingBalance: new bignumber_js_1.BigNumber(0),
            withdrawAddress: "",
            unbondings: [],
            redelegations: []
        };
    if (!cosmosResources.delegations.length)
        return account;
    /** select position on the operation stack where we will insert the new claim rewards */
    var opIndex = rng.next(0, 10);
    var claimRewardOp = genBaseOperation(account, rng, "REWARD", opIndex);
    var fromDelegation = rng.nextArrayItem(cosmosResources.delegations);
    var amount = fromDelegation.pendingRewards.gt(0)
        ? fromDelegation.pendingRewards
        : new bignumber_js_1.BigNumber(Math.round(fromDelegation.amount.toNumber() * 0.01));
    claimRewardOp.extra = {
        validator: {
            address: fromDelegation.validatorAddress,
            amount: amount
        }
    };
    var delegations = cosmosResources.delegations.map(function (delegation) { return (__assign(__assign({}, delegation), { pendingRewards: delegation.validatorAddress === fromDelegation.validatorAddress
            ? new bignumber_js_1.BigNumber(0)
            : delegation.pendingRewards })); });
    setCosmosResources(account, delegations, undefined, undefined, undefined);
    claimRewardOp.fee = new bignumber_js_1.BigNumber(Math.round(amount.toNumber() * 0.001));
    claimRewardOp.value = amount;
    account.operations.splice(opIndex, 0, claimRewardOp);
    account.operationsCount++;
    return account;
}
/**
 * Generates a cosmos undelegation operation updating both operations list and account cosmos resources
 * @memberof cosmos/mock
 * @param {CosmosAccount} account
 * @param {Prando} rng
 */
function addUndelegationOperation(account, rng) {
    var cosmosResources = account.cosmosResources
        ? account.cosmosResources
        : {
            delegations: [],
            delegatedBalance: new bignumber_js_1.BigNumber(0),
            pendingRewardsBalance: new bignumber_js_1.BigNumber(0),
            unbondingBalance: new bignumber_js_1.BigNumber(0),
            withdrawAddress: "",
            unbondings: [],
            redelegations: []
        };
    if (!cosmosResources.delegations.length)
        return account;
    /** select position on the operation stack where we will insert the new claim rewards */
    var opIndex = rng.next(0, 10);
    var undelegationOp = genBaseOperation(account, rng, "UNDELEGATE", opIndex);
    var fromDelegation = rng.nextArrayItem(cosmosResources.delegations);
    var amount = new bignumber_js_1.BigNumber(Math.round(fromDelegation.amount.toNumber() *
        (rng.nextBoolean() ? rng.next(0.1, 1) : 1)));
    var claimedReward = fromDelegation.pendingRewards;
    undelegationOp.extra = {
        validator: {
            address: fromDelegation.validatorAddress,
            amount: amount
        }
    };
    var delegations = cosmosResources.delegations
        .map(function (delegation) { return (__assign(__assign({}, delegation), { amount: delegation.validatorAddress === fromDelegation.validatorAddress
            ? delegation.amount.minus(amount)
            : delegation.amount, pendingRewards: new bignumber_js_1.BigNumber(0) })); })
        .filter(function (_a) {
        var amount = _a.amount;
        return amount.gt(0);
    });
    setCosmosResources(account, delegations, amount, [
        {
            validatorAddress: fromDelegation.validatorAddress,
            amount: amount,
            completionDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000)
        },
    ], undefined);
    undelegationOp.fee = new bignumber_js_1.BigNumber(Math.round(amount.toNumber() * 0.001));
    undelegationOp.value = undelegationOp.fee.minus(claimedReward);
    account.operations.splice(opIndex, 0, undelegationOp);
    account.operationsCount++;
    return account;
}
/**
 * add in specific cosmos operations
 * @memberof cosmos/mock
 * @param {CosmosAccount} account
 * @param {Prando} rng
 */
function genAccountEnhanceOperations(account, rng) {
    addDelegationOperation(account, rng);
    addRedelegationOperation(account, rng);
    addClaimRewardsOperation(account, rng);
    addUndelegationOperation(account, rng);
    addDelegationOperation(account, rng);
    return account;
}
/**
 * Update spendable balance for the account based on delegation data
 * @memberof cosmos/mock
 * @param {CosmosAccount} account
 */
function postSyncAccount(account) {
    var _a, _b;
    var cosmosResources = account === null || account === void 0 ? void 0 : account.cosmosResources;
    var delegatedBalance = (_a = cosmosResources === null || cosmosResources === void 0 ? void 0 : cosmosResources.delegatedBalance) !== null && _a !== void 0 ? _a : new bignumber_js_1.BigNumber(0);
    var unbondingBalance = (_b = cosmosResources === null || cosmosResources === void 0 ? void 0 : cosmosResources.unbondingBalance) !== null && _b !== void 0 ? _b : new bignumber_js_1.BigNumber(0);
    account.spendableBalance = account.balance
        .minus(delegatedBalance)
        .minus(unbondingBalance);
    return account;
}
/**
 * post account scan data logic
 * clears account cosmos resources if supposed to be empty
 * @memberof cosmos/mock
 * @param {Account} account
 */
function postScanAccount(account, _a) {
    var isEmpty = _a.isEmpty;
    if (isEmpty) {
        account.cosmosResources = {
            delegations: [],
            delegatedBalance: new bignumber_js_1.BigNumber(0),
            pendingRewardsBalance: new bignumber_js_1.BigNumber(0),
            unbondingBalance: new bignumber_js_1.BigNumber(0),
            withdrawAddress: account.id,
            unbondings: [],
            redelegations: []
        };
        account.operations = [];
    }
    return account;
}
exports["default"] = {
    genAccountEnhanceOperations: genAccountEnhanceOperations,
    postSyncAccount: postSyncAccount,
    postScanAccount: postScanAccount
};
//# sourceMappingURL=mock.js.map