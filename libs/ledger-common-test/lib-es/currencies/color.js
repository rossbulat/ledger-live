export var getCurrencyColor = function (currency) {
    switch (currency.type) {
        case "CryptoCurrency":
            return currency.color;
        case "TokenCurrency":
            return currency.parentCurrency.color;
        default:
            return "#999";
    }
};
//# sourceMappingURL=color.js.map