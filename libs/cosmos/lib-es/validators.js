import { getCryptoCurrencyById } from "@ledgerhq/ledger-common/lib/currencies";
import { CosmosValidatorsManager } from "./CosmosValidatorsManager";
var cosmosValidatorsManager = new CosmosValidatorsManager(getCryptoCurrencyById("cosmos"));
export default cosmosValidatorsManager;
//# sourceMappingURL=validators.js.map