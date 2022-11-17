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
import { defer, of, range, empty } from "rxjs";
import { catchError, switchMap, concatMap, takeWhile, map, } from "rxjs/operators";
import { log } from "@ledgerhq/logs";
import { TransportStatusError, UserRefusedAddress } from "@ledgerhq/errors";
import { getCryptoCurrencyById } from "./currencies";
import { getEnv } from "./env";
var modes = Object.freeze({
    // this is "default" by convention
    "": {},
    // MEW legacy derivation
    ethM: {
        mandatoryEmptyAccountSkip: 10,
        overridesDerivation: "44'/60'/0'/<account>",
        tag: "legacy"
    },
    // MetaMask style
    ethMM: {
        overridesDerivation: "44'/60'/0'/0/<account>",
        skipFirst: true,
        // already included in the normal bip44,
        tag: "metamask"
    },
    // Deprecated and should no longer be used.
    bch_on_bitcoin_segwit: {
        overridesCoinType: 0,
        isInvalid: true,
        isSegwit: true,
        purpose: 49,
        addressFormat: "p2sh"
    },
    // many users have wrongly sent BTC on BCH paths
    legacy_on_bch: {
        overridesCoinType: 145,
        isInvalid: true
    },
    // chrome app and LL wrongly used to derivate vertcoin on 128
    vertcoin_128: {
        tag: "legacy",
        overridesCoinType: 128
    },
    vertcoin_128_segwit: {
        tag: "legacy",
        overridesCoinType: 128,
        isSegwit: true,
        purpose: 49,
        addressFormat: "p2sh"
    },
    // MEW legacy derivation for eth
    etcM: {
        mandatoryEmptyAccountSkip: 10,
        overridesDerivation: "44'/60'/160720'/0'/<account>",
        tag: "legacy"
    },
    aeternity: {
        overridesDerivation: "<account>"
    },
    // default derivation of tezbox offerred to users
    tezbox: {
        overridesDerivation: "44'/1729'/<account>'/0'"
    },
    tezosbip44h: {
        tag: "galleon",
        overridesDerivation: "44'/1729'/<account>'/0'/0'"
    },
    galleonL: {
        tag: "legacy",
        startsAt: 1,
        overridesDerivation: "44'/1729'/0'/0'/<account>'"
    },
    tezboxL: {
        tag: "legacy",
        startsAt: 1,
        overridesDerivation: "44'/1729'/0'/<account>'"
    },
    taproot: {
        purpose: 86,
        addressFormat: "bech32m",
        tag: "taproot",
        isSegwit: true,
        isTaproot: true
    },
    native_segwit: {
        purpose: 84,
        addressFormat: "bech32",
        tag: "native segwit",
        isSegwit: true,
        isNativeSegwit: true
    },
    segwit: {
        isSegwit: true,
        purpose: 49,
        tag: "segwit",
        addressFormat: "p2sh"
    },
    segwit_on_legacy: {
        isSegwit: true,
        purpose: 44,
        addressFormat: "p2sh",
        isInvalid: true
    },
    legacy_on_segwit: {
        purpose: 49,
        isInvalid: true
    },
    legacy_on_native_segwit: {
        purpose: 84,
        isInvalid: true
    },
    segwit_unsplit: {
        isSegwit: true,
        purpose: 49,
        addressFormat: "p2sh",
        isUnsplit: true,
        tag: "segwit unsplit"
    },
    sep5: {
        overridesDerivation: "44'/148'/<account>'"
    },
    unsplit: {
        isUnsplit: true,
        tag: "unsplit"
    },
    polkadotbip44: {
        overridesDerivation: "44'/354'/<account>'/0'/<address>'"
    },
    gliflegacy: {
        overridesDerivation: "44'/1'/0'/0/<account>",
        tag: "legacy"
    },
    glif: {
        overridesDerivation: "44'/461'/0'/0/<account>",
        startsAt: 1,
        tag: "third-party"
    },
    solanaMain: {
        isNonIterable: true,
        overridesDerivation: "44'/501'"
    },
    solanaSub: {
        overridesDerivation: "44'/501'/<account>'"
    },
    hederaBip44: {
        overridesDerivation: "44/3030"
    },
    cardano: {
        purpose: 1852,
        overridesDerivation: "1852'/1815'/<account>'/<node>/<address>"
    }
});
modes; // eslint-disable-line
// FIXME: CryptoCurrencyConfig was a flowtype we could not easily convert to ts so it has been deleted
// previous types: Partial<CryptoCurrencyConfig<DerivationMode[]>>
var legacyDerivations = {
    aeternity: ["aeternity"],
    bitcoin_cash: [],
    bitcoin: ["legacy_on_bch"],
    vertcoin: ["vertcoin_128", "vertcoin_128_segwit"],
    ethereum_classic: ["etcM"],
    tezos: ["galleonL", "tezboxL", "tezosbip44h", "tezbox"],
    stellar: ["sep5"],
    polkadot: ["polkadotbip44"],
    hedera: ["hederaBip44"],
    filecoin: ["gliflegacy", "glif"],
    cardano: ["cardano"],
    cardano_testnet: ["cardano"]
};
var legacyDerivationsPerFamily = {
    ethereum: ["ethM", "ethMM"]
};
export var asDerivationMode = function (derivationMode) {
    invariant(derivationMode in modes, "not a derivationMode. Got: '%s'", derivationMode);
    return derivationMode;
};
export var getAllDerivationModes = function () {
    return Object.keys(modes);
};
export var getMandatoryEmptyAccountSkip = function (derivationMode) {
    return modes[derivationMode]
        .mandatoryEmptyAccountSkip || 0;
};
export var isInvalidDerivationMode = function (derivationMode) {
    return modes[derivationMode].isInvalid || false;
};
export var isSegwitDerivationMode = function (derivationMode) {
    return modes[derivationMode].isSegwit || false;
};
export var isNativeSegwitDerivationMode = function (derivationMode) {
    return modes[derivationMode].isNativeSegwit ||
        false;
};
export var isTaprootDerivationMode = function (derivationMode) {
    return modes[derivationMode].isTaproot || false;
};
export var isUnsplitDerivationMode = function (derivationMode) {
    return modes[derivationMode].isUnsplit || false;
};
export var isIterableDerivationMode = function (derivationMode) {
    return !modes[derivationMode].isNonIterable;
};
export var getDerivationModeStartsAt = function (derivationMode) { return modes[derivationMode].startsAt || 0; };
export var getPurposeDerivationMode = function (derivationMode) { return modes[derivationMode].purpose || 44; };
export var getTagDerivationMode = function (currency, derivationMode) {
    var mode = modes[derivationMode];
    if (mode.tag) {
        return mode.tag;
    }
    if (mode.isInvalid) {
        return "custom";
    }
    if (currency.supportsSegwit && !isSegwitDerivationMode(derivationMode)) {
        return "legacy";
    }
    return null;
};
export var getAddressFormatDerivationMode = function (derivationMode) {
    return modes[derivationMode].addressFormat ||
        "legacy";
};
export var derivationModeSupportsIndex = function (derivationMode, index) {
    var mode = modes[derivationMode];
    if (mode.skipFirst && index === 0)
        return false;
    return true;
};
var currencyForceCoinType = {
    vertcoin: true
};
/**
 * return a ledger-lib-core compatible DerivationScheme format
 * for a given currency and derivationMode (you can pass an Account because same shape)
 */
export var getDerivationScheme = function (_a) {
    var derivationMode = _a.derivationMode, currency = _a.currency;
    var _b = modes[derivationMode], overridesDerivation = _b.overridesDerivation, overridesCoinType = _b.overridesCoinType;
    if (overridesDerivation)
        return overridesDerivation;
    var splitFrom = isUnsplitDerivationMode(derivationMode) && currency.forkedFrom;
    var coinType = splitFrom
        ? getCryptoCurrencyById(splitFrom).coinType
        : typeof overridesCoinType === "number"
            ? overridesCoinType
            : currencyForceCoinType
                ? currency.coinType
                : "<coin_type>";
    var purpose = getPurposeDerivationMode(derivationMode);
    return "".concat(purpose, "'/").concat(coinType, "'/<account>'/<node>/<address>");
};
// Execute a derivation scheme
export var runDerivationScheme = function (derivationScheme, _a, opts) {
    var coinType = _a.coinType;
    if (opts === void 0) { opts = {}; }
    return derivationScheme
        .replace("<coin_type>", String(coinType))
        .replace("<account>", String(opts.account || 0))
        .replace("<node>", String(opts.node || 0))
        .replace("<address>", String(opts.address || 0));
};
// execute the derivation on the account part of the scheme
export var runAccountDerivationScheme = function (scheme, currency, opts) {
    if (opts === void 0) { opts = {}; }
    return runDerivationScheme(scheme, currency, __assign(__assign({}, opts), { address: "_", node: "_" })).replace(/[_/]+$/, "");
};
var disableBIP44 = {
    aeternity: true,
    tezos: true,
    // current workaround, device app does not seem to support bip44
    stellar: true,
    polkadot: true,
    solana: true,
    hedera: true,
    cardano: true,
    cardano_testnet: true
};
var seedIdentifierPath = {
    neo: function (_a) {
        var purpose = _a.purpose, coinType = _a.coinType;
        return "".concat(purpose, "'/").concat(coinType, "'/0'/0/0");
    },
    filecoin: function (_a) {
        var purpose = _a.purpose, coinType = _a.coinType;
        return "".concat(purpose, "'/").concat(coinType, "'/0'/0/0");
    },
    solana: function (_a) {
        var purpose = _a.purpose, coinType = _a.coinType;
        return "".concat(purpose, "'/").concat(coinType, "'");
    },
    hedera: function (_a) {
        var purpose = _a.purpose, coinType = _a.coinType;
        return "".concat(purpose, "/").concat(coinType);
    },
    cardano: function (_a) {
        var purpose = _a.purpose, coinType = _a.coinType;
        return "".concat(purpose, "'/").concat(coinType, "'/0'/0/0");
    },
    cardano_testnet: function (_a) {
        var purpose = _a.purpose, coinType = _a.coinType;
        return "".concat(purpose, "'/").concat(coinType, "'/0'/0/0");
    },
    _: function (_a) {
        var purpose = _a.purpose, coinType = _a.coinType;
        return "".concat(purpose, "'/").concat(coinType, "'/0'");
    }
};
export var getSeedIdentifierDerivation = function (currency, derivationMode) {
    var unsplitFork = isUnsplitDerivationMode(derivationMode)
        ? currency.forkedFrom
        : null;
    var purpose = getPurposeDerivationMode(derivationMode);
    var coinType = (unsplitFork
        ? getCryptoCurrencyById(unsplitFork)
        : currency).coinType;
    var f = seedIdentifierPath[currency.id] || seedIdentifierPath._;
    return f({
        purpose: purpose,
        coinType: coinType
    });
};
// return an array of ways to derivate, by convention the latest is the standard one.
export var getDerivationModesForCurrency = function (currency) {
    var all = [];
    if (currency.family in legacyDerivationsPerFamily) {
        all = all.concat(legacyDerivationsPerFamily[currency.family]);
    }
    if (currency.id in legacyDerivations) {
        all = all.concat(legacyDerivations[currency.id]);
    }
    if (currency.forkedFrom) {
        all.push("unsplit");
        if (currency.supportsSegwit) {
            all.push("segwit_unsplit");
        }
    }
    if (currency.supportsSegwit) {
        all.push("segwit_on_legacy");
        all.push("legacy_on_segwit");
        all.push("legacy_on_native_segwit");
    }
    if (currency.supportsNativeSegwit) {
        all.push("native_segwit");
    }
    // taproot logic. FIXME should move per family
    if (currency.family === "bitcoin") {
        if (currency.id === "bitcoin" || currency.id === "bitcoin_testnet") {
            all.push("taproot");
        }
    }
    if (currency.supportsSegwit) {
        all.push("segwit");
    }
    if (!disableBIP44[currency.id]) {
        all.push("");
    }
    if (currency.family === "solana") {
        all.push("solanaMain", "solanaSub");
    }
    if (!getEnv("SCAN_FOR_INVALID_PATHS")) {
        return all.filter(function (a) { return !isInvalidDerivationMode(a); });
    }
    return all;
};
var preferredList = [
    "native_segwit",
    "taproot",
    "segwit",
    "",
];
// null => no settings
// [ .. ]
export var getPreferredNewAccountScheme = function (currency) {
    if (currency.family !== "bitcoin")
        return null;
    var derivationsModes = getDerivationModesForCurrency(currency);
    var list = preferredList.filter(function (p) {
        return derivationsModes.includes(p);
    });
    if (list.length === 1)
        return null;
    return list;
};
export var getDefaultPreferredNewAccountScheme = function (currency) {
    var list = getPreferredNewAccountScheme(currency);
    return list && list[0];
};
export function walletDerivation(_a) {
    var currency = _a.currency, derivationMode = _a.derivationMode, derivateAddress = _a.derivateAddress, stepAddress = _a.stepAddress, shouldDerivesOnAccount = _a.shouldDerivesOnAccount;
    var path = getSeedIdentifierDerivation(currency, derivationMode);
    return defer(function () {
        return derivateAddress({
            currency: currency,
            path: path,
            derivationMode: derivationMode
        }).pipe(catchError(function (e) {
            if (e instanceof TransportStatusError ||
                e instanceof UserRefusedAddress) {
                log("scanAccounts", "ignore derivationMode=" + derivationMode);
            }
            return empty();
        }));
    }).pipe(switchMap(function (parentDerivation) {
        var seedIdentifier = parentDerivation.publicKey;
        var emptyCount = 0;
        var mandatoryEmptyAccountSkip = getMandatoryEmptyAccountSkip(derivationMode);
        var derivationScheme = getDerivationScheme({
            derivationMode: derivationMode,
            currency: currency
        });
        var stopAt = isIterableDerivationMode(derivationMode) ? 255 : 1;
        var startsAt = getDerivationModeStartsAt(derivationMode);
        return range(startsAt, stopAt - startsAt).pipe(
        // derivate addresses/xpubs
        concatMap(function (index) {
            if (!derivationModeSupportsIndex(derivationMode, index)) {
                return empty();
            }
            var path = shouldDerivesOnAccount
                ? runAccountDerivationScheme(derivationScheme, currency, {
                    account: index
                })
                : runDerivationScheme(derivationScheme, currency, {
                    account: index
                });
            return derivateAddress({
                currency: currency,
                path: path,
                derivationMode: derivationMode
            }).pipe(map(function (accountDerivation) { return ({
                parentDerivation: parentDerivation,
                accountDerivation: accountDerivation,
                index: index
            }); }));
        }), // do action with these derivations (e.g. synchronize)
        concatMap(function (_a) {
            var parentDerivation = _a.parentDerivation, accountDerivation = _a.accountDerivation, index = _a.index;
            return stepAddress({
                index: index,
                parentDerivation: parentDerivation,
                accountDerivation: accountDerivation,
                derivationMode: derivationMode,
                shouldSkipEmpty: emptyCount < mandatoryEmptyAccountSkip,
                seedIdentifier: seedIdentifier
            });
        }), // take until the list is complete (based on criteria defined by stepAddress)
        // $FlowFixMe
        takeWhile(function (r) { return !r.complete; }, true), // emit just the results
        concatMap(function (_a) {
            var result = _a.result;
            return (result ? of(result) : empty());
        }));
    }));
}
//# sourceMappingURL=derivation.js.map