"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var hw_transport_1 = __importDefault(require("@ledgerhq/hw-transport"));
var deviceAccess_1 = require("./deviceAccess");
var getDeviceInfo_1 = __importDefault(require("./getDeviceInfo"));
var genuineCheck_1 = __importDefault(require("./genuineCheck"));
var getGenuineCheckFromDeviceId_1 = require("./getGenuineCheckFromDeviceId");
jest.mock("./deviceAccess");
jest.mock("./getDeviceInfo");
jest.mock("./genuineCheck");
jest.useFakeTimers();
var mockedGetDeviceInfo = jest.mocked(getDeviceInfo_1["default"]);
var mockedGenuineCheck = jest.mocked(genuineCheck_1["default"]);
var mockedWithDevice = jest.mocked(deviceAccess_1.withDevice);
mockedWithDevice.mockReturnValue(function (job) { return (0, rxjs_1.from)(job(new hw_transport_1["default"]())); });
var aDeviceInfo = {
    mcuVersion: "A_MCU_VERSION",
    version: "A_VERSION",
    majMin: "A_MAJ_MIN",
    targetId: "0.0",
    isBootloader: true,
    isOSU: true,
    providerName: undefined,
    managerAllowed: false,
    pinValidated: true
};
describe("getGenuineCheckFromDeviceId", function () {
    beforeEach(function () {
        mockedGetDeviceInfo.mockResolvedValue(aDeviceInfo);
    });
    afterEach(function () {
        mockedGetDeviceInfo.mockClear();
        mockedGenuineCheck.mockClear();
        jest.clearAllTimers();
    });
    describe("When the device is locked before doing a genuine check, and it timed out", function () {
        it("should notify the function consumer of the need to unlock the device, and once done, continue the genuine check flow", function (done) {
            // Delays the device info response
            mockedGetDeviceInfo.mockReturnValue((0, rxjs_1.of)(aDeviceInfo)
                .pipe((0, operators_1.delay)(1001))
                .toPromise());
            mockedGenuineCheck.mockReturnValue((0, rxjs_1.of)({
                type: "device-permission-requested",
                wording: ""
            }));
            var step = 0;
            (0, getGenuineCheckFromDeviceId_1.getGenuineCheckFromDeviceId)({
                deviceId: "A_DEVICE_ID",
                lockedDeviceTimeoutMs: 1000
            }).subscribe({
                next: function (_a) {
                    var socketEvent = _a.socketEvent, deviceIsLocked = _a.deviceIsLocked;
                    switch (step) {
                        case 0:
                            expect(socketEvent).toBeNull();
                            expect(deviceIsLocked).toBe(true);
                            break;
                        case 1:
                            expect(socketEvent).toBeNull();
                            expect(deviceIsLocked).toBe(false);
                            break;
                        case 2:
                            expect(socketEvent).toEqual({
                                type: "device-permission-requested",
                                wording: ""
                            });
                            expect(deviceIsLocked).toBe(false);
                            done();
                            break;
                    }
                    jest.advanceTimersByTime(1);
                    step += 1;
                }
            });
            jest.advanceTimersByTime(1000);
        });
    });
});
//# sourceMappingURL=getGenuineCheckFromDeviceId.test.js.map