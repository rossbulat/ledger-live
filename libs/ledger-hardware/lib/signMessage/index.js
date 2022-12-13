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
exports.createAction = exports.signMessageExec = exports.prepareMessageToSign = void 0;
var errors_1 = require("@ledgerhq/errors");
var logs_1 = require("@ledgerhq/logs");
var invariant_1 = __importDefault(require("invariant"));
var react_1 = require("react");
var rxjs_1 = require("rxjs");
var hw_signMessage_1 = __importDefault(require("../../generated/hw-signMessage"));
var app_1 = require("../actions/app");
var deviceAccess_1 = require("../deviceAccess");
var prepareMessageToSign = function (account, message) {
    var currency = account.currency, freshAddressPath = account.freshAddressPath, derivationMode = account.derivationMode;
    if (!hw_signMessage_1["default"][currency.family]) {
        throw new Error("Crypto does not support signMessage");
    }
    if ("prepareMessageToSign" in hw_signMessage_1["default"][currency.family]) {
        return hw_signMessage_1["default"][currency.family].prepareMessageToSign(currency, freshAddressPath, derivationMode, message);
    }
    // Default implementation
    return {
        currency: currency,
        path: freshAddressPath,
        derivationMode: derivationMode,
        message: Buffer.from(message, "hex").toString(),
        rawMessage: "0x" + message
    };
};
exports.prepareMessageToSign = prepareMessageToSign;
var signMessage = function (transport, opts) {
    var currency = opts.currency, verify = opts.verify;
    var signMessage = hw_signMessage_1["default"][currency.family].signMessage;
    (0, invariant_1["default"])(signMessage, "signMessage is not implemented for ".concat(currency.id));
    return signMessage(transport, opts)
        .then(function (result) {
        (0, logs_1.log)("hw", "signMessage ".concat(currency.id, " on ").concat(opts.path, " with message [").concat(opts.message, "]"), result);
        return result;
    })["catch"](function (e) {
        (0, logs_1.log)("hw", "signMessage ".concat(currency.id, " on ").concat(opts.path, " FAILED ").concat(String(e)));
        if (e && e.name === "TransportStatusError") {
            if (e.statusCode === 0x6b00 && verify) {
                throw new errors_1.DeviceAppVerifyNotSupported();
            }
            if (e.statusCode === 0x6985 || e.statusCode === 0x5501) {
                throw new errors_1.UserRefusedAddress();
            }
        }
        throw e;
    });
};
var signMessageExec = function (_a) {
    var request = _a.request, deviceId = _a.deviceId;
    var result = (0, deviceAccess_1.withDevice)(deviceId)(function (transport) {
        return (0, rxjs_1.from)(signMessage(transport, request.message));
    });
    return result;
};
exports.signMessageExec = signMessageExec;
var initialState = {
    signMessageRequested: null,
    signMessageError: null,
    signMessageResult: null
};
var createAction = function (connectAppExec, signMessage) {
    if (signMessage === void 0) { signMessage = exports.signMessageExec; }
    var useHook = function (reduxDevice, request) {
        var appState = (0, app_1.createAction)(connectAppExec).useHook(reduxDevice, {
            account: request.account
        });
        var device = appState.device, opened = appState.opened, inWrongDeviceForAccount = appState.inWrongDeviceForAccount, error = appState.error;
        var _a = __read((0, react_1.useState)(__assign(__assign({}, initialState), { signMessageRequested: request.message })), 2), state = _a[0], setState = _a[1];
        var signedFired = (0, react_1.useRef)();
        var sign = (0, react_1.useCallback)(function () { return __awaiter(void 0, void 0, void 0, function () {
            var result, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!device) {
                            setState(__assign(__assign({}, initialState), { signMessageError: new Error("no Device") }));
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, signMessage({
                                request: request,
                                deviceId: device.deviceId
                            }).toPromise()];
                    case 2:
                        result = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        if (e_1.name === "UserRefusedAddress") {
                            e_1.name = "UserRefusedOnDevice";
                            e_1.message = "UserRefusedOnDevice";
                        }
                        return [2 /*return*/, setState(__assign(__assign({}, initialState), { signMessageError: e_1 }))];
                    case 4:
                        setState(__assign(__assign({}, initialState), { signMessageResult: result === null || result === void 0 ? void 0 : result.signature }));
                        return [2 /*return*/];
                }
            });
        }); }, [device, request]);
        (0, react_1.useEffect)(function () {
            if (!device || !opened || inWrongDeviceForAccount || error) {
                return;
            }
            if (state.signMessageRequested && !signedFired.current) {
                signedFired.current = true;
                sign();
            }
        }, [
            device,
            opened,
            inWrongDeviceForAccount,
            error,
            sign,
            state.signMessageRequested,
        ]);
        return __assign(__assign({}, appState), state);
    };
    return {
        useHook: useHook,
        mapResult: function (state) { return ({
            signature: state.signMessageResult,
            error: state.signMessageError
        }); }
    };
};
exports.createAction = createAction;
exports["default"] = signMessage;
//# sourceMappingURL=index.js.map