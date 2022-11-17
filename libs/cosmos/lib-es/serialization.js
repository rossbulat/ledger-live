import { BigNumber } from "bignumber.js";
export function toCosmosResourcesRaw(r) {
    var delegatedBalance = r.delegatedBalance, delegations = r.delegations, pendingRewardsBalance = r.pendingRewardsBalance, unbondingBalance = r.unbondingBalance, withdrawAddress = r.withdrawAddress, redelegations = r.redelegations, unbondings = r.unbondings;
    return {
        delegations: delegations.map(function (_a) {
            var amount = _a.amount, status = _a.status, pendingRewards = _a.pendingRewards, validatorAddress = _a.validatorAddress;
            return ({
                amount: amount.toString(),
                status: status,
                pendingRewards: pendingRewards.toString(),
                validatorAddress: validatorAddress
            });
        }),
        redelegations: redelegations.map(function (_a) {
            var amount = _a.amount, completionDate = _a.completionDate, validatorSrcAddress = _a.validatorSrcAddress, validatorDstAddress = _a.validatorDstAddress;
            return ({
                amount: amount.toString(),
                completionDate: completionDate.toString(),
                validatorSrcAddress: validatorSrcAddress,
                validatorDstAddress: validatorDstAddress
            });
        }),
        unbondings: unbondings.map(function (_a) {
            var amount = _a.amount, completionDate = _a.completionDate, validatorAddress = _a.validatorAddress;
            return ({
                amount: amount.toString(),
                completionDate: completionDate.toString(),
                validatorAddress: validatorAddress
            });
        }),
        delegatedBalance: delegatedBalance.toString(),
        pendingRewardsBalance: pendingRewardsBalance.toString(),
        unbondingBalance: unbondingBalance.toString(),
        withdrawAddress: withdrawAddress
    };
}
export function fromCosmosResourcesRaw(r) {
    var delegatedBalance = r.delegatedBalance, delegations = r.delegations, pendingRewardsBalance = r.pendingRewardsBalance, redelegations = r.redelegations, unbondingBalance = r.unbondingBalance, withdrawAddress = r.withdrawAddress, unbondings = r.unbondings;
    return {
        delegations: delegations.map(function (_a) {
            var amount = _a.amount, status = _a.status, pendingRewards = _a.pendingRewards, validatorAddress = _a.validatorAddress;
            return ({
                amount: new BigNumber(amount),
                status: status,
                pendingRewards: new BigNumber(pendingRewards),
                validatorAddress: validatorAddress
            });
        }),
        redelegations: redelegations.map(function (_a) {
            var amount = _a.amount, completionDate = _a.completionDate, validatorSrcAddress = _a.validatorSrcAddress, validatorDstAddress = _a.validatorDstAddress;
            return ({
                amount: new BigNumber(amount),
                completionDate: new Date(completionDate),
                validatorSrcAddress: validatorSrcAddress,
                validatorDstAddress: validatorDstAddress
            });
        }),
        unbondings: unbondings.map(function (_a) {
            var amount = _a.amount, completionDate = _a.completionDate, validatorAddress = _a.validatorAddress;
            return ({
                amount: new BigNumber(amount),
                completionDate: new Date(completionDate),
                validatorAddress: validatorAddress
            });
        }),
        delegatedBalance: new BigNumber(delegatedBalance),
        pendingRewardsBalance: new BigNumber(pendingRewardsBalance),
        unbondingBalance: new BigNumber(unbondingBalance),
        withdrawAddress: withdrawAddress
    };
}
//# sourceMappingURL=serialization.js.map