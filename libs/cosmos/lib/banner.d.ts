import type { CosmosAccount, CosmosValidatorItem } from "./types";
export interface AccountBannerState {
    display: boolean;
    redelegate: boolean;
    validatorSrcAddress: string;
    ledgerValidator: CosmosValidatorItem | undefined;
}
export declare function getAccountBannerState(account: CosmosAccount): AccountBannerState;
//# sourceMappingURL=banner.d.ts.map