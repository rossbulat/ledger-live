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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var logs_1 = require("@ledgerhq/logs");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var errors_1 = require("@ledgerhq/errors");
var deviceAccess_1 = require("./deviceAccess");
var getDeviceInfo_1 = __importDefault(require("./getDeviceInfo"));
var flash_1 = __importDefault(require("./flash"));
var installFinalFirmware_1 = __importDefault(require("./installFinalFirmware"));
var hasFinalFirmware_1 = require("./hasFinalFirmware");
var wait2s = (0, rxjs_1.of)({
    type: "wait"
}).pipe((0, operators_1.delay)(2000));
var main = function (deviceId, _a) {
    var final = _a.final, shouldFlashMCU = _a.shouldFlashMCU;
    (0, logs_1.log)("hw", "firmwareUpdate-main started");
    var withFinal = (0, hasFinalFirmware_1.hasFinalFirmware)(final);
    var withDeviceInfo = (0, deviceAccess_1.withDevicePolling)(deviceId)(function (transport) { return (0, rxjs_1.from)((0, getDeviceInfo_1["default"])(transport)); }, function () { return true; } // accept all errors. we're waiting forever condition that make getDeviceInfo work
    );
    var withDeviceInstall = function (install) {
        return (0, deviceAccess_1.withDevicePolling)(deviceId)(install, function (e) { return e instanceof errors_1.CantOpenDevice; } // this can happen if withDevicePolling was still seeing the device but it was then interrupted by a device reboot
        );
    };
    var waitForBootloader = withDeviceInfo.pipe((0, operators_1.concatMap)(function (deviceInfo) {
        return deviceInfo.isBootloader ? rxjs_1.EMPTY : (0, rxjs_1.concat)(wait2s, waitForBootloader);
    }));
    var potentialAutoFlash = withDeviceInfo.pipe((0, operators_1.concatMap)(function (deviceInfo) {
        return deviceInfo.isOSU
            ? rxjs_1.EMPTY
            : (0, deviceAccess_1.withDevice)(deviceId)(function (transport) {
                return new rxjs_1.Observable(function (o) {
                    var timeout = setTimeout(function () {
                        (0, logs_1.log)("firmware", "potentialAutoFlash timeout");
                        o.complete();
                    }, 20000);
                    var disconnect = function () {
                        (0, logs_1.log)("firmware", "potentialAutoFlash disconnect");
                        o.complete();
                    };
                    transport.on("disconnect", disconnect);
                    return function () {
                        clearTimeout(timeout);
                        transport.off("disconnect", disconnect);
                    };
                });
            });
    }));
    var bootloaderLoop = withDeviceInfo.pipe((0, operators_1.concatMap)(function (deviceInfo) {
        return !deviceInfo.isBootloader
            ? rxjs_1.EMPTY
            : (0, rxjs_1.concat)(withDeviceInstall((0, flash_1["default"])(final)), wait2s, bootloaderLoop);
    }));
    var finalStep = !withFinal
        ? rxjs_1.EMPTY
        : withDeviceInfo.pipe((0, operators_1.concatMap)(function (deviceInfo) {
            return !deviceInfo.isOSU
                ? (0, rxjs_1.throwError)(new errors_1.DeviceInOSUExpected())
                : withDeviceInstall(installFinalFirmware_1["default"]);
        }));
    var all = shouldFlashMCU
        ? (0, rxjs_1.concat)(waitForBootloader, bootloaderLoop, finalStep)
        : (0, rxjs_1.concat)(potentialAutoFlash, finalStep);
    return all.pipe((0, operators_1.scan)(function (acc, e) {
        if (e.type === "install") {
            return {
                installing: e.step,
                progress: 0
            };
        }
        if (e.type === "bulk-progress") {
            return __assign(__assign({}, acc), { progress: e.progress });
        }
        return acc;
    }, {
        progress: 0,
        installing: null
    }), (0, operators_1.distinctUntilChanged)(), (0, operators_1.throttleTime)(100));
};
exports["default"] = main;
//# sourceMappingURL=firmwareUpdate-main.js.map