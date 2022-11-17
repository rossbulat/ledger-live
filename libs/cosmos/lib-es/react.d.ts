import type { CosmosMappedDelegation, CosmosValidatorItem, CosmosMappedValidator, CosmosDelegationInfo, CosmosOperationMode, CosmosSearchFilter, Transaction, CosmosExtraTxInfo, CosmosPreloadData, CosmosAccount } from "./types";
export declare function useCosmosFamilyPreloadData(currencyName: string): CosmosPreloadData;
export declare function useCosmosFamilyMappedDelegations(account: CosmosAccount, mode?: CosmosOperationMode): CosmosMappedDelegation[];
export declare function useCosmosFamilyDelegationsQuerySelector(account: CosmosAccount, transaction: Transaction, delegationSearchFilter?: CosmosSearchFilter): {
    query: string;
    setQuery: (query: string) => void;
    options: CosmosMappedDelegation[];
    value: CosmosMappedDelegation | null | undefined;
};
/** Hook to search and sort SR list according to initial votes and query */
export declare function useSortedValidators(search: string, validators: CosmosValidatorItem[], delegations: CosmosDelegationInfo[], validatorSearchFilter?: CosmosSearchFilter): CosmosMappedValidator[];
export declare function useMappedExtraOperationDetails({ account, extra, }: {
    account: CosmosAccount;
    extra: CosmosExtraTxInfo;
}): CosmosExtraTxInfo;
export declare function useLedgerFirstShuffledValidatorsCosmosFamily(currencyName: string, searchInput?: string): CosmosValidatorItem[];
//# sourceMappingURL=react.d.ts.map