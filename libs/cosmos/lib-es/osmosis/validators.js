var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { getCryptoCurrencyById } from "@ledgerhq/ledger-common/lib/currencies";
import { CosmosValidatorsManager } from "../CosmosValidatorsManager";
import { nodeEndpoint } from "./api/sdk";
import { osmosisAPI } from "./api/sdk";
var osmosisCryptoCurrency = getCryptoCurrencyById("osmo");
// TODO Refactor this to be a class so that we don't have to query the API multiple times
var getRewardsState = function () { return __awaiter(void 0, void 0, void 0, function () {
    var distributionParams, supply, totalSupply, pool, actualBondedRatio, communityPoolCommission, targetBondedRatio, assumedTimePerBlock, inflationRateChange, inflationMaxRate, inflationMinRate, averageTimePerBlock, averageDailyFees, currentValueInflation;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, _getDistributionParams()];
            case 1:
                distributionParams = _a.sent();
                return [4 /*yield*/, _getTotalSupply()];
            case 2:
                supply = _a.sent();
                totalSupply = parseUOsmoStrAsOsmoNumber(supply.amount);
                return [4 /*yield*/, _getPool()];
            case 3:
                pool = _a.sent();
                actualBondedRatio = parseUOsmoStrAsOsmoNumber(pool.bonded_tokens) / totalSupply;
                communityPoolCommission = parseFloat(distributionParams.community_tax);
                targetBondedRatio = 0.1;
                assumedTimePerBlock = 7;
                inflationRateChange = 0.01;
                inflationMaxRate = 0.01;
                inflationMinRate = 0.01;
                averageTimePerBlock = 7;
                averageDailyFees = 0;
                currentValueInflation = 0.01;
                return [2 /*return*/, {
                        targetBondedRatio: targetBondedRatio,
                        communityPoolCommission: communityPoolCommission,
                        assumedTimePerBlock: assumedTimePerBlock,
                        inflationRateChange: inflationRateChange,
                        inflationMaxRate: inflationMaxRate,
                        inflationMinRate: inflationMinRate,
                        actualBondedRatio: actualBondedRatio,
                        averageTimePerBlock: averageTimePerBlock,
                        totalSupply: totalSupply,
                        averageDailyFees: averageDailyFees,
                        currentValueInflation: currentValueInflation
                    }];
        }
    });
}); };
var _getTotalSupply = function () { return __awaiter(void 0, void 0, void 0, function () {
    var denom, totalSupply;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                denom = osmosisCryptoCurrency.units[1].code;
                return [4 /*yield*/, osmosisAPI.queryTotalSupply(denom)];
            case 1:
                totalSupply = _a.sent();
                return [2 /*return*/, totalSupply];
        }
    });
}); };
var _getPool = function () { return __awaiter(void 0, void 0, void 0, function () {
    var pool;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, osmosisAPI.queryPool()];
            case 1:
                pool = _a.sent();
                return [2 /*return*/, pool];
        }
    });
}); };
var _getDistributionParams = function () { return __awaiter(void 0, void 0, void 0, function () {
    var distributionParams;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, osmosisAPI.queryDistributionParams()];
            case 1:
                distributionParams = _a.sent();
                return [2 /*return*/, distributionParams];
        }
    });
}); };
var parseUOsmoStrAsOsmoNumber = function (uosmos) {
    return parseFloat(uosmos) / 1000000.0;
};
var osmosisValidatorsManager = new CosmosValidatorsManager(osmosisCryptoCurrency, {
    endPoint: nodeEndpoint,
    namespace: "osmosis",
    rewardsState: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, getRewardsState()];
    }); }); }
});
export default osmosisValidatorsManager;
//# sourceMappingURL=validators.js.map