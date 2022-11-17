"use strict";
exports.__esModule = true;
var bignumber_js_1 = require("bignumber.js");
/**
 * Create an empty transaction
 *
 * @returns {Transaction}
 */
var createTransaction = function () { return ({
    family: "cosmos",
    mode: "send",
    amount: new bignumber_js_1.BigNumber(0),
    fees: null,
    gas: null,
    recipient: "",
    useAllAmount: false,
    networkInfo: null,
    memo: null,
    sourceValidator: null,
    validators: []
}); };
exports["default"] = createTransaction;
//# sourceMappingURL=js-createTransaction.js.map