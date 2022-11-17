import { BigNumber } from "bignumber.js";
import type { FlattenAccountsOptions } from "./helpers";
import type { Account, AccountLike } from "@ledgerhq/types-live";
import type { CryptoCurrency, TokenCurrency } from "@ledgerhq/types-cryptoassets";
export declare type AccountComparator = (a: AccountLike, b: AccountLike) => number;
export declare const sortAccountsComparatorFromOrder: (orderAccounts: string, calculateCountervalue: (currency: TokenCurrency | CryptoCurrency, value: BigNumber) => BigNumber | null | undefined) => AccountComparator;
export declare const comparatorSortAccounts: <TA extends AccountLike>(accounts: TA[], comparator: AccountComparator) => TA[];
export declare const flattenSortAccounts: (accounts: Account[], comparator: AccountComparator, o?: FlattenAccountsOptions) => AccountLike[];
export declare const nestedSortAccounts: (topAccounts: Account[], comparator: AccountComparator) => Account[];
//# sourceMappingURL=ordering.d.ts.map