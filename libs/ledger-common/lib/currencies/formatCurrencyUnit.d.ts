import { BigNumber } from "bignumber.js";
import type { Unit } from "@ledgerhq/types-cryptoassets";
declare const defaultFormatOptions: {
    locale: string;
    showCode: boolean;
    alwaysShowSign: boolean;
    showAllDigits: boolean;
    disableRounding: boolean;
    useGrouping: boolean;
    subMagnitude: number;
    discreet: boolean;
    joinFragmentsSeparator: string;
};
declare type FormatFragment = {
    kind: "value";
    value: string;
} | {
    kind: "sign";
    value: string;
} | {
    kind: "code";
    value: string;
} | {
    kind: "separator";
    value: string;
};
export declare function formatCurrencyUnitFragment(unit: Unit, value: BigNumber, _options?: Partial<typeof defaultFormatOptions>): FormatFragment[];
export declare function formatCurrencyUnit(unit: Unit, value: BigNumber, options?: Partial<typeof defaultFormatOptions>): string;
export {};
//# sourceMappingURL=formatCurrencyUnit.d.ts.map