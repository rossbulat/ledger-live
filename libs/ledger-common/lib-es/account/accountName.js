var MAX_ACCOUNT_NAME_SIZE = 50;
export var getAccountPlaceholderName = function (_a) {
    var currency = _a.currency, index = _a.index;
    return "".concat(currency.name, " ").concat(index + 1);
};
export var getNewAccountPlaceholderName = getAccountPlaceholderName; // same naming
export var validateNameEdition = function (account, name) {
    return ((name || account.name || "").replace(/\s+/g, " ").trim() ||
        account.name ||
        getAccountPlaceholderName(account)).slice(0, MAX_ACCOUNT_NAME_SIZE);
};
//# sourceMappingURL=accountName.js.map