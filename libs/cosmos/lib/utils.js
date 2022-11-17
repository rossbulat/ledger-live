"use strict";
exports.__esModule = true;
exports.isCosmosAccount = exports.COSMOS_FAMILY_LEDGER_VALIDATOR_ADDRESSES = exports.LEDGER_VALIDATOR_ADDRESS = void 0;
var utils_1 = require("./osmosis/utils");
exports.LEDGER_VALIDATOR_ADDRESS = "cosmosvaloper10wljxpl03053h9690apmyeakly3ylhejrucvtm";
exports.COSMOS_FAMILY_LEDGER_VALIDATOR_ADDRESSES = [
    exports.LEDGER_VALIDATOR_ADDRESS,
    utils_1.LEDGER_OSMOSIS_VALIDATOR_ADDRESS,
];
function isCosmosAccount(account) {
    return (account === null || account === void 0 ? void 0 : account.cosmosResources) !== undefined;
}
exports.isCosmosAccount = isCosmosAccount;
//# sourceMappingURL=utils.js.map