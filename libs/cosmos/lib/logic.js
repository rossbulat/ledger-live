"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.getRedelegationCompletionDate = exports.getRedelegation = exports.canClaimRewards = exports.canRedelegate = exports.canDelegate = exports.canUndelegate = exports.getMaxEstimatedBalance = exports.getMaxDelegationAvailable = exports.searchFilter = exports.formatValue = exports.mapDelegationInfo = exports.mapRedelegations = exports.mapUnbondings = exports.mapDelegations = exports.COSMOS_MIN_FEES = exports.COSMOS_MIN_SAFE = exports.COSMOS_MAX_DELEGATIONS = exports.COSMOS_MAX_UNBONDINGS = exports.COSMOS_MAX_REDELEGATIONS = void 0;
var invariant_1 = __importDefault(require("invariant"));
var bignumber_js_1 = require("bignumber.js");
var currencies_1 = require("@ledgerhq/common/lib/currencies");
var js_prepareTransaction_1 = require("./js-prepareTransaction");
exports.COSMOS_MAX_REDELEGATIONS = 7;
exports.COSMOS_MAX_UNBONDINGS = 7;
exports.COSMOS_MAX_DELEGATIONS = 5;
exports.COSMOS_MIN_SAFE = new bignumber_js_1.BigNumber(100000); // 100000 uAtom
exports.COSMOS_MIN_FEES = new bignumber_js_1.BigNumber(6000); // 6000 uAtom
function mapDelegations(delegations, validators, unit) {
    return delegations.map(function (d) {
        var _a;
        var rank = validators.findIndex(function (v) { return v.validatorAddress === d.validatorAddress; });
        var validator = (_a = validators[rank]) !== null && _a !== void 0 ? _a : d;
        return __assign(__assign({}, d), { formattedAmount: (0, currencies_1.formatCurrencyUnit)(unit, d.amount, {
                disableRounding: true,
                alwaysShowSign: false,
                showCode: true
            }), formattedPendingRewards: (0, currencies_1.formatCurrencyUnit)(unit, d.pendingRewards, {
                disableRounding: true,
                alwaysShowSign: false,
                showCode: true
            }), rank: rank, validator: validator });
    });
}
exports.mapDelegations = mapDelegations;
function mapUnbondings(unbondings, validators, unit) {
    return unbondings
        .sort(function (a, b) { return a.completionDate.valueOf() - b.completionDate.valueOf(); })
        .map(function (u) {
        var validator = validators.find(function (v) { return v.validatorAddress === u.validatorAddress; });
        return __assign(__assign({}, u), { formattedAmount: (0, currencies_1.formatCurrencyUnit)(unit, u.amount, {
                disableRounding: true,
                alwaysShowSign: false,
                showCode: true
            }), validator: validator });
    });
}
exports.mapUnbondings = mapUnbondings;
function mapRedelegations(redelegations, validators, unit) {
    return redelegations.map(function (r) {
        var validatorSrc = validators.find(function (v) { return v.validatorAddress === r.validatorSrcAddress; });
        var validatorDst = validators.find(function (v) { return v.validatorAddress === r.validatorDstAddress; });
        return __assign(__assign({}, r), { formattedAmount: (0, currencies_1.formatCurrencyUnit)(unit, r.amount, {
                disableRounding: true,
                alwaysShowSign: false,
                showCode: true
            }), validatorSrc: validatorSrc, validatorDst: validatorDst });
    });
}
exports.mapRedelegations = mapRedelegations;
var mapDelegationInfo = function (delegations, validators, unit, transaction) {
    return delegations.map(function (d) { return (__assign(__assign({}, d), { validator: validators.find(function (v) { return v.validatorAddress === d.address; }), formattedAmount: (0, currencies_1.formatCurrencyUnit)(unit, transaction ? transaction.amount : d.amount, {
            disableRounding: true,
            alwaysShowSign: false,
            showCode: true
        }) })); });
};
exports.mapDelegationInfo = mapDelegationInfo;
var formatValue = function (value, unit) {
    return value
        .dividedBy(Math.pow(10, unit.magnitude))
        .integerValue(bignumber_js_1.BigNumber.ROUND_FLOOR)
        .toNumber();
};
exports.formatValue = formatValue;
var searchFilter = function (query) {
    return function (_a) {
        var _b, _c;
        var validator = _a.validator;
        var terms = "".concat((_b = validator === null || validator === void 0 ? void 0 : validator.name) !== null && _b !== void 0 ? _b : "", " ").concat((_c = validator === null || validator === void 0 ? void 0 : validator.validatorAddress) !== null && _c !== void 0 ? _c : "");
        return terms.toLowerCase().includes(query.toLowerCase().trim());
    };
};
exports.searchFilter = searchFilter;
function getMaxDelegationAvailable(account, validatorsLength) {
    var numberOfDelegations = Math.min(exports.COSMOS_MAX_DELEGATIONS, validatorsLength || 1);
    var spendableBalance = account.spendableBalance;
    return spendableBalance
        .minus(exports.COSMOS_MIN_FEES.multipliedBy(numberOfDelegations))
        .minus(exports.COSMOS_MIN_SAFE);
}
exports.getMaxDelegationAvailable = getMaxDelegationAvailable;
var getMaxEstimatedBalance = function (a, estimatedFees) {
    var cosmosResources = a.cosmosResources;
    var blockBalance = new bignumber_js_1.BigNumber(0);
    if (cosmosResources) {
        blockBalance = cosmosResources.unbondingBalance.plus(cosmosResources.delegatedBalance);
    }
    var amount = a.balance.minus(estimatedFees).minus(blockBalance);
    // If the fees are greater than the balance we will have a negative amount
    // so we round it to 0
    if (amount.lt(0)) {
        return new bignumber_js_1.BigNumber(0);
    }
    return amount;
};
exports.getMaxEstimatedBalance = getMaxEstimatedBalance;
function canUndelegate(account) {
    var cosmosResources = account.cosmosResources;
    (0, invariant_1["default"])(cosmosResources, "cosmosResources should exist");
    return (!!(cosmosResources === null || cosmosResources === void 0 ? void 0 : cosmosResources.unbondings) &&
        cosmosResources.unbondings.length < exports.COSMOS_MAX_UNBONDINGS);
}
exports.canUndelegate = canUndelegate;
function canDelegate(account) {
    var maxSpendableBalance = getMaxDelegationAvailable(account, 1);
    return maxSpendableBalance.gt(0);
}
exports.canDelegate = canDelegate;
function canRedelegate(account, delegation) {
    var cosmosResources = account.cosmosResources;
    (0, invariant_1["default"])(cosmosResources, "cosmosResources should exist");
    return (!!(cosmosResources === null || cosmosResources === void 0 ? void 0 : cosmosResources.redelegations) &&
        cosmosResources.redelegations.length < exports.COSMOS_MAX_REDELEGATIONS &&
        !cosmosResources.redelegations.some(function (rd) { return rd.validatorDstAddress === delegation.validatorAddress; }));
}
exports.canRedelegate = canRedelegate;
function canClaimRewards(account, delegation) {
    return __awaiter(this, void 0, void 0, function () {
        var cosmosResources, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cosmosResources = account.cosmosResources;
                    (0, invariant_1["default"])(cosmosResources, "cosmosResources should exist");
                    return [4 /*yield*/, (0, js_prepareTransaction_1.calculateFees)({
                            account: account,
                            transaction: {
                                family: "cosmos",
                                mode: "claimReward",
                                amount: new bignumber_js_1.BigNumber(0),
                                fees: null,
                                gas: null,
                                recipient: "",
                                useAllAmount: false,
                                networkInfo: null,
                                memo: null,
                                sourceValidator: null,
                                validators: [
                                    {
                                        address: delegation.validatorAddress,
                                        amount: new bignumber_js_1.BigNumber(0)
                                    },
                                ]
                            }
                        })];
                case 1:
                    res = _a.sent();
                    return [2 /*return*/, (res.estimatedFees.lt(account.spendableBalance) &&
                            res.estimatedFees.lt(delegation.pendingRewards))];
            }
        });
    });
}
exports.canClaimRewards = canClaimRewards;
function getRedelegation(account, delegation) {
    var _a;
    var cosmosResources = account.cosmosResources;
    var redelegations = (_a = cosmosResources === null || cosmosResources === void 0 ? void 0 : cosmosResources.redelegations) !== null && _a !== void 0 ? _a : [];
    var currentRedelegation = redelegations.find(function (r) { return r.validatorDstAddress === delegation.validatorAddress; });
    return currentRedelegation;
}
exports.getRedelegation = getRedelegation;
function getRedelegationCompletionDate(account, delegation) {
    var currentRedelegation = getRedelegation(account, delegation);
    return currentRedelegation ? currentRedelegation.completionDate : null;
}
exports.getRedelegationCompletionDate = getRedelegationCompletionDate;
//# sourceMappingURL=logic.js.map