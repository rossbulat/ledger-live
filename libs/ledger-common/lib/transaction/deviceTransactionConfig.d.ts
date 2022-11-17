declare type tooltipArgs = Record<string, string>;
export declare type CommonDeviceTransactionField = {
    type: "amount";
    label: string;
} | {
    type: "address";
    label: string;
    address: string;
} | {
    type: "fees";
    label: string;
} | {
    type: "text";
    label: string;
    value: string;
    tooltipI18nKey?: string;
    tooltipI18nArgs?: tooltipArgs;
};
export {};
//# sourceMappingURL=deviceTransactionConfig.d.ts.map