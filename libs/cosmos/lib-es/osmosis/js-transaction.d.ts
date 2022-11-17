import type { Account } from "@ledgerhq/types-live";
import type { Transaction } from "./types";
/**
 * Create an empty transaction
 *
 * @returns {Transaction}
 */
export declare const createTransaction: () => Transaction;
/**
 * Apply patch to transaction
 *
 * @param {*} t
 * @param {*} patch
 */
export declare const updateTransaction: (t: Transaction, patch: Partial<Transaction>) => Transaction;
/**
 * Prepare transaction before checking status
 *
 * @param {Account} a
 * @param {Transaction} t
 */
export declare const prepareTransaction: (account: Account, t: Transaction) => Promise<Transaction>;
//# sourceMappingURL=js-transaction.d.ts.map