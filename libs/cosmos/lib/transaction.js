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
exports.__esModule = true;
exports.toTransactionRaw = exports.fromTransactionRaw = exports.formatTransaction = void 0;
var bignumber_js_1 = require("bignumber.js");
var common_1 = require("@ledgerhq/ledger-common/lib/transaction/common");
var account_1 = require("@ledgerhq/ledger-common/lib/account");
var currencies_1 = require("@ledgerhq/ledger-common/lib/currencies");
var formatTransaction = function (_a, account) {
    var mode = _a.mode, amount = _a.amount, fees = _a.fees, recipient = _a.recipient, validators = _a.validators, memo = _a.memo, sourceValidator = _a.sourceValidator, useAllAmount = _a.useAllAmount;
    return "\n".concat(mode.toUpperCase(), " ").concat(useAllAmount
        ? "MAX"
        : amount.isZero()
            ? ""
            : " " +
                (0, currencies_1.formatCurrencyUnit)((0, account_1.getAccountUnit)(account), amount, {
                    showCode: true,
                    disableRounding: true
                }), "\nTO ").concat(recipient, "\n").concat(!validators
        ? ""
        : validators
            .map(function (v) {
            return "  " +
                (0, currencies_1.formatCurrencyUnit)((0, account_1.getAccountUnit)(account), v.amount, {
                    disableRounding: true
                }) +
                " -> " +
                v.address;
        })
            .join("\n")).concat(!sourceValidator ? "" : "\n  source validator=" + sourceValidator, "\nwith fees=").concat(fees ? (0, currencies_1.formatCurrencyUnit)((0, account_1.getAccountUnit)(account), fees) : "?").concat(!memo ? "" : "\n  memo=".concat(memo));
};
exports.formatTransaction = formatTransaction;
var fromTransactionRaw = function (tr) {
    var common = (0, common_1.fromTransactionCommonRaw)(tr);
    var networkInfo = tr.networkInfo;
    return __assign(__assign({}, common), { family: tr.family, mode: tr.mode, networkInfo: networkInfo && {
            family: networkInfo.family,
            fees: new bignumber_js_1.BigNumber(networkInfo.fees)
        }, fees: tr.fees ? new bignumber_js_1.BigNumber(tr.fees) : null, gas: tr.gas ? new bignumber_js_1.BigNumber(tr.gas) : null, memo: tr.memo, sourceValidator: tr.sourceValidator, validators: tr.validators
            ? tr.validators.map(function (v) { return (__assign(__assign({}, v), { amount: new bignumber_js_1.BigNumber(v.amount) })); })
            : [] });
};
exports.fromTransactionRaw = fromTransactionRaw;
var toTransactionRaw = function (t) {
    var common = (0, common_1.toTransactionCommonRaw)(t);
    var networkInfo = t.networkInfo;
    return __assign(__assign({}, common), { family: t.family, mode: t.mode, networkInfo: networkInfo && {
            family: networkInfo.family,
            fees: networkInfo.fees.toString()
        }, fees: t.fees ? t.fees.toString() : null, gas: t.gas ? t.gas.toString() : null, memo: t.memo, sourceValidator: t.sourceValidator, validators: t.validators
            ? t.validators.map(function (v) { return (__assign(__assign({}, v), { amount: v.amount.toString() })); })
            : [] });
};
exports.toTransactionRaw = toTransactionRaw;
exports["default"] = {
    formatTransaction: exports.formatTransaction,
    fromTransactionRaw: exports.fromTransactionRaw,
    toTransactionRaw: exports.toTransactionRaw,
    fromTransactionStatusRaw: common_1.fromTransactionStatusRawCommon,
    toTransactionStatusRaw: common_1.toTransactionStatusRawCommon,
    formatTransactionStatus: common_1.formatTransactionStatusCommon
};
//# sourceMappingURL=transaction.js.map