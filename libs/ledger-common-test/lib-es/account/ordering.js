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
import { BigNumber } from "bignumber.js";
import { flattenAccounts, getAccountCurrency } from "./helpers";
var sortNameLense = function (a) {
    switch (a.type) {
        case "Account":
            return a.name;
        case "TokenAccount":
            return a.token.name;
        case "ChildAccount":
            return a.currency.name;
        default:
            return "";
    }
};
export var sortAccountsComparatorFromOrder = function (orderAccounts, calculateCountervalue) {
    var _a = __read(orderAccounts.split("|"), 2), order = _a[0], sort = _a[1];
    var ascValue = sort === "desc" ? -1 : 1;
    if (order === "name") {
        return function (a, b) {
            return ascValue *
                sortNameLense(a).localeCompare(sortNameLense(b), undefined, {
                    numeric: true
                });
        };
    }
    var cvCaches = {};
    var lazyCalcCV = function (a) {
        if (a.id in cvCaches)
            return cvCaches[a.id];
        var v = calculateCountervalue(getAccountCurrency(a), a.balance) ||
            new BigNumber(-1);
        cvCaches[a.id] = v;
        return v;
    };
    return function (a, b) {
        var diff = ascValue * lazyCalcCV(a).minus(lazyCalcCV(b)).toNumber();
        if (diff === 0)
            return sortNameLense(a).localeCompare(sortNameLense(b));
        return diff;
    };
};
export var comparatorSortAccounts = function (accounts, comparator) {
    var meta = accounts
        .map(function (ta, index) { return ({
        account: ta,
        index: index
    }); })
        .sort(function (a, b) { return comparator(a.account, b.account); });
    if (meta.every(function (m, i) { return m.index === i; })) {
        // account ordering is preserved, we keep the same array reference (this should happen most of the time)
        return accounts;
    }
    // otherwise, need to reorder
    return meta.map(function (m) { return accounts[m.index]; });
};
// flatten accounts and sort between them (used for grid mode)
export var flattenSortAccounts = function (accounts, comparator, o) {
    return comparatorSortAccounts(flattenAccounts(accounts, o), comparator);
};
// sort top level accounts and the inner sub accounts if necessary (used for lists)
export var nestedSortAccounts = function (topAccounts, comparator) {
    var oneAccountHaveChanged = false;
    // first of all we sort the inner token accounts
    var accounts = topAccounts.map(function (a) {
        if (!a.subAccounts)
            return a;
        var subAccounts = comparatorSortAccounts(a.subAccounts, comparator);
        if (subAccounts === a.subAccounts)
            return a;
        oneAccountHaveChanged = true;
        return __assign(__assign({}, a), { subAccounts: subAccounts });
    });
    // then we sort again between them
    return comparatorSortAccounts(oneAccountHaveChanged ? accounts : topAccounts, comparator);
};
//# sourceMappingURL=ordering.js.map