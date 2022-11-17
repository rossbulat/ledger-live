import { CosmosLikeTransaction, CosmosAccount, TransactionStatus } from "./types";
import { CosmosAPI } from "./api/Cosmos";
export declare class CosmosTransactionStatusManager {
    protected _api: CosmosAPI;
    protected _validatorOperatorAddressPrefix: string;
    constructor(options?: {
        api?: CosmosAPI;
        validatorOperatorAddressPrefix?: string;
    });
    getTransactionStatus: (a: CosmosAccount, t: CosmosLikeTransaction) => Promise<TransactionStatus>;
    private getDelegateTransactionStatus;
    private getSendTransactionStatus;
    private redelegationStatusError;
    private isDelegable;
}
declare const _default: (a: CosmosAccount, t: CosmosLikeTransaction) => Promise<import("@ledgerhq/types-live").TransactionStatusCommon>;
export default _default;
//# sourceMappingURL=js-getTransactionStatus.d.ts.map