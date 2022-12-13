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
import { BigNumber } from "bignumber.js";
import { formatTransactionStatusCommon as formatTransactionStatus, fromTransactionCommonRaw, fromTransactionStatusRawCommon as fromTransactionStatusRaw, toTransactionCommonRaw, toTransactionStatusRawCommon as toTransactionStatusRaw, } from "@ledgerhq/ledger-common/lib/transaction/common";
import { getAccountUnit } from "@ledgerhq/ledger-common/lib/account";
import { formatCurrencyUnit } from "@ledgerhq/ledger-common/lib/currencies";
export var formatTransaction = function (_a, account) {
    var mode = _a.mode, amount = _a.amount, fees = _a.fees, recipient = _a.recipient, validators = _a.validators, memo = _a.memo, sourceValidator = _a.sourceValidator, useAllAmount = _a.useAllAmount;
    return "\n".concat(mode.toUpperCase(), " ").concat(useAllAmount
        ? "MAX"
        : amount.isZero()
            ? ""
            : " " +
                formatCurrencyUnit(getAccountUnit(account), amount, {
                    showCode: true,
                    disableRounding: true
                }), "\nTO ").concat(recipient, "\n").concat(!validators
        ? ""
        : validators
            .map(function (v) {
            return "  " +
                formatCurrencyUnit(getAccountUnit(account), v.amount, {
                    disableRounding: true
                }) +
                " -> " +
                v.address;
        })
            .join("\n")).concat(!sourceValidator ? "" : "\n  source validator=" + sourceValidator, "\nwith fees=").concat(fees ? formatCurrencyUnit(getAccountUnit(account), fees) : "?").concat(!memo ? "" : "\n  memo=".concat(memo));
};
export var fromTransactionRaw = function (tr) {
    var common = fromTransactionCommonRaw(tr);
    var networkInfo = tr.networkInfo;
    return __assign(__assign({}, common), { family: tr.family, mode: tr.mode, networkInfo: networkInfo && {
            family: networkInfo.family,
            fees: new BigNumber(networkInfo.fees)
        }, fees: tr.fees ? new BigNumber(tr.fees) : null, gas: tr.gas ? new BigNumber(tr.gas) : null, memo: tr.memo, sourceValidator: tr.sourceValidator, validators: tr.validators
            ? tr.validators.map(function (v) { return (__assign(__assign({}, v), { amount: new BigNumber(v.amount) })); })
            : [] });
};
export var toTransactionRaw = function (t) {
    var common = toTransactionCommonRaw(t);
    var networkInfo = t.networkInfo;
    return __assign(__assign({}, common), { family: t.family, mode: t.mode, networkInfo: networkInfo && {
            family: networkInfo.family,
            fees: networkInfo.fees.toString()
        }, fees: t.fees ? t.fees.toString() : null, gas: t.gas ? t.gas.toString() : null, memo: t.memo, sourceValidator: t.sourceValidator, validators: t.validators
            ? t.validators.map(function (v) { return (__assign(__assign({}, v), { amount: v.amount.toString() })); })
            : [] });
};
export default {
    formatTransaction: formatTransaction,
    fromTransactionRaw: fromTransactionRaw,
    toTransactionRaw: toTransactionRaw,
    fromTransactionStatusRaw: fromTransactionStatusRaw,
    toTransactionStatusRaw: toTransactionStatusRaw,
    formatTransactionStatus: formatTransactionStatus
};
//# sourceMappingURL=transaction.js.map