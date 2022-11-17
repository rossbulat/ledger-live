import { BigNumber } from "bignumber.js";
import type { Account, AccountLike, AccountLikeArray, SubAccount, TokenAccount, ChildAccount } from "@ledgerhq/types-live";
import { CryptoCurrency, TokenCurrency, Unit } from "@ledgerhq/types-cryptoassets";
export declare const getMainAccount: (account: AccountLike, parentAccount?: Account | null | undefined) => Account;
export declare const getAccountCurrency: (account?: AccountLike) => TokenCurrency | CryptoCurrency;
export declare const getAccountUnit: (account: AccountLike) => Unit;
export declare const getAccountName: (account: AccountLike) => string;
export declare const getAccountSpendableBalance: (account: AccountLike) => BigNumber;
export declare const isAccountEmpty: (a: AccountLike) => boolean;
export declare function areAllOperationsLoaded(account: AccountLike): boolean;
export declare const isAccountBalanceSignificant: (a: AccountLike) => boolean;
export declare function clearAccount<T extends AccountLike>(account: T): T;
export declare function findSubAccountById(account: Account, id: string): SubAccount | null | undefined;
export declare function listSubAccounts(account: Account): SubAccount[];
export declare type FlattenAccountsOptions = {
    enforceHideEmptySubAccounts?: boolean;
};
export declare function flattenAccounts(topAccounts: AccountLikeArray, o?: FlattenAccountsOptions): AccountLike[];
export declare const shortAddressPreview: (addr: string, target?: number) => string;
export declare const isAccountBalanceUnconfirmed: (account: AccountLike) => boolean;
export declare const isUpToDateAccount: (account: Account | null | undefined) => boolean;
export declare const makeEmptyTokenAccount: (account: Account, token: TokenCurrency) => TokenAccount;
/**
 * Enhance an account to force token accounts presence
 */
export declare const accountWithMandatoryTokens: (account: Account, tokenCurrencies: TokenCurrency[]) => Account;
/**
 * Patch account to enforce the removal of a blacklisted token
 */
export declare const withoutToken: (account: Account, tokenId: string) => Account;
/**
 * Find matching pair of subAccount/parentAccount for a given token curency
 * if no subAccount found will return parentAccount or null if no matches found
 */
export declare const findTokenAccountByCurrency: (tokenCurrency: TokenCurrency, accounts: Account[]) => {
    account?: SubAccount;
    parentAccount: Account;
} | null | undefined;
export declare function isAccount(account?: AccountLike): account is Account;
export declare function isTokenAccount(account?: AccountLike): account is TokenAccount;
export declare function isChildAccount(account?: AccountLike): account is ChildAccount;
export declare function isSubAccount(account?: AccountLike): account is SubAccount;
export declare function getParentAccount(account: AccountLike, accounts: AccountLike[]): Account;
//# sourceMappingURL=helpers.d.ts.map