import type { AccountLike, AccountLikeArray, DailyOperations, Operation } from "@ledgerhq/types-live";
declare type GroupOpsByDayOpts = {
    count: number;
    withSubAccounts?: boolean;
    filterOperation?: (arg0: Operation, arg1: AccountLike) => boolean;
};
/**
 * @memberof account
 */
export declare function groupAccountsOperationsByDay(inputAccounts: AccountLikeArray, { count, withSubAccounts, filterOperation }: GroupOpsByDayOpts): DailyOperations;
/**
 * Return a list of `{count}` operations grouped by day.
 * @memberof account
 */
export declare function groupAccountOperationsByDay(account: AccountLike, arg: GroupOpsByDayOpts): DailyOperations;
export {};
//# sourceMappingURL=groupOperations.d.ts.map