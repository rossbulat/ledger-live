"use strict";
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
exports.__esModule = true;
exports.formatTransactionStatusCommon = exports.toTransactionStatusRawCommon = exports.fromTransactionStatusRawCommon = exports.toTransactionCommonRaw = exports.fromTransactionCommonRaw = void 0;
var errors_1 = require("@ledgerhq/errors");
var bignumber_js_1 = require("bignumber.js");
var lodash_1 = require("lodash");
var account_1 = require("../account");
var currencies_1 = require("../currencies");
var fromTransactionCommonRaw = function (raw) {
    var common = {
        amount: new bignumber_js_1.BigNumber(raw.amount),
        recipient: raw.recipient
    };
    if ("useAllAmount" in raw) {
        common.useAllAmount = raw.useAllAmount;
    }
    if ("subAccountId" in raw) {
        common.subAccountId = raw.subAccountId;
    }
    return common;
};
exports.fromTransactionCommonRaw = fromTransactionCommonRaw;
var toTransactionCommonRaw = function (raw) {
    var common = {
        amount: raw.amount.toString(),
        recipient: raw.recipient
    };
    if ("useAllAmount" in raw) {
        common.useAllAmount = raw.useAllAmount;
    }
    if ("subAccountId" in raw) {
        common.subAccountId = raw.subAccountId;
    }
    return common;
};
exports.toTransactionCommonRaw = toTransactionCommonRaw;
var fromErrorRaw = function (raw) {
    return (0, errors_1.deserializeError)(JSON.parse(raw));
};
var toErrorRaw = function (raw) {
    return JSON.stringify((0, errors_1.serializeError)(raw)) || "{}";
};
var fromTransactionStatusRawCommon = function (ts) { return ({
    errors: (0, lodash_1.mapValues)(ts.errors, fromErrorRaw),
    warnings: (0, lodash_1.mapValues)(ts.warnings, fromErrorRaw),
    estimatedFees: new bignumber_js_1.BigNumber(ts.estimatedFees),
    amount: new bignumber_js_1.BigNumber(ts.amount),
    totalSpent: new bignumber_js_1.BigNumber(ts.totalSpent),
    recipientIsReadOnly: ts.recipientIsReadOnly
}); };
exports.fromTransactionStatusRawCommon = fromTransactionStatusRawCommon;
var toTransactionStatusRawCommon = function (ts) { return ({
    errors: (0, lodash_1.mapValues)(ts.errors, toErrorRaw),
    warnings: (0, lodash_1.mapValues)(ts.warnings, toErrorRaw),
    estimatedFees: ts.estimatedFees.toString(),
    amount: ts.amount.toString(),
    totalSpent: ts.totalSpent.toString(),
    recipientIsReadOnly: ts.recipientIsReadOnly
}); };
exports.toTransactionStatusRawCommon = toTransactionStatusRawCommon;
var formatErrorSmall = function (e) {
    return e.name === "Error" ? e.message : e.name;
};
var formatTransactionStatusCommon = function (t, _a, mainAccount) {
    var errors = _a.errors, warnings = _a.warnings, estimatedFees = _a.estimatedFees, amount = _a.amount, totalSpent = _a.totalSpent;
    var str = "";
    var account = (t.subAccountId &&
        (mainAccount.subAccounts || []).find(function (a) { return a.id === t.subAccountId; })) ||
        mainAccount;
    str +=
        "\n  amount: " +
            (0, currencies_1.formatCurrencyUnit)((0, account_1.getAccountUnit)(account), amount, {
                showCode: true,
                disableRounding: true
            });
    str +=
        "\n  estimated fees: " +
            (0, currencies_1.formatCurrencyUnit)((0, account_1.getAccountUnit)(mainAccount), estimatedFees, {
                showCode: true,
                disableRounding: true
            });
    str +=
        "\n  total spent: " +
            (0, currencies_1.formatCurrencyUnit)((0, account_1.getAccountUnit)(account), totalSpent, {
                showCode: true,
                disableRounding: true
            });
    str +=
        "\n" +
            "errors: ".concat(Object.entries(errors)
                .map(function (_a) {
                var _b = __read(_a, 2), key = _b[0], error = _b[1];
                return "".concat(key, " ").concat(formatErrorSmall(error));
            })
                .join(", "));
    str +=
        "\n" +
            "errors: ".concat(Object.entries(warnings)
                .map(function (_a) {
                var _b = __read(_a, 2), key = _b[0], warning = _b[1];
                return "".concat(key, " ").concat(formatErrorSmall(warning));
            })
                .join(", "));
    return str;
};
exports.formatTransactionStatusCommon = formatTransactionStatusCommon;
//# sourceMappingURL=common.js.map