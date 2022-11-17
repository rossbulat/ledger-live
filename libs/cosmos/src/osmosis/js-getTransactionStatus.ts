import { CosmosTransactionStatusManager } from "../js-getTransactionStatus";
import { osmosisAPI } from "./api/sdk";

const osmosisTransactionStatusManager = new CosmosTransactionStatusManager({
  api: osmosisAPI,
  validatorOperatorAddressPrefix: "osmovaloper",
});

export default osmosisTransactionStatusManager.getTransactionStatus;
