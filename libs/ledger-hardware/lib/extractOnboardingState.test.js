"use strict";
exports.__esModule = true;
var extractOnboardingState_1 = require("./extractOnboardingState");
describe("@hw/extractOnboardingState", function () {
    describe("extractOnboardingState", function () {
        describe("When the flag bytes are incorrect", function () {
            it("should throw an error", function () {
                var incompleteFlagsBytes = Buffer.from([0, 0]);
                // DeviceExtractOnboardingStateError is not of type Error,
                // so cannot check in toThrow(DeviceExtractOnboardingStateError)
                expect(function () { return (0, extractOnboardingState_1.extractOnboardingState)(incompleteFlagsBytes); }).toThrow();
            });
        });
        describe("When the device is onboarded", function () {
            it("should return a device state that is onboarded", function () {
                var flagsBytes = Buffer.from([1 << 2, 0, 0, 0]);
                var onboardingState = (0, extractOnboardingState_1.extractOnboardingState)(flagsBytes);
                expect(onboardingState).not.toBeNull();
                expect(onboardingState === null || onboardingState === void 0 ? void 0 : onboardingState.isOnboarded).toBe(true);
            });
        });
        describe("When the device is in recovery mode", function () {
            it("should return a device state that is in recovery mode", function () {
                var flagsBytes = Buffer.from([1, 0, 0, 0]);
                var onboardingState = (0, extractOnboardingState_1.extractOnboardingState)(flagsBytes);
                expect(onboardingState).not.toBeNull();
                expect(onboardingState === null || onboardingState === void 0 ? void 0 : onboardingState.isInRecoveryMode).toBe(true);
            });
        });
        describe("When the device is not onboarded and in normal mode", function () {
            var flagsBytes;
            beforeEach(function () {
                flagsBytes = Buffer.from([0, 0, 0, 0]);
            });
            describe("and the user is on the welcome screen", function () {
                it("should return an onboarding step that is set at the welcome screen", function () {
                    flagsBytes[3] = 0;
                    var onboardingState = (0, extractOnboardingState_1.extractOnboardingState)(flagsBytes);
                    expect(onboardingState).not.toBeNull();
                    expect(onboardingState === null || onboardingState === void 0 ? void 0 : onboardingState.currentOnboardingStep).toBe(extractOnboardingState_1.OnboardingStep.WelcomeScreen1);
                    flagsBytes[3] = 1;
                    onboardingState = (0, extractOnboardingState_1.extractOnboardingState)(flagsBytes);
                    expect(onboardingState).not.toBeNull();
                    expect(onboardingState === null || onboardingState === void 0 ? void 0 : onboardingState.currentOnboardingStep).toBe(extractOnboardingState_1.OnboardingStep.WelcomeScreen2);
                    flagsBytes[3] = 2;
                    onboardingState = (0, extractOnboardingState_1.extractOnboardingState)(flagsBytes);
                    expect(onboardingState).not.toBeNull();
                    expect(onboardingState === null || onboardingState === void 0 ? void 0 : onboardingState.currentOnboardingStep).toBe(extractOnboardingState_1.OnboardingStep.WelcomeScreen3);
                    flagsBytes[3] = 3;
                    onboardingState = (0, extractOnboardingState_1.extractOnboardingState)(flagsBytes);
                    expect(onboardingState).not.toBeNull();
                    expect(onboardingState === null || onboardingState === void 0 ? void 0 : onboardingState.currentOnboardingStep).toBe(extractOnboardingState_1.OnboardingStep.WelcomeScreen4);
                });
            });
            describe("and the user is choosing what kind of setup they want", function () {
                beforeEach(function () {
                    flagsBytes[3] = 5;
                });
                it("should return an onboarding step that is set at the setup choice", function () {
                    var onboardingState = (0, extractOnboardingState_1.extractOnboardingState)(flagsBytes);
                    expect(onboardingState).not.toBeNull();
                    expect(onboardingState === null || onboardingState === void 0 ? void 0 : onboardingState.currentOnboardingStep).toBe(extractOnboardingState_1.OnboardingStep.SetupChoice);
                });
            });
            describe("and the user is setting their pin", function () {
                beforeEach(function () {
                    flagsBytes[3] = 6;
                });
                it("should return an onboarding step that is set at setting the pin", function () {
                    var onboardingState = (0, extractOnboardingState_1.extractOnboardingState)(flagsBytes);
                    expect(onboardingState).not.toBeNull();
                    expect(onboardingState === null || onboardingState === void 0 ? void 0 : onboardingState.currentOnboardingStep).toBe(extractOnboardingState_1.OnboardingStep.Pin);
                });
            });
            describe("and the user is generating a new seed", function () {
                describe("and the seed phrase type is set to 24 words", function () {
                    beforeEach(function () {
                        // 24-words seed
                        flagsBytes[2] |= 0 << 5;
                    });
                    it("should return a device state with the correct seed phrase type", function () {
                        var onboardingState = (0, extractOnboardingState_1.extractOnboardingState)(flagsBytes);
                        expect(onboardingState).not.toBeNull();
                        expect(onboardingState === null || onboardingState === void 0 ? void 0 : onboardingState.seedPhraseType).toBe("24-words");
                    });
                    describe("and the user is writing the seed word i", function () {
                        beforeEach(function () {
                            flagsBytes[3] = 7;
                        });
                        it("should return an onboarding step that is set at writting the seed phrase", function () {
                            var onboardingState = (0, extractOnboardingState_1.extractOnboardingState)(flagsBytes);
                            expect(onboardingState).not.toBeNull();
                            expect(onboardingState === null || onboardingState === void 0 ? void 0 : onboardingState.currentOnboardingStep).toBe(extractOnboardingState_1.OnboardingStep.NewDevice);
                        });
                        it("should return a device state with the index of the current seed word being written", function () {
                            var byte3 = flagsBytes[2];
                            for (var wordIndex = 0; wordIndex < 24; wordIndex++) {
                                flagsBytes[2] = byte3 | wordIndex;
                                var onboardingState = (0, extractOnboardingState_1.extractOnboardingState)(flagsBytes);
                                expect(onboardingState).not.toBeNull();
                                expect(onboardingState === null || onboardingState === void 0 ? void 0 : onboardingState.currentSeedWordIndex).toBe(wordIndex);
                            }
                        });
                    });
                    describe("and the user is confirming the seed word i", function () {
                        beforeEach(function () {
                            flagsBytes[3] = 8;
                        });
                        it("should return an onboarding step that is set at confirming the seed phrase", function () {
                            var onboardingState = (0, extractOnboardingState_1.extractOnboardingState)(flagsBytes);
                            expect(onboardingState).not.toBeNull();
                            expect(onboardingState === null || onboardingState === void 0 ? void 0 : onboardingState.currentOnboardingStep).toBe(extractOnboardingState_1.OnboardingStep.NewDeviceConfirming);
                        });
                        it("should return a device state with the index of the current seed word being confirmed", function () {
                            var byte3 = flagsBytes[2];
                            for (var wordIndex = 0; wordIndex < 24; wordIndex++) {
                                flagsBytes[2] = byte3 | wordIndex;
                                var onboardingState = (0, extractOnboardingState_1.extractOnboardingState)(flagsBytes);
                                expect(onboardingState).not.toBeNull();
                                expect(onboardingState === null || onboardingState === void 0 ? void 0 : onboardingState.currentSeedWordIndex).toBe(wordIndex);
                            }
                        });
                    });
                });
            });
            describe("and the user is recovering a seed", function () {
                describe("and the seed phrase type is set to X words", function () {
                    it("should return a device state with the correct seed phrase type", function () {
                        var byte3 = flagsBytes[2];
                        // 24-words
                        flagsBytes[2] = byte3 | (0 << 5);
                        var onboardingState = (0, extractOnboardingState_1.extractOnboardingState)(flagsBytes);
                        expect(onboardingState).not.toBeNull();
                        expect(onboardingState === null || onboardingState === void 0 ? void 0 : onboardingState.seedPhraseType).toBe("24-words");
                        // 18-words
                        flagsBytes[2] = byte3 | (1 << 5);
                        onboardingState = (0, extractOnboardingState_1.extractOnboardingState)(flagsBytes);
                        expect(onboardingState).not.toBeNull();
                        expect(onboardingState === null || onboardingState === void 0 ? void 0 : onboardingState.seedPhraseType).toBe("18-words");
                        // 12-words
                        flagsBytes[2] = byte3 | (2 << 5);
                        onboardingState = (0, extractOnboardingState_1.extractOnboardingState)(flagsBytes);
                        expect(onboardingState).not.toBeNull();
                        expect(onboardingState === null || onboardingState === void 0 ? void 0 : onboardingState.seedPhraseType).toBe("12-words");
                    });
                    describe("and the user is confirming (seed recovery) the seed word i", function () {
                        beforeEach(function () {
                            // 24-words seed
                            flagsBytes[2] |= 0 << 5;
                            flagsBytes[3] = 9;
                        });
                        it("should return an onboarding step that is set at confirming the restored seed phrase", function () {
                            var onboardingState = (0, extractOnboardingState_1.extractOnboardingState)(flagsBytes);
                            expect(onboardingState).not.toBeNull();
                            expect(onboardingState === null || onboardingState === void 0 ? void 0 : onboardingState.currentOnboardingStep).toBe(extractOnboardingState_1.OnboardingStep.RestoreSeed);
                        });
                        it("should return a device state with the index of the current seed word being confirmed", function () {
                            var byte3 = flagsBytes[2];
                            for (var wordIndex = 0; wordIndex < 24; wordIndex++) {
                                flagsBytes[2] = byte3 | wordIndex;
                                var onboardingState = (0, extractOnboardingState_1.extractOnboardingState)(flagsBytes);
                                expect(onboardingState).not.toBeNull();
                                expect(onboardingState === null || onboardingState === void 0 ? void 0 : onboardingState.currentSeedWordIndex).toBe(wordIndex);
                            }
                        });
                    });
                });
            });
            describe("and the user is on the safety warning screen", function () {
                beforeEach(function () {
                    flagsBytes[3] = 10;
                });
                it("should return an onboarding step that is set at the safety warning screen", function () {
                    var onboardingState = (0, extractOnboardingState_1.extractOnboardingState)(flagsBytes);
                    expect(onboardingState).not.toBeNull();
                    expect(onboardingState === null || onboardingState === void 0 ? void 0 : onboardingState.currentOnboardingStep).toBe(extractOnboardingState_1.OnboardingStep.SafetyWarning);
                });
            });
            describe("and the user is on 'choose name' step", function () {
                beforeEach(function () {
                    flagsBytes[3] = 12;
                });
                it("should return an onboarding step that is set at ready", function () {
                    var onboardingState = (0, extractOnboardingState_1.extractOnboardingState)(flagsBytes);
                    expect(onboardingState).not.toBeNull();
                    expect(onboardingState === null || onboardingState === void 0 ? void 0 : onboardingState.currentOnboardingStep).toBe(extractOnboardingState_1.OnboardingStep.ChooseName);
                });
            });
            describe("and the user finished the onboarding process", function () {
                beforeEach(function () {
                    flagsBytes[3] = 11;
                });
                it("should return an onboarding step that is set at ready", function () {
                    var onboardingState = (0, extractOnboardingState_1.extractOnboardingState)(flagsBytes);
                    expect(onboardingState).not.toBeNull();
                    expect(onboardingState === null || onboardingState === void 0 ? void 0 : onboardingState.currentOnboardingStep).toBe(extractOnboardingState_1.OnboardingStep.Ready);
                });
            });
        });
    });
});
//# sourceMappingURL=extractOnboardingState.test.js.map