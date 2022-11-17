"use strict";
exports.__esModule = true;
exports.getCurrencyColor = void 0;
var getCurrencyColor = function (currency) {
    switch (currency.type) {
        case "CryptoCurrency":
            return currency.color;
        case "TokenCurrency":
            return currency.parentCurrency.color;
        default:
            return "#999";
    }
};
exports.getCurrencyColor = getCurrencyColor;
//# sourceMappingURL=color.js.map