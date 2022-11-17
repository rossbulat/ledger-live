"use strict";
exports.__esModule = true;
var js_getTransactionStatus_1 = require("../js-getTransactionStatus");
var sdk_1 = require("./api/sdk");
var osmosisTransactionStatusManager = new js_getTransactionStatus_1.CosmosTransactionStatusManager({
    api: sdk_1.osmosisAPI,
    validatorOperatorAddressPrefix: "osmovaloper"
});
exports["default"] = osmosisTransactionStatusManager.getTransactionStatus;
//# sourceMappingURL=js-getTransactionStatus.js.map