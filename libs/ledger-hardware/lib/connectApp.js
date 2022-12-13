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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.openAppFromDashboard = void 0;
var semver_1 = __importDefault(require("semver"));
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var errors_1 = require("@ledgerhq/errors");
var currencies_1 = require("../currencies");
var appSupportsQuitApp_1 = __importDefault(require("../appSupportsQuitApp"));
var deviceAccess_1 = require("./deviceAccess");
var hw_1 = require("../apps/hw");
var isDashboardName_1 = require("./isDashboardName");
var getAppAndVersion_1 = __importDefault(require("./getAppAndVersion"));
var getDeviceInfo_1 = __importDefault(require("./getDeviceInfo"));
var getAddress_1 = __importDefault(require("./getAddress"));
var openApp_1 = __importDefault(require("./openApp"));
var quitApp_1 = __importDefault(require("./quitApp"));
var errors_2 = require("../errors");
var apps_1 = require("../apps");
var isUpdateAvailable_1 = __importDefault(require("./isUpdateAvailable"));
var manager_1 = __importDefault(require("../manager"));
var openAppFromDashboard = function (transport, appName) {
    return (0, rxjs_1.from)((0, getDeviceInfo_1["default"])(transport)).pipe((0, operators_1.mergeMap)(function (deviceInfo) {
        return (0, rxjs_1.merge)(
        // Nb Allows LLD/LLM to update lastSeenDevice, this can run in parallel
        // since there are no more device exchanges.
        (0, rxjs_1.from)(manager_1["default"].getLatestFirmwareForDevice(deviceInfo)).pipe((0, operators_1.concatMap)(function (latestFirmware) {
            return (0, rxjs_1.of)({
                type: "device-update-last-seen",
                deviceInfo: deviceInfo,
                latestFirmware: latestFirmware
            });
        })), (0, rxjs_1.concat)((0, rxjs_1.of)({
            type: "ask-open-app",
            appName: appName
        }), (0, rxjs_1.defer)(function () { return (0, rxjs_1.from)((0, openApp_1["default"])(transport, appName)); }).pipe((0, operators_1.concatMap)(function () {
            return (0, rxjs_1.of)({
                type: "device-permission-granted"
            });
        }), (0, operators_1.catchError)(function (e) {
            if (e && e instanceof errors_1.TransportStatusError) {
                // @ts-expect-error TransportStatusError to be typed on ledgerjs
                switch (e.statusCode) {
                    case 0x6984: // No StatusCodes definition
                    case 0x6807: // No StatusCodes definition
                        return (0, hw_1.streamAppInstall)({
                            transport: transport,
                            appNames: [appName],
                            onSuccessObs: function () {
                                return (0, rxjs_1.from)((0, exports.openAppFromDashboard)(transport, appName));
                            }
                        });
                    case errors_1.StatusCodes.CONDITIONS_OF_USE_NOT_SATISFIED:
                    case 0x5501: // No StatusCodes definition
                        return (0, rxjs_1.throwError)(new errors_1.UserRefusedOnDevice());
                    // openAppFromDashboard is exported, so LOCKED_DEVICE should be handled too
                    case errors_1.StatusCodes.LOCKED_DEVICE:
                        return (0, rxjs_1.of)({
                            type: "lockedDevice"
                        });
                }
            }
            return (0, rxjs_1.throwError)(e);
        }))));
    }));
};
exports.openAppFromDashboard = openAppFromDashboard;
var attemptToQuitApp = function (transport, appAndVersion) {
    return appAndVersion && (0, appSupportsQuitApp_1["default"])(appAndVersion)
        ? (0, rxjs_1.from)((0, quitApp_1["default"])(transport)).pipe((0, operators_1.concatMap)(function () {
            return (0, rxjs_1.of)({
                type: "disconnected",
                expected: true
            });
        }), (0, operators_1.catchError)(function (e) { return (0, rxjs_1.throwError)(e); }))
        : (0, rxjs_1.of)({
            type: "ask-quit-app"
        });
};
var derivationLogic = function (transport, _a) {
    var _b = _a.requiresDerivation, currencyId = _b.currencyId, derivationRest = __rest(_b, ["currencyId"]), appAndVersion = _a.appAndVersion, appName = _a.appName;
    return (0, rxjs_1.defer)(function () {
        return (0, rxjs_1.from)((0, getAddress_1["default"])(transport, __assign({ currency: (0, currencies_1.getCryptoCurrencyById)(currencyId) }, derivationRest)));
    }).pipe((0, operators_1.map)(function (_a) {
        var address = _a.address;
        return ({
            type: "opened",
            app: appAndVersion,
            derivation: {
                address: address
            }
        });
    }), (0, operators_1.catchError)(function (e) {
        if (!e)
            return (0, rxjs_1.throwError)(e);
        if (e instanceof errors_1.BtcUnmatchedApp) {
            return (0, rxjs_1.of)({
                type: "ask-open-app",
                appName: appName
            });
        }
        if (e instanceof errors_1.TransportStatusError) {
            // @ts-expect-error TransportStatusError to be typed on ledgerjs
            var statusCode = e.statusCode;
            if (statusCode === errors_1.StatusCodes.SECURITY_STATUS_NOT_SATISFIED ||
                statusCode === errors_1.StatusCodes.INCORRECT_LENGTH ||
                (0x6600 <= statusCode && statusCode <= 0x67ff)) {
                return (0, rxjs_1.of)({
                    type: "ask-open-app",
                    appName: appName
                });
            }
            switch (statusCode) {
                case 0x6f04: // FW-90. app was locked... | No StatusCodes definition
                case errors_1.StatusCodes.HALTED: // FW-90. app bricked, a reboot fixes it.
                case errors_1.StatusCodes.INS_NOT_SUPPORTED:
                    // this is likely because it's the wrong app (LNS 1.3.1)
                    return attemptToQuitApp(transport, appAndVersion);
                // derivationLogic is also called inside the catchError of cmd below
                // so it needs to handle LOCKED_DEVICE
                case errors_1.StatusCodes.LOCKED_DEVICE:
                    return (0, rxjs_1.of)({
                        type: "lockedDevice"
                    });
            }
        }
        return (0, rxjs_1.throwError)(e);
    }));
};
var cmd = function (_a) {
    var modelId = _a.modelId, devicePath = _a.devicePath, appName = _a.appName, requiresDerivation = _a.requiresDerivation, dependencies = _a.dependencies, requireLatestFirmware = _a.requireLatestFirmware, outdatedApp = _a.outdatedApp;
    return (0, deviceAccess_1.withDevice)(devicePath)(function (transport) {
        return new rxjs_1.Observable(function (o) {
            var timeoutSub = (0, rxjs_1.of)({
                type: "unresponsiveDevice"
            })
                .pipe((0, operators_1.delay)(1000))
                .subscribe(function (e) { return o.next(e); });
            var innerSub = function (_a) {
                var appName = _a.appName, dependencies = _a.dependencies, requireLatestFirmware = _a.requireLatestFirmware;
                return (0, rxjs_1.defer)(function () { return (0, rxjs_1.from)((0, getAppAndVersion_1["default"])(transport)); }).pipe((0, operators_1.concatMap)(function (appAndVersion) {
                    timeoutSub.unsubscribe();
                    if ((0, isDashboardName_1.isDashboardName)(appAndVersion.name)) {
                        // check if we meet minimum fw
                        if (requireLatestFirmware || outdatedApp) {
                            return (0, rxjs_1.from)((0, getDeviceInfo_1["default"])(transport)).pipe((0, operators_1.mergeMap)(function (deviceInfo) {
                                return (0, rxjs_1.from)(manager_1["default"].getLatestFirmwareForDevice(deviceInfo)).pipe((0, operators_1.mergeMap)(function (latest) {
                                    var isLatest = !latest ||
                                        semver_1["default"].eq(deviceInfo.version, latest.final.version);
                                    if ((!requireLatestFirmware ||
                                        (requireLatestFirmware && isLatest)) &&
                                        outdatedApp) {
                                        return (0, rxjs_1.from)((0, isUpdateAvailable_1["default"])(deviceInfo, outdatedApp)).pipe((0, operators_1.mergeMap)(function (isAvailable) {
                                            return isAvailable
                                                ? (0, rxjs_1.throwError)(new errors_1.UpdateYourApp(undefined, {
                                                    managerAppName: outdatedApp.name
                                                }))
                                                : (0, rxjs_1.throwError)(new errors_2.LatestFirmwareVersionRequired("LatestFirmwareVersionRequired", {
                                                    latest: latest === null || latest === void 0 ? void 0 : latest.final.version,
                                                    current: deviceInfo.version
                                                }));
                                        }));
                                    }
                                    if (isLatest) {
                                        o.next({ type: "latest-firmware-resolved" });
                                        return innerSub({ appName: appName, dependencies: dependencies }); // NB without the fw version check
                                    }
                                    else {
                                        return (0, rxjs_1.throwError)(new errors_2.LatestFirmwareVersionRequired("LatestFirmwareVersionRequired", {
                                            latest: latest.final.version,
                                            current: deviceInfo.version
                                        }));
                                    }
                                }));
                            }));
                        }
                        // check if we meet dependencies
                        if (dependencies === null || dependencies === void 0 ? void 0 : dependencies.length) {
                            var completesInDashboard = (0, isDashboardName_1.isDashboardName)(appName);
                            return (0, hw_1.streamAppInstall)({
                                transport: transport,
                                appNames: __spreadArray(__spreadArray([], __read((completesInDashboard ? [] : [appName])), false), __read(dependencies), false),
                                onSuccessObs: function () {
                                    o.next({
                                        type: "dependencies-resolved"
                                    });
                                    return innerSub({
                                        appName: appName
                                    }); // NB without deps
                                }
                            });
                        }
                        // maybe we want to be in the dashboard
                        if (appName === appAndVersion.name) {
                            var e = {
                                type: "opened",
                                app: appAndVersion
                            };
                            return (0, rxjs_1.of)(e);
                        }
                        // we're in dashboard
                        return (0, exports.openAppFromDashboard)(transport, appName);
                    }
                    var appNeedsUpgrade = (0, apps_1.mustUpgrade)(modelId, appAndVersion.name, appAndVersion.version);
                    if (appNeedsUpgrade) {
                        // We need to quit the app first, then we need to get the device information to see if an
                        // app update that fulfills the minimum is available on this provider for this device version.
                        o.next({
                            type: "has-outdated-app",
                            outdatedApp: appAndVersion
                        });
                    }
                    // in order to check the fw version, install deps, or check app update availability, we need dashboard
                    if ((dependencies === null || dependencies === void 0 ? void 0 : dependencies.length) ||
                        requireLatestFirmware ||
                        appAndVersion.name !== appName ||
                        appNeedsUpgrade) {
                        return attemptToQuitApp(transport, appAndVersion);
                    }
                    if (requiresDerivation) {
                        return derivationLogic(transport, {
                            requiresDerivation: requiresDerivation,
                            appAndVersion: appAndVersion,
                            appName: appName
                        });
                    }
                    else {
                        var e = {
                            type: "opened",
                            app: appAndVersion
                        };
                        return (0, rxjs_1.of)(e);
                    }
                }), (0, operators_1.catchError)(function (e) {
                    if (e instanceof errors_1.DisconnectedDeviceDuringOperation ||
                        e instanceof errors_1.DisconnectedDevice) {
                        return (0, rxjs_1.of)({
                            type: "disconnected"
                        });
                    }
                    if (e && e instanceof errors_1.TransportStatusError) {
                        // @ts-expect-error TransportStatusError to be typed on ledgerjs
                        switch (e.statusCode) {
                            case errors_1.StatusCodes.CLA_NOT_SUPPORTED: // in 1.3.1 dashboard
                            case errors_1.StatusCodes.INS_NOT_SUPPORTED: // in 1.3.1 and bitcoin app
                                // fallback on "old way" because device does not support getAppAndVersion
                                if (!requiresDerivation) {
                                    // if there is no derivation, there is nothing we can do to check an app (e.g. requiring non coin app)
                                    return (0, rxjs_1.throwError)(new errors_1.FirmwareOrAppUpdateRequired());
                                }
                                return derivationLogic(transport, {
                                    requiresDerivation: requiresDerivation,
                                    appName: appName
                                });
                            case errors_1.StatusCodes.LOCKED_DEVICE:
                                return (0, rxjs_1.of)({
                                    type: "lockedDevice"
                                });
                        }
                    }
                    return (0, rxjs_1.throwError)(e);
                }));
            };
            var sub = innerSub({
                appName: appName,
                dependencies: dependencies,
                requireLatestFirmware: requireLatestFirmware
            }).subscribe(o);
            return function () {
                timeoutSub.unsubscribe();
                sub.unsubscribe();
            };
        });
    });
};
exports["default"] = cmd;
//# sourceMappingURL=connectApp.js.map