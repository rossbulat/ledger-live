"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var errors_1 = require("@ledgerhq/errors");
var hw_1 = require("../apps/hw");
var deviceAccess_1 = require("./deviceAccess");
var getDeviceInfo_1 = __importDefault(require("./getDeviceInfo"));
var getAppAndVersion_1 = __importDefault(require("./getAppAndVersion"));
var isDashboardName_1 = require("./isDashboardName");
var errors_2 = require("../errors");
var attemptToQuitApp_1 = __importDefault(require("./attemptToQuitApp"));
var cmd = function (_a) {
    var devicePath = _a.devicePath, managerRequest = _a.managerRequest;
    return (0, deviceAccess_1.withDevice)(devicePath)(function (transport) {
        return new rxjs_1.Observable(function (o) {
            var timeoutSub = (0, rxjs_1.of)({
                type: "unresponsiveDevice"
            })
                .pipe((0, operators_1.delay)(1000))
                .subscribe(function (e) { return o.next(e); });
            var sub = (0, rxjs_1.from)((0, getDeviceInfo_1["default"])(transport))
                .pipe((0, operators_1.concatMap)(function (deviceInfo) {
                timeoutSub.unsubscribe();
                if (!deviceInfo.onboarded && !deviceInfo.isRecoveryMode) {
                    throw new errors_2.DeviceNotOnboarded();
                }
                if (deviceInfo.isBootloader) {
                    return (0, rxjs_1.of)({
                        type: "bootloader",
                        deviceInfo: deviceInfo
                    });
                }
                if (deviceInfo.isOSU) {
                    return (0, rxjs_1.of)({
                        type: "osu",
                        deviceInfo: deviceInfo
                    });
                }
                return (0, rxjs_1.concat)((0, rxjs_1.of)({
                    type: "listingApps",
                    deviceInfo: deviceInfo
                }), (0, hw_1.listApps)(transport, deviceInfo));
            }), (0, operators_1.catchError)(function (e) {
                if (e &&
                    e instanceof errors_1.TransportStatusError &&
                    // @ts-expect-error typescript not checking agains the instanceof
                    e.statusCode === errors_1.StatusCodes.LOCKED_DEVICE) {
                    return (0, rxjs_1.of)({
                        type: "lockedDevice"
                    });
                }
                else if (e instanceof errors_1.DeviceOnDashboardExpected ||
                    (e &&
                        e instanceof errors_1.TransportStatusError &&
                        [
                            errors_1.StatusCodes.CLA_NOT_SUPPORTED,
                            errors_1.StatusCodes.INS_NOT_SUPPORTED,
                            0x6e01,
                            0x6d01,
                            0x6d02, // No StatusCodes definition
                        ].includes(
                        // @ts-expect-error typescript not checking agains the instanceof
                        e.statusCode))) {
                    return (0, rxjs_1.from)((0, getAppAndVersion_1["default"])(transport)).pipe((0, operators_1.concatMap)(function (appAndVersion) {
                        return !(managerRequest === null || managerRequest === void 0 ? void 0 : managerRequest.autoQuitAppDisabled) &&
                            !(0, isDashboardName_1.isDashboardName)(appAndVersion.name)
                            ? (0, attemptToQuitApp_1["default"])(transport, appAndVersion)
                            : (0, rxjs_1.of)({
                                type: "appDetected"
                            });
                    }));
                }
                return (0, rxjs_1.throwError)(e);
            }))
                .subscribe(o);
            return function () {
                timeoutSub.unsubscribe();
                sub.unsubscribe();
            };
        });
    });
};
exports["default"] = cmd;
//# sourceMappingURL=connectManager.js.map