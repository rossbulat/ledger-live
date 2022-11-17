import { Observable } from "rxjs";
import type { Transaction } from "./types";
import type { Account, AccountLike, AccountLikeArray } from "@ledgerhq/types-live";
declare function inferAccounts(account: Account): AccountLikeArray;
declare function inferTransactions(transactions: Array<{
    account: AccountLike;
    transaction: Transaction;
    mainAccount: Account;
}>, opts: Record<string, any>, { inferAmount }: any): Transaction[];
declare const _default: {
    options: ({
        name: string;
        type: StringConstructor;
        desc: string;
        multiple?: undefined;
    } | {
        name: string;
        type: StringConstructor;
        multiple: boolean;
        desc: string;
    })[];
    inferAccounts: typeof inferAccounts;
    inferTransactions: typeof inferTransactions;
    commands: {
        osmosisValidators: {
            args: {
                name: string;
                desc: string;
                type: StringConstructor;
            }[];
            job: ({ format, }: Partial<{
                format: string;
            }>) => Observable<string>;
        };
    };
};
export default _default;
//# sourceMappingURL=cli-transaction.d.ts.map