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
import { deserializeError, serializeError } from "@ledgerhq/errors";
import { BigNumber } from "bignumber.js";
import { mapValues } from "lodash";
import { getAccountUnit } from "../account";
import { formatCurrencyUnit } from "../currencies";
export var fromTransactionCommonRaw = function (raw) {
    var common = {
        amount: new BigNumber(raw.amount),
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
export var toTransactionCommonRaw = function (raw) {
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
var fromErrorRaw = function (raw) {
    return deserializeError(JSON.parse(raw));
};
var toErrorRaw = function (raw) {
    return JSON.stringify(serializeError(raw)) || "{}";
};
export var fromTransactionStatusRawCommon = function (ts) { return ({
    errors: mapValues(ts.errors, fromErrorRaw),
    warnings: mapValues(ts.warnings, fromErrorRaw),
    estimatedFees: new BigNumber(ts.estimatedFees),
    amount: new BigNumber(ts.amount),
    totalSpent: new BigNumber(ts.totalSpent),
    recipientIsReadOnly: ts.recipientIsReadOnly
}); };
export var toTransactionStatusRawCommon = function (ts) { return ({
    errors: mapValues(ts.errors, toErrorRaw),
    warnings: mapValues(ts.warnings, toErrorRaw),
    estimatedFees: ts.estimatedFees.toString(),
    amount: ts.amount.toString(),
    totalSpent: ts.totalSpent.toString(),
    recipientIsReadOnly: ts.recipientIsReadOnly
}); };
var formatErrorSmall = function (e) {
    return e.name === "Error" ? e.message : e.name;
};
export var formatTransactionStatusCommon = function (t, _a, mainAccount) {
    var errors = _a.errors, warnings = _a.warnings, estimatedFees = _a.estimatedFees, amount = _a.amount, totalSpent = _a.totalSpent;
    var str = "";
    var account = (t.subAccountId &&
        (mainAccount.subAccounts || []).find(function (a) { return a.id === t.subAccountId; })) ||
        mainAccount;
    str +=
        "\n  amount: " +
            formatCurrencyUnit(getAccountUnit(account), amount, {
                showCode: true,
                disableRounding: true
            });
    str +=
        "\n  estimated fees: " +
            formatCurrencyUnit(getAccountUnit(mainAccount), estimatedFees, {
                showCode: true,
                disableRounding: true
            });
    str +=
        "\n  total spent: " +
            formatCurrencyUnit(getAccountUnit(account), totalSpent, {
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
//# sourceMappingURL=common.js.map