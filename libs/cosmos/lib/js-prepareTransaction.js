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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.prepareTransaction = exports.calculateFees = void 0;
var bignumber_js_1 = __importDefault(require("bignumber.js"));
var Cosmos_1 = require("./api/Cosmos");
var env_1 = require("@ledgerhq/ledger-common/lib/env");
var js_buildTransaction_1 = require("./js-buildTransaction");
var logic_1 = require("./logic");
var cache_1 = require("@ledgerhq/ledger-common/lib/cache");
exports.calculateFees = (0, cache_1.makeLRUCache)(function (_a) {
    var account = _a.account, transaction = _a.transaction;
    return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getEstimatedFees(account, transaction)];
                case 1: return [2 /*return*/, _b.sent()];
            }
        });
    });
}, function (_a) {
    var account = _a.account, transaction = _a.transaction;
    return "".concat(account.id, "_").concat(account.currency.id, "_").concat(transaction.amount.toString(), "_").concat(transaction.recipient, "_").concat(String(transaction.useAllAmount), "_").concat(transaction.mode, "_").concat(transaction.validators
        ? transaction.validators.map(function (v) { return v.address; }).join("-")
        : "", "_").concat(transaction.memo ? transaction.memo.toString() : "", "_").concat(transaction.sourceValidator ? transaction.sourceValidator : "");
});
var getEstimatedFees = function (account, transaction) { return __awaiter(void 0, void 0, void 0, function () {
    var gasQty, gasPrice, unsignedPayload, pubkey, tx_bytes, gasUsed, estimatedGas, estimatedFees;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                gasQty = new bignumber_js_1["default"](250000);
                gasPrice = new bignumber_js_1["default"]((0, env_1.getEnv)("COSMOS_GAS_PRICE"));
                return [4 /*yield*/, (0, js_buildTransaction_1.buildTransaction)(account, transaction)];
            case 1:
                unsignedPayload = _a.sent();
                if (!unsignedPayload) return [3 /*break*/, 4];
                pubkey = {
                    typeUrl: "/cosmos.crypto.secp256k1.PubKey",
                    value: new Uint8Array(__spreadArray(__spreadArray([], __read(new Uint8Array([10, 33])), false), __read(new Uint8Array(Buffer.from(account.seedIdentifier, "hex"))), false))
                };
                return [4 /*yield*/, (0, js_buildTransaction_1.postBuildTransaction)(account, transaction, pubkey, unsignedPayload, new Uint8Array(Buffer.from(account.seedIdentifier, "hex")))];
            case 2:
                tx_bytes = _a.sent();
                return [4 /*yield*/, Cosmos_1.defaultCosmosAPI.simulate(tx_bytes)];
            case 3:
                gasUsed = _a.sent();
                if (gasUsed.gt(0)) {
                    gasQty = gasUsed
                        // Don't known what is going on,
                        // Ledger Live Desktop return half of what it should,
                        // Ledger Live Common CLI do the math correctly.
                        // Use coeff 2 as trick..
                        // .multipliedBy(new BigNumber(getEnv("COSMOS_GAS_AMPLIFIER")))
                        .multipliedBy(new bignumber_js_1["default"]((0, env_1.getEnv)("COSMOS_GAS_AMPLIFIER") * 2))
                        .integerValue();
                }
                _a.label = 4;
            case 4:
                estimatedGas = gasQty;
                estimatedFees = gasPrice.multipliedBy(gasQty).integerValue();
                return [2 /*return*/, { estimatedFees: estimatedFees, estimatedGas: estimatedGas }];
        }
    });
}); };
var prepareTransaction = function (account, transaction) { return __awaiter(void 0, void 0, void 0, function () {
    var memo, amount, _a, estimatedFees, estimatedGas;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                memo = transaction.memo;
                amount = transaction.amount;
                if (transaction.mode !== "send" && !transaction.memo) {
                    memo = "Ledger Live";
                }
                return [4 /*yield*/, (0, exports.calculateFees)({
                        account: account,
                        transaction: __assign(__assign({}, transaction), { amount: transaction.useAllAmount
                                ? account.spendableBalance.minus(new bignumber_js_1["default"](2500))
                                : amount, memo: memo })
                    })];
            case 1:
                _a = _b.sent(), estimatedFees = _a.estimatedFees, estimatedGas = _a.estimatedGas;
                if (transaction.useAllAmount) {
                    amount = (0, logic_1.getMaxEstimatedBalance)(account, estimatedFees);
                }
                if (transaction.memo !== memo ||
                    !estimatedFees.eq(transaction.fees || new bignumber_js_1["default"](0)) ||
                    !estimatedGas.eq(transaction.gas || new bignumber_js_1["default"](0)) ||
                    !amount.eq(transaction.amount)) {
                    return [2 /*return*/, __assign(__assign({}, transaction), { memo: memo, fees: estimatedFees, gas: estimatedGas, amount: amount })];
                }
                return [2 /*return*/, transaction];
        }
    });
}); };
exports.prepareTransaction = prepareTransaction;
exports["default"] = exports.prepareTransaction;
//# sourceMappingURL=js-prepareTransaction.js.map