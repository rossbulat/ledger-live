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
import invariant from "invariant";
import { BigNumber } from "bignumber.js";
import { formatCurrencyUnit } from "@ledgerhq/ledger-common/lib/currencies";
import { calculateFees } from "./js-prepareTransaction";
export var COSMOS_MAX_REDELEGATIONS = 7;
export var COSMOS_MAX_UNBONDINGS = 7;
export var COSMOS_MAX_DELEGATIONS = 5;
export var COSMOS_MIN_SAFE = new BigNumber(100000); // 100000 uAtom
export var COSMOS_MIN_FEES = new BigNumber(6000); // 6000 uAtom
export function mapDelegations(delegations, validators, unit) {
    return delegations.map(function (d) {
        var _a;
        var rank = validators.findIndex(function (v) { return v.validatorAddress === d.validatorAddress; });
        var validator = (_a = validators[rank]) !== null && _a !== void 0 ? _a : d;
        return __assign(__assign({}, d), { formattedAmount: formatCurrencyUnit(unit, d.amount, {
                disableRounding: true,
                alwaysShowSign: false,
                showCode: true
            }), formattedPendingRewards: formatCurrencyUnit(unit, d.pendingRewards, {
                disableRounding: true,
                alwaysShowSign: false,
                showCode: true
            }), rank: rank, validator: validator });
    });
}
export function mapUnbondings(unbondings, validators, unit) {
    return unbondings
        .sort(function (a, b) { return a.completionDate.valueOf() - b.completionDate.valueOf(); })
        .map(function (u) {
        var validator = validators.find(function (v) { return v.validatorAddress === u.validatorAddress; });
        return __assign(__assign({}, u), { formattedAmount: formatCurrencyUnit(unit, u.amount, {
                disableRounding: true,
                alwaysShowSign: false,
                showCode: true
            }), validator: validator });
    });
}
export function mapRedelegations(redelegations, validators, unit) {
    return redelegations.map(function (r) {
        var validatorSrc = validators.find(function (v) { return v.validatorAddress === r.validatorSrcAddress; });
        var validatorDst = validators.find(function (v) { return v.validatorAddress === r.validatorDstAddress; });
        return __assign(__assign({}, r), { formattedAmount: formatCurrencyUnit(unit, r.amount, {
                disableRounding: true,
                alwaysShowSign: false,
                showCode: true
            }), validatorSrc: validatorSrc, validatorDst: validatorDst });
    });
}
export var mapDelegationInfo = function (delegations, validators, unit, transaction) {
    return delegations.map(function (d) { return (__assign(__assign({}, d), { validator: validators.find(function (v) { return v.validatorAddress === d.address; }), formattedAmount: formatCurrencyUnit(unit, transaction ? transaction.amount : d.amount, {
            disableRounding: true,
            alwaysShowSign: false,
            showCode: true
        }) })); });
};
export var formatValue = function (value, unit) {
    return value
        .dividedBy(Math.pow(10, unit.magnitude))
        .integerValue(BigNumber.ROUND_FLOOR)
        .toNumber();
};
export var searchFilter = function (query) {
    return function (_a) {
        var _b, _c;
        var validator = _a.validator;
        var terms = "".concat((_b = validator === null || validator === void 0 ? void 0 : validator.name) !== null && _b !== void 0 ? _b : "", " ").concat((_c = validator === null || validator === void 0 ? void 0 : validator.validatorAddress) !== null && _c !== void 0 ? _c : "");
        return terms.toLowerCase().includes(query.toLowerCase().trim());
    };
};
export function getMaxDelegationAvailable(account, validatorsLength) {
    var numberOfDelegations = Math.min(COSMOS_MAX_DELEGATIONS, validatorsLength || 1);
    var spendableBalance = account.spendableBalance;
    return spendableBalance
        .minus(COSMOS_MIN_FEES.multipliedBy(numberOfDelegations))
        .minus(COSMOS_MIN_SAFE);
}
export var getMaxEstimatedBalance = function (a, estimatedFees) {
    var cosmosResources = a.cosmosResources;
    var blockBalance = new BigNumber(0);
    if (cosmosResources) {
        blockBalance = cosmosResources.unbondingBalance.plus(cosmosResources.delegatedBalance);
    }
    var amount = a.balance.minus(estimatedFees).minus(blockBalance);
    // If the fees are greater than the balance we will have a negative amount
    // so we round it to 0
    if (amount.lt(0)) {
        return new BigNumber(0);
    }
    return amount;
};
export function canUndelegate(account) {
    var cosmosResources = account.cosmosResources;
    invariant(cosmosResources, "cosmosResources should exist");
    return (!!(cosmosResources === null || cosmosResources === void 0 ? void 0 : cosmosResources.unbondings) &&
        cosmosResources.unbondings.length < COSMOS_MAX_UNBONDINGS);
}
export function canDelegate(account) {
    var maxSpendableBalance = getMaxDelegationAvailable(account, 1);
    return maxSpendableBalance.gt(0);
}
export function canRedelegate(account, delegation) {
    var cosmosResources = account.cosmosResources;
    invariant(cosmosResources, "cosmosResources should exist");
    return (!!(cosmosResources === null || cosmosResources === void 0 ? void 0 : cosmosResources.redelegations) &&
        cosmosResources.redelegations.length < COSMOS_MAX_REDELEGATIONS &&
        !cosmosResources.redelegations.some(function (rd) { return rd.validatorDstAddress === delegation.validatorAddress; }));
}
export function canClaimRewards(account, delegation) {
    return __awaiter(this, void 0, void 0, function () {
        var cosmosResources, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cosmosResources = account.cosmosResources;
                    invariant(cosmosResources, "cosmosResources should exist");
                    return [4 /*yield*/, calculateFees({
                            account: account,
                            transaction: {
                                family: "cosmos",
                                mode: "claimReward",
                                amount: new BigNumber(0),
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
                                        amount: new BigNumber(0)
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
export function getRedelegation(account, delegation) {
    var _a;
    var cosmosResources = account.cosmosResources;
    var redelegations = (_a = cosmosResources === null || cosmosResources === void 0 ? void 0 : cosmosResources.redelegations) !== null && _a !== void 0 ? _a : [];
    var currentRedelegation = redelegations.find(function (r) { return r.validatorDstAddress === delegation.validatorAddress; });
    return currentRedelegation;
}
export function getRedelegationCompletionDate(account, delegation) {
    var currentRedelegation = getRedelegation(account, delegation);
    return currentRedelegation ? currentRedelegation.completionDate : null;
}
//# sourceMappingURL=logic.js.map