"use strict";
exports.__esModule = true;
exports.OsmosisCurrency = exports.OsmosisTransactionTypeEnum = void 0;
exports.OsmosisTransactionTypeEnum = {
    // See https://docs.figment.io/network-documentation/cosmos/enriched-apis/transaction-search
    // for help on these types.
    Send: "send",
    MultiSend: "multisend",
    Delegate: "delegate",
    Redelegate: "begin_redelegate",
    Undelegate: "undelegate",
    Reward: "withdraw_delegator_reward"
};
exports.OsmosisCurrency = "uosmo";
//# sourceMappingURL=sdk.types.js.map