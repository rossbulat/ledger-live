import { Observable } from "rxjs";
import { OnboardingState } from "./extractOnboardingState";
export declare type OnboardingStatePollingResult = {
    onboardingState: OnboardingState | null;
    allowedError: Error | null;
};
export declare type GetOnboardingStatePollingResult = Observable<OnboardingStatePollingResult>;
export declare type GetOnboardingStatePollingArgs = {
    deviceId: string;
    pollingPeriodMs: number;
    fetchingTimeoutMs?: number;
};
/**
 * Polls the device onboarding state at a given frequency
 * @param deviceId A device id
 * @param pollingPeriodMs The period in ms after which the device onboarding state is fetched again
 * @param fetchingTimeoutMs The time to wait while fetching for the device onboarding state before throwing an error, in ms
 * @returns An Observable that polls the device onboarding state
 */
export declare const getOnboardingStatePolling: ({ deviceId, pollingPeriodMs, fetchingTimeoutMs, }: GetOnboardingStatePollingArgs) => GetOnboardingStatePollingResult;
export declare const isAllowedOnboardingStatePollingError: (error: unknown) => boolean;
//# sourceMappingURL=getOnboardingStatePolling.d.ts.map