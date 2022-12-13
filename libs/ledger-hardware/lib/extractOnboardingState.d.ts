/// <reference types="node" />
import { SeedPhraseType } from "@ledgerhq/types-live";
export declare const fromSeedPhraseTypeToNbOfSeedWords: Map<SeedPhraseType, number>;
export declare enum OnboardingStep {
    WelcomeScreen1 = "WELCOME_SCREEN_1",
    WelcomeScreen2 = "WELCOME_SCREEN_2",
    WelcomeScreen3 = "WELCOME_SCREEN_3",
    WelcomeScreen4 = "WELCOME_SCREEN_4",
    WelcomeScreenReminder = "WELCOME_SCREEN_REMINDER",
    SetupChoice = "SETUP_CHOICE",
    Pin = "PIN",
    NewDevice = "NEW_DEVICE",
    NewDeviceConfirming = "NEW_DEVICE_CONFIRMING",
    RestoreSeed = "RESTORE_SEED",
    SafetyWarning = "SAFETY WARNING",
    Ready = "READY",
    ChooseName = "CHOOSE_NAME"
}
export declare type OnboardingState = {
    isOnboarded: boolean;
    isInRecoveryMode: boolean;
    seedPhraseType: SeedPhraseType;
    currentOnboardingStep: OnboardingStep;
    currentSeedWordIndex: number;
};
/**
 * Extracts the onboarding state of the device
 * @param flagsBytes Buffer of bytes of length onboardingFlagsBytesLength reprensenting the device state flags
 * @returns An OnboardingState
 */
export declare const extractOnboardingState: (flagsBytes: Buffer) => OnboardingState;
//# sourceMappingURL=extractOnboardingState.d.ts.map