import { BigNumber } from "bignumber.js";
export declare type SupportedOptions = {
    minimumFractionDigits: number;
    maximumFractionDigits: number;
    useGrouping: boolean;
};
export declare const toLocaleString: (n: BigNumber, localeInput?: string, options?: Partial<SupportedOptions>) => string;
//# sourceMappingURL=BigNumberToLocaleString.d.ts.map