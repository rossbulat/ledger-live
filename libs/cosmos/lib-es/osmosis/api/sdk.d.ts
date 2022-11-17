import BigNumber from "bignumber.js";
import { Operation, OperationType } from "@ledgerhq/types-live";
import { CosmosAPI } from "../../api/Cosmos";
import { OsmosisDistributionParams, OsmosisPool, OsmosisTotalSupply } from "../OsmosisSupplyTypes";
import { OsmosisAccountTransaction, OsmosisAmount, OsmosisSendEventContent } from "./sdk.types";
export declare const nodeEndpoint: any;
/**
 * Map a send transaction as returned by the indexer to a Ledger Live Operation
 */
export declare const convertTransactionToOperation: (accountId: string, type: OperationType, value: BigNumber, transaction: OsmosisAccountTransaction, senders: string[] | undefined, recipients: string[] | undefined, extra: Record<string, any>) => Operation;
/**
 * Map transaction to a correct Operation Value (affecting account balance)
 */
export declare function getOperationValue(eventContent: OsmosisSendEventContent, type: string, fee: BigNumber): BigNumber;
/**
 * Extract only the amount from a list of type OsmosisAmount
 */
export declare const getMicroOsmoAmount: (amounts: OsmosisAmount[]) => BigNumber;
export declare class OsmosisAPI extends CosmosAPI {
    protected _defaultEndpoint: string;
    protected _namespace: string;
    private _defaultTransactionsLimit;
    getOperations: (accountId: string, address: string, startDate: Date | null, startAt?: number, transactionsLimit?: number) => Promise<Operation[]>;
    convertSendTransactionToOperation: (accountId: string, address: string, event: any, tx: OsmosisAccountTransaction, memo: string) => Promise<Operation | undefined>;
    convertDelegateTransactionToOperation: (accountId: string, event: any, tx: OsmosisAccountTransaction, memo: string) => Promise<Operation[]>;
    calculateAutoClaimedRewards: (tx: OsmosisAccountTransaction) => BigNumber;
    convertRedelegateTransactionToOperation: (accountId: string, event: any, tx: OsmosisAccountTransaction, memo: string) => Promise<Operation[]>;
    convertUndelegateTransactionToOperation: (accountId: string, event: any, tx: OsmosisAccountTransaction, memo: string) => Promise<Operation[]>;
    convertRewardTransactionToOperation: (accountId: string, tx: OsmosisAccountTransaction, memo: string) => Promise<Operation[]>;
    queryTotalSupply: (minDenomUnit: string) => Promise<OsmosisTotalSupply>;
    queryPool: () => Promise<OsmosisPool>;
    queryDistributionParams: () => Promise<OsmosisDistributionParams>;
}
export declare const osmosisAPI: OsmosisAPI;
//# sourceMappingURL=sdk.d.ts.map