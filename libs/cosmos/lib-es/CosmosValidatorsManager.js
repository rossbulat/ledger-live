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
import network from "@ledgerhq/ledger-common/lib/network";
import { log } from "@ledgerhq/logs";
import { getEnv } from "@ledgerhq/ledger-common/lib/env";
import { makeLRUCache } from "@ledgerhq/ledger-common/lib/cache";
// Utils
var getBaseApiUrl = function (currency) {
    if (currency.id === "cosmos_testnet") {
        return getEnv("API_COSMOS_TESTNET_BLOCKCHAIN_EXPLORER_API_ENDPOINT");
    }
    else {
        return getEnv("API_COSMOS_BLOCKCHAIN_EXPLORER_API_ENDPOINT");
    }
};
var isStargate = function (currency) {
    if (currency.id === "cosmos_testnet") {
        return getEnv("API_COSMOS_TESTNET_NODE") == "STARGATE_NODE";
    }
    else {
        return getEnv("API_COSMOS_NODE") == "STARGATE_NODE";
    }
};
var parseUatomStrAsAtomNumber = function (uatoms) {
    return parseFloat(uatoms) / 1000000.0;
};
var CosmosValidatorsManager = /** @class */ (function () {
    function CosmosValidatorsManager(currency, options) {
        var _this = this;
        this._namespace = "cosmos";
        this._version = "v1beta1";
        this.cacheValidators = makeLRUCache(function (rewardState) { return __awaiter(_this, void 0, void 0, function () {
            var currency, url, data, validators, url, data, validators;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        currency = this._currency;
                        if (!isStargate(currency)) return [3 /*break*/, 2];
                        url = "".concat(this._endPoint, "/cosmos/staking/").concat(this._version, "/validators?status=BOND_STATUS_BONDED&pagination.limit=175");
                        return [4 /*yield*/, network({
                                url: url,
                                method: "GET"
                            })];
                    case 1:
                        data = (_a.sent()).data;
                        validators = data.validators.map(function (validator) {
                            var commission = parseFloat(validator.commission.commission_rates.rate);
                            return {
                                validatorAddress: validator.operator_address,
                                name: validator.description.moniker,
                                tokens: parseFloat(validator.tokens),
                                votingPower: _this.validatorVotingPower(validator.tokens, rewardState),
                                commission: commission,
                                estimatedYearlyRewardsRate: _this.validatorEstimatedRate(commission, rewardState)
                            };
                        });
                        return [2 /*return*/, validators];
                    case 2:
                        url = "".concat(this._endPoint, "/staking/validators");
                        return [4 /*yield*/, network({
                                url: url,
                                method: "GET"
                            })];
                    case 3:
                        data = (_a.sent()).data;
                        validators = data.result.map(function (validator) {
                            var commission = parseFloat(validator.commission.commission_rates.rate);
                            return {
                                validatorAddress: validator.operator_address,
                                name: validator.description.moniker,
                                tokens: parseFloat(validator.tokens),
                                votingPower: _this.validatorVotingPower(validator.tokens, rewardState),
                                commission: commission,
                                estimatedYearlyRewardsRate: _this.validatorEstimatedRate(commission, rewardState)
                            };
                        });
                        return [2 /*return*/, validators];
                }
            });
        }); }, function (_) { return _this._currency.id; });
        this.getValidators = function () { return __awaiter(_this, void 0, void 0, function () {
            var rewardsState, _a, rewardsState;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!isStargate(this._currency)) return [3 /*break*/, 6];
                        if (!this._rewardsState) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._rewardsState()];
                    case 1:
                        _a = _b.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.getStargateRewardsState()];
                    case 3:
                        _a = _b.sent();
                        _b.label = 4;
                    case 4:
                        rewardsState = _a;
                        return [4 /*yield*/, this.cacheValidators(rewardsState)];
                    case 5: 
                    // validators need the rewardsState ONLY to compute voting power as
                    // percentage instead of raw uatoms amounts
                    return [2 /*return*/, _b.sent()];
                    case 6: return [4 /*yield*/, this.getRewardsState()];
                    case 7:
                        rewardsState = _b.sent();
                        return [4 /*yield*/, this.cacheValidators(rewardsState)];
                    case 8: 
                    // validators need the rewardsState ONLY to compute voting power as
                    // percentage instead of raw uatoms amounts
                    return [2 /*return*/, _b.sent()];
                }
            });
        }); };
        this.getRewardsState = makeLRUCache(function () { return __awaiter(_this, void 0, void 0, function () {
            var inflationUrl, inflationData, currentValueInflation, inflationParametersUrl, inflationParametersData, inflationRateChange, inflationMaxRate, inflationMinRate, targetBondedRatio, assumedTimePerBlock, communityTaxUrl, communityTax, communityPoolCommission, supplyUrl, totalSupplyData, totalSupply, ratioUrl, ratioData, actualBondedRatio, averageDailyFees, averageTimePerBlock;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        inflationUrl = "".concat(this._endPoint, "/minting/inflation");
                        return [4 /*yield*/, network({
                                url: inflationUrl,
                                method: "GET"
                            })];
                    case 1:
                        inflationData = (_a.sent()).data;
                        currentValueInflation = parseFloat(inflationData.result);
                        inflationParametersUrl = "".concat(this._endPoint, "/minting/parameters");
                        return [4 /*yield*/, network({
                                url: inflationParametersUrl,
                                method: "GET"
                            })];
                    case 2:
                        inflationParametersData = (_a.sent()).data;
                        inflationRateChange = parseFloat(inflationParametersData.result.inflation_rate_change);
                        inflationMaxRate = parseFloat(inflationParametersData.result.inflation_max);
                        inflationMinRate = parseFloat(inflationParametersData.result.inflation_min);
                        targetBondedRatio = parseFloat(inflationParametersData.result.goal_bonded);
                        assumedTimePerBlock = 31556736.0 / parseFloat(inflationParametersData.result.blocks_per_year);
                        communityTaxUrl = "".concat(this._endPoint, "/distribution/parameters");
                        return [4 /*yield*/, network({
                                url: communityTaxUrl,
                                method: "GET"
                            })];
                    case 3:
                        communityTax = (_a.sent()).data;
                        communityPoolCommission = parseFloat(communityTax.result.community_tax);
                        supplyUrl = "".concat(this._endPoint, "/supply/total");
                        return [4 /*yield*/, network({
                                url: supplyUrl,
                                method: "GET"
                            })];
                    case 4:
                        totalSupplyData = (_a.sent()).data;
                        totalSupply = parseUatomStrAsAtomNumber(totalSupplyData.result[0].amount);
                        ratioUrl = "".concat(this._endPoint, "/staking/pool");
                        return [4 /*yield*/, network({
                                url: ratioUrl,
                                method: "GET"
                            })];
                    case 5:
                        ratioData = (_a.sent()).data;
                        actualBondedRatio = parseUatomStrAsAtomNumber(ratioData.result.bonded_tokens) / totalSupply;
                        averageDailyFees = 20;
                        averageTimePerBlock = 7.5;
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
        }); }, function () { return _this._currency.id; });
        this.getStargateRewardsState = makeLRUCache(function () { return __awaiter(_this, void 0, void 0, function () {
            var inflationUrl, inflationData, currentValueInflation, inflationParametersUrl, inflationParametersData, inflationRateChange, inflationMaxRate, inflationMinRate, targetBondedRatio, assumedTimePerBlock, communityTaxUrl, communityTax, communityPoolCommission, supplyUrl, totalSupplyData, totalSupply, ratioUrl, ratioData, actualBondedRatio, averageDailyFees, averageTimePerBlock;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        inflationUrl = "".concat(this._endPoint, "/cosmos/mint/v1beta1/inflation");
                        return [4 /*yield*/, network({
                                url: inflationUrl,
                                method: "GET"
                            })];
                    case 1:
                        inflationData = (_a.sent()).data;
                        currentValueInflation = parseFloat(inflationData.inflation);
                        inflationParametersUrl = "".concat(this._endPoint, "/cosmos/mint/v1beta1/params");
                        return [4 /*yield*/, network({
                                url: inflationParametersUrl,
                                method: "GET"
                            })];
                    case 2:
                        inflationParametersData = (_a.sent()).data;
                        inflationRateChange = parseFloat(inflationParametersData.params.inflation_rate_change);
                        inflationMaxRate = parseFloat(inflationParametersData.params.inflation_max);
                        inflationMinRate = parseFloat(inflationParametersData.params.inflation_min);
                        targetBondedRatio = parseFloat(inflationParametersData.params.goal_bonded);
                        assumedTimePerBlock = 31556736.0 / parseFloat(inflationParametersData.params.blocks_per_year);
                        communityTaxUrl = "".concat(this._endPoint, "/cosmos/distribution/v1beta1/params");
                        return [4 /*yield*/, network({
                                url: communityTaxUrl,
                                method: "GET"
                            })];
                    case 3:
                        communityTax = (_a.sent()).data;
                        communityPoolCommission = parseFloat(communityTax.params.community_tax);
                        supplyUrl = "".concat(this._endPoint, "/cosmos/bank/v1beta1/supply/").concat(this._minDenom);
                        return [4 /*yield*/, network({
                                url: supplyUrl,
                                method: "GET"
                            })];
                    case 4:
                        totalSupplyData = (_a.sent()).data;
                        totalSupply = parseUatomStrAsAtomNumber(totalSupplyData.amount.amount);
                        ratioUrl = "".concat(this._endPoint, "/cosmos/staking/v1beta1/pool");
                        return [4 /*yield*/, network({
                                url: ratioUrl,
                                method: "GET"
                            })];
                    case 5:
                        ratioData = (_a.sent()).data;
                        actualBondedRatio = parseUatomStrAsAtomNumber(ratioData.pool.bonded_tokens) / totalSupply;
                        averageDailyFees = 20;
                        averageTimePerBlock = 7.5;
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
        }); }, function () { return _this._currency.id; });
        this.computeAvgYearlyInflation = function (rewardsState) {
            // Return invalid rewardsState if
            // rewardsState.currentValueInflation is not between inflationMinRate and inflationMaxRate
            var inflationSlope = (1 - rewardsState.actualBondedRatio / rewardsState.targetBondedRatio) *
                rewardsState.inflationRateChange;
            var unrestrictedEndOfYearInflation = rewardsState.currentValueInflation * (1 + inflationSlope);
            if (unrestrictedEndOfYearInflation <= rewardsState.inflationMaxRate &&
                unrestrictedEndOfYearInflation >= rewardsState.inflationMinRate) {
                return ((rewardsState.currentValueInflation + unrestrictedEndOfYearInflation) /
                    2);
            }
            if (unrestrictedEndOfYearInflation > rewardsState.inflationMaxRate) {
                var diffToMax = rewardsState.inflationMaxRate - rewardsState.currentValueInflation;
                var maxPoint = diffToMax / inflationSlope;
                var averageInflation = (1 - maxPoint / 2) * rewardsState.inflationMaxRate +
                    (maxPoint / 2) * rewardsState.currentValueInflation;
                return averageInflation;
            }
            if (unrestrictedEndOfYearInflation < rewardsState.inflationMinRate) {
                var diffToMin = rewardsState.currentValueInflation - rewardsState.inflationMinRate;
                var minPoint = diffToMin / inflationSlope;
                var averageInflation = (1 - minPoint / 2) * rewardsState.inflationMinRate +
                    (minPoint / 2) * rewardsState.currentValueInflation;
                return averageInflation;
            }
            throw new Error("Unreachable code");
        };
        this.validatorVotingPower = function (validatorTokens, rewardsState) {
            return (parseFloat(validatorTokens) /
                (rewardsState.actualBondedRatio * rewardsState.totalSupply * 1000000) // TODO validate that this is correct for Osmosis. Just because we get a valid number doesn't mean it's correct
            );
        };
        this._osmoValidatorEstimatedRate = function (_, __) {
            return 0.15; // todo fix this obviously
        };
        this.validatorEstimatedRate = function (validatorCommission, rewardsState) {
            if (_this._namespace === "osmosis") {
                return _this._osmoValidatorEstimatedRate(validatorCommission, rewardsState);
            }
            // This correction changes how inflation is computed vs. the value the network advertises
            var inexactBlockTimeCorrection = rewardsState.assumedTimePerBlock / rewardsState.averageTimePerBlock;
            // This correction assumes a constant bonded_ratio, this changes the yearly inflation
            var yearlyInflation = _this.computeAvgYearlyInflation(rewardsState);
            // This correction adds the fees to the rate computation
            var yearlyFeeRate = (rewardsState.averageDailyFees * 365.24) / rewardsState.totalSupply;
            return (inexactBlockTimeCorrection *
                (yearlyInflation + yearlyFeeRate) *
                (1 / rewardsState.actualBondedRatio) *
                (1 - rewardsState.communityPoolCommission) *
                (1 - validatorCommission));
        };
        this.hydrateValidators = function (validators) {
            log("".concat(_this._namespace, "/validators"), "hydrate " + validators.length + " validators");
            _this.cacheValidators.hydrate("", validators);
        };
        this._currency = currency;
        this._endPoint = getBaseApiUrl(this._currency);
        this._minDenom = currency.id === "cosmos_testnet" ? "umuon" : "uatom";
        if (options === null || options === void 0 ? void 0 : options.namespace) {
            this._namespace = options.namespace;
        }
        // if (options?.version) {
        //   this._version = options.version;
        // }
        if (options === null || options === void 0 ? void 0 : options.endPoint) {
            this._endPoint = options.endPoint;
            // TODO this is a hack for now
            this._minDenom = currency.units[1].code; // this will be uosmo for Osmosis
        }
        if (options === null || options === void 0 ? void 0 : options.rewardsState) {
            this._rewardsState = options.rewardsState;
        }
    }
    return CosmosValidatorsManager;
}());
export { CosmosValidatorsManager };
//# sourceMappingURL=CosmosValidatorsManager.js.map