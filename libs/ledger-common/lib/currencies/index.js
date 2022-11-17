"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
exports.__esModule = true;
exports.listTokens = exports.findCompoundToken = exports.getCurrencyColor = exports.sanitizeValueString = exports.valueFromUnit = exports.decodeURIScheme = exports.encodeURIScheme = exports.hasCryptoCurrencyId = exports.getCryptoCurrencyById = exports.formatShort = exports.formatCurrencyUnitFragment = exports.formatCurrencyUnit = exports.chopCurrencyUnitDecimals = exports.parseCurrencyUnit = exports.getAbandonSeedAddress = exports.getTokenById = exports.hasTokenId = exports.findTokenById = exports.findTokenByTicker = exports.findTokenByAddress = exports.listTokenTypesForCryptoCurrency = exports.listTokensForCryptoCurrency = exports.hasFiatCurrencyTicker = exports.findFiatCurrencyByTicker = exports.findCryptoCurrencyByKeyword = exports.findCryptoCurrencyByScheme = exports.findCryptoCurrencyByTicker = exports.findCryptoCurrencyById = exports.findCryptoCurrency = exports.findCurrencyByTicker = exports.getFiatCurrencyByTicker = exports.listCryptoCurrencies = exports.listFiatCurrencies = void 0;
var CurrencyURIScheme_1 = require("./CurrencyURIScheme");
exports.encodeURIScheme = CurrencyURIScheme_1.encodeURIScheme;
exports.decodeURIScheme = CurrencyURIScheme_1.decodeURIScheme;
var sanitizeValueString_1 = require("./sanitizeValueString");
exports.sanitizeValueString = sanitizeValueString_1.sanitizeValueString;
var cryptoassets_1 = require("@ledgerhq/cryptoassets");
exports.listFiatCurrencies = cryptoassets_1.listFiatCurrencies;
exports.findFiatCurrencyByTicker = cryptoassets_1.findFiatCurrencyByTicker;
exports.getFiatCurrencyByTicker = cryptoassets_1.getFiatCurrencyByTicker;
exports.hasFiatCurrencyTicker = cryptoassets_1.hasFiatCurrencyTicker;
exports.listCryptoCurrencies = cryptoassets_1.listCryptoCurrencies;
exports.getCryptoCurrencyById = cryptoassets_1.getCryptoCurrencyById;
exports.hasCryptoCurrencyId = cryptoassets_1.hasCryptoCurrencyId;
exports.findCryptoCurrency = cryptoassets_1.findCryptoCurrency;
exports.findCryptoCurrencyById = cryptoassets_1.findCryptoCurrencyById;
exports.findCryptoCurrencyByScheme = cryptoassets_1.findCryptoCurrencyByScheme;
exports.findCryptoCurrencyByKeyword = cryptoassets_1.findCryptoCurrencyByKeyword;
exports.findCryptoCurrencyByTicker = cryptoassets_1.findCryptoCurrencyByTicker;
exports.listTokens = cryptoassets_1.listTokens;
exports.listTokensForCryptoCurrency = cryptoassets_1.listTokensForCryptoCurrency;
exports.listTokenTypesForCryptoCurrency = cryptoassets_1.listTokenTypesForCryptoCurrency;
exports.findTokenByTicker = cryptoassets_1.findTokenByTicker;
exports.findTokenById = cryptoassets_1.findTokenById;
exports.findTokenByAddress = cryptoassets_1.findTokenByAddress;
exports.hasTokenId = cryptoassets_1.hasTokenId;
exports.findCompoundToken = cryptoassets_1.findCompoundToken;
exports.getAbandonSeedAddress = cryptoassets_1.getAbandonSeedAddress;
exports.getTokenById = cryptoassets_1.getTokenById;
__exportStar(require("./support"), exports);
var parseCurrencyUnit_1 = require("./parseCurrencyUnit");
exports.parseCurrencyUnit = parseCurrencyUnit_1.parseCurrencyUnit;
var chopCurrencyUnitDecimals_1 = require("./chopCurrencyUnitDecimals");
exports.chopCurrencyUnitDecimals = chopCurrencyUnitDecimals_1.chopCurrencyUnitDecimals;
var formatCurrencyUnit_1 = require("./formatCurrencyUnit");
exports.formatCurrencyUnit = formatCurrencyUnit_1.formatCurrencyUnit;
exports.formatCurrencyUnitFragment = formatCurrencyUnit_1.formatCurrencyUnitFragment;
var formatShort_1 = require("./formatShort");
exports.formatShort = formatShort_1.formatShort;
var valueFromUnit_1 = require("./valueFromUnit");
exports.valueFromUnit = valueFromUnit_1.valueFromUnit;
var color_1 = require("./color");
exports.getCurrencyColor = color_1.getCurrencyColor;
var findCurrencyByTicker = function (ticker) {
    return (0, cryptoassets_1.findCryptoCurrencyByTicker)(ticker) ||
        (0, cryptoassets_1.findFiatCurrencyByTicker)(ticker) ||
        (0, cryptoassets_1.findTokenByTicker)(ticker);
};
exports.findCurrencyByTicker = findCurrencyByTicker;
//# sourceMappingURL=index.js.map