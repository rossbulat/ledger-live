"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.repairChoices = void 0;
var logs_1 = require("@ledgerhq/logs");
var errors_1 = require("@ledgerhq/errors");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var semver_1 = __importDefault(require("semver"));
var Manager_1 = __importDefault(require("../api/Manager"));
var deviceAccess_1 = require("./deviceAccess");
var provider_1 = require("../manager/provider");
var getDeviceInfo_1 = __importDefault(require("./getDeviceInfo"));
var deviceWordings_1 = require("../deviceWordings");
var getDeviceRunningMode_1 = require("./getDeviceRunningMode");
var wait2s = (0, rxjs_1.of)({
    type: "wait"
}).pipe((0, operators_1.delay)(2000));
exports.repairChoices = [
    {
        id: "mcuOutdated",
        label: deviceWordings_1.mcuOutdated,
        forceMCU: "0.7"
    },
    {
        id: "mcuNotGenuine",
        label: deviceWordings_1.mcuNotGenuine,
        forceMCU: "0.7"
    },
    {
        id: "followDeviceRepair",
        label: deviceWordings_1.followDeviceRepair,
        forceMCU: "0.9"
    },
    {
        id: "followDeviceUpdate",
        label: deviceWordings_1.followDeviceUpdate,
        forceMCU: "0.9"
    },
];
var filterMCUForDeviceInfo = function (deviceInfo) {
    var provider = (0, provider_1.getProviderId)(deviceInfo);
    return function (mcu) { return mcu.providers.includes(provider); };
};
var repair = function (deviceId, forceMCU_) {
    (0, logs_1.log)("hw", "firmwareUpdate-repair");
    var mcusPromise = Manager_1["default"].getMcus();
    var withDeviceInfo = (0, deviceAccess_1.withDevicePolling)(deviceId)(function (transport) { return (0, rxjs_1.from)((0, getDeviceInfo_1["default"])(transport)); }, function () { return true; } // accept all errors. we're waiting forever condition that make getDeviceInfo work
    );
    var waitForBootloader = withDeviceInfo.pipe((0, operators_1.concatMap)(function (deviceInfo) {
        return deviceInfo.isBootloader ? rxjs_1.EMPTY : (0, rxjs_1.concat)(wait2s, waitForBootloader);
    }));
    var loop = function (forceMCU) {
        return (0, rxjs_1.concat)(withDeviceInfo.pipe((0, operators_1.concatMap)(function (deviceInfo) {
            var installMcu = function (version) {
                return (0, deviceAccess_1.withDevice)(deviceId)(function (transport) {
                    return Manager_1["default"].installMcu(transport, "mcu", {
                        targetId: deviceInfo.targetId,
                        version: version
                    });
                });
            };
            if (!deviceInfo.isBootloader) {
                // finish earlier
                return rxjs_1.EMPTY;
            }
            // This is a special case where user is in firmware 1.3.1
            // and the device shows MCU Not Genuine.
            // User needs to press both keys three times to go back to dashboard
            // and continue the update process
            if (forceMCU &&
                forceMCU === "0.7" &&
                (deviceInfo.majMin === "0.6" || deviceInfo.majMin === "0.7")) {
                // finish earlier
                return (0, rxjs_1.throwError)(new errors_1.MCUNotGenuineToDashboard());
            }
            if (forceMCU) {
                return (0, rxjs_1.concat)(installMcu(forceMCU), wait2s, loop());
            }
            switch (deviceInfo.majMin) {
                case "0.0":
                    return (0, rxjs_1.concat)(installMcu("0.6"), wait2s, loop());
                case "0.6":
                    return installMcu("1.5");
                case "0.7":
                    return installMcu("1.6");
                case "0.9":
                    return installMcu("1.7");
                default:
                    return (0, rxjs_1.from)(mcusPromise).pipe((0, operators_1.concatMap)(function (mcus) {
                        var next;
                        var seVersion = deviceInfo.seVersion, seTargetId = deviceInfo.seTargetId, mcuBlVersion = deviceInfo.mcuBlVersion;
                        // This is a special case where a user with LNX version >= 2.0.0
                        // comes back with a broken updated device. We need to be able
                        // to patch MCU or Bootloader if needed
                        if (seVersion && seTargetId) {
                            (0, logs_1.log)("hw", "firmwareUpdate-repair seVersion and seTargetId found", { seVersion: seVersion, seTargetId: seTargetId });
                            var validMcusForDeviceInfo_1 = mcus
                                .filter(filterMCUForDeviceInfo(deviceInfo))
                                .filter(function (mcu) { return mcu.from_bootloader_version !== "none"; });
                            (0, logs_1.log)("hw", "firmwareUpdate-repair valid mcus for device", {
                                validMcusForDeviceInfo: validMcusForDeviceInfo_1
                            });
                            return (0, rxjs_1.from)(Manager_1["default"].getDeviceVersion(seTargetId, (0, provider_1.getProviderId)(deviceInfo))).pipe((0, operators_1.mergeMap)(function (deviceVersion) {
                                return (0, rxjs_1.from)(Manager_1["default"].getCurrentFirmware({
                                    deviceId: deviceVersion.id,
                                    version: seVersion,
                                    provider: (0, provider_1.getProviderId)(deviceInfo)
                                }));
                            }), (0, operators_1.mergeMap)(function (finalFirmware) {
                                var _a, _b;
                                (0, logs_1.log)("hw", "firmwareUpdate-repair got final firmware", {
                                    finalFirmware: finalFirmware
                                });
                                var mcu = Manager_1["default"].findBestMCU(finalFirmware.mcu_versions
                                    .map(function (id) {
                                    return validMcusForDeviceInfo_1.find(function (mcu) { return mcu.id === id; });
                                })
                                    .filter(Boolean));
                                (0, logs_1.log)("hw", "firmwareUpdate-repair got mcu", { mcu: mcu });
                                if (!mcu)
                                    return rxjs_1.EMPTY;
                                var expectedBootloaderVersion = (_a = semver_1["default"].coerce(mcu.from_bootloader_version)) === null || _a === void 0 ? void 0 : _a.version;
                                var currentBootloaderVersion = (_b = semver_1["default"].coerce(mcuBlVersion)) === null || _b === void 0 ? void 0 : _b.version;
                                (0, logs_1.log)("hw", "firmwareUpdate-repair bootloader versions", {
                                    currentBootloaderVersion: currentBootloaderVersion,
                                    expectedBootloaderVersion: expectedBootloaderVersion
                                });
                                if (expectedBootloaderVersion === currentBootloaderVersion) {
                                    next = mcu;
                                    (0, logs_1.log)("hw", "firmwareUpdate-repair bootloader versions are the same", { next: next });
                                }
                                else {
                                    next = {
                                        name: mcu.from_bootloader_version
                                    };
                                    (0, logs_1.log)("hw", "firmwareUpdate-repair bootloader versions are different", { next: next });
                                }
                                return installMcu(next.name);
                            }));
                        }
                        else {
                            next = Manager_1["default"].findBestMCU(Manager_1["default"].compatibleMCUForDeviceInfo(mcus, deviceInfo, (0, provider_1.getProviderId)(deviceInfo)));
                            if (next)
                                return installMcu(next.name);
                        }
                        return rxjs_1.EMPTY;
                    }));
            }
        })), (0, rxjs_1.from)((0, getDeviceRunningMode_1.getDeviceRunningMode)({
            deviceId: deviceId,
            unresponsiveTimeoutMs: 4000,
            cantOpenDeviceRetryLimit: 2
        })).pipe((0, operators_1.mergeMap)(function (result) {
            if (result.type === "bootloaderMode") {
                return loop(forceMCU);
            }
            else {
                return rxjs_1.EMPTY;
            }
        })));
    };
    // TODO ideally we should race waitForBootloader with an event "display-bootloader-reboot", it should be a delayed event that is not emitted if waitForBootloader is fast enough..
    return (0, rxjs_1.concat)(waitForBootloader, loop(forceMCU_)).pipe((0, operators_1.filter)(function (e) { return e.type === "bulk-progress"; }), (0, operators_1.map)(function (e) { return ({
        progress: e.progress
    }); }), (0, operators_1.throttleTime)(100));
};
exports["default"] = repair;
//# sourceMappingURL=firmwareUpdate-repair.js.map