import type { Account, CryptoCurrencyIds } from "@ledgerhq/types-live";
export declare type AccountData = {
    id: string;
    currencyId: string;
    freshAddress?: string;
    seedIdentifier: string;
    derivationMode: string;
    name: string;
    index: number;
    balance: string;
};
export declare type CryptoSettings = {
    confirmationsNb?: number;
};
export declare type Settings = {
    counterValue?: string;
    currenciesSettings: Record<CryptoCurrencyIds, CryptoSettings>;
    pairExchanges: Record<string, string | null | undefined>;
    blacklistedTokenIds?: string[];
    hideEmptyTokenAccounts?: boolean;
};
export declare type DataIn = {
    accounts: Account[];
    settings: Settings;
    exporterName: string;
    exporterVersion: string;
};
declare type Meta = {
    exporterName: string;
    exporterVersion: string;
};
export declare type Result = {
    accounts: AccountData[];
    settings: Settings;
    meta: Meta;
};
export declare function encode({ accounts, settings, exporterName, exporterVersion, }: DataIn): string;
export declare function decode(bytes: string): Result;
export declare function accountToAccountData({ id, name, seedIdentifier, derivationMode, freshAddress, currency, index, balance, }: Account): AccountData;
export declare const accountDataToAccount: ({ id, currencyId, freshAddress: inputFreshAddress, name, index, balance, derivationMode: derivationModeStr, seedIdentifier, }: AccountData) => Account;
export {};
//# sourceMappingURL=cross.d.ts.map