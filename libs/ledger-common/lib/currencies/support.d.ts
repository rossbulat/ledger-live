import { CryptoCurrencyIds } from "@ledgerhq/cryptoassets";
import { CryptoCurrency, FiatCurrency } from "@ledgerhq/types-cryptoassets";
export declare function isFiatSupported(fiat: FiatCurrency): boolean;
export declare function setSupportedFiats(ids: string[]): void;
export declare function listSupportedFiats(): FiatCurrency[];
export declare function setSupportedCurrencies(ids: CryptoCurrencyIds[]): void;
export declare function listSupportedCurrencies(): CryptoCurrency[];
export declare function isCurrencySupported(currency: CryptoCurrency): boolean;
//# sourceMappingURL=support.d.ts.map