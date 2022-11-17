"use strict";
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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.CosmosTransactionStatusManager = void 0;
var errors_1 = require("@ledgerhq/errors");
var errors_2 = require("@ledgerhq/common/lib/errors");
var bignumber_js_1 = require("bignumber.js");
var logic_1 = require("./logic");
var invariant_1 = __importDefault(require("invariant"));
var Cosmos_1 = require("./api/Cosmos");
var sdk_1 = require("./osmosis/api/sdk");
var CosmosTransactionStatusManager = /** @class */ (function () {
    function CosmosTransactionStatusManager(options) {
        var _this = this;
        this._api = Cosmos_1.defaultCosmosAPI;
        this._validatorOperatorAddressPrefix = "cosmosvaloper";
        this.getTransactionStatus = function (a, t) { return __awaiter(_this, void 0, void 0, function () {
            var errors, warnings, redelegationError, _a, first, unbondingError, validatorAmount, estimatedFees, totalSpent, cosmosResources, claimReward;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(t.mode === "send")) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getSendTransactionStatus(a, t)];
                    case 1: 
                    // We isolate the send transaction that it's a little bit different from the rest
                    return [2 /*return*/, _b.sent()];
                    case 2:
                        if (!(t.mode === "delegate")) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.getDelegateTransactionStatus(a, t)];
                    case 3: return [2 /*return*/, _b.sent()];
                    case 4:
                        errors = {};
                        warnings = {};
                        // here we only treat about all other mode than delegate and send
                        if (t.validators.some(function (v) {
                            return !v.address ||
                                !v.address.includes(_this._validatorOperatorAddressPrefix);
                        }) ||
                            t.validators.length === 0)
                            errors.recipient = new errors_1.InvalidAddress(undefined, {
                                currencyName: a.currency.name
                            });
                        if (t.mode === "redelegate") {
                            redelegationError = this.redelegationStatusError(a, t);
                            if (redelegationError) {
                                // Note : note sure if I have to put this error on this field
                                errors.redelegation = redelegationError;
                            }
                        }
                        else if (t.mode === "undelegate") {
                            (0, invariant_1["default"])(a.cosmosResources &&
                                a.cosmosResources.unbondings.length < logic_1.COSMOS_MAX_UNBONDINGS, "unbondings should not have more than 6 entries");
                            if (t.validators.length === 0)
                                errors.recipient = new errors_1.InvalidAddress(undefined, {
                                    currencyName: a.currency.name
                                });
                            _a = __read(t.validators, 1), first = _a[0];
                            unbondingError = first && this.isDelegable(a, first.address, first.amount);
                            if (unbondingError) {
                                errors.unbonding = unbondingError;
                            }
                        }
                        validatorAmount = t.validators.reduce(function (old, current) { return old.plus(current.amount); }, new bignumber_js_1.BigNumber(0));
                        if (t.mode !== "claimReward" && validatorAmount.lte(0)) {
                            errors.amount = new errors_1.AmountRequired();
                        }
                        estimatedFees = t.fees || new bignumber_js_1.BigNumber(0);
                        if (!t.fees) {
                            errors.fees = new errors_1.FeeNotLoaded();
                        }
                        totalSpent = estimatedFees;
                        if (["claimReward", "claimRewardCompound"].includes(t.mode)) {
                            cosmosResources = a.cosmosResources;
                            (0, invariant_1["default"])(cosmosResources, "cosmosResources should exist");
                            claimReward = t.validators.length && cosmosResources
                                ? cosmosResources.delegations.find(function (delegation) {
                                    return delegation.validatorAddress === t.validators[0].address;
                                })
                                : null;
                            if (claimReward && estimatedFees.gt(claimReward.pendingRewards)) {
                                warnings.claimReward = new errors_2.ClaimRewardsFeesWarning();
                            }
                        }
                        if (!errors.recipient &&
                            !errors.amount &&
                            (validatorAmount.lt(0) || totalSpent.gt(a.spendableBalance))) {
                            errors.amount = new errors_1.NotEnoughBalance();
                            totalSpent = new bignumber_js_1.BigNumber(0);
                        }
                        return [2 /*return*/, Promise.resolve({
                                errors: errors,
                                warnings: warnings,
                                estimatedFees: estimatedFees,
                                amount: new bignumber_js_1.BigNumber(0),
                                totalSpent: totalSpent
                            })];
                }
            });
        }); };
        this.getDelegateTransactionStatus = function (a, t) { return __awaiter(_this, void 0, void 0, function () {
            var errors, warnings, estimatedFees, amount, totalSpent;
            var _this = this;
            return __generator(this, function (_a) {
                errors = {};
                warnings = {};
                if (t.validators.some(function (v) {
                    return !v.address ||
                        !v.address.includes(_this._validatorOperatorAddressPrefix);
                }) ||
                    t.validators.length === 0)
                    errors.recipient = new errors_1.InvalidAddress(undefined, {
                        currencyName: a.currency.name
                    });
                if (t.validators.length > logic_1.COSMOS_MAX_DELEGATIONS) {
                    errors.validators = new errors_2.CosmosTooManyValidators();
                }
                estimatedFees = t.fees || new bignumber_js_1.BigNumber(0);
                if (this._api instanceof sdk_1.OsmosisAPI) {
                    if (!t.fees) {
                        errors.fees = new errors_1.FeeNotLoaded();
                    }
                }
                else {
                    if (!t.fees || !t.fees.gt(0)) {
                        errors.fees = new errors_1.FeeNotLoaded();
                    }
                }
                // TODO, refactor this block. We should use cosmosResources for Osmosis
                if (this._api instanceof sdk_1.OsmosisAPI) {
                    amount = t.useAllAmount
                        ? a.spendableBalance.minus(estimatedFees)
                        : new bignumber_js_1.BigNumber(t.amount);
                }
                else {
                    amount = t.useAllAmount
                        ? (0, logic_1.getMaxEstimatedBalance)(a, estimatedFees)
                        : t.amount;
                }
                totalSpent = amount.plus(estimatedFees);
                if (amount.eq(0)) {
                    errors.amount = new errors_1.AmountRequired();
                }
                if (!errors.recipient &&
                    !errors.amount &&
                    (amount.lt(0) || totalSpent.gt(a.spendableBalance))) {
                    errors.amount = new errors_1.NotEnoughBalance();
                }
                if (!errors.amount && t.useAllAmount) {
                    warnings.amount = new errors_2.CosmosDelegateAllFundsWarning();
                }
                return [2 /*return*/, Promise.resolve({
                        errors: errors,
                        warnings: warnings,
                        estimatedFees: estimatedFees,
                        amount: amount,
                        totalSpent: totalSpent
                    })];
            });
        }); };
        this.getSendTransactionStatus = function (a, t) { return __awaiter(_this, void 0, void 0, function () {
            var errors, warnings, amount, estimatedFees, totalSpent;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        errors = {};
                        warnings = {};
                        if (!!t.recipient) return [3 /*break*/, 1];
                        errors.recipient = new errors_1.RecipientRequired("");
                        return [3 /*break*/, 4];
                    case 1:
                        if (!(a.freshAddress === t.recipient)) return [3 /*break*/, 2];
                        errors.recipient = new errors_1.InvalidAddressBecauseDestinationIsAlsoSource();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this._api.isValidRecipent(t.recipient)];
                    case 3:
                        if (!(_a.sent())) {
                            errors.recipient = new errors_1.InvalidAddress(undefined, {
                                currencyName: a.currency.name
                            });
                        }
                        _a.label = 4;
                    case 4:
                        amount = t.amount;
                        if (amount.lte(0) && !t.useAllAmount) {
                            errors.amount = new errors_1.AmountRequired();
                        }
                        estimatedFees = t.fees || new bignumber_js_1.BigNumber(0);
                        if (this._api instanceof sdk_1.OsmosisAPI) {
                            if (!t.fees) {
                                errors.fees = new errors_1.FeeNotLoaded();
                            }
                        }
                        else {
                            if (!t.fees || !t.fees.gt(0)) {
                                errors.fees = new errors_1.FeeNotLoaded();
                            }
                        }
                        amount = t.useAllAmount ? (0, logic_1.getMaxEstimatedBalance)(a, estimatedFees) : amount;
                        totalSpent = amount.plus(estimatedFees);
                        if ((amount.lte(0) && t.useAllAmount) || // if use all Amount sets an amount at 0
                            (!errors.recipient && !errors.amount && totalSpent.gt(a.spendableBalance)) // if spendable balance lower than total
                        ) {
                            errors.amount = new errors_1.NotEnoughBalance();
                        }
                        if (a.cosmosResources &&
                            a.cosmosResources.delegations.length > 0 &&
                            t.useAllAmount) {
                            warnings.amount = new errors_1.RecommendUndelegation();
                        }
                        return [2 /*return*/, Promise.resolve({
                                errors: errors,
                                warnings: warnings,
                                estimatedFees: estimatedFees,
                                amount: amount,
                                totalSpent: totalSpent
                            })];
                }
            });
        }); };
        this.redelegationStatusError = function (a, t) {
            if (a.cosmosResources) {
                var redelegations = a.cosmosResources.redelegations;
                (0, invariant_1["default"])(redelegations.length < logic_1.COSMOS_MAX_REDELEGATIONS, "redelegation should not have more than 6 entries");
                if (redelegations.some(function (redelegation) {
                    var dstValidator = redelegation.validatorDstAddress;
                    return (dstValidator === t.sourceValidator &&
                        redelegation.completionDate > new Date());
                })) {
                    return new errors_2.CosmosRedelegationInProgress();
                }
                if (t.validators.length > 0) {
                    if (t.sourceValidator === t.validators[0].address) {
                        return new errors_1.InvalidAddressBecauseDestinationIsAlsoSource();
                    }
                    else {
                        return _this.isDelegable(a, t.sourceValidator, t.validators[0].amount);
                    }
                }
            }
            return null;
        };
        this.isDelegable = function (a, address, amount) {
            var cosmosResources = a.cosmosResources;
            (0, invariant_1["default"])(cosmosResources, "cosmosResources should exist");
            if (cosmosResources &&
                cosmosResources.delegations.some(function (delegation) {
                    return delegation.validatorAddress === address &&
                        delegation.amount.lt(amount);
                })) {
                return new errors_2.NotEnoughDelegationBalance();
            }
            return null;
        };
        if (options === null || options === void 0 ? void 0 : options.validatorOperatorAddressPrefix) {
            this._validatorOperatorAddressPrefix =
                options.validatorOperatorAddressPrefix;
        }
        if (options === null || options === void 0 ? void 0 : options.api) {
            this._api = options.api;
        }
    }
    return CosmosTransactionStatusManager;
}());
exports.CosmosTransactionStatusManager = CosmosTransactionStatusManager;
var cosmosTransactionStatusManager = new CosmosTransactionStatusManager();
exports["default"] = cosmosTransactionStatusManager.getTransactionStatus;
//# sourceMappingURL=js-getTransactionStatus.js.map