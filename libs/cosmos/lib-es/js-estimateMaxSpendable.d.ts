import type { Account, AccountLike } from "@ledgerhq/types-live";
import { BigNumber } from "bignumber.js";
import type { Transaction } from "./types";
declare const estimateMaxSpendable: ({ account, parentAccount, transaction, }: {
    account: AccountLike;
    parentAccount: Account;
    transaction: Transaction;
}) => Promise<BigNumber>;
export default estimateMaxSpendable;
//# sourceMappingURL=js-estimateMaxSpendable.d.ts.map