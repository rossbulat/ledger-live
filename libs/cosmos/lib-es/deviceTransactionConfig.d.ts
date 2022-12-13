import type { AccountLike, Account } from "@ledgerhq/types-live";
import type { Transaction, TransactionStatus } from "./types";
import type { CommonDeviceTransactionField } from "@ledgerhq/ledger-common/lib/transaction";
export declare type ExtraDeviceTransactionField = {
    type: "cosmos.delegateValidators";
    label: string;
} | {
    type: "cosmos.validatorName";
    label: string;
} | {
    type: "cosmos.sourceValidatorName";
    label: string;
};
declare type CosmosTransactionFieldType = (CommonDeviceTransactionField | ExtraDeviceTransactionField) & {
    type: string;
    label: string;
    value?: string;
    address?: string;
};
declare function getDeviceTransactionConfig({ account, parentAccount, transaction, status, }: {
    account: AccountLike;
    parentAccount: Account | null | undefined;
    transaction: Transaction;
    status: TransactionStatus;
}): Array<CosmosTransactionFieldType>;
export default getDeviceTransactionConfig;
//# sourceMappingURL=deviceTransactionConfig.d.ts.map