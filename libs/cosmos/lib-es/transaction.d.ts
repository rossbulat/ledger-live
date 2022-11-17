import type { Transaction, TransactionRaw } from "./types";
import { Account } from "@ledgerhq/types-live";
export declare const formatTransaction: ({ mode, amount, fees, recipient, validators, memo, sourceValidator, useAllAmount, }: Transaction, account: Account) => string;
export declare const fromTransactionRaw: (tr: TransactionRaw) => Transaction;
export declare const toTransactionRaw: (t: Transaction) => TransactionRaw;
declare const _default: {
    formatTransaction: ({ mode, amount, fees, recipient, validators, memo, sourceValidator, useAllAmount, }: Transaction, account: Account) => string;
    fromTransactionRaw: (tr: TransactionRaw) => Transaction;
    toTransactionRaw: (t: Transaction) => TransactionRaw;
    fromTransactionStatusRaw: (ts: import("@ledgerhq/types-live").TransactionStatusCommonRaw) => import("@ledgerhq/types-live").TransactionStatusCommon;
    toTransactionStatusRaw: (ts: import("@ledgerhq/types-live").TransactionStatusCommon) => import("@ledgerhq/types-live").TransactionStatusCommonRaw;
    formatTransactionStatus: (t: import("@ledgerhq/types-live").TransactionCommon, { errors, warnings, estimatedFees, amount, totalSpent, }: import("@ledgerhq/types-live").TransactionStatusCommon, mainAccount: Account) => string;
};
export default _default;
//# sourceMappingURL=transaction.d.ts.map