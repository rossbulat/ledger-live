import { getFiatCurrencyByTicker, getCryptoCurrencyById, hasCryptoCurrencyId, } from "@ledgerhq/cryptoassets";
import { getEnv } from "../env";
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
export function isFiatSupported(fiat) {
    return userSupportedFiats.includes(fiat);
}
export function setSupportedFiats(ids) {
    userSupportedFiats = ids.map(getFiatCurrencyByTicker);
}
export function listSupportedFiats() {
    return userSupportedFiats;
}
export function setSupportedCurrencies(ids) {
    userSupportedCurrencies = Array.from(new Set(ids)) // Make sure to remove duplicates
        .map(function (id) { return getCryptoCurrencyById(id); });
}
function getExperimentalSupports() {
    return getEnv("EXPERIMENTAL_CURRENCIES")
        .split(",")
        .filter(function (id) {
        return hasCryptoCurrencyId(id) &&
            !userSupportedCurrencies.find(function (c) { return c.id === id; });
    })
        .map(getCryptoCurrencyById);
}
export function listSupportedCurrencies() {
    var experimentals = getExperimentalSupports();
    return experimentals.length === 0
        ? userSupportedCurrencies
        : userSupportedCurrencies.concat(experimentals);
}
export function isCurrencySupported(currency) {
    return listSupportedCurrencies().includes(currency);
}
//# sourceMappingURL=support.js.map