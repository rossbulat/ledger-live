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
var getAppAndVersion_1 = __importDefault(require("./getAppAndVersion"));
var errors_1 = require("@ledgerhq/errors");
var getAddress_1 = __importDefault(require("./getAddress"));
var derivation_1 = require("../derivation");
var dashboardAppNames = ["BOLOS", "OLOS\u0000"]; // NB nano x 1.2.4-1 dashboard app name
exports["default"] = (function (transport, currency, devicePath) { return __awaiter(void 0, void 0, void 0, function () {
    var currentApp;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, getAppAndVersion_1["default"])(transport)["catch"](function (e) {
                    if (e.status === 0x6e00)
                        return null;
                    throw e;
                })];
            case 1:
                currentApp = _a.sent();
                if (!currentApp) return [3 /*break*/, 2];
                if (currentApp.name === currency.managerAppName) {
                    return [2 /*return*/];
                }
                else if (dashboardAppNames.includes(currentApp.name)) {
                    throw new errors_1.DeviceOnDashboardUnexpected();
                }
                throw new errors_1.WrongAppForCurrency("wrong app ".concat(currentApp.name, ", expected ").concat(currency.managerAppName), {
                    current: currentApp.name,
                    expected: currency.managerAppName
                });
            case 2: 
            // NB fallback for devices not supporting getAppAndVersion
            return [4 /*yield*/, (0, getAddress_1["default"])(transport, {
                    derivationMode: "",
                    devicePath: devicePath,
                    currency: currency,
                    path: (0, derivation_1.runDerivationScheme)((0, derivation_1.getDerivationScheme)({
                        currency: currency,
                        derivationMode: ""
                    }), currency),
                    segwit: false
                })];
            case 3:
                // NB fallback for devices not supporting getAppAndVersion
                _a.sent();
                _a.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=checkCurrencyApp.js.map