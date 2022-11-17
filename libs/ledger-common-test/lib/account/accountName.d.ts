import { CryptoCurrency } from "@ledgerhq/types-cryptoassets";
import { Account, DerivationMode } from "@ledgerhq/types-live";
export declare const getAccountPlaceholderName: ({ currency, index, }: {
    currency: CryptoCurrency;
    index: number;
    derivationMode: DerivationMode;
}) => string;
export declare const getNewAccountPlaceholderName: ({ currency, index, }: {
    currency: CryptoCurrency;
    index: number;
    derivationMode: DerivationMode;
}) => string;
export declare const validateNameEdition: (account: Account, name?: string | null | undefined) => string;
//# sourceMappingURL=accountName.d.ts.map