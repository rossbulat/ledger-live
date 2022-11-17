"use strict";
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.getAccountBannerState = void 0;
var preloadedData_1 = require("./preloadedData");
var utils_1 = require("./utils");
var logic_1 = require("./logic");
function getAccountBannerState(account) {
    // Group current validator
    var cosmosResources = account.cosmosResources
        ? account.cosmosResources
        : { delegations: [], redelegations: [] };
    var delegationAddresses = cosmosResources.delegations.map(function (delegation) {
        return delegation.validatorAddress;
    });
    var redelegationAddresses = cosmosResources.redelegations.map(function (redelegation) {
        return redelegation.validatorDstAddress;
    });
    var validatorAdresses = __spreadArray(__spreadArray([], __read(delegationAddresses), false), __read(redelegationAddresses), false);
    // Get ledger validator data
    var validators = (0, preloadedData_1.getCurrentCosmosPreloadData)().validators;
    var ledgerValidator = validators.find(function (validator) { return validator.validatorAddress === utils_1.LEDGER_VALIDATOR_ADDRESS; });
    // Find user current worst validator (default validator is ledger)
    var worstValidator = ledgerValidator;
    var _loop_1 = function (i) {
        var validatorAdress = validatorAdresses[i];
        var validator = validators.find(function (validator) { return validator.validatorAddress === validatorAdress; });
        if (worstValidator &&
            validator &&
            worstValidator.commission < validator.commission &&
            (0, logic_1.canRedelegate)(account, validator)) {
            worstValidator = validator;
        }
    };
    for (var i = 0; i < validatorAdresses.length; i++) {
        _loop_1(i);
    }
    var redelegate = false;
    var validatorSrcAddress = "";
    var display = false;
    if (worstValidator) {
        if ((worstValidator === null || worstValidator === void 0 ? void 0 : worstValidator.validatorAddress) === (ledgerValidator === null || ledgerValidator === void 0 ? void 0 : ledgerValidator.validatorAddress)) {
            // Not found worst validator than ledger
            if ((0, logic_1.canDelegate)(account)) {
                // Delegate remaining ATOM (not staked)
                display = true;
            }
        }
        else {
            // Redelegate to the worst validator
            display = true;
            redelegate = true;
            validatorSrcAddress = worstValidator.validatorAddress;
        }
    }
    return {
        display: display,
        redelegate: redelegate,
        validatorSrcAddress: validatorSrcAddress,
        ledgerValidator: ledgerValidator
    };
}
exports.getAccountBannerState = getAccountBannerState;
//# sourceMappingURL=banner.js.map