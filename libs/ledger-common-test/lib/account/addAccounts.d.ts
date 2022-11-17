import type { Account, DerivationMode } from "@ledgerhq/types-live";
export declare type AddAccountSupportLink = {
    id: "segwit_or_native_segwit";
    url: string;
};
export declare type AddAccountsSection = {
    id: string;
    selectable: boolean;
    defaultSelected: boolean;
    data: Account[];
    supportLink?: AddAccountSupportLink;
};
export declare type AddAccountsSectionResult = {
    sections: AddAccountsSection[];
    alreadyEmptyAccount: Account | null | undefined;
};
/**
 * logic that for the Add Accounts sectioned list
 */
export declare function groupAddAccounts(existingAccounts: Account[], scannedAccounts: Account[], context: {
    scanning: boolean;
    preferredNewAccountSchemes?: DerivationMode[];
}): AddAccountsSectionResult;
export declare type AddAccountsProps = {
    existingAccounts: Account[];
    scannedAccounts: Account[];
    selectedIds: string[];
    renamings: Record<string, string>;
};
export declare function migrateAccounts({ scannedAccounts, existingAccounts, }: {
    scannedAccounts: Account[];
    existingAccounts: Account[];
}): Account[];
export declare function addAccounts({ scannedAccounts, existingAccounts, selectedIds, renamings, }: AddAccountsProps): Account[];
//# sourceMappingURL=addAccounts.d.ts.map