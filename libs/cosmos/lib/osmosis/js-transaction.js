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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.prepareTransaction = exports.updateTransaction = exports.createTransaction = void 0;
var bignumber_js_1 = require("bignumber.js");
var js_getFeesForTransaction_1 = __importStar(require("./js-getFeesForTransaction"));
var js_estimateMaxSpendable_1 = __importDefault(require("./js-estimateMaxSpendable"));
var sameFees = function (a, b) { return (!a || !b ? a === b : a.eq(b)); };
/**
 * Create an empty transaction
 *
 * @returns {Transaction}
 */
var createTransaction = function () { return ({
    family: "osmosis",
    mode: "send",
    amount: new bignumber_js_1.BigNumber(0),
    recipient: "",
    useAllAmount: false,
    fees: null,
    gas: null,
    memo: null,
    validators: [],
    sourceValidator: null,
    networkInfo: {
        family: "osmosis",
        fees: new bignumber_js_1.BigNumber(0)
    }
}); };
exports.createTransaction = createTransaction;
/**
 * Apply patch to transaction
 *
 * @param {*} t
 * @param {*} patch
 */
var updateTransaction = function (t, patch) {
    var _a;
    if ("mode" in patch && patch.mode !== t.mode) {
        return __assign(__assign(__assign({}, t), patch), { gas: null, fees: null });
    }
    if ("validators" in patch &&
        ((_a = patch.validators) === null || _a === void 0 ? void 0 : _a.length) !== t.validators.length) {
        return __assign(__assign(__assign({}, t), patch), { gas: null, fees: null });
    }
    return __assign(__assign({}, t), patch);
};
exports.updateTransaction = updateTransaction;
/**
 * Prepare transaction before checking status
 *
 * @param {Account} a
 * @param {Transaction} t
 */
var prepareTransaction = function (account, t) { return __awaiter(void 0, void 0, void 0, function () {
    var fees, memo, gas, amount, mode, _a, _b, validatorAmount;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                fees = t.fees, memo = t.memo, gas = t.gas, amount = t.amount;
                mode = t.mode;
                return [4 /*yield*/, (0, js_getFeesForTransaction_1["default"])(mode)];
            case 1:
                fees = _c.sent();
                return [4 /*yield*/, (0, js_getFeesForTransaction_1.getEstimatedGas)(mode)];
            case 2:
                gas = _c.sent();
                if (!(mode === "send")) return [3 /*break*/, 6];
                _a = t;
                if (!t.useAllAmount) return [3 /*break*/, 4];
                return [4 /*yield*/, (0, js_estimateMaxSpendable_1["default"])({ account: account, parentAccount: null, mode: mode })];
            case 3:
                _b = _c.sent();
                return [3 /*break*/, 5];
            case 4:
                _b = amount;
                _c.label = 5;
            case 5:
                _a.amount = _b;
                _c.label = 6;
            case 6:
                if (mode !== "send" && !memo) {
                    memo = "Ledger Live";
                }
                if (!t.useAllAmount) return [3 /*break*/, 8];
                return [4 /*yield*/, (0, js_estimateMaxSpendable_1["default"])({ account: account, parentAccount: null, mode: mode })];
            case 7:
                amount = _c.sent();
                t = __assign(__assign({}, t), { amount: amount, fees: fees, gas: gas });
                _c.label = 8;
            case 8:
                if ((mode === "delegate" || mode === "claimRewardCompound") && amount.eq(0)) {
                    validatorAmount = t.validators.reduce(function (old, current) { return old.plus(current.amount); }, new bignumber_js_1.BigNumber(0));
                    amount = validatorAmount;
                    t = __assign(__assign({}, t), { amount: amount, fees: fees, gas: gas });
                }
                if (t.memo !== memo || !sameFees(t.fees, fees)) {
                    return [2 /*return*/, __assign(__assign({}, t), { memo: memo, fees: fees, gas: gas })];
                }
                return [2 /*return*/, t];
        }
    });
}); };
exports.prepareTransaction = prepareTransaction;
//# sourceMappingURL=js-transaction.js.map