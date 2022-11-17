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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.useLedgerFirstShuffledValidatorsCosmosFamily = exports.useMappedExtraOperationDetails = exports.useSortedValidators = exports.useCosmosFamilyDelegationsQuerySelector = exports.useCosmosFamilyMappedDelegations = exports.useCosmosFamilyPreloadData = void 0;
var invariant_1 = __importDefault(require("invariant"));
var react_1 = require("react");
var preloadedData_1 = require("./preloadedData");
var logic_1 = require("./logic");
var account_1 = require("@ledgerhq/common/lib/account");
var utils_1 = require("./utils");
// Add Cosmos-families imports below:
var preloadedData_2 = require("./osmosis/preloadedData");
var utils_2 = require("./osmosis/utils");
function useCosmosFamilyPreloadData(currencyName) {
    var getCurrent;
    var getUpdates;
    if (currencyName == "cosmos") {
        getCurrent = preloadedData_1.getCurrentCosmosPreloadData;
        getUpdates = preloadedData_1.getCosmosPreloadDataUpdates;
    }
    if (currencyName == "osmosis") {
        getCurrent = preloadedData_2.getCurrentOsmosisPreloadData;
        getUpdates = preloadedData_2.getOsmosisPreloadDataUpdates;
    }
    var _a = __read((0, react_1.useState)(getCurrent), 2), state = _a[0], setState = _a[1];
    (0, react_1.useEffect)(function () {
        var sub = getUpdates().subscribe(setState);
        return function () { return sub.unsubscribe(); };
    }, [getCurrent, getUpdates]);
    return state;
}
exports.useCosmosFamilyPreloadData = useCosmosFamilyPreloadData;
// export function useCosmosPreloadData(): CosmosPreloadData {
//   const [state, setState] = useState(getCurrentCosmosPreloadData);
//   useEffect(() => {
//     const sub = getCosmosPreloadDataUpdates().subscribe(setState);
//     return () => sub.unsubscribe();
//   }, []);
//   return state;
// }
function useCosmosFamilyMappedDelegations(account, mode) {
    var _a;
    var currencyName = account.currency.name.toLowerCase();
    var validators = useCosmosFamilyPreloadData(currencyName).validators;
    var delegations = (_a = account.cosmosResources) === null || _a === void 0 ? void 0 : _a.delegations;
    (0, invariant_1["default"])(delegations, "cosmos: delegations is required");
    var unit = (0, account_1.getAccountUnit)(account);
    return (0, react_1.useMemo)(function () {
        var mappedDelegations = (0, logic_1.mapDelegations)(delegations || [], validators, unit);
        return mode === "claimReward"
            ? mappedDelegations.filter(function (_a) {
                var pendingRewards = _a.pendingRewards;
                return pendingRewards.gt(0);
            })
            : mappedDelegations;
    }, [delegations, validators, mode, unit]);
}
exports.useCosmosFamilyMappedDelegations = useCosmosFamilyMappedDelegations;
function useCosmosFamilyDelegationsQuerySelector(account, transaction, delegationSearchFilter) {
    if (delegationSearchFilter === void 0) { delegationSearchFilter = logic_1.searchFilter; }
    var _a = __read((0, react_1.useState)(""), 2), query = _a[0], setQuery = _a[1];
    var delegations = useCosmosFamilyMappedDelegations(account, transaction.mode);
    var options = (0, react_1.useMemo)(function () { return delegations.filter(delegationSearchFilter(query)); }, [query, delegations, delegationSearchFilter]);
    var selectedValidator = transaction.validators && transaction.validators[0];
    var value = (0, react_1.useMemo)(function () {
        switch (transaction.mode) {
            case "redelegate":
                (0, invariant_1["default"])(transaction.sourceValidator, "cosmos: sourceValidator is required");
                return options.find(function (_a) {
                    var validatorAddress = _a.validatorAddress;
                    return validatorAddress === transaction.sourceValidator;
                });
            default:
                return (selectedValidator &&
                    delegations.find(function (_a) {
                        var validatorAddress = _a.validatorAddress;
                        return validatorAddress === selectedValidator.address;
                    }));
        }
    }, [delegations, selectedValidator, transaction, options]);
    return {
        query: query,
        setQuery: setQuery,
        options: options,
        value: value
    };
}
exports.useCosmosFamilyDelegationsQuerySelector = useCosmosFamilyDelegationsQuerySelector;
/** Hook to search and sort SR list according to initial votes and query */
function useSortedValidators(search, validators, delegations, validatorSearchFilter) {
    if (validatorSearchFilter === void 0) { validatorSearchFilter = logic_1.searchFilter; }
    var initialVotes = delegations.map(function (_a) {
        var address = _a.address;
        return address;
    });
    var mappedValidators = (0, react_1.useMemo)(function () {
        return validators.map(function (validator, rank) { return ({
            rank: rank + 1,
            validator: validator
        }); });
    }, [validators]);
    var sortedVotes = (0, react_1.useMemo)(function () {
        return mappedValidators
            .filter(function (_a) {
            var validator = _a.validator;
            return initialVotes.includes(validator.validatorAddress);
        })
            .concat(mappedValidators.filter(function (_a) {
            var validator = _a.validator;
            return !initialVotes.includes(validator.validatorAddress);
        }));
    }, [mappedValidators, initialVotes]);
    var sr = (0, react_1.useMemo)(function () {
        return search
            ? mappedValidators.filter(validatorSearchFilter(search))
            : sortedVotes;
    }, [search, mappedValidators, sortedVotes, validatorSearchFilter]);
    return sr;
}
exports.useSortedValidators = useSortedValidators;
// Nothing using this function?
function useMappedExtraOperationDetails(_a) {
    var account = _a.account, extra = _a.extra;
    var validators = useCosmosFamilyPreloadData("cosmos").validators;
    var unit = (0, account_1.getAccountUnit)(account);
    return {
        validators: extra.validators
            ? (0, logic_1.mapDelegationInfo)(extra.validators, validators, unit)
            : undefined,
        validator: extra.validator
            ? (0, logic_1.mapDelegationInfo)([extra.validator], validators, unit)[0]
            : undefined,
        sourceValidator: extra.sourceValidator ? extra.sourceValidator : undefined,
        autoClaimedRewards: extra.autoClaimedRewards != null
            ? extra.autoClaimedRewards
            : "empty string"
    };
}
exports.useMappedExtraOperationDetails = useMappedExtraOperationDetails;
function useLedgerFirstShuffledValidatorsCosmosFamily(currencyName, searchInput) {
    var data;
    var ledgerValidatorAddress;
    if (currencyName == "osmosis") {
        data = (0, preloadedData_2.getCurrentOsmosisPreloadData)();
        ledgerValidatorAddress = utils_2.LEDGER_OSMOSIS_VALIDATOR_ADDRESS;
    }
    else {
        data = (0, preloadedData_1.getCurrentCosmosPreloadData)();
        ledgerValidatorAddress = utils_1.LEDGER_VALIDATOR_ADDRESS;
    }
    return (0, react_1.useMemo)(function () {
        var _a;
        return reorderValidators((_a = data === null || data === void 0 ? void 0 : data.validators) !== null && _a !== void 0 ? _a : [], ledgerValidatorAddress, searchInput);
    }, [data, ledgerValidatorAddress, searchInput]);
}
exports.useLedgerFirstShuffledValidatorsCosmosFamily = useLedgerFirstShuffledValidatorsCosmosFamily;
function reorderValidators(validators, ledgerValidatorAddress, searchInput) {
    var sortedValidators = validators
        .filter(function (validator) { return validator.commission !== 1.0; })
        .filter(function (validator) {
        return searchInput
            ? validator.name.toLowerCase().includes(searchInput.toLowerCase())
            : true;
    })
        .sort(function (a, b) { return b.votingPower - a.votingPower; });
    // move Ledger validator to the first position
    var ledgerValidator = sortedValidators.find(function (v) { return v.validatorAddress === ledgerValidatorAddress; });
    if (ledgerValidator) {
        var sortedValidatorsLedgerFirst = sortedValidators.filter(function (v) { return v.validatorAddress !== ledgerValidatorAddress; });
        sortedValidatorsLedgerFirst.unshift(ledgerValidator);
        return sortedValidatorsLedgerFirst;
    }
    return sortedValidators;
}
//# sourceMappingURL=react.js.map