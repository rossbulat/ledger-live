import type { CryptoCurrency } from "@ledgerhq/types-cryptoassets";
import Transport from "@ledgerhq/hw-transport";
import type { DerivationMode } from "../../derivation";
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
export declare type Resolver = (arg0: Transport, arg1: GetAddressOptions) => Promise<Result>;
//# sourceMappingURL=types.d.ts.map