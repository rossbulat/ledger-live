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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.getParentAccount = exports.isSubAccount = exports.isChildAccount = exports.isTokenAccount = exports.isAccount = exports.findTokenAccountByCurrency = exports.withoutToken = exports.accountWithMandatoryTokens = exports.makeEmptyTokenAccount = exports.isUpToDateAccount = exports.isAccountBalanceUnconfirmed = exports.shortAddressPreview = exports.flattenAccounts = exports.listSubAccounts = exports.findSubAccountById = exports.clearAccount = exports.isAccountBalanceSignificant = exports.areAllOperationsLoaded = exports.isAccountEmpty = exports.getAccountSpendableBalance = exports.getAccountName = exports.getAccountUnit = exports.getAccountCurrency = exports.getMainAccount = void 0;
var bignumber_js_1 = require("bignumber.js");
var invariant_1 = __importDefault(require("invariant"));
var env_1 = require("../env");
var accountId_1 = require("./accountId");
var balanceHistoryCache_1 = require("./balanceHistoryCache");
// by convention, a main account is the top level account
// in case of an Account is the account itself
// in case of a TokenAccount it's the parentAccount
var getMainAccount = function (account, parentAccount) {
    var mainAccount = account.type === "Account" ? account : parentAccount;
    (0, invariant_1["default"])(mainAccount, "an account is expected");
    return mainAccount;
};
exports.getMainAccount = getMainAccount;
var getAccountCurrency = function (account) {
    switch (account === null || account === void 0 ? void 0 : account.type) {
        case "Account":
        case "ChildAccount":
            return account.currency;
        case "TokenAccount":
            return account.token;
        default:
            throw new Error("invalid account.type=" + (account === null || account === void 0 ? void 0 : account.type));
    }
};
exports.getAccountCurrency = getAccountCurrency;
var getAccountUnit = function (account) {
    switch (account.type) {
        case "Account":
            return account.unit;
        case "TokenAccount":
            return account.token.units[0];
        case "ChildAccount":
            return account.currency.units[0];
        default:
            throw new Error("invalid account.type=" + account.type);
    }
};
exports.getAccountUnit = getAccountUnit;
var getAccountName = function (account) {
    switch (account.type) {
        case "Account":
        case "ChildAccount":
            return account.name;
        case "TokenAccount":
            return account.token.name;
        default:
            throw new Error("invalid account.type=" + account.type);
    }
};
exports.getAccountName = getAccountName;
var getAccountSpendableBalance = function (account) {
    switch (account.type) {
        case "Account":
        case "TokenAccount":
            return account.spendableBalance;
        case "ChildAccount":
            return account.balance;
        default:
            throw new Error("invalid account.type=" + account.type);
    }
};
exports.getAccountSpendableBalance = getAccountSpendableBalance;
var isAccountEmpty = function (a) {
    // STP: to fix
    // if (a.type === "Account" && a.currency.family === "tron") {
    //   const tronAcc = a as TronAccount;
    //   // FIXME: here we compared a BigNumber to a number, would always return false
    //   return (
    //     tronAcc.tronResources && tronAcc.tronResources.bandwidth.freeLimit.eq(0)
    //   );
    // }
    var hasSubAccounts = a.type === "Account" && a.subAccounts && a.subAccounts.length;
    return a.operationsCount === 0 && a.balance.isZero() && !hasSubAccounts;
};
exports.isAccountEmpty = isAccountEmpty;
function areAllOperationsLoaded(account) {
    if (account.operationsCount !== account.operations.length) {
        return false;
    }
    if (account.type === "Account" && account.subAccounts) {
        return account.subAccounts.every(areAllOperationsLoaded);
    }
    return true;
}
exports.areAllOperationsLoaded = areAllOperationsLoaded;
var isAccountBalanceSignificant = function (a) {
    return a.balance.gt(100);
};
exports.isAccountBalanceSignificant = isAccountBalanceSignificant;
// in future, could be a per currency thing
// clear account to a bare minimal version that can be restored via sync
// will preserve the balance to avoid user panic
function clearAccount(account) {
    var _a;
    if (account.type === "TokenAccount") {
        return __assign(__assign({}, account), { balanceHistoryCache: balanceHistoryCache_1.emptyHistoryCache, operations: [], pendingOperations: [] });
    }
    if (account.type === "ChildAccount") {
        return __assign(__assign({}, account), { balanceHistoryCache: balanceHistoryCache_1.emptyHistoryCache, operations: [], pendingOperations: [] });
    }
    var copy = __assign(__assign({}, account), { balanceHistoryCache: balanceHistoryCache_1.emptyHistoryCache, lastSyncDate: new Date(0), operations: [], pendingOperations: [], subAccounts: account.subAccounts &&
            ((_a = account.subAccounts) === null || _a === void 0 ? void 0 : _a.map(clearAccount)) });
    // STP: to fix
    // if (copy.currency.family === "tron") {
    //   const tronAcc = copy as TronAccount;
    //   tronAcc.tronResources = {
    //     ...tronAcc.tronResources,
    //     cacheTransactionInfoById: {},
    //   };
    // }
    // if (copy.currency.family === "bitcoin") {
    //   (copy as BitcoinAccount).bitcoinResources = initialBitcoinResourcesValue;
    // }
    delete copy.nfts;
    return copy;
}
exports.clearAccount = clearAccount;
function findSubAccountById(account, id) {
    return (account.subAccounts || []).find(function (a) { return a.id === id; });
}
exports.findSubAccountById = findSubAccountById;
// get the token accounts of an account, ignoring those that are zero IF user don't want them
function listSubAccounts(account) {
    var accounts = account.subAccounts || [];
    if ((0, env_1.getEnv)("HIDE_EMPTY_TOKEN_ACCOUNTS")) {
        return accounts.filter(function (a) { return !a.balance.isZero(); });
    }
    return accounts;
}
exports.listSubAccounts = listSubAccounts;
function flattenAccounts(topAccounts, o) {
    if (o === void 0) { o = {}; }
    var accounts = [];
    for (var i = 0; i < topAccounts.length; i++) {
        var account = topAccounts[i];
        accounts.push(account);
        if (account.type === "Account") {
            var subAccounts = o.enforceHideEmptySubAccounts
                ? listSubAccounts(account)
                : account.subAccounts || [];
            for (var j = 0; j < subAccounts.length; j++) {
                accounts.push(subAccounts[j]);
            }
        }
    }
    return accounts;
}
exports.flattenAccounts = flattenAccounts;
var shortAddressPreview = function (addr, target) {
    if (target === void 0) { target = 20; }
    var slice = Math.floor((target - 3) / 2);
    return addr.length < target - 3
        ? addr
        : "".concat(addr.slice(0, slice), "...").concat(addr.slice(addr.length - slice));
};
exports.shortAddressPreview = shortAddressPreview;
var isAccountBalanceUnconfirmed = function (account) {
    return account.pendingOperations.some(function (op) { return !account.operations.find(function (o) { return o.hash === op.hash; }); }) || account.operations.some(function (op) { return !op.blockHeight; });
};
exports.isAccountBalanceUnconfirmed = isAccountBalanceUnconfirmed;
var isUpToDateAccount = function (account) {
    if (!account)
        return true;
    var lastSyncDate = account.lastSyncDate, currency = account.currency;
    var blockAvgTime = currency.blockAvgTime;
    if (!blockAvgTime)
        return true;
    var outdated = 
    // FIXME: same here, we need to use valueOf for typescript to compare dates
    Date.now().valueOf() - (lastSyncDate.valueOf() || 0) >
        blockAvgTime * 1000 + (0, env_1.getEnv)("SYNC_OUTDATED_CONSIDERED_DELAY");
    return !outdated;
};
exports.isUpToDateAccount = isUpToDateAccount;
var makeEmptyTokenAccount = function (account, token) { return ({
    type: "TokenAccount",
    id: account.id + "+" + token.contractAddress,
    parentId: account.id,
    token: token,
    balance: new bignumber_js_1.BigNumber(0),
    spendableBalance: new bignumber_js_1.BigNumber(0),
    operationsCount: 0,
    creationDate: new Date(),
    operations: [],
    pendingOperations: [],
    starred: false,
    swapHistory: [],
    balanceHistoryCache: balanceHistoryCache_1.emptyHistoryCache
}); };
exports.makeEmptyTokenAccount = makeEmptyTokenAccount;
/**
 * Enhance an account to force token accounts presence
 */
var accountWithMandatoryTokens = function (account, tokenCurrencies) {
    var subAccounts = account.subAccounts;
    if (!subAccounts)
        return account;
    var existingTokens = subAccounts
        .map(function (a) { return a.type === "TokenAccount" && a.token; })
        .filter(Boolean);
    var addition = tokenCurrencies
        .filter(function (t // token of the same currency
    ) { return t.parentCurrency === account.currency && !existingTokens.includes(t); } // not yet in the sub accounts
    )
        .map(function (token) { return ({
        type: "TokenAccount",
        id: (0, accountId_1.encodeTokenAccountId)(account.id, token),
        parentId: account.id,
        token: token,
        balance: new bignumber_js_1.BigNumber(0),
        spendableBalance: new bignumber_js_1.BigNumber(0),
        operationsCount: 0,
        creationDate: new Date(),
        operations: [],
        pendingOperations: [],
        starred: false,
        swapHistory: [],
        balanceHistoryCache: balanceHistoryCache_1.emptyHistoryCache
    }); });
    if (addition.length === 0)
        return account;
    return __assign(__assign({}, account), { subAccounts: subAccounts.concat(addition) });
};
exports.accountWithMandatoryTokens = accountWithMandatoryTokens;
/**
 * Patch account to enforce the removal of a blacklisted token
 */
var withoutToken = function (account, tokenId) {
    var subAccounts = account.subAccounts;
    if (!subAccounts)
        return account;
    var tokenAccount = subAccounts.find(function (a) { return a.type === "TokenAccount" && a.token.id === tokenId; });
    if (!tokenAccount)
        return account;
    return __assign(__assign({}, account), { subAccounts: subAccounts.filter(function (sa) { return sa.id !== tokenAccount.id; }) });
};
exports.withoutToken = withoutToken;
/**
 * Find matching pair of subAccount/parentAccount for a given token curency
 * if no subAccount found will return parentAccount or null if no matches found
 */
var findTokenAccountByCurrency = function (tokenCurrency, accounts) {
    var e_1, _a, e_2, _b;
    var parentCurrency = tokenCurrency.parentCurrency;
    try {
        for (var accounts_1 = __values(accounts), accounts_1_1 = accounts_1.next(); !accounts_1_1.done; accounts_1_1 = accounts_1.next()) {
            var parentAccount = accounts_1_1.value;
            if (parentAccount.subAccounts && parentAccount.subAccounts.length > 0) {
                try {
                    for (var _c = (e_2 = void 0, __values(parentAccount.subAccounts)), _d = _c.next(); !_d.done; _d = _c.next()) {
                        var account = _d.value;
                        var c = (0, exports.getAccountCurrency)(account);
                        if (c.id === tokenCurrency.id) {
                            // if token currency matches subAccount return couple account/parentAccount
                            return {
                                account: account,
                                parentAccount: parentAccount
                            };
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_b = _c["return"])) _b.call(_c);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
            var parentC = (0, exports.getAccountCurrency)(parentAccount);
            if (parentC.id === parentCurrency.id) {
                // if no token currency matches but parent matches return parentAccount
                return {
                    parentAccount: parentAccount
                };
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (accounts_1_1 && !accounts_1_1.done && (_a = accounts_1["return"])) _a.call(accounts_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return null; // else return nothing
};
exports.findTokenAccountByCurrency = findTokenAccountByCurrency;
function isAccount(account) {
    return (account === null || account === void 0 ? void 0 : account.type) === "Account";
}
exports.isAccount = isAccount;
function isTokenAccount(account) {
    return (account === null || account === void 0 ? void 0 : account.type) === "TokenAccount";
}
exports.isTokenAccount = isTokenAccount;
function isChildAccount(account) {
    return (account === null || account === void 0 ? void 0 : account.type) === "ChildAccount";
}
exports.isChildAccount = isChildAccount;
function isSubAccount(account) {
    return isTokenAccount(account) || isChildAccount(account);
}
exports.isSubAccount = isSubAccount;
function getParentAccount(account, accounts) {
    switch (account.type) {
        case "Account":
            return account;
        case "TokenAccount":
        case "ChildAccount": {
            var parentAccount = accounts.find(function (a) { return a.id == account.parentId; });
            if (!parentAccount) {
                throw new Error("No 'parentAccount' account provided for token account");
            }
            return parentAccount;
        }
    }
}
exports.getParentAccount = getParentAccount;
//# sourceMappingURL=helpers.js.map