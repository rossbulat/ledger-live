"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.isAllowedOnboardingStatePollingError = exports.getOnboardingStatePolling = void 0;
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var getVersion_1 = __importDefault(require("./getVersion"));
var deviceAccess_1 = require("./deviceAccess");
var errors_1 = require("@ledgerhq/errors");
var extractOnboardingState_1 = require("./extractOnboardingState");
/**
 * Polls the device onboarding state at a given frequency
 * @param deviceId A device id
 * @param pollingPeriodMs The period in ms after which the device onboarding state is fetched again
 * @param fetchingTimeoutMs The time to wait while fetching for the device onboarding state before throwing an error, in ms
 * @returns An Observable that polls the device onboarding state
 */
var getOnboardingStatePolling = function (_a) {
    var deviceId = _a.deviceId, pollingPeriodMs = _a.pollingPeriodMs, _b = _a.fetchingTimeoutMs, fetchingTimeoutMs = _b === void 0 ? pollingPeriodMs : _b;
    var firstRun = true;
    var delayedOnceOnboardingStateObservable = new rxjs_1.Observable(function (subscriber) {
        var delayMs = firstRun ? 0 : pollingPeriodMs;
        firstRun = false;
        var getOnboardingStateOnce = function () {
            var firmwareInfoOrAllowedErrorObservable = (0, deviceAccess_1.withDevice)(deviceId)(function (t) {
                return (0, rxjs_1.from)((0, getVersion_1["default"])(t));
            }).pipe((0, operators_1.timeout)(fetchingTimeoutMs), // Throws a TimeoutError
            (0, operators_1.first)(), (0, operators_1.catchError)(function (error) {
                if ((0, exports.isAllowedOnboardingStatePollingError)(error)) {
                    // Pushes the error to the next step to be processed (no retry from the beginning)
                    return (0, rxjs_1.of)(error);
                }
                return (0, rxjs_1.throwError)(error);
            }));
            // If an error is catched previously, and this error is "allowed",
            // the value from the observable is not a FirmwareInfo but an Error
            var _a = __read((0, rxjs_1.partition)(firmwareInfoOrAllowedErrorObservable, 
            // TS cannot infer correctly the value given to RxJS partition
            function (value) { return Boolean(value === null || value === void 0 ? void 0 : value.flags); }), 2), firmwareInfoObservable = _a[0], allowedErrorObservable = _a[1];
            var onboardingStateFromFirmwareInfoObservable = firmwareInfoObservable.pipe((0, operators_1.map)(function (firmwareInfo) {
                var _a;
                var onboardingState = null;
                try {
                    onboardingState = (0, extractOnboardingState_1.extractOnboardingState)(firmwareInfo.flags);
                }
                catch (error) {
                    if (error instanceof errors_1.DeviceExtractOnboardingStateError) {
                        return {
                            onboardingState: null,
                            allowedError: error
                        };
                    }
                    else {
                        return {
                            onboardingState: null,
                            allowedError: new errors_1.DeviceOnboardingStatePollingError("SyncOnboarding: Unknown error while extracting the onboarding state ".concat((_a = error === null || error === void 0 ? void 0 : error.name) !== null && _a !== void 0 ? _a : error, " ").concat(error === null || error === void 0 ? void 0 : error.message))
                        };
                    }
                }
                return { onboardingState: onboardingState, allowedError: null };
            }));
            // Handles the case of an (allowed) Error value
            var onboardingStateFromAllowedErrorObservable = allowedErrorObservable.pipe((0, operators_1.map)(function (allowedError) {
                return {
                    onboardingState: null,
                    allowedError: allowedError
                };
            }));
            return (0, rxjs_1.merge)(onboardingStateFromFirmwareInfoObservable, onboardingStateFromAllowedErrorObservable);
        };
        // Delays the fetch of the onboarding state
        setTimeout(function () {
            getOnboardingStateOnce().subscribe({
                next: function (value) {
                    subscriber.next(value);
                },
                error: function (error) {
                    subscriber.error(error);
                },
                complete: function () { return subscriber.complete(); }
            });
        }, delayMs);
    });
    return delayedOnceOnboardingStateObservable.pipe((0, operators_1.repeat)());
};
exports.getOnboardingStatePolling = getOnboardingStatePolling;
var isAllowedOnboardingStatePollingError = function (error) {
    if (error &&
        // Timeout error is thrown by rxjs's timeout
        (error instanceof rxjs_1.TimeoutError ||
            error instanceof errors_1.DisconnectedDevice ||
            error instanceof errors_1.CantOpenDevice ||
            error instanceof errors_1.TransportRaceCondition ||
            error instanceof errors_1.TransportStatusError)) {
        return true;
    }
    return false;
};
exports.isAllowedOnboardingStatePollingError = isAllowedOnboardingStatePollingError;
//# sourceMappingURL=getOnboardingStatePolling.js.map