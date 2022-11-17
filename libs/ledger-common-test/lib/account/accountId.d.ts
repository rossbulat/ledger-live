import type { AccountIdParams, DerivationMode } from "@ledgerhq/types-live";
import type { CryptoCurrency, TokenCurrency } from "@ledgerhq/types-cryptoassets";
export declare function encodeAccountId({ type, version, currencyId, xpubOrAddress, derivationMode, }: AccountIdParams): string;
export declare function encodeTokenAccountId(accountId: string, token: TokenCurrency): string;
export declare function decodeTokenAccountId(id: string): {
    accountId: string;
    token: TokenCurrency | null | undefined;
};
export declare function decodeAccountId(accountId: string): AccountIdParams;
export declare function getWalletName({ seedIdentifier, derivationMode, currency, }: {
    seedIdentifier: string;
    derivationMode: DerivationMode;
    currency: CryptoCurrency;
}): string;
export declare const inferFamilyFromAccountId: (accountId: string) => string | null | undefined;
//# sourceMappingURL=accountId.d.ts.map