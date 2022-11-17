"use strict";
exports.__esModule = true;
exports.isCurrencySupported = exports.listSupportedCurrencies = exports.setSupportedCurrencies = exports.listSupportedFiats = exports.setSupportedFiats = exports.isFiatSupported = void 0;
var cryptoassets_1 = require("@ledgerhq/cryptoassets");
var env_1 = require("../env");
// set by user side effect to precise which currencies are considered supported (typically by live)
var userSupportedCurrencies = [];
var userSupportedFiats = [];
// Current list was established with what our API really supports
// to update the list,
// 1. $ ledger-live countervalues --format supportedFiats --fiats
// 2. copy & paste the output
setSupportedFiats([
    "AED",
    "AUD",
    "BGN",
    "BHD",
    "BRL",
    "CAD",
    "CHF",
    "CLP",
    "CNY",
    "CRC",
    "CZK",
    "DKK",
    "EUR",
    "GBP",
    "GHS",
    "HKD",
    "HRK",
    "HUF",
    "IDR",
    "ILS",
    "INR",
    "IRR",
    "JPY",
    "KES",
    "KHR",
    "KRW",
    "MUR",
    "MXN",
    "MYR",
    "NGN",
    "NOK",
    "NZD",
    "PHP",
    "PKR",
    "PLN",
    "RON",
    "RUB",
    "SEK",
    "SGD",
    "THB",
    "TRY",
    "TZS",
    "UAH",
    "UGX",
    "USD",
    "VES",
    "VND",
    "VUV",
    "ZAR",
]);
function isFiatSupported(fiat) {
    return userSupportedFiats.includes(fiat);
}
exports.isFiatSupported = isFiatSupported;
function setSupportedFiats(ids) {
    userSupportedFiats = ids.map(cryptoassets_1.getFiatCurrencyByTicker);
}
exports.setSupportedFiats = setSupportedFiats;
function listSupportedFiats() {
    return userSupportedFiats;
}
exports.listSupportedFiats = listSupportedFiats;
function setSupportedCurrencies(ids) {
    userSupportedCurrencies = Array.from(new Set(ids)) // Make sure to remove duplicates
        .map(function (id) { return (0, cryptoassets_1.getCryptoCurrencyById)(id); });
}
exports.setSupportedCurrencies = setSupportedCurrencies;
function getExperimentalSupports() {
    return (0, env_1.getEnv)("EXPERIMENTAL_CURRENCIES")
        .split(",")
        .filter(function (id) {
        return (0, cryptoassets_1.hasCryptoCurrencyId)(id) &&
            !userSupportedCurrencies.find(function (c) { return c.id === id; });
    })
        .map(cryptoassets_1.getCryptoCurrencyById);
}
function listSupportedCurrencies() {
    var experimentals = getExperimentalSupports();
    return experimentals.length === 0
        ? userSupportedCurrencies
        : userSupportedCurrencies.concat(experimentals);
}
exports.listSupportedCurrencies = listSupportedCurrencies;
function isCurrencySupported(currency) {
    return listSupportedCurrencies().includes(currency);
}
exports.isCurrencySupported = isCurrencySupported;
//# sourceMappingURL=support.js.map