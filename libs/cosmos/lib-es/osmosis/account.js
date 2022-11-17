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
import BigNumber from "bignumber.js";
import { formatAccountSpecifics } from "../account";
function formatOperationSpecifics(op) {
    var _a = op.extra, memo = _a.memo, validators = _a.validators, autoClaimedRewards = _a.autoClaimedRewards;
    var str = " ";
    if (validators && validators.length > 0) {
        str += validators
            .map(function (v) {
            "\n    to ".concat(v.address, " ").concat(v.amount);
        })
            .join("");
    }
    if (autoClaimedRewards) {
        str += "\n auto claimed rewards is: ".concat(autoClaimedRewards.toString());
    }
    if (memo) {
        str += "\n    Memo: ".concat(memo);
    }
    return str;
}
export function fromOperationExtraRaw(extra) {
    var e = {};
    if (extra && extra.validators) {
        e = __assign(__assign({}, extra), { validators: extra.validators.map(function (o) { return (__assign(__assign({}, o), { amount: new BigNumber(o.amount) })); }) });
    }
    return e;
}
export function toOperationExtraRaw(extra) {
    var e = {};
    if (extra && extra.validators) {
        e = __assign(__assign({}, extra), { validators: extra.validators.map(function (o) { return (__assign(__assign({}, o), { amount: o.amount.toString() })); }) });
    }
    return e;
}
export default {
    formatOperationSpecifics: formatOperationSpecifics,
    fromOperationExtraRaw: fromOperationExtraRaw,
    toOperationExtraRaw: toOperationExtraRaw,
    formatAccountSpecifics: formatAccountSpecifics
};
//# sourceMappingURL=account.js.map