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
exports.toOperationExtraRaw = exports.fromOperationExtraRaw = exports.formatAccountSpecifics = void 0;
var invariant_1 = __importDefault(require("invariant"));
var bignumber_js_1 = require("bignumber.js");
var preloadedData_1 = require("./preloadedData");
var account_1 = require("@ledgerhq/ledger-common/lib/account");
var currencies_1 = require("@ledgerhq/ledger-common/lib/currencies");
var logic_1 = require("./logic");
var preloadedData_2 = require("./osmosis/preloadedData");
function formatOperationSpecifics(op, unit) {
    var validators = op.extra.validators;
    return (validators || [])
        .map(function (v) {
        return "\n    to ".concat(v.address, " ").concat(unit
            ? (0, currencies_1.formatCurrencyUnit)(unit, new bignumber_js_1.BigNumber(v.amount), {
                showCode: true,
                disableRounding: true
            }).padEnd(16)
            : v.amount);
    })
        .join("");
}
function getCurrentCosmosFamilyPreloadData(currencyName) {
    if (currencyName === "osmosis") {
        return (0, preloadedData_2.getCurrentOsmosisPreloadData)();
    }
    else {
        return (0, preloadedData_1.getCurrentCosmosPreloadData)();
    }
}
function formatAccountSpecifics(account) {
    var _a, _b, _c;
    var cosmosResources = account.cosmosResources;
    (0, invariant_1["default"])(cosmosResources, "cosmos account expected");
    var currencyName = account.currency.name.toLowerCase();
    var validators = getCurrentCosmosFamilyPreloadData(currencyName).validators;
    var unit = (0, account_1.getAccountUnit)(account);
    var formatConfig = {
        disableRounding: true,
        alwaysShowSign: false,
        showCode: true
    };
    var str = " ";
    str +=
        (0, currencies_1.formatCurrencyUnit)(unit, account.spendableBalance, formatConfig) +
            " spendable. ";
    if (cosmosResources === null || cosmosResources === void 0 ? void 0 : cosmosResources.delegatedBalance.gt(0)) {
        str +=
            (0, currencies_1.formatCurrencyUnit)(unit, cosmosResources.delegatedBalance, formatConfig) +
                " delegated. ";
    }
    if (cosmosResources === null || cosmosResources === void 0 ? void 0 : cosmosResources.unbondingBalance.gt(0)) {
        str +=
            (0, currencies_1.formatCurrencyUnit)(unit, cosmosResources.unbondingBalance, formatConfig) +
                " unbonding. ";
    }
    var mappedDelegations = (0, logic_1.mapDelegations)((_a = cosmosResources === null || cosmosResources === void 0 ? void 0 : cosmosResources.delegations) !== null && _a !== void 0 ? _a : [], validators, unit);
    if (mappedDelegations.length) {
        str += "\nDELEGATIONS\n";
        str += mappedDelegations
            .map(function (d) {
            return "  to ".concat(d.validatorAddress, " ").concat((0, currencies_1.formatCurrencyUnit)(unit, d.amount, {
                showCode: true,
                disableRounding: true
            }), " ").concat(d.pendingRewards.gt(0)
                ? " (claimable " +
                    (0, currencies_1.formatCurrencyUnit)(unit, d.amount, {
                        disableRounding: true
                    }) +
                    ")"
                : "");
        })
            .join("\n");
    }
    var mappedUnbondings = (0, logic_1.mapUnbondings)((_b = cosmosResources === null || cosmosResources === void 0 ? void 0 : cosmosResources.unbondings) !== null && _b !== void 0 ? _b : [], validators, unit);
    if (mappedUnbondings.length) {
        str += "\nUNDELEGATIONS\n";
        str += mappedUnbondings
            .map(function (d) {
            return "  from ".concat(d.validatorAddress, " ").concat((0, currencies_1.formatCurrencyUnit)(unit, d.amount, {
                showCode: true,
                disableRounding: true
            }));
        })
            .join("\n");
    }
    var mappedRedelegations = (0, logic_1.mapRedelegations)((_c = cosmosResources === null || cosmosResources === void 0 ? void 0 : cosmosResources.redelegations) !== null && _c !== void 0 ? _c : [], validators, unit);
    if (mappedRedelegations.length) {
        str += "\nREDELEGATIONS\n";
        str += mappedRedelegations
            .map(function (d) {
            return "  from ".concat(d.validatorSrcAddress, " to ").concat(d.validatorDstAddress, " ").concat((0, currencies_1.formatCurrencyUnit)(unit, d.amount, {
                showCode: true,
                disableRounding: true
            }));
        })
            .join("\n");
    }
    return str;
}
exports.formatAccountSpecifics = formatAccountSpecifics;
function fromOperationExtraRaw(extra) {
    var e = {};
    if (extra && extra.validators) {
        e = __assign(__assign({}, extra), { validators: extra.validators.map(function (o) { return (__assign(__assign({}, o), { amount: new bignumber_js_1.BigNumber(o.amount) })); }) });
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
    formatAccountSpecifics: formatAccountSpecifics,
    formatOperationSpecifics: formatOperationSpecifics,
    fromOperationExtraRaw: fromOperationExtraRaw,
    toOperationExtraRaw: toOperationExtraRaw
};
//# sourceMappingURL=account.js.map