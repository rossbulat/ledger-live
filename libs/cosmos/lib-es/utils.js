import { LEDGER_OSMOSIS_VALIDATOR_ADDRESS } from "./osmosis/utils";
export var LEDGER_VALIDATOR_ADDRESS = "cosmosvaloper10wljxpl03053h9690apmyeakly3ylhejrucvtm";
export var COSMOS_FAMILY_LEDGER_VALIDATOR_ADDRESSES = [
    LEDGER_VALIDATOR_ADDRESS,
    LEDGER_OSMOSIS_VALIDATOR_ADDRESS,
];
export function isCosmosAccount(account) {
    return (account === null || account === void 0 ? void 0 : account.cosmosResources) !== undefined;
}
//# sourceMappingURL=utils.js.map