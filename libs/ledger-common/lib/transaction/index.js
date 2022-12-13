"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
exports.__esModule = true;
__exportStar(require("./common"), exports);
__exportStar(require("./deviceTransactionConfig"), exports);
// export const fromTransactionRaw = (tr: TransactionRaw): Transaction => {
//   const TM = transactionModulePerFamily[tr.family];
//   // FIXME: something is wrong with TM.fromTransactionRaw expecting a (arg: never) => for some reasons
//   return TM.fromTransactionRaw(tr as any);
// };
// export const toTransactionRaw = (t: Transaction): TransactionRaw => {
//   const TM = transactionModulePerFamily[t.family];
//   // FIXME: something is wrong with TM.toTransactionRaw expecting a (arg: never) => for some reasons
//   return TM.toTransactionRaw(t as any);
// };
// export const fromTransactionStatusRaw = (
//   tr: TransactionStatusRaw,
//   family: string
// ): TransactionStatus => {
//   const TM = transactionModulePerFamily[family];
//   return TM.fromTransactionStatusRaw(tr as any);
// };
// export const toTransactionStatusRaw = (
//   t: TransactionStatus,
//   family: string
// ): TransactionStatusRaw => {
//   const TM = transactionModulePerFamily[family];
//   return TM.toTransactionStatusRaw(t as any);
// };
// export const formatTransaction = (t: Transaction, a: Account): string => {
//   const TM = transactionModulePerFamily[t.family];
//   // FIXME: something is wrong with TM.formatTransaction expecting a (arg: never) => for some reasons
//   return TM.formatTransaction ? TM.formatTransaction(t as any, a as any) : "";
// };
// export const formatTransactionStatus = (
//   t: Transaction,
//   ts: TransactionStatus,
//   mainAccount: Account
// ): string => {
//   const TM = transactionModulePerFamily[t.family];
//   return TM.formatTransactionStatus(t as any, ts as any, mainAccount as any);
// };
//# sourceMappingURL=index.js.map