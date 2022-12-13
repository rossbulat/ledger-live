"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var hw_transport_1 = __importStar(require("@ledgerhq/hw-transport"));
var errors_1 = require("@ledgerhq/errors");
var getDeviceInfo_1 = __importDefault(require("./getDeviceInfo"));
var getDeviceRunningMode_1 = require("./getDeviceRunningMode");
var aDeviceInfo_1 = require("../mock/fixtures/aDeviceInfo");
jest.useFakeTimers();
// Only mocks withDevice
jest.mock("./deviceAccess", function () {
    var originalModule = jest.requireActual("./deviceAccess");
    return __assign(__assign({}, originalModule), { withDevice: jest.fn().mockReturnValue(function (job) {
            return (0, rxjs_1.from)(job(new hw_transport_1["default"]()));
        }) });
});
// Needs to mock the timer from rxjs used in retryWhileErrors
jest.mock("rxjs", function () {
    var originalModule = jest.requireActual("rxjs");
    return __assign(__assign({}, originalModule), { timer: jest.fn() });
});
var mockedTimer = jest.mocked(rxjs_1.timer);
jest.mock("./getDeviceInfo");
var mockedGetDeviceInfo = jest.mocked(getDeviceInfo_1["default"]);
var A_DEVICE_ID = "";
describe("getDeviceRunningMode", function () {
    beforeEach(function () {
        mockedTimer.mockReturnValue((0, rxjs_1.of)(1));
    });
    afterEach(function () {
        mockedTimer.mockClear();
        mockedGetDeviceInfo.mockClear();
    });
    describe("When the device is in bootloader mode", function () {
        it("pushes an event bootloaderMode", function (done) {
            var aDeviceInfo = (0, aDeviceInfo_1.aDeviceInfoBuilder)({ isBootloader: true });
            mockedGetDeviceInfo.mockResolvedValue(aDeviceInfo);
            (0, getDeviceRunningMode_1.getDeviceRunningMode)({ deviceId: A_DEVICE_ID }).subscribe({
                next: function (event) {
                    try {
                        expect(event.type).toBe("bootloaderMode");
                        done();
                    }
                    catch (expectError) {
                        done(expectError);
                    }
                },
                error: function (error) {
                    // It should not reach here
                    done(error);
                }
            });
            jest.advanceTimersByTime(1);
        });
        describe("but for now it is restarting and/or in a unknown state", function () {
            it("it should wait and retry until the device is in bootloader", function (done) {
                var aDeviceInfo = (0, aDeviceInfo_1.aDeviceInfoBuilder)({ isBootloader: true });
                var nbAcceptedErrors = 3;
                var count = 0;
                // Could not simply mockedRejectValueOnce several times followed by
                // a mockedResolveValueOnce. Needed to transform getDeviceInfo
                // into an Observable.
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                mockedGetDeviceInfo.mockImplementation(function () {
                    return new rxjs_1.Observable(function (o) {
                        if (count < nbAcceptedErrors) {
                            count++;
                            o.error(new errors_1.DisconnectedDevice());
                        }
                        else {
                            o.next(aDeviceInfo);
                        }
                    });
                });
                (0, getDeviceRunningMode_1.getDeviceRunningMode)({
                    deviceId: A_DEVICE_ID
                }).subscribe({
                    next: function (event) {
                        try {
                            expect(mockedTimer).toBeCalledTimes(nbAcceptedErrors);
                            expect(event.type).toBe("bootloaderMode");
                            done();
                        }
                        catch (expectError) {
                            done(expectError);
                        }
                    },
                    error: function (error) {
                        // It should not reach here
                        done(error);
                    }
                });
                // No need to handle the timer with a specific value as rxjs timer has been mocked
                // because we could not advance the timer every time the retryWhileErrors is called
                jest.advanceTimersByTime(1);
            });
        });
    });
    describe("When the device is NOT in bootloader mode and unlocked", function () {
        it("pushes an event mainMode", function (done) {
            var aDeviceInfo = (0, aDeviceInfo_1.aDeviceInfoBuilder)({ isBootloader: false });
            mockedGetDeviceInfo.mockResolvedValue(aDeviceInfo);
            (0, getDeviceRunningMode_1.getDeviceRunningMode)({ deviceId: A_DEVICE_ID }).subscribe({
                next: function (event) {
                    try {
                        expect(event.type).toBe("mainMode");
                        done();
                    }
                    catch (expectError) {
                        done(expectError);
                    }
                },
                error: function (error) {
                    // It should not reach here
                    done(error);
                }
            });
            jest.advanceTimersByTime(1);
        });
    });
    describe("When the device is locked (not in bootloader)", function () {
        describe("And is not responsive", function () {
            it("waits for a given time and pushes an event lockedDevice", function (done) {
                var unresponsiveTimeoutMs = 5000;
                // The deviceInfo will not be returned before the timeout
                // leading to an "unresponsive device"
                var aDeviceInfo = (0, aDeviceInfo_1.aDeviceInfoBuilder)({ isBootloader: false });
                mockedGetDeviceInfo.mockResolvedValue((0, rxjs_1.of)(aDeviceInfo)
                    .pipe((0, operators_1.delay)(unresponsiveTimeoutMs + 1000))
                    .toPromise());
                (0, getDeviceRunningMode_1.getDeviceRunningMode)({
                    deviceId: A_DEVICE_ID,
                    unresponsiveTimeoutMs: unresponsiveTimeoutMs
                }).subscribe({
                    next: function (event) {
                        try {
                            expect(event.type).toBe("lockedDevice");
                            done();
                        }
                        catch (expectError) {
                            done(expectError);
                        }
                    },
                    error: function (error) {
                        // It should not reach here
                        done(error);
                    }
                });
                jest.advanceTimersByTime(unresponsiveTimeoutMs + 1);
            });
        });
        describe("And the device responds with a LOCKED_DEVICE error", function () {
            it("pushes an event lockedDevice", function (done) {
                mockedGetDeviceInfo.mockRejectedValue(new hw_transport_1.TransportStatusError(hw_transport_1.StatusCodes.LOCKED_DEVICE));
                (0, getDeviceRunningMode_1.getDeviceRunningMode)({
                    deviceId: A_DEVICE_ID
                }).subscribe({
                    next: function (event) {
                        try {
                            expect(event.type).toBe("lockedDevice");
                            done();
                        }
                        catch (expectError) {
                            done(expectError);
                        }
                    },
                    error: function (error) {
                        // It should not reach here
                        done(error);
                    }
                });
                jest.advanceTimersByTime(1);
            });
        });
        describe("And the transport lib throws CantOpenDevice errors", function () {
            it("pushes an event disconnectedOrlockedDevice after a given number of retry", function (done) {
                var cantOpenDeviceRetryLimit = 3;
                mockedGetDeviceInfo.mockRejectedValue(new errors_1.CantOpenDevice());
                (0, getDeviceRunningMode_1.getDeviceRunningMode)({
                    deviceId: A_DEVICE_ID,
                    cantOpenDeviceRetryLimit: cantOpenDeviceRetryLimit
                }).subscribe({
                    next: function (event) {
                        try {
                            expect(mockedTimer).toBeCalledTimes(cantOpenDeviceRetryLimit);
                            expect(event.type).toBe("disconnectedOrlockedDevice");
                            done();
                        }
                        catch (expectError) {
                            done(expectError);
                        }
                    },
                    error: function (error) {
                        // It should not reach here
                        done(error);
                    }
                });
                // No need to handle the timer with a specific value as rxjs timer has been mocked
                // because we could not advance the timer every time the retryWhileErrors is called
                jest.advanceTimersByTime(1);
            });
        });
    });
});
//# sourceMappingURL=getDeviceRunningMode.test.js.map