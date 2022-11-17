import type { BigNumber } from "bignumber.js";
import { TransactionStatusCommon, TransactionStatusCommonRaw } from "@ledgerhq/types-live";
import { CosmosLikeTransaction, CosmosLikeTransactionRaw } from "../types";
import { CosmosDelegationInfo, CosmosDelegationInfoRaw } from "../types";
export declare type Transaction = CosmosLikeTransaction & {
    family: "osmosis";
    mode: string;
    fees: BigNumber | null;
    gas: BigNumber | null | undefined;
    memo: string | null | undefined;
    validators: CosmosDelegationInfo[];
    sourceValidator: string | null | undefined;
};
export declare type TransactionRaw = CosmosLikeTransactionRaw & {
    family: "osmosis";
    mode: string;
    fees: string | null;
    gas: string | null | undefined;
    memo: string | null | undefined;
    validators: CosmosDelegationInfoRaw[];
    sourceValidator: string | null | undefined;
};
export declare type TransactionStatus = TransactionStatusCommon;
export declare type TransactionStatusRaw = TransactionStatusCommonRaw;
export declare type OsmosisRewardsState = {
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
//# sourceMappingURL=types.d.ts.map