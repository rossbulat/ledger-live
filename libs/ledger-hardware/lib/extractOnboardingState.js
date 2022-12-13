"use strict";
exports.__esModule = true;
exports.extractOnboardingState = exports.OnboardingStep = exports.fromSeedPhraseTypeToNbOfSeedWords = void 0;
var errors_1 = require("@ledgerhq/errors");
var types_live_1 = require("@ledgerhq/types-live");
var onboardingFlagsBytesLength = 4;
var onboardedMask = 0x04;
var inRecoveryModeMask = 0x01;
var seedPhraseTypeMask = 0x60;
var seedPhraseTypeFlagOffset = 5;
var currentSeedWordIndexMask = 0x1f;
var fromBitsToSeedPhraseType = new Map([
    [0, types_live_1.SeedPhraseType.TwentyFour],
    [1, types_live_1.SeedPhraseType.Eighteen],
    [2, types_live_1.SeedPhraseType.Twelve],
]);
exports.fromSeedPhraseTypeToNbOfSeedWords = new Map([
    [types_live_1.SeedPhraseType.TwentyFour, 24],
    [types_live_1.SeedPhraseType.Eighteen, 18],
    [types_live_1.SeedPhraseType.Twelve, 12],
]);
var OnboardingStep;
(function (OnboardingStep) {
    OnboardingStep["WelcomeScreen1"] = "WELCOME_SCREEN_1";
    OnboardingStep["WelcomeScreen2"] = "WELCOME_SCREEN_2";
    OnboardingStep["WelcomeScreen3"] = "WELCOME_SCREEN_3";
    OnboardingStep["WelcomeScreen4"] = "WELCOME_SCREEN_4";
    OnboardingStep["WelcomeScreenReminder"] = "WELCOME_SCREEN_REMINDER";
    OnboardingStep["SetupChoice"] = "SETUP_CHOICE";
    OnboardingStep["Pin"] = "PIN";
    OnboardingStep["NewDevice"] = "NEW_DEVICE";
    OnboardingStep["NewDeviceConfirming"] = "NEW_DEVICE_CONFIRMING";
    OnboardingStep["RestoreSeed"] = "RESTORE_SEED";
    OnboardingStep["SafetyWarning"] = "SAFETY WARNING";
    OnboardingStep["Ready"] = "READY";
    OnboardingStep["ChooseName"] = "CHOOSE_NAME";
})(OnboardingStep = exports.OnboardingStep || (exports.OnboardingStep = {}));
var fromBitsToOnboardingStep = new Map([
    [0, OnboardingStep.WelcomeScreen1],
    [1, OnboardingStep.WelcomeScreen2],
    [2, OnboardingStep.WelcomeScreen3],
    [3, OnboardingStep.WelcomeScreen4],
    [4, OnboardingStep.WelcomeScreenReminder],
    [5, OnboardingStep.SetupChoice],
    [6, OnboardingStep.Pin],
    [7, OnboardingStep.NewDevice],
    [8, OnboardingStep.NewDeviceConfirming],
    [9, OnboardingStep.RestoreSeed],
    [10, OnboardingStep.SafetyWarning],
    [11, OnboardingStep.Ready],
    [12, OnboardingStep.ChooseName],
]);
/**
 * Extracts the onboarding state of the device
 * @param flagsBytes Buffer of bytes of length onboardingFlagsBytesLength reprensenting the device state flags
 * @returns An OnboardingState
 */
var extractOnboardingState = function (flagsBytes) {
    if (!flagsBytes || flagsBytes.length < onboardingFlagsBytesLength) {
        throw new errors_1.DeviceExtractOnboardingStateError("Incorrect onboarding flags bytes");
    }
    var isOnboarded = Boolean(flagsBytes[0] & onboardedMask);
    var isInRecoveryMode = Boolean(flagsBytes[0] & inRecoveryModeMask);
    var seedPhraseTypeBits = (flagsBytes[2] & seedPhraseTypeMask) >> seedPhraseTypeFlagOffset;
    var seedPhraseType = fromBitsToSeedPhraseType.get(seedPhraseTypeBits);
    if (!seedPhraseType) {
        throw new errors_1.DeviceExtractOnboardingStateError("Incorrect onboarding bits for the seed phrase type");
    }
    var currentOnboardingStepBits = flagsBytes[3];
    var currentOnboardingStep = fromBitsToOnboardingStep.get(currentOnboardingStepBits);
    if (!currentOnboardingStep) {
        throw new errors_1.DeviceExtractOnboardingStateError("Incorrect onboarding bits for the current onboarding step");
    }
    var currentSeedWordIndex = flagsBytes[2] & currentSeedWordIndexMask;
    return {
        isOnboarded: isOnboarded,
        isInRecoveryMode: isInRecoveryMode,
        seedPhraseType: seedPhraseType,
        currentOnboardingStep: currentOnboardingStep,
        currentSeedWordIndex: currentSeedWordIndex
    };
};
exports.extractOnboardingState = extractOnboardingState;
//# sourceMappingURL=extractOnboardingState.js.map