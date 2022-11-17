import { CosmosTransactionStatusManager } from "../js-getTransactionStatus";
import { osmosisAPI } from "./api/sdk";
var osmosisTransactionStatusManager = new CosmosTransactionStatusManager({
    api: osmosisAPI,
    validatorOperatorAddressPrefix: "osmovaloper"
});
export default osmosisTransactionStatusManager.getTransactionStatus;
//# sourceMappingURL=js-getTransactionStatus.js.map