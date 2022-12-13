"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var getOnboardingStatePolling_1 = require("./getOnboardingStatePolling");
var rxjs_1 = require("rxjs");
var rxjsOperators = __importStar(require("rxjs/operators"));
var devices_1 = require("@ledgerhq/devices");
var hw_transport_1 = __importDefault(require("@ledgerhq/hw-transport"));
var errors_1 = require("@ledgerhq/errors");
var deviceAccess_1 = require("./deviceAccess");
var getVersion_1 = __importDefault(require("./getVersion"));
var extractOnboardingState_1 = require("./extractOnboardingState");
var types_live_1 = require("@ledgerhq/types-live");
jest.mock("./deviceAccess");
jest.mock("./getVersion");
jest.mock("./extractOnboardingState");
jest.mock("@ledgerhq/hw-transport");
jest.useFakeTimers();
var aDevice = {
    deviceId: "DEVICE_ID_A",
    deviceName: "DEVICE_NAME_A",
    modelId: devices_1.DeviceModelId.nanoFTS,
    wired: false
};
// As extractOnboardingState is mocked, the firmwareInfo
// returned by getVersion does not matter
var aFirmwareInfo = {
    isBootloader: false,
    rawVersion: "",
    targetId: 0,
    mcuVersion: "",
    flags: Buffer.from([])
};
var pollingPeriodMs = 1000;
var mockedGetVersion = jest.mocked(getVersion_1["default"]);
var mockedWithDevice = jest.mocked(deviceAccess_1.withDevice);
mockedWithDevice.mockReturnValue(function (job) { return (0, rxjs_1.from)(job(new hw_transport_1["default"]())); });
var mockedExtractOnboardingState = jest.mocked(extractOnboardingState_1.extractOnboardingState);
describe("getOnboardingStatePolling", function () {
    var anOnboardingState;
    var onboardingStatePollingSubscription;
    beforeEach(function () {
        anOnboardingState = {
            isOnboarded: false,
            isInRecoveryMode: false,
            seedPhraseType: types_live_1.SeedPhraseType.TwentyFour,
            currentSeedWordIndex: 0,
            currentOnboardingStep: extractOnboardingState_1.OnboardingStep.NewDevice
        };
    });
    afterEach(function () {
        mockedGetVersion.mockClear();
        mockedExtractOnboardingState.mockClear();
        jest.clearAllTimers();
        onboardingStatePollingSubscription === null || onboardingStatePollingSubscription === void 0 ? void 0 : onboardingStatePollingSubscription.unsubscribe();
    });
    describe("When a communication error occurs while fetching the device state", function () {
        describe("and when the error is allowed and thrown before the defined timeout", function () {
            it("should update the onboarding state to null and keep track of the allowed error", function (done) {
                mockedGetVersion.mockRejectedValue(new errors_1.DisconnectedDevice("An allowed error"));
                mockedExtractOnboardingState.mockReturnValue(anOnboardingState);
                var device = aDevice;
                (0, getOnboardingStatePolling_1.getOnboardingStatePolling)({
                    deviceId: device.deviceId,
                    pollingPeriodMs: pollingPeriodMs
                }).subscribe({
                    next: function (value) {
                        expect(value.onboardingState).toBeNull();
                        expect(value.allowedError).toBeInstanceOf(errors_1.DisconnectedDevice);
                        done();
                    }
                });
                // The timeout is equal to pollingPeriodMs by default
                jest.advanceTimersByTime(pollingPeriodMs - 1);
            });
        });
        describe("and when a timeout occurred before the error (or the fetch took too long)", function () {
            it("should update the allowed error value to notify the consumer - default value for the timeout", function (done) {
                mockedGetVersion.mockResolvedValue(aFirmwareInfo);
                mockedExtractOnboardingState.mockReturnValue(anOnboardingState);
                var device = aDevice;
                (0, getOnboardingStatePolling_1.getOnboardingStatePolling)({
                    deviceId: device.deviceId,
                    pollingPeriodMs: pollingPeriodMs
                }).subscribe({
                    next: function (value) {
                        expect(value.onboardingState).toBeNull();
                        expect(value.allowedError).toBeInstanceOf(rxjs_1.TimeoutError);
                        done();
                    }
                });
                // Waits more than the timeout
                jest.advanceTimersByTime(pollingPeriodMs + 1);
            });
            it("should update the allowed error value to notify the consumer - timeout value set by the consumer", function (done) {
                var fetchingTimeoutMs = pollingPeriodMs + 500;
                mockedGetVersion.mockResolvedValue(aFirmwareInfo);
                mockedExtractOnboardingState.mockReturnValue(anOnboardingState);
                var device = aDevice;
                (0, getOnboardingStatePolling_1.getOnboardingStatePolling)({
                    deviceId: device.deviceId,
                    pollingPeriodMs: pollingPeriodMs,
                    fetchingTimeoutMs: fetchingTimeoutMs
                }).subscribe({
                    next: function (value) {
                        expect(value.onboardingState).toBeNull();
                        expect(value.allowedError).toBeInstanceOf(rxjs_1.TimeoutError);
                        done();
                    }
                });
                // Waits more than the timeout
                jest.advanceTimersByTime(fetchingTimeoutMs + 1);
            });
        });
        describe("and when the error is fatal and thrown before the defined timeout", function () {
            it("should notify the consumer that a unallowed error occurred", function (done) {
                mockedGetVersion.mockRejectedValue(new Error("Unknown error"));
                var device = aDevice;
                (0, getOnboardingStatePolling_1.getOnboardingStatePolling)({
                    deviceId: device.deviceId,
                    pollingPeriodMs: pollingPeriodMs
                }).subscribe({
                    error: function (error) {
                        expect(error).toBeInstanceOf(Error);
                        expect(error === null || error === void 0 ? void 0 : error.message).toBe("Unknown error");
                        done();
                    }
                });
                jest.advanceTimersByTime(pollingPeriodMs - 1);
            });
        });
    });
    describe("When the fetched device state is incorrect", function () {
        it("should return a null onboarding state, and keep track of the extract error", function (done) {
            mockedGetVersion.mockResolvedValue(aFirmwareInfo);
            mockedExtractOnboardingState.mockImplementation(function () {
                throw new errors_1.DeviceExtractOnboardingStateError("Some incorrect device info");
            });
            var device = aDevice;
            onboardingStatePollingSubscription = (0, getOnboardingStatePolling_1.getOnboardingStatePolling)({
                deviceId: device.deviceId,
                pollingPeriodMs: pollingPeriodMs
            }).subscribe({
                next: function (value) {
                    expect(value.onboardingState).toBeNull();
                    expect(value.allowedError).toBeInstanceOf(errors_1.DeviceExtractOnboardingStateError);
                    done();
                }
            });
            jest.advanceTimersByTime(pollingPeriodMs - 1);
        });
    });
    describe("When polling returns a correct device state", function () {
        it("should return a correct onboarding state", function (done) {
            mockedGetVersion.mockResolvedValue(aFirmwareInfo);
            mockedExtractOnboardingState.mockReturnValue(anOnboardingState);
            var device = aDevice;
            onboardingStatePollingSubscription = (0, getOnboardingStatePolling_1.getOnboardingStatePolling)({
                deviceId: device.deviceId,
                pollingPeriodMs: pollingPeriodMs
            }).subscribe({
                next: function (value) {
                    expect(value.allowedError).toBeNull();
                    expect(value.onboardingState).toEqual(anOnboardingState);
                    done();
                },
                error: function (error) {
                    done(error);
                }
            });
            jest.advanceTimersByTime(pollingPeriodMs - 1);
        });
        it("should poll a new onboarding state after the defined period of time", function (done) {
            mockedGetVersion.mockResolvedValue(aFirmwareInfo);
            mockedExtractOnboardingState.mockReturnValue(anOnboardingState);
            var device = aDevice;
            // Did not manage to test that the polling is repeated by using jest's fake timer
            // and advanceTimersByTime method or equivalent.
            // Hacky test: spy on the repeat operator to see if it has been called.
            var spiedRepeat = jest.spyOn(rxjsOperators, "repeat");
            onboardingStatePollingSubscription = (0, getOnboardingStatePolling_1.getOnboardingStatePolling)({
                deviceId: device.deviceId,
                pollingPeriodMs: pollingPeriodMs
            }).subscribe({
                next: function (value) {
                    expect(value.onboardingState).toEqual(anOnboardingState);
                    expect(value.allowedError).toBeNull();
                    expect(spiedRepeat).toHaveBeenCalledTimes(1);
                    done();
                },
                error: function (error) {
                    done(error);
                }
            });
            jest.runOnlyPendingTimers();
        });
    });
});
//# sourceMappingURL=getOnboardingStatePolling.test.js.map