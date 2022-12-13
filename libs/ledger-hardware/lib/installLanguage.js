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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var errors_1 = require("@ledgerhq/errors");
var Manager_1 = __importDefault(require("../api/Manager"));
var deviceAccess_1 = require("./deviceAccess");
var getDeviceInfo_1 = __importDefault(require("./getDeviceInfo"));
var network_1 = __importDefault(require("../network"));
var errors_2 = require("../errors");
var getAppAndVersion_1 = __importDefault(require("./getAppAndVersion"));
var isDashboardName_1 = require("./isDashboardName");
var attemptToQuitApp_1 = __importDefault(require("./attemptToQuitApp"));
function installLanguage(_a) {
    var _this = this;
    var deviceId = _a.deviceId, language = _a.language;
    var sub = (0, deviceAccess_1.withDevice)(deviceId)(function (transport) {
        return new rxjs_1.Observable(function (subscriber) {
            var timeoutSub = (0, rxjs_1.of)({
                type: "unresponsiveDevice"
            })
                .pipe((0, operators_1.delay)(1000))
                .subscribe(function (e) { return subscriber.next(e); });
            var sub = (0, rxjs_1.from)((0, getDeviceInfo_1["default"])(transport))
                .pipe((0, operators_1.mergeMap)(function (deviceInfo) { return __awaiter(_this, void 0, void 0, function () {
                var languages, packs, pack, apdu_install_url, url, rawApdus, apdus, i, response, status_1, statusStr;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            timeoutSub.unsubscribe();
                            if (!(language === "english")) return [3 /*break*/, 2];
                            return [4 /*yield*/, uninstallAllLanguages(transport)];
                        case 1:
                            _a.sent();
                            subscriber.next({
                                type: "languageInstalled"
                            });
                            subscriber.complete();
                            return [2 /*return*/];
                        case 2: return [4 /*yield*/, Manager_1["default"].getLanguagePackagesForDevice(deviceInfo)];
                        case 3:
                            languages = _a.sent();
                            packs = languages.filter(function (l) { return l.language === language; });
                            if (!packs.length)
                                return [2 /*return*/, subscriber.error(new errors_1.LanguageNotFound(language))];
                            pack = packs[0];
                            apdu_install_url = pack.apdu_install_url;
                            url = apdu_install_url;
                            return [4 /*yield*/, (0, network_1["default"])({
                                    method: "GET",
                                    url: url
                                })];
                        case 4:
                            rawApdus = (_a.sent()).data;
                            apdus = rawApdus.split(/\r?\n/).filter(Boolean);
                            return [4 /*yield*/, uninstallAllLanguages(transport)];
                        case 5:
                            _a.sent();
                            i = 0;
                            _a.label = 6;
                        case 6:
                            if (!(i < apdus.length)) return [3 /*break*/, 9];
                            if (apdus[i].startsWith("e030")) {
                                subscriber.next({
                                    type: "devicePermissionRequested"
                                });
                            }
                            return [4 /*yield*/, transport.exchange(Buffer.from(apdus[i], "hex"))];
                        case 7:
                            response = _a.sent();
                            status_1 = response.readUInt16BE(response.length - 2);
                            statusStr = status_1.toString(16);
                            // Some error handling
                            if (status_1 === 0x5501) {
                                return [2 /*return*/, subscriber.error(new errors_2.LanguageInstallRefusedOnDevice(statusStr))];
                            }
                            else if (status_1 !== 0x9000) {
                                return [2 /*return*/, subscriber.error(new errors_1.TransportError("Unexpected device response", statusStr))];
                            }
                            subscriber.next({
                                type: "progress",
                                progress: (i + 1) / apdus.length
                            });
                            _a.label = 8;
                        case 8:
                            i++;
                            return [3 /*break*/, 6];
                        case 9:
                            subscriber.next({
                                type: "languageInstalled"
                            });
                            subscriber.complete();
                            return [2 /*return*/];
                    }
                });
            }); }), (0, operators_1.catchError)(function (e) {
                if (e instanceof errors_1.DeviceOnDashboardExpected ||
                    (e &&
                        e instanceof errors_1.TransportStatusError &&
                        [0x6e00, 0x6d00, 0x6e01, 0x6d01, 0x6d02].includes(
                        // @ts-expect-error typescript not checking agains the instanceof
                        e.statusCode))) {
                    return (0, rxjs_1.from)((0, getAppAndVersion_1["default"])(transport)).pipe((0, operators_1.concatMap)(function (appAndVersion) {
                        return !(0, isDashboardName_1.isDashboardName)(appAndVersion.name)
                            ? (0, attemptToQuitApp_1["default"])(transport, appAndVersion)
                            : (0, rxjs_1.of)({
                                type: "appDetected"
                            });
                    }));
                }
                return (0, rxjs_1.throwError)(e);
            }))
                .subscribe(subscriber);
            return function () {
                timeoutSub.unsubscribe();
                sub.unsubscribe();
            };
        });
    });
    return sub;
}
exports["default"] = installLanguage;
var uninstallAllLanguages = function (transport) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, transport.send(0xe0, 0x33, 0xff, 0x00, undefined, [0x9000, 0x5501] // Expected responses when uninstalling.
                )];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
//# sourceMappingURL=installLanguage.js.map