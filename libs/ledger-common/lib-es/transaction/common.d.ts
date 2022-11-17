import type { Account, TransactionCommon, TransactionCommonRaw, TransactionStatusCommon, TransactionStatusCommonRaw } from "@ledgerhq/types-live";
export declare const fromTransactionCommonRaw: (raw: TransactionCommonRaw) => TransactionCommon;
export declare const toTransactionCommonRaw: (raw: TransactionCommon) => TransactionCommonRaw;
export declare const fromTransactionStatusRawCommon: (ts: TransactionStatusCommonRaw) => TransactionStatusCommon;
export declare const toTransactionStatusRawCommon: (ts: TransactionStatusCommon) => TransactionStatusCommonRaw;
export declare const formatTransactionStatusCommon: (t: TransactionCommon, { errors, warnings, estimatedFees, amount, totalSpent, }: TransactionStatusCommon, mainAccount: Account) => string;
//# sourceMappingURL=common.d.ts.map