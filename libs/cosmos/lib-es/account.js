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
import invariant from "invariant";
import { BigNumber } from "bignumber.js";
import { getCurrentCosmosPreloadData } from "./preloadedData";
import { getAccountUnit } from "@ledgerhq/ledger-common/lib/account";
import { formatCurrencyUnit } from "@ledgerhq/ledger-common/lib/currencies";
import { mapDelegations, mapUnbondings, mapRedelegations } from "./logic";
import { getCurrentOsmosisPreloadData } from "./osmosis/preloadedData";
function formatOperationSpecifics(op, unit) {
    var validators = op.extra.validators;
    return (validators || [])
        .map(function (v) {
        return "\n    to ".concat(v.address, " ").concat(unit
            ? formatCurrencyUnit(unit, new BigNumber(v.amount), {
                showCode: true,
                disableRounding: true
            }).padEnd(16)
            : v.amount);
    })
        .join("");
}
function getCurrentCosmosFamilyPreloadData(currencyName) {
    if (currencyName === "osmosis") {
        return getCurrentOsmosisPreloadData();
    }
    else {
        return getCurrentCosmosPreloadData();
    }
}
export function formatAccountSpecifics(account) {
    var _a, _b, _c;
    var cosmosResources = account.cosmosResources;
    invariant(cosmosResources, "cosmos account expected");
    var currencyName = account.currency.name.toLowerCase();
    var validators = getCurrentCosmosFamilyPreloadData(currencyName).validators;
    var unit = getAccountUnit(account);
    var formatConfig = {
        disableRounding: true,
        alwaysShowSign: false,
        showCode: true
    };
    var str = " ";
    str +=
        formatCurrencyUnit(unit, account.spendableBalance, formatConfig) +
            " spendable. ";
    if (cosmosResources === null || cosmosResources === void 0 ? void 0 : cosmosResources.delegatedBalance.gt(0)) {
        str +=
            formatCurrencyUnit(unit, cosmosResources.delegatedBalance, formatConfig) +
                " delegated. ";
    }
    if (cosmosResources === null || cosmosResources === void 0 ? void 0 : cosmosResources.unbondingBalance.gt(0)) {
        str +=
            formatCurrencyUnit(unit, cosmosResources.unbondingBalance, formatConfig) +
                " unbonding. ";
    }
    var mappedDelegations = mapDelegations((_a = cosmosResources === null || cosmosResources === void 0 ? void 0 : cosmosResources.delegations) !== null && _a !== void 0 ? _a : [], validators, unit);
    if (mappedDelegations.length) {
        str += "\nDELEGATIONS\n";
        str += mappedDelegations
            .map(function (d) {
            return "  to ".concat(d.validatorAddress, " ").concat(formatCurrencyUnit(unit, d.amount, {
                showCode: true,
                disableRounding: true
            }), " ").concat(d.pendingRewards.gt(0)
                ? " (claimable " +
                    formatCurrencyUnit(unit, d.amount, {
                        disableRounding: true
                    }) +
                    ")"
                : "");
        })
            .join("\n");
    }
    var mappedUnbondings = mapUnbondings((_b = cosmosResources === null || cosmosResources === void 0 ? void 0 : cosmosResources.unbondings) !== null && _b !== void 0 ? _b : [], validators, unit);
    if (mappedUnbondings.length) {
        str += "\nUNDELEGATIONS\n";
        str += mappedUnbondings
            .map(function (d) {
            return "  from ".concat(d.validatorAddress, " ").concat(formatCurrencyUnit(unit, d.amount, {
                showCode: true,
                disableRounding: true
            }));
        })
            .join("\n");
    }
    var mappedRedelegations = mapRedelegations((_c = cosmosResources === null || cosmosResources === void 0 ? void 0 : cosmosResources.redelegations) !== null && _c !== void 0 ? _c : [], validators, unit);
    if (mappedRedelegations.length) {
        str += "\nREDELEGATIONS\n";
        str += mappedRedelegations
            .map(function (d) {
            return "  from ".concat(d.validatorSrcAddress, " to ").concat(d.validatorDstAddress, " ").concat(formatCurrencyUnit(unit, d.amount, {
                showCode: true,
                disableRounding: true
            }));
        })
            .join("\n");
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
    formatAccountSpecifics: formatAccountSpecifics,
    formatOperationSpecifics: formatOperationSpecifics,
    fromOperationExtraRaw: fromOperationExtraRaw,
    toOperationExtraRaw: toOperationExtraRaw
};
//# sourceMappingURL=account.js.map