import type { CryptoCurrency } from "@ledgerhq/types-cryptoassets";
import type { Account, AccountLike } from "@ledgerhq/types-live";
import type { DerivationMode } from "../derivation";
export declare const shouldShowNewAccount: (currency: CryptoCurrency, derivationMode: DerivationMode) => boolean;
export declare const getReceiveFlowError: (account: AccountLike, parentAccount: Account | null | undefined) => Error | null | undefined;
export declare function canBeMigrated(account: Account): boolean;
export declare function findAccountMigration(account: Account, scannedAccounts: Account[]): Account | null | undefined;
export declare function checkAccountSupported(account: Account): Error | null | undefined;
//# sourceMappingURL=support.d.ts.map