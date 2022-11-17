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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.addAccounts = exports.migrateAccounts = exports.groupAddAccounts = void 0;
var uniqWith_1 = __importDefault(require("lodash/uniqWith"));
var accountName_1 = require("./accountName");
var helpers_1 = require("./helpers");
var support_1 = require("./support");
function sameAccountIdentity(a, b) {
    return (a.id === b.id ||
        (a.freshAddress
            ? a.currency === b.currency && a.freshAddress === b.freshAddress
            : false) ||
        (a.xpub ? a.currency === b.currency && a.xpub === b.xpub : false));
}
/**
 * logic that for the Add Accounts sectioned list
 */
function groupAddAccounts(existingAccounts, scannedAccounts, context) {
    var importedAccounts = [];
    var importableAccounts = [];
    var creatableAccounts = [];
    var migrateAccounts = [];
    var alreadyEmptyAccount;
    var scannedAccountsWithoutMigrate = __spreadArray([], __read(scannedAccounts), false);
    existingAccounts.forEach(function (existingAccount) {
        var migrate = (0, support_1.findAccountMigration)(existingAccount, scannedAccountsWithoutMigrate);
        if (migrate) {
            migrateAccounts.push(__assign(__assign({}, migrate), { name: existingAccount.name }));
            var index = scannedAccountsWithoutMigrate.indexOf(migrate);
            if (index !== -1) {
                scannedAccountsWithoutMigrate[index] =
                    scannedAccountsWithoutMigrate[scannedAccountsWithoutMigrate.length - 1];
                scannedAccountsWithoutMigrate.pop();
            }
        }
    });
    scannedAccountsWithoutMigrate.forEach(function (acc) {
        var existingAccount = existingAccounts.find(function (a) {
            return sameAccountIdentity(a, acc);
        });
        if (existingAccount) {
            if (!acc.used && !alreadyEmptyAccount) {
                alreadyEmptyAccount = existingAccount;
            }
            importedAccounts.push(existingAccount);
        }
        else if (!acc.used) {
            creatableAccounts.push(acc);
        }
        else {
            importableAccounts.push(acc);
        }
    });
    var sections = [];
    if (importableAccounts.length) {
        sections.push({
            id: "importable",
            selectable: true,
            defaultSelected: true,
            data: importableAccounts
        });
    }
    if (migrateAccounts.length) {
        sections.push({
            id: "migrate",
            selectable: true,
            defaultSelected: true,
            data: migrateAccounts
        });
    }
    if (!context.scanning || creatableAccounts.length) {
        // NB if data is empty, need to do custom placeholder that depends on alreadyEmptyAccount
        sections.push({
            id: "creatable",
            selectable: true,
            defaultSelected: false,
            data: context.preferredNewAccountSchemes &&
                context.preferredNewAccountSchemes.length > 0
                ? creatableAccounts.filter(function (a) {
                    return context.preferredNewAccountSchemes &&
                        // Note: we could use a simple preferredNewAccountScheme param
                        a.derivationMode === context.preferredNewAccountSchemes[0];
                })
                : creatableAccounts
        });
    }
    if (importedAccounts.length) {
        sections.push({
            id: "imported",
            selectable: false,
            defaultSelected: false,
            data: importedAccounts
        });
    }
    return {
        sections: sections,
        alreadyEmptyAccount: alreadyEmptyAccount
    };
}
exports.groupAddAccounts = groupAddAccounts;
var preserveUserData = function (update, existing) { return (__assign(__assign({}, update), { name: existing.name })); };
function migrateAccounts(_a) {
    var scannedAccounts = _a.scannedAccounts, existingAccounts = _a.existingAccounts;
    // subset of scannedAccounts that exists to not add them but just do migration part
    var subset = [];
    existingAccounts.forEach(function (existing) {
        var migration = (0, support_1.findAccountMigration)(existing, scannedAccounts);
        if (migration && !subset.some(function (a) { return a.id === migration.id; })) {
            subset.push(migration);
        }
    });
    return addAccounts({
        scannedAccounts: subset,
        existingAccounts: existingAccounts,
        selectedIds: subset.map(function (a) { return a.id; }),
        renamings: {}
    });
}
exports.migrateAccounts = migrateAccounts;
function addAccounts(_a) {
    var scannedAccounts = _a.scannedAccounts, existingAccounts = _a.existingAccounts, selectedIds = _a.selectedIds, renamings = _a.renamings;
    var newAccounts = [];
    // scanned accounts that was selected
    var selected = scannedAccounts.filter(function (a) { return selectedIds.includes(a.id); });
    // we'll search for potential migration and append to newAccounts
    existingAccounts.forEach(function (existing) {
        var migration = (0, support_1.findAccountMigration)(existing, selected);
        if (migration) {
            if (!newAccounts.some(function (a) { return a.id === migration.id; })) {
                newAccounts.push(preserveUserData(migration, existing));
                var index = selected.indexOf(migration);
                if (index !== -1) {
                    selected[index] = selected[selected.length - 1];
                    selected.pop();
                }
            }
        }
        else {
            // we'll try to find an updated version of the existing account as opportunity to refresh the operations
            var update = selected.find(function (a) { return sameAccountIdentity(a, existing); });
            if (update) {
                // preserve existing name
                var acc = preserveUserData(update, existing);
                if (update.id !== existing.id) {
                    acc = (0, helpers_1.clearAccount)(acc);
                }
                newAccounts.push(acc);
            }
            else {
                newAccounts.push(existing);
            }
        }
    });
    // append the new accounts
    selected.forEach(function (acc) {
        var alreadyThere = newAccounts.find(function (a) { return sameAccountIdentity(a, acc); });
        if (!alreadyThere) {
            newAccounts.push(acc);
        }
    });
    // dedup and apply the renaming
    return (0, uniqWith_1["default"])(newAccounts, sameAccountIdentity).map(function (a) {
        var name = (0, accountName_1.validateNameEdition)(a, renamings[a.id]);
        if (name)
            return __assign(__assign({}, a), { name: name });
        return a;
    });
}
exports.addAccounts = addAccounts;
//# sourceMappingURL=addAccounts.js.map