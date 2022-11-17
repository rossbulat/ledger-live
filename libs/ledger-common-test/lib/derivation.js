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
exports.walletDerivation = exports.getDefaultPreferredNewAccountScheme = exports.getPreferredNewAccountScheme = exports.getDerivationModesForCurrency = exports.getSeedIdentifierDerivation = exports.runAccountDerivationScheme = exports.runDerivationScheme = exports.getDerivationScheme = exports.derivationModeSupportsIndex = exports.getAddressFormatDerivationMode = exports.getTagDerivationMode = exports.getPurposeDerivationMode = exports.getDerivationModeStartsAt = exports.isIterableDerivationMode = exports.isUnsplitDerivationMode = exports.isTaprootDerivationMode = exports.isNativeSegwitDerivationMode = exports.isSegwitDerivationMode = exports.isInvalidDerivationMode = exports.getMandatoryEmptyAccountSkip = exports.getAllDerivationModes = exports.asDerivationMode = void 0;
var invariant_1 = __importDefault(require("invariant"));
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var logs_1 = require("@ledgerhq/logs");
var errors_1 = require("@ledgerhq/errors");
var currencies_1 = require("./currencies");
var env_1 = require("./env");
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
var asDerivationMode = function (derivationMode) {
    (0, invariant_1["default"])(derivationMode in modes, "not a derivationMode. Got: '%s'", derivationMode);
    return derivationMode;
};
exports.asDerivationMode = asDerivationMode;
var getAllDerivationModes = function () {
    return Object.keys(modes);
};
exports.getAllDerivationModes = getAllDerivationModes;
var getMandatoryEmptyAccountSkip = function (derivationMode) {
    return modes[derivationMode]
        .mandatoryEmptyAccountSkip || 0;
};
exports.getMandatoryEmptyAccountSkip = getMandatoryEmptyAccountSkip;
var isInvalidDerivationMode = function (derivationMode) {
    return modes[derivationMode].isInvalid || false;
};
exports.isInvalidDerivationMode = isInvalidDerivationMode;
var isSegwitDerivationMode = function (derivationMode) {
    return modes[derivationMode].isSegwit || false;
};
exports.isSegwitDerivationMode = isSegwitDerivationMode;
var isNativeSegwitDerivationMode = function (derivationMode) {
    return modes[derivationMode].isNativeSegwit ||
        false;
};
exports.isNativeSegwitDerivationMode = isNativeSegwitDerivationMode;
var isTaprootDerivationMode = function (derivationMode) {
    return modes[derivationMode].isTaproot || false;
};
exports.isTaprootDerivationMode = isTaprootDerivationMode;
var isUnsplitDerivationMode = function (derivationMode) {
    return modes[derivationMode].isUnsplit || false;
};
exports.isUnsplitDerivationMode = isUnsplitDerivationMode;
var isIterableDerivationMode = function (derivationMode) {
    return !modes[derivationMode].isNonIterable;
};
exports.isIterableDerivationMode = isIterableDerivationMode;
var getDerivationModeStartsAt = function (derivationMode) { return modes[derivationMode].startsAt || 0; };
exports.getDerivationModeStartsAt = getDerivationModeStartsAt;
var getPurposeDerivationMode = function (derivationMode) { return modes[derivationMode].purpose || 44; };
exports.getPurposeDerivationMode = getPurposeDerivationMode;
var getTagDerivationMode = function (currency, derivationMode) {
    var mode = modes[derivationMode];
    if (mode.tag) {
        return mode.tag;
    }
    if (mode.isInvalid) {
        return "custom";
    }
    if (currency.supportsSegwit && !(0, exports.isSegwitDerivationMode)(derivationMode)) {
        return "legacy";
    }
    return null;
};
exports.getTagDerivationMode = getTagDerivationMode;
var getAddressFormatDerivationMode = function (derivationMode) {
    return modes[derivationMode].addressFormat ||
        "legacy";
};
exports.getAddressFormatDerivationMode = getAddressFormatDerivationMode;
var derivationModeSupportsIndex = function (derivationMode, index) {
    var mode = modes[derivationMode];
    if (mode.skipFirst && index === 0)
        return false;
    return true;
};
exports.derivationModeSupportsIndex = derivationModeSupportsIndex;
var currencyForceCoinType = {
    vertcoin: true
};
/**
 * return a ledger-lib-core compatible DerivationScheme format
 * for a given currency and derivationMode (you can pass an Account because same shape)
 */
var getDerivationScheme = function (_a) {
    var derivationMode = _a.derivationMode, currency = _a.currency;
    var _b = modes[derivationMode], overridesDerivation = _b.overridesDerivation, overridesCoinType = _b.overridesCoinType;
    if (overridesDerivation)
        return overridesDerivation;
    var splitFrom = (0, exports.isUnsplitDerivationMode)(derivationMode) && currency.forkedFrom;
    var coinType = splitFrom
        ? (0, currencies_1.getCryptoCurrencyById)(splitFrom).coinType
        : typeof overridesCoinType === "number"
            ? overridesCoinType
            : currencyForceCoinType
                ? currency.coinType
                : "<coin_type>";
    var purpose = (0, exports.getPurposeDerivationMode)(derivationMode);
    return "".concat(purpose, "'/").concat(coinType, "'/<account>'/<node>/<address>");
};
exports.getDerivationScheme = getDerivationScheme;
// Execute a derivation scheme
var runDerivationScheme = function (derivationScheme, _a, opts) {
    var coinType = _a.coinType;
    if (opts === void 0) { opts = {}; }
    return derivationScheme
        .replace("<coin_type>", String(coinType))
        .replace("<account>", String(opts.account || 0))
        .replace("<node>", String(opts.node || 0))
        .replace("<address>", String(opts.address || 0));
};
exports.runDerivationScheme = runDerivationScheme;
// execute the derivation on the account part of the scheme
var runAccountDerivationScheme = function (scheme, currency, opts) {
    if (opts === void 0) { opts = {}; }
    return (0, exports.runDerivationScheme)(scheme, currency, __assign(__assign({}, opts), { address: "_", node: "_" })).replace(/[_/]+$/, "");
};
exports.runAccountDerivationScheme = runAccountDerivationScheme;
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
var getSeedIdentifierDerivation = function (currency, derivationMode) {
    var unsplitFork = (0, exports.isUnsplitDerivationMode)(derivationMode)
        ? currency.forkedFrom
        : null;
    var purpose = (0, exports.getPurposeDerivationMode)(derivationMode);
    var coinType = (unsplitFork
        ? (0, currencies_1.getCryptoCurrencyById)(unsplitFork)
        : currency).coinType;
    var f = seedIdentifierPath[currency.id] || seedIdentifierPath._;
    return f({
        purpose: purpose,
        coinType: coinType
    });
};
exports.getSeedIdentifierDerivation = getSeedIdentifierDerivation;
// return an array of ways to derivate, by convention the latest is the standard one.
var getDerivationModesForCurrency = function (currency) {
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
    if (!(0, env_1.getEnv)("SCAN_FOR_INVALID_PATHS")) {
        return all.filter(function (a) { return !(0, exports.isInvalidDerivationMode)(a); });
    }
    return all;
};
exports.getDerivationModesForCurrency = getDerivationModesForCurrency;
var preferredList = [
    "native_segwit",
    "taproot",
    "segwit",
    "",
];
// null => no settings
// [ .. ]
var getPreferredNewAccountScheme = function (currency) {
    if (currency.family !== "bitcoin")
        return null;
    var derivationsModes = (0, exports.getDerivationModesForCurrency)(currency);
    var list = preferredList.filter(function (p) {
        return derivationsModes.includes(p);
    });
    if (list.length === 1)
        return null;
    return list;
};
exports.getPreferredNewAccountScheme = getPreferredNewAccountScheme;
var getDefaultPreferredNewAccountScheme = function (currency) {
    var list = (0, exports.getPreferredNewAccountScheme)(currency);
    return list && list[0];
};
exports.getDefaultPreferredNewAccountScheme = getDefaultPreferredNewAccountScheme;
function walletDerivation(_a) {
    var currency = _a.currency, derivationMode = _a.derivationMode, derivateAddress = _a.derivateAddress, stepAddress = _a.stepAddress, shouldDerivesOnAccount = _a.shouldDerivesOnAccount;
    var path = (0, exports.getSeedIdentifierDerivation)(currency, derivationMode);
    return (0, rxjs_1.defer)(function () {
        return derivateAddress({
            currency: currency,
            path: path,
            derivationMode: derivationMode
        }).pipe((0, operators_1.catchError)(function (e) {
            if (e instanceof errors_1.TransportStatusError ||
                e instanceof errors_1.UserRefusedAddress) {
                (0, logs_1.log)("scanAccounts", "ignore derivationMode=" + derivationMode);
            }
            return (0, rxjs_1.empty)();
        }));
    }).pipe((0, operators_1.switchMap)(function (parentDerivation) {
        var seedIdentifier = parentDerivation.publicKey;
        var emptyCount = 0;
        var mandatoryEmptyAccountSkip = (0, exports.getMandatoryEmptyAccountSkip)(derivationMode);
        var derivationScheme = (0, exports.getDerivationScheme)({
            derivationMode: derivationMode,
            currency: currency
        });
        var stopAt = (0, exports.isIterableDerivationMode)(derivationMode) ? 255 : 1;
        var startsAt = (0, exports.getDerivationModeStartsAt)(derivationMode);
        return (0, rxjs_1.range)(startsAt, stopAt - startsAt).pipe(
        // derivate addresses/xpubs
        (0, operators_1.concatMap)(function (index) {
            if (!(0, exports.derivationModeSupportsIndex)(derivationMode, index)) {
                return (0, rxjs_1.empty)();
            }
            var path = shouldDerivesOnAccount
                ? (0, exports.runAccountDerivationScheme)(derivationScheme, currency, {
                    account: index
                })
                : (0, exports.runDerivationScheme)(derivationScheme, currency, {
                    account: index
                });
            return derivateAddress({
                currency: currency,
                path: path,
                derivationMode: derivationMode
            }).pipe((0, operators_1.map)(function (accountDerivation) { return ({
                parentDerivation: parentDerivation,
                accountDerivation: accountDerivation,
                index: index
            }); }));
        }), // do action with these derivations (e.g. synchronize)
        (0, operators_1.concatMap)(function (_a) {
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
        (0, operators_1.takeWhile)(function (r) { return !r.complete; }, true), // emit just the results
        (0, operators_1.concatMap)(function (_a) {
            var result = _a.result;
            return (result ? (0, rxjs_1.of)(result) : (0, rxjs_1.empty)());
        }));
    }));
}
exports.walletDerivation = walletDerivation;
//# sourceMappingURL=derivation.js.map