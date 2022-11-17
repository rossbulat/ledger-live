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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.toOperationExtraRaw = exports.fromOperationExtraRaw = void 0;
var bignumber_js_1 = __importDefault(require("bignumber.js"));
var account_1 = require("../account");
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
function fromOperationExtraRaw(extra) {
    var e = {};
    if (extra && extra.validators) {
        e = __assign(__assign({}, extra), { validators: extra.validators.map(function (o) { return (__assign(__assign({}, o), { amount: new bignumber_js_1["default"](o.amount) })); }) });
    }
    return e;
}
exports.fromOperationExtraRaw = fromOperationExtraRaw;
function toOperationExtraRaw(extra) {
    var e = {};
    if (extra && extra.validators) {
        e = __assign(__assign({}, extra), { validators: extra.validators.map(function (o) { return (__assign(__assign({}, o), { amount: o.amount.toString() })); }) });
    }
    return e;
}
exports.toOperationExtraRaw = toOperationExtraRaw;
exports["default"] = {
    formatOperationSpecifics: formatOperationSpecifics,
    fromOperationExtraRaw: fromOperationExtraRaw,
    toOperationExtraRaw: toOperationExtraRaw,
    formatAccountSpecifics: account_1.formatAccountSpecifics
};
//# sourceMappingURL=account.js.map