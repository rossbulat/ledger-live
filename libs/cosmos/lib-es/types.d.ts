import type { BigNumber } from "bignumber.js";
import { Account, AccountRaw, Operation, OperationRaw, TransactionCommon, TransactionCommonRaw, TransactionStatusCommon, TransactionStatusCommonRaw } from "@ledgerhq/types-live";
export declare type CosmosDelegationStatus = "bonded" | "unbonding" | "unbonded";
export declare type CosmosDelegation = {
    validatorAddress: string;
    amount: BigNumber;
    pendingRewards: BigNumber;
    status: CosmosDelegationStatus;
};
export declare type CosmosRedelegation = {
    validatorSrcAddress: string;
    validatorDstAddress: string;
    amount: BigNumber;
    completionDate: Date;
};
export declare type CosmosUnbonding = {
    validatorAddress: string;
    amount: BigNumber;
    completionDate: Date;
};
export declare type CosmosResources = {
    delegations: CosmosDelegation[];
    redelegations: CosmosRedelegation[];
    unbondings: CosmosUnbonding[];
    delegatedBalance: BigNumber;
    pendingRewardsBalance: BigNumber;
    unbondingBalance: BigNumber;
    withdrawAddress: string;
};
export declare type CosmosDelegationRaw = {
    validatorAddress: string;
    amount: string;
    pendingRewards: string;
    status: CosmosDelegationStatus;
};
export declare type CosmosUnbondingRaw = {
    validatorAddress: string;
    amount: string;
    completionDate: string;
};
export declare type CosmosRedelegationRaw = {
    validatorSrcAddress: string;
    validatorDstAddress: string;
    amount: string;
    completionDate: string;
};
export declare type CosmosResourcesRaw = {
    delegations: CosmosDelegationRaw[];
    redelegations: CosmosRedelegationRaw[];
    unbondings: CosmosUnbondingRaw[];
    delegatedBalance: string;
    pendingRewardsBalance: string;
    unbondingBalance: string;
    withdrawAddress: string;
};
export declare type CosmosValidatorItem = {
    validatorAddress: string;
    name: string;
    votingPower: number;
    commission: number;
    estimatedYearlyRewardsRate: number;
    tokens: number;
};
export declare type CosmosRewardsState = {
    targetBondedRatio: number;
    communityPoolCommission: number;
    assumedTimePerBlock: number;
    inflationRateChange: number;
    inflationMaxRate: number;
    inflationMinRate: number;
    actualBondedRatio: number;
    averageTimePerBlock: number;
    totalSupply: number;
    averageDailyFees: number;
    currentValueInflation: number;
};
export declare type CosmosPreloadData = {
    validators: CosmosValidatorItem[];
};
export declare type CosmosOperationMode = "send" | "delegate" | "undelegate" | "redelegate" | "claimReward" | "claimRewardCompound";
export declare type CosmosLikeNetworkInfo = {
    family: string;
    fees: BigNumber;
};
export declare type CosmosLikeNetworkInfoRaw = {
    family: string;
    fees: string;
};
export declare type NetworkInfo = CosmosLikeNetworkInfo & {
    family: "cosmos";
};
export declare type NetworkInfoRaw = CosmosLikeNetworkInfoRaw & {
    family: "cosmos";
};
export declare type CosmosOperation = Operation & {
    extra: CosmosExtraTxInfo;
};
export declare type CosmosOperationRaw = OperationRaw & {
    extra: CosmosExtraTxInfo;
};
export declare type CosmosExtraTxInfo = {
    validators?: CosmosDelegationInfo[];
    sourceValidator?: string | null | undefined;
    validator?: CosmosDelegationInfo;
    autoClaimedRewards?: string | null | undefined;
};
export declare type CosmosDelegationInfo = {
    address: string;
    amount: BigNumber;
};
export declare type CosmosDelegationInfoRaw = {
    address: string;
    amount: string;
};
export declare type CosmosClaimedRewardInfo = {
    amount: BigNumber;
};
export declare type CosmosLikeTransaction = TransactionCommon & {
    family: string;
    mode: CosmosOperationMode;
    networkInfo: CosmosLikeNetworkInfo | null | undefined;
    fees: BigNumber | null | undefined;
    gas: BigNumber | null | undefined;
    memo: string | null | undefined;
    validators: CosmosDelegationInfo[];
    sourceValidator: string | null | undefined;
};
export declare type Transaction = CosmosLikeTransaction & {
    family: "cosmos" | "osmosis";
    networkInfo: NetworkInfo | null | undefined;
};
export declare type CosmosLikeTransactionRaw = TransactionCommonRaw & {
    family: string;
    mode: CosmosOperationMode;
    networkInfo: CosmosLikeNetworkInfoRaw | null | undefined;
    fees: string | null | undefined;
    gas: string | null | undefined;
    memo: string | null | undefined;
    validators: CosmosDelegationInfoRaw[];
    sourceValidator: string | null | undefined;
};
export declare type TransactionRaw = CosmosLikeTransactionRaw & {
    family: "cosmos" | "osmosis";
    networkInfo: NetworkInfoRaw | null | undefined;
};
export declare type StatusErrorMap = {
    recipient?: Error;
    amount?: Error;
    fees?: Error;
    validators?: Error;
    delegate?: Error;
    redelegation?: Error;
    unbonding?: Error;
    claimReward?: Error;
    feeTooHigh?: Error;
};
export declare type CosmosMappedDelegation = CosmosDelegation & {
    formattedAmount: string;
    formattedPendingRewards: string;
    rank: number;
    validator: CosmosValidatorItem | null | undefined;
};
export declare type CosmosMappedUnbonding = CosmosUnbonding & {
    formattedAmount: string;
    validator: CosmosValidatorItem | null | undefined;
};
export declare type CosmosMappedRedelegation = CosmosRedelegation & {
    formattedAmount: string;
    validatorSrc: CosmosValidatorItem | null | undefined;
    validatorDst: CosmosValidatorItem | null | undefined;
};
export declare type CosmosMappedDelegationInfo = CosmosDelegationInfo & {
    validator: CosmosValidatorItem | null | undefined;
    formattedAmount: string;
};
export declare type CosmosMappedValidator = {
    rank: number;
    validator: CosmosValidatorItem;
};
export declare type CosmosSearchFilter = (query: string) => (delegation: CosmosMappedDelegation | CosmosMappedValidator) => boolean;
export declare type CosmosAccount = Account & {
    cosmosResources: CosmosResources;
};
export declare type CosmosAccountRaw = AccountRaw & {
    cosmosResources: CosmosResourcesRaw;
};
export declare type TransactionStatus = TransactionStatusCommon;
export declare type TransactionStatusRaw = TransactionStatusCommonRaw;
//# sourceMappingURL=types.d.ts.map