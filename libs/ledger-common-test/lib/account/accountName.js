"use strict";
exports.__esModule = true;
exports.validateNameEdition = exports.getNewAccountPlaceholderName = exports.getAccountPlaceholderName = void 0;
var MAX_ACCOUNT_NAME_SIZE = 50;
var getAccountPlaceholderName = function (_a) {
    var currency = _a.currency, index = _a.index;
    return "".concat(currency.name, " ").concat(index + 1);
};
exports.getAccountPlaceholderName = getAccountPlaceholderName;
exports.getNewAccountPlaceholderName = exports.getAccountPlaceholderName; // same naming
var validateNameEdition = function (account, name) {
    return ((name || account.name || "").replace(/\s+/g, " ").trim() ||
        account.name ||
        (0, exports.getAccountPlaceholderName)(account)).slice(0, MAX_ACCOUNT_NAME_SIZE);
};
exports.validateNameEdition = validateNameEdition;
//# sourceMappingURL=accountName.js.map