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
var getLatestAvailableFirmwareFromDeviceId_1 = require("../getLatestAvailableFirmwareFromDeviceId");
var useGetLatestAvailableFirmware_1 = require("./useGetLatestAvailableFirmware");
jest.mock("../getLatestAvailableFirmwareFromDeviceId");
jest.useFakeTimers();
var mockedGetLatestAvailableFirmwareFromDeviceId = jest.mocked(getLatestAvailableFirmwareFromDeviceId_1.getLatestAvailableFirmwareFromDeviceId);
var aLatestFirmwareContext = {
    osu: {
        next_se_firmware_final_version: 1,
        previous_se_firmware_final_version: [],
        id: 0,
        name: "OSU",
        description: null,
        display_name: null,
        notes: null,
        perso: "",
        firmware: "",
        firmware_key: "",
        hash: "",
        date_creation: "",
        date_last_modified: "",
        device_versions: [],
        providers: []
    },
    final: {
        id: 1,
        name: "FINAL",
        description: null,
        display_name: null,
        notes: null,
        perso: "",
        firmware: "",
        firmware_key: "",
        hash: "",
        date_creation: "",
        date_last_modified: "",
        device_versions: [],
        providers: [],
        version: "",
        se_firmware: 1,
        osu_versions: [],
        mcu_versions: [],
        application_versions: []
    },
    shouldFlashMCU: false
};
// TODO: rename into useGetLatestAvailableFirmware ?
describe("useGetLatestAvailableFirmware", function () {
    afterEach(function () {
        mockedGetLatestAvailableFirmwareFromDeviceId.mockClear();
        jest.clearAllTimers();
    });
    describe("When no new firmware update is available for a device", function () {
        it("should notify the hook consumer that there is no latest available firmware", function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockedGetLatestAvailableFirmwareFromDeviceId.mockReturnValue((0, rxjs_1.of)({
                            firmwareUpdateContext: undefined
                        }));
                        result = (0, react_hooks_1.renderHook)(function () {
                            return (0, useGetLatestAvailableFirmware_1.useGetLatestAvailableFirmware)({
                                getLatestAvailableFirmwareFromDeviceId: mockedGetLatestAvailableFirmwareFromDeviceId,
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
                        expect(result.current.status).toEqual("no-available-firmware");
                        expect(result.current.error).toBeNull();
                        expect(result.current.latestFirmware).toBeNull();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("When a new firmware update is available for a device", function () {
        it("should notify the hook consumer that there is a new latest available firmware", function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockedGetLatestAvailableFirmwareFromDeviceId.mockReturnValue((0, rxjs_1.of)({
                            firmwareUpdateContext: aLatestFirmwareContext
                        }));
                        result = (0, react_hooks_1.renderHook)(function () {
                            return (0, useGetLatestAvailableFirmware_1.useGetLatestAvailableFirmware)({
                                getLatestAvailableFirmwareFromDeviceId: mockedGetLatestAvailableFirmwareFromDeviceId,
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
                        expect(result.current.status).toEqual("available-firmware");
                        expect(result.current.error).toBeNull();
                        expect(result.current.latestFirmware).toEqual(aLatestFirmwareContext);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=useGetLatestAvailableFirmware.test.js.map