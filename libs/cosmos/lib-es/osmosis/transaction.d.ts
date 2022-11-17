declare const _default: {
    formatTransaction: ({ mode, amount, fees, recipient, validators, memo, sourceValidator, useAllAmount, }: import("../types").Transaction, account: import("@ledgerhq/types-live").Account) => string;
    fromTransactionRaw: (tr: import("../types").TransactionRaw) => import("../types").Transaction;
    toTransactionRaw: (t: import("../types").Transaction) => import("../types").TransactionRaw;
    fromTransactionStatusRaw: (ts: import("@ledgerhq/types-live").TransactionStatusCommonRaw) => import("@ledgerhq/types-live").TransactionStatusCommon;
    toTransactionStatusRaw: (ts: import("@ledgerhq/types-live").TransactionStatusCommon) => import("@ledgerhq/types-live").TransactionStatusCommonRaw;
    formatTransactionStatus: (t: import("@ledgerhq/types-live").TransactionCommon, { errors, warnings, estimatedFees, amount, totalSpent, }: import("@ledgerhq/types-live").TransactionStatusCommon, mainAccount: import("@ledgerhq/types-live").Account) => string;
};
export default _default;
//# sourceMappingURL=transaction.d.ts.map