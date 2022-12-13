"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var react_hooks_1 = require("@testing-library/react-hooks");
var rxjs_1 = require("rxjs");
var errors_1 = require("@ledgerhq/errors");
var useGenuineCheck_1 = require("./useGenuineCheck");
var getGenuineCheckFromDeviceId_1 = require("../getGenuineCheckFromDeviceId");
jest.mock("../getGenuineCheckFromDeviceId");
jest.useFakeTimers();
var mockedGetGenuineCheckFromDeviceId = jest.mocked(getGenuineCheckFromDeviceId_1.getGenuineCheckFromDeviceId);
describe("useGenuineCheck", function () {
    afterEach(function () {
        mockedGetGenuineCheckFromDeviceId.mockClear();
        jest.clearAllTimers();
    });
    describe("When the genuine check requests for a device permission", function () {
        it("should notify the hook consumer of the request", function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockedGetGenuineCheckFromDeviceId.mockReturnValue((0, rxjs_1.of)({
                            socketEvent: { type: "device-permission-requested", wording: "" },
                            deviceIsLocked: false
                        }));
                        result = (0, react_hooks_1.renderHook)(function () {
                            return (0, useGenuineCheck_1.useGenuineCheck)({
                                getGenuineCheckFromDeviceId: mockedGetGenuineCheckFromDeviceId,
                                deviceId: "A_DEVICE_ID"
                            });
                        }).result;
                        return [4 /*yield*/, (0, react_hooks_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    jest.advanceTimersByTime(1);
                                    return [2 /*return*/];
                                });
                            }); })];
                    case 1:
                        _a.sent();
                        expect(result.current.devicePermissionState).toEqual("requested");
                        expect(result.current.genuineState).toEqual("unchecked");
                        expect(result.current.error).toBeNull();
                        return [2 /*return*/];
                }
            });
        }); });
        it("should notify the hook consumer if the device permission is granted", function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockedGetGenuineCheckFromDeviceId.mockReturnValue((0, rxjs_1.of)({
                            socketEvent: { type: "device-permission-granted" },
                            deviceIsLocked: false
                        }));
                        result = (0, react_hooks_1.renderHook)(function () {
                            return (0, useGenuineCheck_1.useGenuineCheck)({
                                getGenuineCheckFromDeviceId: mockedGetGenuineCheckFromDeviceId,
                                deviceId: "A_DEVICE_ID"
                            });
                        }).result;
                        return [4 /*yield*/, (0, react_hooks_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    jest.advanceTimersByTime(1);
                                    return [2 /*return*/];
                                });
                            }); })];
                    case 1:
                        _a.sent();
                        expect(result.current.devicePermissionState).toEqual("granted");
                        expect(result.current.genuineState).toEqual("unchecked");
                        expect(result.current.error).toBeNull();
                        return [2 /*return*/];
                }
            });
        }); });
        it("should notify the hook consumer if the device permission is refused", function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockedGetGenuineCheckFromDeviceId.mockReturnValue((0, rxjs_1.throwError)(new errors_1.UserRefusedAllowManager()));
                        result = (0, react_hooks_1.renderHook)(function () {
                            return (0, useGenuineCheck_1.useGenuineCheck)({
                                getGenuineCheckFromDeviceId: mockedGetGenuineCheckFromDeviceId,
                                deviceId: "A_DEVICE_ID"
                            });
                        }).result;
                        return [4 /*yield*/, (0, react_hooks_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    jest.advanceTimersByTime(1);
                                    return [2 /*return*/];
                                });
                            }); })];
                    case 1:
                        _a.sent();
                        expect(result.current.devicePermissionState).toEqual("refused");
                        expect(result.current.genuineState).toEqual("unchecked");
                        expect(result.current.error).toBeNull();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("When an error occurred during the genuine check", function () {
        it("should notify the hook consumer that an error occurred", function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockedGetGenuineCheckFromDeviceId.mockReturnValue((0, rxjs_1.throwError)(new errors_1.DisconnectedDeviceDuringOperation()));
                        result = (0, react_hooks_1.renderHook)(function () {
                            return (0, useGenuineCheck_1.useGenuineCheck)({
                                getGenuineCheckFromDeviceId: mockedGetGenuineCheckFromDeviceId,
                                deviceId: "A_DEVICE_ID"
                            });
                        }).result;
                        return [4 /*yield*/, (0, react_hooks_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    jest.advanceTimersByTime(1);
                                    return [2 /*return*/];
                                });
                            }); })];
                    case 1:
                        _a.sent();
                        expect(result.current.genuineState).toEqual("unchecked");
                        expect(result.current.error).toBeInstanceOf(errors_1.DisconnectedDeviceDuringOperation);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("When the genuine check is completed", function () {
        describe("and it is a success", function () {
            it("should notify the hook consumer of the success", function () { return __awaiter(void 0, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            mockedGetGenuineCheckFromDeviceId.mockReturnValue((0, rxjs_1.of)({
                                socketEvent: { type: "result", payload: "0000" },
                                deviceIsLocked: false
                            }));
                            result = (0, react_hooks_1.renderHook)(function () {
                                return (0, useGenuineCheck_1.useGenuineCheck)({
                                    getGenuineCheckFromDeviceId: mockedGetGenuineCheckFromDeviceId,
                                    deviceId: "A_DEVICE_ID"
                                });
                            }).result;
                            return [4 /*yield*/, (0, react_hooks_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        jest.advanceTimersByTime(1);
                                        return [2 /*return*/];
                                    });
                                }); })];
                        case 1:
                            _a.sent();
                            expect(result.current.genuineState).toEqual("genuine");
                            expect(result.current.error).toBeNull();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe("and the device is not genuine", function () {
            it("should notify the hook consumer that the device is not genuine", function () { return __awaiter(void 0, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            mockedGetGenuineCheckFromDeviceId.mockReturnValue((0, rxjs_1.of)({
                                socketEvent: { type: "result", payload: "1111" },
                                deviceIsLocked: false
                            }));
                            result = (0, react_hooks_1.renderHook)(function () {
                                return (0, useGenuineCheck_1.useGenuineCheck)({
                                    getGenuineCheckFromDeviceId: mockedGetGenuineCheckFromDeviceId,
                                    deviceId: "A_DEVICE_ID"
                                });
                            }).result;
                            return [4 /*yield*/, (0, react_hooks_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        jest.advanceTimersByTime(1);
                                        return [2 /*return*/];
                                    });
                                }); })];
                        case 1:
                            _a.sent();
                            expect(result.current.genuineState).toEqual("non-genuine");
                            expect(result.current.error).toBeNull();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe("When the hook consumer requests to reset the genuine check state", function () {
        it("should reset the device permission and genuine states", function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // In the case of an unsuccessful genuine check
                        mockedGetGenuineCheckFromDeviceId.mockReturnValue((0, rxjs_1.of)({
                            socketEvent: { type: "device-permission-granted" },
                            deviceIsLocked: false
                        }, {
                            socketEvent: { type: "result", payload: "1111" },
                            deviceIsLocked: false
                        }));
                        result = (0, react_hooks_1.renderHook)(function () {
                            return (0, useGenuineCheck_1.useGenuineCheck)({
                                getGenuineCheckFromDeviceId: mockedGetGenuineCheckFromDeviceId,
                                isHookEnabled: true,
                                deviceId: "A_DEVICE_ID"
                            });
                        }).result;
                        return [4 /*yield*/, (0, react_hooks_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    jest.advanceTimersByTime(1);
                                    return [2 /*return*/];
                                });
                            }); })];
                    case 1:
                        _a.sent();
                        expect(result.current.devicePermissionState).toEqual("granted");
                        expect(result.current.genuineState).toEqual("non-genuine");
                        expect(result.current.error).toBeNull();
                        // We ask to reset the genuine check state
                        return [4 /*yield*/, (0, react_hooks_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    result.current.resetGenuineCheckState();
                                    return [2 /*return*/];
                                });
                            }); })];
                    case 2:
                        // We ask to reset the genuine check state
                        _a.sent();
                        expect(result.current.devicePermissionState).toEqual("unrequested");
                        expect(result.current.genuineState).toEqual("unchecked");
                        expect(result.current.error).toBeNull();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("When the device is locked before doing a genuine check, and it timed out", function () {
        it("should notify the hook consumer of the need to unlock the device", function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockedGetGenuineCheckFromDeviceId.mockReturnValue((0, rxjs_1.of)({
                            socketEvent: null,
                            deviceIsLocked: true
                        }));
                        result = (0, react_hooks_1.renderHook)(function () {
                            return (0, useGenuineCheck_1.useGenuineCheck)({
                                getGenuineCheckFromDeviceId: mockedGetGenuineCheckFromDeviceId,
                                deviceId: "A_DEVICE_ID"
                            });
                        }).result;
                        return [4 /*yield*/, (0, react_hooks_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    jest.advanceTimersByTime(1);
                                    return [2 /*return*/];
                                });
                            }); })];
                    case 1:
                        _a.sent();
                        expect(result.current.devicePermissionState).toEqual("unlock-needed");
                        expect(result.current.genuineState).toEqual("unchecked");
                        expect(result.current.error).toBeNull();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=useGenuineCheck.test.js.map