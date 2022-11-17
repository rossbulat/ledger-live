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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var bignumber_js_1 = require("bignumber.js");
var errors_1 = require("@ledgerhq/errors");
var mockHelpers_1 = require("../../../bridge/mockHelpers");
var preloadedData_1 = require("../preloadedData");
var account_1 = require("../../../account");
var preloadedData_mock_1 = __importDefault(require("../preloadedData.mock"));
var mockHelpers_2 = require("../../../bridge/mockHelpers");
var receive = (0, mockHelpers_2.makeAccountBridgeReceive)();
var defaultGetFees = function (a, t) {
    return (t.fees || new bignumber_js_1.BigNumber(0)).times(t.gas || new bignumber_js_1.BigNumber(0));
};
var createTransaction = function () { return ({
    family: "cosmos",
    mode: "send",
    amount: new bignumber_js_1.BigNumber(0),
    recipient: "",
    fees: null,
    gas: null,
    memo: null,
    validators: [],
    sourceValidator: null,
    networkInfo: null,
    useAllAmount: false
}); };
var updateTransaction = function (t, patch) { return (__assign(__assign({}, t), patch)); };
var estimateMaxSpendable = function (_a) {
    var account = _a.account, parentAccount = _a.parentAccount, transaction = _a.transaction;
    var mainAccount = (0, account_1.getMainAccount)(account, parentAccount);
    var estimatedFees = transaction
        ? defaultGetFees(mainAccount, transaction)
        : new bignumber_js_1.BigNumber(5000);
    return Promise.resolve(bignumber_js_1.BigNumber.max(0, account.balance.minus(estimatedFees)));
};
var getTransactionStatus = function (account, t) {
    var errors = {};
    var warnings = {};
    var useAllAmount = !!t.useAllAmount;
    var estimatedFees = defaultGetFees(account, t);
    var totalSpent = useAllAmount
        ? account.balance
        : new bignumber_js_1.BigNumber(t.amount).plus(estimatedFees);
    var amount = useAllAmount
        ? account.balance.minus(estimatedFees)
        : new bignumber_js_1.BigNumber(t.amount);
    if (amount.gt(0) && estimatedFees.times(10).gt(amount)) {
        warnings.feeTooHigh = new errors_1.FeeTooHigh();
    }
    // Fill up transaction errors...
    if (totalSpent.gt(account.balance)) {
        errors.amount = new errors_1.NotEnoughBalance();
    }
    // Fill up recipient errors...
    if (!t.recipient) {
        errors.recipient = new errors_1.RecipientRequired("");
    }
    else if ((0, mockHelpers_1.isInvalidRecipient)(t.recipient)) {
        errors.recipient = new errors_1.InvalidAddress("");
    }
    return Promise.resolve({
        errors: errors,
        warnings: warnings,
        estimatedFees: estimatedFees,
        amount: amount,
        totalSpent: totalSpent
    });
};
var prepareTransaction = function (a, t) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (!t.networkInfo) {
            return [2 /*return*/, __assign(__assign({}, t), { gas: new bignumber_js_1.BigNumber(1), fees: new bignumber_js_1.BigNumber(500), networkInfo: {
                        family: "cosmos",
                        fees: new bignumber_js_1.BigNumber(500)
                    } })];
        }
        return [2 /*return*/, t];
    });
}); };
var accountBridge = {
    estimateMaxSpendable: estimateMaxSpendable,
    createTransaction: createTransaction,
    updateTransaction: updateTransaction,
    getTransactionStatus: getTransactionStatus,
    prepareTransaction: prepareTransaction,
    sync: mockHelpers_1.sync,
    receive: receive,
    signOperation: mockHelpers_1.signOperation,
    broadcast: mockHelpers_1.broadcast
};
var currencyBridge = {
    scanAccounts: mockHelpers_1.scanAccounts,
    preload: function () {
        (0, preloadedData_1.setCosmosPreloadData)(preloadedData_mock_1["default"]);
        return Promise.resolve(preloadedData_mock_1["default"]);
    },
    hydrate: function (data) {
        (0, preloadedData_1.setCosmosPreloadData)((0, preloadedData_1.asSafeCosmosPreloadData)(data));
    }
};
exports["default"] = {
    currencyBridge: currencyBridge,
    accountBridge: accountBridge
};
//# sourceMappingURL=mock.js.map