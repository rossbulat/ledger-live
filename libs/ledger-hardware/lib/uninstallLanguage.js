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
var deviceAccess_1 = require("./deviceAccess");
var getDeviceInfo_1 = __importDefault(require("./getDeviceInfo"));
var types_live_1 = require("@ledgerhq/types-live");
var appSupportsQuitApp_1 = __importDefault(require("../appSupportsQuitApp"));
var quitApp_1 = __importDefault(require("./quitApp"));
var getAppAndVersion_1 = __importDefault(require("./getAppAndVersion"));
var isDashboardName_1 = require("./isDashboardName");
var attemptToQuitApp = function (transport, appAndVersion) {
    return appAndVersion && (0, appSupportsQuitApp_1["default"])(appAndVersion)
        ? (0, rxjs_1.from)((0, quitApp_1["default"])(transport)).pipe((0, operators_1.concatMap)(function () {
            return (0, rxjs_1.of)({
                type: "unresponsiveDevice"
            });
        }), (0, operators_1.catchError)(function (e) { return (0, rxjs_1.throwError)(e); }))
        : (0, rxjs_1.of)({
            type: "appDetected"
        });
};
function unistallLanguage(_a) {
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
                .pipe((0, operators_1.mergeMap)(function (_) { return __awaiter(_this, void 0, void 0, function () {
                var id;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            timeoutSub.unsubscribe();
                            id = types_live_1.languageIds[language];
                            return [4 /*yield*/, transport.send(0xe0, 0x33, id, 0x00, undefined, [0x9000, 0x5501] // Expected responses when uninstalling.
                                )];
                        case 1:
                            _a.sent();
                            subscriber.next({
                                type: "languageUninstalled"
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
                    var quitAppObservable = (0, rxjs_1.from)((0, getAppAndVersion_1["default"])(transport)).pipe((0, operators_1.concatMap)(function (appAndVersion) {
                        return !(0, isDashboardName_1.isDashboardName)(appAndVersion.name)
                            ? attemptToQuitApp(transport, appAndVersion)
                            : (0, rxjs_1.of)({
                                type: "appDetected"
                            });
                    }));
                    quitAppObservable.subscribe(function (event) { return subscriber.next(event); }, function (error) { return subscriber.error(error); });
                }
                subscriber.error(e);
                return rxjs_1.EMPTY;
            }))
                .subscribe();
            return function () {
                timeoutSub.unsubscribe();
                sub.unsubscribe();
            };
        });
    });
    return sub;
}
exports["default"] = unistallLanguage;
//# sourceMappingURL=uninstallLanguage.js.map