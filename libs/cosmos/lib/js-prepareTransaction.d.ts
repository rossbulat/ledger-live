import { Transaction } from "./types";
import BigNumber from "bignumber.js";
import { CacheRes } from "@ledgerhq/common/lib/cache";
import type { Account } from "@ledgerhq/types-live";
export declare const calculateFees: CacheRes<Array<{
    account: Account;
    transaction: Transaction;
}>, {
    estimatedFees: BigNumber;
    estimatedGas: BigNumber;
}>;
export declare const prepareTransaction: (account: Account, transaction: Transaction) => Promise<Transaction>;
export default prepareTransaction;
//# sourceMappingURL=js-prepareTransaction.d.ts.map