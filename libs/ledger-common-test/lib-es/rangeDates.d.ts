import type { PortfolioRangeConfig, PortfolioRange } from "@ledgerhq/types-live";
export declare const hourIncrement: number;
export declare const dayIncrement: number;
export declare const weekIncrement: number;
export declare function startOfHour(t: Date): Date;
export declare function startOfMonth(t: Date): Date;
export declare function startOfDay(t: Date): Date;
export declare function startOfWeek(t: Date): Date;
export declare function getPortfolioRangeConfig(r: PortfolioRange): PortfolioRangeConfig;
export declare const granularities: {
    WEEK: {
        increment: number;
        startOf: typeof startOfWeek;
        maxDatapoints: number;
    };
    DAY: {
        increment: number;
        startOf: typeof startOfDay;
        maxDatapoints: number;
    };
    HOUR: {
        increment: number;
        startOf: typeof startOfHour;
        maxDatapoints: number;
    };
};
export declare function getDates(r: PortfolioRange, count: number): Date[];
export declare function getRanges(): string[];
//# sourceMappingURL=rangeDates.d.ts.map