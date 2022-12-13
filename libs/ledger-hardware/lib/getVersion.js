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
exports.isHardwareVersionSupported = exports.isBootloaderVersionSupported = void 0;
var devices_1 = require("@ledgerhq/devices");
var semver_1 = require("semver");
var localization_1 = require("../manager/localization");
var deviceVersionRangesForBootloaderVersion = {
    nanoS: ">=2.0.0",
    nanoX: ">=2.0.0",
    nanoSP: ">=1.0.0"
};
var isBootloaderVersionSupported = function (seVersion, modelId) {
    return !!modelId &&
        !!deviceVersionRangesForBootloaderVersion[modelId] &&
        !!(0, semver_1.satisfies)((0, semver_1.coerce)(seVersion) || seVersion, deviceVersionRangesForBootloaderVersion[modelId]);
};
exports.isBootloaderVersionSupported = isBootloaderVersionSupported;
var deviceVersionRangesForHardwareVersion = {
    nanoX: ">=2.0.0"
};
/**
 * @returns whether the Hardware Version bytes are included in the result of the
 * getVersion APDU
 * */
var isHardwareVersionSupported = function (seVersion, modelId) {
    return !!modelId &&
        !!deviceVersionRangesForHardwareVersion[modelId] &&
        !!(0, semver_1.satisfies)((0, semver_1.coerce)(seVersion) || seVersion, deviceVersionRangesForHardwareVersion[modelId]);
};
exports.isHardwareVersionSupported = isHardwareVersionSupported;
function getVersion(transport) {
    return __awaiter(this, void 0, void 0, function () {
        var res, data, i, targetId, rawVersionLength, rawVersion, flagsLength, flags, mcuVersion, mcuBlVersion, seVersion, bootloaderVersion, hardwareVersion, mcuTargetId, seTargetId, languageId, isBootloader, part1Length, part1, part2Length, part2, mcuVersionLength, mcuVersionBuf, isOSU, deviceModel, bootloaderVersionLength, bootloaderVersionBuf, hardwareVersionLength, languageIdLength;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, transport.send(0xe0, 0x01, 0x00, 0x00)];
                case 1:
                    res = _a.sent();
                    data = res.slice(0, res.length - 2);
                    i = 0;
                    targetId = data.readUIntBE(0, 4);
                    i += 4;
                    rawVersionLength = data[i++];
                    rawVersion = data.slice(i, i + rawVersionLength).toString();
                    i += rawVersionLength;
                    flagsLength = data[i++];
                    flags = data.slice(i, i + flagsLength);
                    i += flagsLength;
                    if (!rawVersionLength) {
                        // To support old firmware like bootloader of 1.3.1
                        rawVersion = "0.0.0";
                        flags = Buffer.allocUnsafeSlow(0);
                    }
                    mcuVersion = "";
                    isBootloader = (targetId & 0xf0000000) !== 0x30000000;
                    if (isBootloader) {
                        mcuBlVersion = rawVersion;
                        mcuTargetId = targetId;
                        if (i < data.length) {
                            part1Length = data[i++];
                            part1 = data.slice(i, i + part1Length);
                            i += part1Length;
                            // at this time, this is how we branch old & new format
                            if (part1Length >= 5) {
                                seVersion = part1.toString();
                                part2Length = data[i++];
                                part2 = data.slice(i, i + part2Length);
                                i += flagsLength;
                                seTargetId = part2.readUIntBE(0, 4);
                            }
                            else {
                                seTargetId = part1.readUIntBE(0, 4);
                            }
                        }
                    }
                    else {
                        seVersion = rawVersion;
                        seTargetId = targetId;
                        mcuVersionLength = data[i++];
                        mcuVersionBuf = Buffer.from(data.slice(i, i + mcuVersionLength));
                        i += mcuVersionLength;
                        if (mcuVersionBuf[mcuVersionBuf.length - 1] === 0) {
                            mcuVersionBuf = mcuVersionBuf.slice(0, mcuVersionBuf.length - 1);
                        }
                        mcuVersion = mcuVersionBuf.toString();
                        isOSU = rawVersion.includes("-osu");
                        if (!isOSU) {
                            deviceModel = (0, devices_1.identifyTargetId)(targetId);
                            if ((0, exports.isBootloaderVersionSupported)(seVersion, deviceModel === null || deviceModel === void 0 ? void 0 : deviceModel.id)) {
                                bootloaderVersionLength = data[i++];
                                bootloaderVersionBuf = Buffer.from(data.slice(i, i + bootloaderVersionLength));
                                i += bootloaderVersionLength;
                                if (bootloaderVersionBuf[bootloaderVersionBuf.length - 1] === 0) {
                                    bootloaderVersionBuf = bootloaderVersionBuf.slice(0, bootloaderVersionBuf.length - 1);
                                }
                                bootloaderVersion = bootloaderVersionBuf.toString();
                            }
                            if ((0, exports.isHardwareVersionSupported)(seVersion, deviceModel === null || deviceModel === void 0 ? void 0 : deviceModel.id)) {
                                hardwareVersionLength = data[i++];
                                hardwareVersion = data
                                    .slice(i, i + hardwareVersionLength)
                                    .readUIntBE(0, 1); // ?? string? number?
                                i += hardwareVersionLength;
                            }
                            if ((0, localization_1.isDeviceLocalizationSupported)(seVersion, deviceModel === null || deviceModel === void 0 ? void 0 : deviceModel.id)) {
                                languageIdLength = data[i++];
                                languageId = data.slice(i, i + languageIdLength).readUIntBE(0, 1);
                            }
                        }
                    }
                    return [2 /*return*/, {
                            isBootloader: isBootloader,
                            rawVersion: rawVersion,
                            targetId: targetId,
                            seVersion: seVersion,
                            mcuVersion: mcuVersion,
                            mcuBlVersion: mcuBlVersion,
                            mcuTargetId: mcuTargetId,
                            seTargetId: seTargetId,
                            flags: flags,
                            bootloaderVersion: bootloaderVersion,
                            hardwareVersion: hardwareVersion,
                            languageId: languageId
                        }];
            }
        });
    });
}
exports["default"] = getVersion;
//# sourceMappingURL=getVersion.js.map