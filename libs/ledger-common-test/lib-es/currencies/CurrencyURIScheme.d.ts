import { BigNumber } from "bignumber.js";
import { CryptoCurrency } from "@ledgerhq/types-cryptoassets";
declare type Data = {
    address: string;
    currency?: CryptoCurrency;
    amount?: BigNumber;
    userGasLimit?: BigNumber;
    gasPrice?: BigNumber;
};
export declare function encodeURIScheme(data: Data): string;
export declare function decodeURIScheme(str: string): Data;
export {};
//# sourceMappingURL=CurrencyURIScheme.d.ts.map