"use strict";
exports.__esModule = true;
exports.LEDGER_OSMOSIS_VALIDATOR_ADDRESS = exports.isValidAddress = void 0;
var bech32_1 = require("bech32");
// Address validation freely inspired from
// https://github.com/terra-money/terra.js/blob/9e5f553de3ff3e975eaaf91b1f06e45658b1a5e0/src/core/bech32.ts
function checkPrefixAndLength(prefix, data, length) {
    try {
        var vals = (0, bech32_1.decode)(data);
        return vals.prefix === prefix && data.length == length;
    }
    catch (e) {
        return false;
    }
}
/**
 * Checks if a string is a valid Osmosis account address.
 *
 * @param addr string to check
 */
function isValidAddress(currencyPrefix, addr) {
    return checkPrefixAndLength(currencyPrefix, addr, 43);
}
exports.isValidAddress = isValidAddress;
// export const FIGMENT_OSMOSIS_VALIDATOR_ADDRESS =
//   "osmovaloper1hjct6q7npsspsg3dgvzk3sdf89spmlpf6t4agt";
exports.LEDGER_OSMOSIS_VALIDATOR_ADDRESS = "osmovaloper17cp6fxccqxrpj4zc00w2c7u6y0umc2jajsyc5t";
//# sourceMappingURL=utils.js.map