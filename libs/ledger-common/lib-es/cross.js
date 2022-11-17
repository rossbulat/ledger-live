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
// cross helps dealing with cross-project feature like export/import & cross project conversions
import { BigNumber } from "bignumber.js";
import compressjs from "@ledgerhq/compressjs";
import { runDerivationScheme, getDerivationScheme, asDerivationMode, } from "./derivation";
import { decodeAccountId, emptyHistoryCache } from "./account";
import { getCryptoCurrencyById } from "./currencies";
export function encode(_a) {
    var accounts = _a.accounts, settings = _a.settings, exporterName = _a.exporterName, exporterVersion = _a.exporterVersion;
    return Buffer.from(compressjs.Bzip2.compressFile(Buffer.from(JSON.stringify({
        meta: {
            exporterName: exporterName,
            exporterVersion: exporterVersion
        },
        accounts: accounts.map(accountToAccountData),
        settings: settings
    })))).toString("binary");
}
var asResultMeta = function (unsafe) {
    if (typeof unsafe !== "object" || !unsafe) {
        throw new Error("invalid meta data");
    }
    var exporterName = unsafe.exporterName, exporterVersion = unsafe.exporterVersion;
    if (typeof exporterName !== "string") {
        throw new Error("invalid meta.exporterName");
    }
    if (typeof exporterVersion !== "string") {
        throw new Error("invalid meta.exporterVersion");
    }
    return {
        exporterName: exporterName,
        exporterVersion: exporterVersion
    };
};
var asResultAccount = function (unsafe) {
    if (typeof unsafe !== "object" || !unsafe) {
        throw new Error("invalid account data");
    }
    var id = unsafe.id, currencyId = unsafe.currencyId, freshAddress = unsafe.freshAddress, seedIdentifier = unsafe.seedIdentifier, derivationMode = unsafe.derivationMode, name = unsafe.name, index = unsafe.index, balance = unsafe.balance;
    if (typeof id !== "string") {
        throw new Error("invalid account.id");
    }
    if (typeof currencyId !== "string") {
        throw new Error("invalid account.currencyId");
    }
    if (typeof seedIdentifier !== "string") {
        throw new Error("invalid account.seedIdentifier");
    }
    if (typeof derivationMode !== "string") {
        throw new Error("invalid account.derivationMode");
    }
    if (typeof name !== "string") {
        throw new Error("invalid account.name");
    }
    if (typeof index !== "number") {
        throw new Error("invalid account.index");
    }
    if (typeof balance !== "string") {
        throw new Error("invalid account.balance");
    }
    var o = {
        id: id,
        currencyId: currencyId,
        seedIdentifier: seedIdentifier,
        derivationMode: derivationMode,
        name: name,
        index: index,
        balance: balance
    };
    if (typeof freshAddress === "string" && freshAddress) {
        o.freshAddress = freshAddress;
    }
    return o;
};
var asResultAccounts = function (unsafe) {
    if (typeof unsafe !== "object" || !unsafe || !Array.isArray(unsafe)) {
        throw new Error("invalid accounts data");
    }
    return unsafe.map(asResultAccount);
};
var asCryptoSettings = function (unsafe) {
    if (typeof unsafe !== "object" || !unsafe) {
        throw new Error("invalid currency settings data");
    }
    var confirmationsNb = unsafe.confirmationsNb;
    if (typeof confirmationsNb === "number") {
        return {
            confirmationsNb: confirmationsNb
        };
    }
    return {};
};
var asResultSettings = function (unsafe) {
    var e_1, _a;
    if (typeof unsafe !== "object" || !unsafe) {
        throw new Error("invalid settings data");
    }
    var counterValue = unsafe.counterValue, currenciesSettings = unsafe.currenciesSettings, pairExchanges = unsafe.pairExchanges, blacklistedTokenIds = unsafe.blacklistedTokenIds, hideEmptyTokenAccounts = unsafe.hideEmptyTokenAccounts;
    var currenciesSettingsSafe = {};
    if (currenciesSettings && typeof currenciesSettings === "object") {
        for (var k in currenciesSettings) {
            currenciesSettingsSafe[k] = asCryptoSettings(currenciesSettings[k]);
        }
    }
    var pairExchangesSafe = {};
    if (pairExchanges && typeof pairExchanges === "object") {
        for (var k in pairExchanges) {
            var v = pairExchanges[k];
            if (v && typeof v === "string") {
                pairExchangesSafe[k] = v;
            }
        }
    }
    var res = {
        currenciesSettings: currenciesSettingsSafe,
        pairExchanges: pairExchangesSafe
    };
    if (counterValue && typeof counterValue === "string") {
        res.counterValue = counterValue;
    }
    if (hideEmptyTokenAccounts && typeof hideEmptyTokenAccounts === "boolean") {
        res.hideEmptyTokenAccounts = hideEmptyTokenAccounts;
    }
    var blacklistedTokenIdsSafe = [];
    if (blacklistedTokenIds && Array.isArray(blacklistedTokenIds)) {
        try {
            for (var blacklistedTokenIds_1 = __values(blacklistedTokenIds), blacklistedTokenIds_1_1 = blacklistedTokenIds_1.next(); !blacklistedTokenIds_1_1.done; blacklistedTokenIds_1_1 = blacklistedTokenIds_1.next()) {
                var b = blacklistedTokenIds_1_1.value;
                if (typeof b === "string") {
                    blacklistedTokenIdsSafe.push(b);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (blacklistedTokenIds_1_1 && !blacklistedTokenIds_1_1.done && (_a = blacklistedTokenIds_1["return"])) _a.call(blacklistedTokenIds_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        res.blacklistedTokenIds = blacklistedTokenIdsSafe;
    }
    return res;
};
export function decode(bytes) {
    var unsafe = JSON.parse(Buffer.from(compressjs.Bzip2.decompressFile(Buffer.from(bytes, "binary"))).toString());
    if (typeof unsafe !== "object" || !unsafe) {
        throw new Error("invalid data");
    }
    return {
        meta: asResultMeta(unsafe.meta),
        accounts: asResultAccounts(unsafe.accounts),
        settings: asResultSettings(unsafe.settings)
    };
}
export function accountToAccountData(_a) {
    var id = _a.id, name = _a.name, seedIdentifier = _a.seedIdentifier, derivationMode = _a.derivationMode, freshAddress = _a.freshAddress, currency = _a.currency, index = _a.index, balance = _a.balance;
    var res = {
        id: id,
        name: name,
        seedIdentifier: seedIdentifier,
        derivationMode: derivationMode,
        freshAddress: freshAddress,
        currencyId: currency.id,
        index: index,
        balance: balance.toString()
    };
    return res;
}
// reverse the account data to an account.
// this restore the essential data of an account and the result of the fields
// are assumed to be restored during first sync
export var accountDataToAccount = function (_a) {
    var id = _a.id, currencyId = _a.currencyId, inputFreshAddress = _a.freshAddress, name = _a.name, index = _a.index, balance = _a.balance, derivationModeStr = _a.derivationMode, seedIdentifier = _a.seedIdentifier;
    var xpubOrAddress = decodeAccountId(id).xpubOrAddress; // TODO rename in AccountId xpubOrAddress
    var derivationMode = asDerivationMode(derivationModeStr);
    var currency = getCryptoCurrencyById(currencyId);
    var xpub = "";
    var freshAddress = inputFreshAddress || "";
    var freshAddressPath = "";
    if (
    // FIXME Dirty hack, since we have no way here to know if "xpubOrAddress" is one or the other.
    // Proposed fix: https://ledgerhq.atlassian.net/browse/LL-7437
    currency.family === "bitcoin" ||
        currency.family === "cardano") {
        // In bitcoin implementation, xpubOrAddress field always go in the xpub
        xpub = xpubOrAddress;
    }
    else {
        if (currency.family === "tezos") {
            xpub = xpubOrAddress;
        }
        else if (!freshAddress) {
            // otherwise, it's the freshAddress
            freshAddress = xpubOrAddress;
        }
        freshAddressPath = runDerivationScheme(getDerivationScheme({
            currency: currency,
            derivationMode: derivationMode
        }), currency, {
            account: index
        });
    }
    var balanceBN = new BigNumber(balance);
    var account = {
        type: "Account",
        id: id,
        derivationMode: derivationMode,
        seedIdentifier: seedIdentifier,
        xpub: xpub,
        name: name,
        starred: false,
        used: false,
        currency: currency,
        index: index,
        freshAddress: freshAddress,
        freshAddressPath: freshAddressPath,
        swapHistory: [],
        // these fields will be completed as we will sync
        freshAddresses: [],
        blockHeight: 0,
        balance: balanceBN,
        spendableBalance: balanceBN,
        operationsCount: 0,
        operations: [],
        pendingOperations: [],
        unit: currency.units[0],
        lastSyncDate: new Date(0),
        creationDate: new Date(),
        balanceHistoryCache: emptyHistoryCache
    };
    return account;
};
//# sourceMappingURL=cross.js.map