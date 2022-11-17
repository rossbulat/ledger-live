import { BigNumber } from "bignumber.js";
/**
 * Create an empty transaction
 *
 * @returns {Transaction}
 */
var createTransaction = function () { return ({
    family: "cosmos",
    mode: "send",
    amount: new BigNumber(0),
    fees: null,
    gas: null,
    recipient: "",
    useAllAmount: false,
    networkInfo: null,
    memo: null,
    sourceValidator: null,
    validators: []
}); };
export default createTransaction;
//# sourceMappingURL=js-createTransaction.js.map