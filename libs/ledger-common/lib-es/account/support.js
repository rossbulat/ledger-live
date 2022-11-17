import { AccountNotSupported, CurrencyNotSupported, UnavailableTezosOriginatedAccountReceive, } from "@ledgerhq/errors";
import { getEnv } from "../env";
import { decodeAccountId } from "./accountId";
import { getAllDerivationModes, getDerivationModesForCurrency, } from "../derivation";
import { isCurrencySupported } from "../currencies";
export var shouldShowNewAccount = function (currency, derivationMode) {
    var modes = getDerivationModesForCurrency(currency);
    // last mode is always creatable by convention
    if (modes[modes.length - 1] === derivationMode)
        return true;
    // legacy is only available with flag SHOW_LEGACY_NEW_ACCOUNT
    if (derivationMode === "" &&
        (!!getEnv("SHOW_LEGACY_NEW_ACCOUNT") || currency.family === "bitcoin"))
        return true;
    // native segwit being not yet supported everywhere, segwit is always available for creation
    if (derivationMode === "segwit" ||
        (currency.family === "bitcoin" &&
            (derivationMode === "native_segwit" || derivationMode === "taproot")))
        return true;
    return false;
};
export var getReceiveFlowError = function (account, parentAccount) {
    if (parentAccount && parentAccount.currency.id === "tezos") {
        return new UnavailableTezosOriginatedAccountReceive("");
    }
};
export function canBeMigrated(account) {
    try {
        var version = decodeAccountId(account.id).version;
        if (getEnv("MOCK")) {
            return version === "0";
        }
        return false;
    }
    catch (e) {
        return false;
    }
}
// attempt to find an account in scanned accounts that satisfy a migration
export function findAccountMigration(account, scannedAccounts) {
    if (!canBeMigrated(account))
        return;
    if (getEnv("MOCK")) {
        return scannedAccounts.find(function (a) {
            return a.id !== account.id && // a migration assume an id changes
                a.currency === account.currency &&
                a.freshAddress === account.freshAddress;
        });
    }
}
export function checkAccountSupported(account) {
    if (!getAllDerivationModes().includes(account.derivationMode)) {
        return new AccountNotSupported("derivation not supported " + account.derivationMode, {
            reason: account.derivationMode
        });
    }
    if (!isCurrencySupported(account.currency)) {
        var currencyName = account.currency.name;
        return new CurrencyNotSupported("currency not supported: " + currencyName, {
            currencyName: currencyName
        });
    }
}
//# sourceMappingURL=support.js.map