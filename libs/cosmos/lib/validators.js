"use strict";
exports.__esModule = true;
var currencies_1 = require("@ledgerhq/common/lib/currencies");
var CosmosValidatorsManager_1 = require("./CosmosValidatorsManager");
var cosmosValidatorsManager = new CosmosValidatorsManager_1.CosmosValidatorsManager((0, currencies_1.getCryptoCurrencyById)("cosmos"));
exports["default"] = cosmosValidatorsManager;
//# sourceMappingURL=validators.js.map