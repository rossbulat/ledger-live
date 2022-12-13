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
/* eslint-disable no-bitwise */
var errors_1 = require("@ledgerhq/errors");
var logs_1 = require("@ledgerhq/logs");
var getVersion_1 = __importDefault(require("./getVersion"));
var isDevFirmware_1 = __importDefault(require("./isDevFirmware"));
var getAppAndVersion_1 = __importDefault(require("./getAppAndVersion"));
var provider_1 = require("../manager/provider");
var isDashboardName_1 = require("./isDashboardName");
var errors_2 = require("../errors");
var ManagerAllowedFlag = 0x08;
var PinValidatedFlag = 0x80;
function getDeviceInfo(transport) {
    return __awaiter(this, void 0, void 0, function () {
        var probablyOnDashboard, res, isBootloader, rawVersion, targetId, seVersion, seTargetId, mcuBlVersion, mcuVersion, mcuTargetId, flags, bootloaderVersion, hardwareVersion, languageId, isOSU, version, m, _a, majMin, postDash, providerName, flag, managerAllowed, pinValidated, isRecoveryMode, onboarded, hasDevFirmware;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, getAppAndVersion_1["default"])(transport)
                        .then(function (_a) {
                        var name = _a.name;
                        return (0, isDashboardName_1.isDashboardName)(name);
                    })["catch"](function (e) {
                        if (e instanceof errors_1.TransportStatusError) {
                            // @ts-expect-error typescript not checking agains the instanceof
                            if (e.statusCode === 0x6e00) {
                                return true;
                            }
                            // @ts-expect-error typescript not checking agains the instanceof
                            if (e.statusCode === 0x6d00) {
                                return false;
                            }
                        }
                        throw e;
                    })];
                case 1:
                    probablyOnDashboard = _b.sent();
                    if (!probablyOnDashboard) {
                        throw new errors_1.DeviceOnDashboardExpected();
                    }
                    return [4 /*yield*/, (0, getVersion_1["default"])(transport)["catch"](function (e) {
                            if (e instanceof errors_1.TransportStatusError) {
                                // @ts-expect-error typescript not checking agains the instanceof
                                if (e.statusCode === 0x6d06) {
                                    throw new errors_2.DeviceNotOnboarded();
                                }
                            }
                            throw e;
                        })];
                case 2:
                    res = _b.sent();
                    isBootloader = res.isBootloader, rawVersion = res.rawVersion, targetId = res.targetId, seVersion = res.seVersion, seTargetId = res.seTargetId, mcuBlVersion = res.mcuBlVersion, mcuVersion = res.mcuVersion, mcuTargetId = res.mcuTargetId, flags = res.flags, bootloaderVersion = res.bootloaderVersion, hardwareVersion = res.hardwareVersion, languageId = res.languageId;
                    isOSU = rawVersion.includes("-osu");
                    version = rawVersion.replace("-osu", "");
                    m = rawVersion.match(/([0-9]+.[0-9]+)(.[0-9]+)?(-(.*))?/);
                    _a = __read(m || [], 5), majMin = _a[1], postDash = _a[4];
                    providerName = provider_1.PROVIDERS[postDash] ? postDash : null;
                    flag = flags.length > 0 ? flags[0] : 0;
                    managerAllowed = !!(flag & ManagerAllowedFlag);
                    pinValidated = !!(flag & PinValidatedFlag);
                    isRecoveryMode = false;
                    onboarded = true;
                    if (flags.length === 4) {
                        // Nb Since LNS+ unseeded devices are visible + extra flags
                        isRecoveryMode = !!(flags[0] & 0x01);
                        onboarded = !!(flags[0] & 0x04);
                    }
                    (0, logs_1.log)("hw", "deviceInfo: se@" +
                        version +
                        " mcu@" +
                        mcuVersion +
                        (isOSU ? " (osu)" : isBootloader ? " (bootloader)" : ""));
                    hasDevFirmware = (0, isDevFirmware_1["default"])(seVersion);
                    return [2 /*return*/, {
                            version: version,
                            mcuVersion: mcuVersion,
                            seVersion: seVersion,
                            mcuBlVersion: mcuBlVersion,
                            majMin: majMin,
                            providerName: providerName || null,
                            targetId: targetId,
                            hasDevFirmware: hasDevFirmware,
                            seTargetId: seTargetId,
                            mcuTargetId: mcuTargetId,
                            isOSU: isOSU,
                            isBootloader: isBootloader,
                            isRecoveryMode: isRecoveryMode,
                            managerAllowed: managerAllowed,
                            pinValidated: pinValidated,
                            onboarded: onboarded,
                            bootloaderVersion: bootloaderVersion,
                            hardwareVersion: hardwareVersion,
                            languageId: languageId
                        }];
            }
        });
    });
}
exports["default"] = getDeviceInfo;
//# sourceMappingURL=getDeviceInfo.js.map