"use strict";
exports.__esModule = true;
exports.checkAccountSupported = exports.findAccountMigration = exports.canBeMigrated = exports.getReceiveFlowError = exports.shouldShowNewAccount = void 0;
var errors_1 = require("@ledgerhq/errors");
var env_1 = require("../env");
var accountId_1 = require("./accountId");
var derivation_1 = require("../derivation");
var currencies_1 = require("../currencies");
var shouldShowNewAccount = function (currency, derivationMode) {
    var modes = (0, derivation_1.getDerivationModesForCurrency)(currency);
    // last mode is always creatable by convention
    if (modes[modes.length - 1] === derivationMode)
        return true;
    // legacy is only available with flag SHOW_LEGACY_NEW_ACCOUNT
    if (derivationMode === "" &&
        (!!(0, env_1.getEnv)("SHOW_LEGACY_NEW_ACCOUNT") || currency.family === "bitcoin"))
        return true;
    // native segwit being not yet supported everywhere, segwit is always available for creation
    if (derivationMode === "segwit" ||
        (currency.family === "bitcoin" &&
            (derivationMode === "native_segwit" || derivationMode === "taproot")))
        return true;
    return false;
};
exports.shouldShowNewAccount = shouldShowNewAccount;
var getReceiveFlowError = function (account, parentAccount) {
    if (parentAccount && parentAccount.currency.id === "tezos") {
        return new errors_1.UnavailableTezosOriginatedAccountReceive("");
    }
};
exports.getReceiveFlowError = getReceiveFlowError;
function canBeMigrated(account) {
    try {
        var version = (0, accountId_1.decodeAccountId)(account.id).version;
        if ((0, env_1.getEnv)("MOCK")) {
            return version === "0";
        }
        return false;
    }
    catch (e) {
        return false;
    }
}
exports.canBeMigrated = canBeMigrated;
// attempt to find an account in scanned accounts that satisfy a migration
function findAccountMigration(account, scannedAccounts) {
    if (!canBeMigrated(account))
        return;
    if ((0, env_1.getEnv)("MOCK")) {
        return scannedAccounts.find(function (a) {
            return a.id !== account.id && // a migration assume an id changes
                a.currency === account.currency &&
                a.freshAddress === account.freshAddress;
        });
    }
}
exports.findAccountMigration = findAccountMigration;
function checkAccountSupported(account) {
    if (!(0, derivation_1.getAllDerivationModes)().includes(account.derivationMode)) {
        return new errors_1.AccountNotSupported("derivation not supported " + account.derivationMode, {
            reason: account.derivationMode
        });
    }
    if (!(0, currencies_1.isCurrencySupported)(account.currency)) {
        var currencyName = account.currency.name;
        return new errors_1.CurrencyNotSupported("currency not supported: " + currencyName, {
            currencyName: currencyName
        });
    }
}
exports.checkAccountSupported = checkAccountSupported;
//# sourceMappingURL=support.js.map