import type { GranularityId, BalanceHistoryCache, AccountLike, Account } from "@ledgerhq/types-live";
export declare const emptyHistoryCache: {
    HOUR: {
        latestDate: null;
        balances: never[];
    };
    DAY: {
        latestDate: null;
        balances: never[];
    };
    WEEK: {
        latestDate: null;
        balances: never[];
    };
};
export declare function generateHistoryFromOperations(account: AccountLike): BalanceHistoryCache;
/**
 * get the current balance history of the account. if possible from the cache.
 */
export declare function getAccountHistoryBalances(account: AccountLike, g: GranularityId): number[];
/**
 * utility used at the end of an account synchronisation to recalculate the balance history if necessary
 */
export declare function recalculateAccountBalanceHistories(res: Account, prev: Account): Account;
//# sourceMappingURL=balanceHistoryCache.d.ts.map