import type { AccountLike } from "@ledgerhq/types-live";
import type { TransactionStatus } from "./types";
import { Transaction } from "./types";
declare type CommonDeviceTransactionField = {
    type: "text";
    label: "Type" | "Memo";
    value: string;
};
export declare type ExtraDeviceTransactionField = CommonDeviceTransactionField | {
    type: "cosmos.delegateValidators";
    label: string;
} | {
    type: "cosmos.validatorName";
    label: string;
} | {
    type: "cosmos.sourceValidatorName";
    label: string;
} | {
    type: "osmosis.extendedAmount";
    label: string;
    value?: string;
};
declare function getDeviceTransactionConfig({ transaction, status: { estimatedFees, totalSpent }, }: {
    account: AccountLike;
    transaction: Transaction;
    status: TransactionStatus;
}): Array<ExtraDeviceTransactionField>;
export default getDeviceTransactionConfig;
//# sourceMappingURL=deviceTransactionConfig.d.ts.map