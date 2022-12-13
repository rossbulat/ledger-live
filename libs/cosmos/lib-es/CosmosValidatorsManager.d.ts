import { EnvName, EnvValue } from "@ledgerhq/ledger-common/lib/env";
import type { CosmosValidatorItem, CosmosRewardsState } from "./types";
import type { CryptoCurrency } from "@ledgerhq/types-cryptoassets";
export declare class CosmosValidatorsManager {
    protected _namespace: string;
    protected _version: string;
    protected _currency: CryptoCurrency;
    protected _minDenom: string;
    protected _endPoint: EnvValue<EnvName> | undefined;
    protected _rewardsState: any | undefined;
    constructor(currency: CryptoCurrency, options?: {
        namespace?: string;
        endPoint?: EnvValue<EnvName>;
        rewardsState?: any;
    });
    private cacheValidators;
    getValidators: () => Promise<CosmosValidatorItem[]>;
    private getRewardsState;
    private getStargateRewardsState;
    private computeAvgYearlyInflation;
    validatorVotingPower: (validatorTokens: string, rewardsState: CosmosRewardsState) => number;
    _osmoValidatorEstimatedRate: (_: number, __: CosmosRewardsState) => number;
    validatorEstimatedRate: (validatorCommission: number, rewardsState: CosmosRewardsState) => number;
    hydrateValidators: (validators: CosmosValidatorItem[]) => void;
}
//# sourceMappingURL=CosmosValidatorsManager.d.ts.map