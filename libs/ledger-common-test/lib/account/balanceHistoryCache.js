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
exports.recalculateAccountBalanceHistories = exports.getAccountHistoryBalances = exports.generateHistoryFromOperations = exports.emptyHistoryCache = void 0;
var operation_1 = require("../operation");
var rangeDates_1 = require("../rangeDates");
exports.emptyHistoryCache = {
    HOUR: {
        latestDate: null,
        balances: []
    },
    DAY: {
        latestDate: null,
        balances: []
    },
    WEEK: {
        latestDate: null,
        balances: []
    }
};
function generateHistoryFromOperationsG(account, g, // partial=true allows a faster implementation that only recompose the last part of the history
// to only use when we do not recalculate the history but we just want to access it
partial) {
    if (partial === void 0) { partial = false; }
    var _a = rangeDates_1.granularities[g], increment = _a.increment, startOf = _a.startOf, maxDatapoints = _a.maxDatapoints;
    var latestDate = startOf(new Date()).getTime();
    var balances = [];
    var balance = account.balance;
    var operationsLength = account.operations.length;
    var date = latestDate;
    var reference = account.balanceHistoryCache[g];
    for (var i = 0; i < operationsLength;) {
        if ((partial && reference.latestDate && date < reference.latestDate) ||
            balances.length > maxDatapoints) {
            break;
        }
        // accumulate operations after time t
        while (i < operationsLength &&
            // FIXME: added valueOf here to make typescript happy
            account.operations[i].date.valueOf() > date) {
            balance = balance.minus((0, operation_1.getOperationAmountNumberWithInternals)(account.operations[i]));
            i++;
        }
        balances.unshift(Math.max(balance.toNumber(), 0));
        date -= increment;
    }
    if (partial) {
        balances = reference.balances.concat(balances);
    }
    return {
        balances: balances,
        latestDate: latestDate
    };
}
function generateHistoryFromOperations(account) {
    return {
        HOUR: generateHistoryFromOperationsG(account, "HOUR"),
        DAY: generateHistoryFromOperationsG(account, "DAY"),
        WEEK: generateHistoryFromOperationsG(account, "WEEK")
    };
}
exports.generateHistoryFromOperations = generateHistoryFromOperations;
/**
 * get the current balance history of the account. if possible from the cache.
 */
function getAccountHistoryBalances(account, g) {
    var _a = account.balanceHistoryCache[g], balances = _a.balances, latestDate = _a.latestDate;
    var startOf = rangeDates_1.granularities[g].startOf;
    var now = startOf(new Date()).getTime();
    if (latestDate && latestDate === now) {
        return balances;
    }
    // account cache was not up to date. recalculating on the fly
    return generateHistoryFromOperationsG(account, g, true).balances;
}
exports.getAccountHistoryBalances = getAccountHistoryBalances;
/**
 * utility used at the end of an account synchronisation to recalculate the balance history if necessary
 */
function recalculateAccountBalanceHistories(res, prev) {
    // recalculate balance history cache
    if (prev.balanceHistoryCache === res.balanceHistoryCache) {
        // we only regenerate if it was not overriden by the implemenetation.
        res = __assign(__assign({}, res), { balanceHistoryCache: generateHistoryFromOperations(res) });
    }
    var prevSubAccounts = prev.subAccounts;
    var nextSubAccounts = res.subAccounts;
    if (nextSubAccounts &&
        prevSubAccounts &&
        prevSubAccounts !== nextSubAccounts) {
        // when sub accounts changes, we need to recalculate
        res.subAccounts = nextSubAccounts.map(function (subAccount) {
            var old = prevSubAccounts.find(function (a) { return a.id === subAccount.id; });
            if (!old ||
                old.balanceHistoryCache === subAccount.balanceHistoryCache) {
                // we only regenerate if it was not overriden by the implemenetation.
                subAccount = __assign(__assign({}, subAccount), { balanceHistoryCache: generateHistoryFromOperations(subAccount) });
            }
            return subAccount;
        });
    }
    return res;
}
exports.recalculateAccountBalanceHistories = recalculateAccountBalanceHistories;
//# sourceMappingURL=balanceHistoryCache.js.map