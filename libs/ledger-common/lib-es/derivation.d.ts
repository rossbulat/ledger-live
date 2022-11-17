import { Observable } from "rxjs";
import type { CryptoCurrency } from "@ledgerhq/types-cryptoassets";
export declare type Result = {
    address: string;
    path: string;
    publicKey: string;
    chainCode?: string;
};
export declare type GetAddressOptions = {
    currency: CryptoCurrency;
    path: string;
    derivationMode: DerivationMode;
    verify?: boolean;
    skipAppFailSafeCheck?: boolean;
    askChainCode?: boolean;
    forceFormat?: string;
    devicePath?: string;
    segwit?: boolean;
};
export declare type ModeSpec = {
    mandatoryEmptyAccountSkip?: number;
    isNonIterable?: boolean;
    startsAt?: number;
    overridesDerivation?: string;
    isSegwit?: boolean;
    isNativeSegwit?: boolean;
    isTaproot?: boolean;
    isUnsplit?: boolean;
    skipFirst?: true;
    overridesCoinType?: number;
    purpose?: number;
    isInvalid?: boolean;
    tag?: string;
    addressFormat?: string;
};
export declare type DerivationMode = keyof typeof modes;
declare const modes: Readonly<{
    "": {};
    ethM: {
        mandatoryEmptyAccountSkip: number;
        overridesDerivation: string;
        tag: string;
    };
    ethMM: {
        overridesDerivation: string;
        skipFirst: boolean;
        tag: string;
    };
    bch_on_bitcoin_segwit: {
        overridesCoinType: number;
        isInvalid: boolean;
        isSegwit: boolean;
        purpose: number;
        addressFormat: string;
    };
    legacy_on_bch: {
        overridesCoinType: number;
        isInvalid: boolean;
    };
    vertcoin_128: {
        tag: string;
        overridesCoinType: number;
    };
    vertcoin_128_segwit: {
        tag: string;
        overridesCoinType: number;
        isSegwit: boolean;
        purpose: number;
        addressFormat: string;
    };
    etcM: {
        mandatoryEmptyAccountSkip: number;
        overridesDerivation: string;
        tag: string;
    };
    aeternity: {
        overridesDerivation: string;
    };
    tezbox: {
        overridesDerivation: string;
    };
    tezosbip44h: {
        tag: string;
        overridesDerivation: string;
    };
    galleonL: {
        tag: string;
        startsAt: number;
        overridesDerivation: string;
    };
    tezboxL: {
        tag: string;
        startsAt: number;
        overridesDerivation: string;
    };
    taproot: {
        purpose: number;
        addressFormat: string;
        tag: string;
        isSegwit: boolean;
        isTaproot: boolean;
    };
    native_segwit: {
        purpose: number;
        addressFormat: string;
        tag: string;
        isSegwit: boolean;
        isNativeSegwit: boolean;
    };
    segwit: {
        isSegwit: boolean;
        purpose: number;
        tag: string;
        addressFormat: string;
    };
    segwit_on_legacy: {
        isSegwit: boolean;
        purpose: number;
        addressFormat: string;
        isInvalid: boolean;
    };
    legacy_on_segwit: {
        purpose: number;
        isInvalid: boolean;
    };
    legacy_on_native_segwit: {
        purpose: number;
        isInvalid: boolean;
    };
    segwit_unsplit: {
        isSegwit: boolean;
        purpose: number;
        addressFormat: string;
        isUnsplit: boolean;
        tag: string;
    };
    sep5: {
        overridesDerivation: string;
    };
    unsplit: {
        isUnsplit: boolean;
        tag: string;
    };
    polkadotbip44: {
        overridesDerivation: string;
    };
    gliflegacy: {
        overridesDerivation: string;
        tag: string;
    };
    glif: {
        overridesDerivation: string;
        startsAt: number;
        tag: string;
    };
    solanaMain: {
        isNonIterable: boolean;
        overridesDerivation: string;
    };
    solanaSub: {
        overridesDerivation: string;
    };
    hederaBip44: {
        overridesDerivation: string;
    };
    cardano: {
        purpose: number;
        overridesDerivation: string;
    };
}>;
export declare const asDerivationMode: (derivationMode: string) => DerivationMode;
export declare const getAllDerivationModes: () => DerivationMode[];
export declare const getMandatoryEmptyAccountSkip: (derivationMode: DerivationMode) => number;
export declare const isInvalidDerivationMode: (derivationMode: DerivationMode) => boolean;
export declare const isSegwitDerivationMode: (derivationMode: DerivationMode) => boolean;
export declare const isNativeSegwitDerivationMode: (derivationMode: DerivationMode) => boolean;
export declare const isTaprootDerivationMode: (derivationMode: DerivationMode) => boolean;
export declare const isUnsplitDerivationMode: (derivationMode: DerivationMode) => boolean;
export declare const isIterableDerivationMode: (derivationMode: DerivationMode) => boolean;
export declare const getDerivationModeStartsAt: (derivationMode: DerivationMode) => number;
export declare const getPurposeDerivationMode: (derivationMode: DerivationMode) => number;
export declare const getTagDerivationMode: (currency: CryptoCurrency, derivationMode: DerivationMode) => string | null | undefined;
export declare const getAddressFormatDerivationMode: (derivationMode: DerivationMode) => string;
export declare const derivationModeSupportsIndex: (derivationMode: DerivationMode, index: number) => boolean;
/**
 * return a ledger-lib-core compatible DerivationScheme format
 * for a given currency and derivationMode (you can pass an Account because same shape)
 */
export declare const getDerivationScheme: ({ derivationMode, currency, }: {
    derivationMode: DerivationMode;
    currency: CryptoCurrency;
}) => string;
export declare const runDerivationScheme: (derivationScheme: string, { coinType, }: {
    coinType: number;
}, opts?: {
    account?: number | string;
    node?: number | string;
    address?: number | string;
}) => string;
export declare const runAccountDerivationScheme: (scheme: string, currency: {
    coinType: number;
}, opts?: {
    account?: number | string;
}) => string;
export declare const getSeedIdentifierDerivation: (currency: CryptoCurrency, derivationMode: DerivationMode) => string;
export declare const getDerivationModesForCurrency: (currency: CryptoCurrency) => DerivationMode[];
export declare const getPreferredNewAccountScheme: (currency: CryptoCurrency) => DerivationMode[] | null | undefined;
export declare const getDefaultPreferredNewAccountScheme: (currency: CryptoCurrency) => DerivationMode | null | undefined;
export declare type StepAddressInput = {
    index: number;
    parentDerivation: Result;
    accountDerivation: Result;
    derivationMode: DerivationMode;
    shouldSkipEmpty: boolean;
    seedIdentifier: string;
};
export declare type WalletDerivationInput<R> = {
    currency: CryptoCurrency;
    derivationMode: DerivationMode;
    derivateAddress: (arg0: GetAddressOptions) => Observable<Result>;
    stepAddress: (arg0: StepAddressInput) => Observable<{
        result?: R;
        complete?: boolean;
    }>;
    shouldDerivesOnAccount?: boolean;
};
export declare function walletDerivation<R>({ currency, derivationMode, derivateAddress, stepAddress, shouldDerivesOnAccount, }: WalletDerivationInput<R>): Observable<R>;
export {};
//# sourceMappingURL=derivation.d.ts.map