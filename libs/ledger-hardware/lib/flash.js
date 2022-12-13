"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var logs_1 = require("@ledgerhq/logs");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var Manager_1 = __importDefault(require("../api/Manager"));
var provider_1 = require("../manager/provider");
var getDeviceInfo_1 = __importDefault(require("./getDeviceInfo"));
var blVersionAliases = {
    "0.0": "0.6"
};
var filterMCUForDeviceInfo = function (deviceInfo) {
    var provider = (0, provider_1.getProviderId)(deviceInfo);
    return function (mcu) { return mcu.providers.includes(provider); };
};
exports["default"] = (function (finalFirmware) {
    return function (transport) {
        return (0, rxjs_1.from)((0, getDeviceInfo_1["default"])(transport)).pipe((0, operators_1.mergeMap)(function (deviceInfo) {
            return (deviceInfo.majMin in blVersionAliases
                ? (0, rxjs_1.of)(blVersionAliases[deviceInfo.majMin])
                : (0, rxjs_1.from)(
                // we pick the best MCU to install in the context of the firmware
                Manager_1["default"].getMcus()
                    .then(function (mcus) { return mcus.filter(filterMCUForDeviceInfo(deviceInfo)); })
                    .then(function (mcus) {
                    return mcus.filter(function (mcu) { return mcu.from_bootloader_version !== "none"; });
                })
                    .then(function (mcus) {
                    return Manager_1["default"].findBestMCU(finalFirmware.mcu_versions
                        .map(function (id) { return mcus.find(function (mcu) { return mcu.id === id; }); })
                        .filter(Boolean));
                }))).pipe((0, operators_1.mergeMap)(function (mcuVersion) {
                if (!mcuVersion)
                    return rxjs_1.EMPTY;
                var version;
                var isMCU = false;
                if (typeof mcuVersion === "string") {
                    version = mcuVersion;
                    (0, logs_1.log)("firmware-update", "flash ".concat(version, " from mcuVersion"));
                }
                else {
                    var mcuFromBootloader = (mcuVersion.from_bootloader_version || "")
                        .split(".")
                        .slice(0, 2)
                        .join(".");
                    isMCU = deviceInfo.majMin === mcuFromBootloader;
                    version = isMCU ? mcuVersion.name : mcuFromBootloader;
                    (0, logs_1.log)("firmware-update", "flash ".concat(version, " isMcu=").concat(String(isMCU)), {
                        blVersion: deviceInfo.majMin,
                        mcuFromBootloader: mcuFromBootloader,
                        version: version,
                        isMCU: isMCU
                    });
                }
                return (0, rxjs_1.concat)((0, rxjs_1.of)({
                    type: "install",
                    step: "flash-" + (isMCU ? "mcu" : "bootloader")
                }), Manager_1["default"].installMcu(transport, "mcu", {
                    targetId: deviceInfo.targetId,
                    version: version
                }));
            }));
        }));
    };
});
//# sourceMappingURL=flash.js.map