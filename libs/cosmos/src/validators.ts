import { getCryptoCurrencyById } from "@ledgerhq/ledger-common/lib/currencies";
import { CosmosValidatorsManager } from "./CosmosValidatorsManager";

const cosmosValidatorsManager = new CosmosValidatorsManager(
  getCryptoCurrencyById("cosmos")
);

export default cosmosValidatorsManager;
