import { Observable } from "rxjs";
import { Transaction as CosmosTransaction } from "./types";
import { AccountLike } from "@ledgerhq/types-live";
declare function inferTransactions(transactions: Array<{
    account: AccountLike;
    transaction: CosmosTransaction;
}>, opts: Record<string, any>, { inferAmount }: any): CosmosTransaction[];
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
    inferTransactions: typeof inferTransactions;
    commands: {
        cosmosValidators: {
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