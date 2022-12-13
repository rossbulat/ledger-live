import type { CryptoCurrency } from "@ledgerhq/types-cryptoassets";
import Transport from "@ledgerhq/hw-transport";
import type { DerivationMode } from "../../derivation";
import { TypedMessageData } from "../../families/ethereum/types";
export declare type Result = {
    rsv: {
        r: string;
        s: string;
        v: number;
    };
    signature: string;
};
export declare type MessageData = {
    currency: CryptoCurrency;
    path: string;
    verify?: boolean;
    derivationMode: DerivationMode;
    message: string;
    rawMessage: string;
};
export declare type SignMessage = (transport: Transport, message: MessageData | TypedMessageData) => Promise<Result>;
//# sourceMappingURL=types.d.ts.map