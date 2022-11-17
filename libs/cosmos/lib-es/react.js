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
import invariant from "invariant";
import { useEffect, useMemo, useState } from "react";
import { getCurrentCosmosPreloadData, getCosmosPreloadDataUpdates, } from "./preloadedData";
import { mapDelegations, mapDelegationInfo, searchFilter as defaultSearchFilter, } from "./logic";
import { getAccountUnit } from "@ledgerhq/common/lib/account";
import { LEDGER_VALIDATOR_ADDRESS } from "./utils";
// Add Cosmos-families imports below:
import { getCurrentOsmosisPreloadData, getOsmosisPreloadDataUpdates, } from "./osmosis/preloadedData";
import { LEDGER_OSMOSIS_VALIDATOR_ADDRESS } from "./osmosis/utils";
export function useCosmosFamilyPreloadData(currencyName) {
    var getCurrent;
    var getUpdates;
    if (currencyName == "cosmos") {
        getCurrent = getCurrentCosmosPreloadData;
        getUpdates = getCosmosPreloadDataUpdates;
    }
    if (currencyName == "osmosis") {
        getCurrent = getCurrentOsmosisPreloadData;
        getUpdates = getOsmosisPreloadDataUpdates;
    }
    var _a = __read(useState(getCurrent), 2), state = _a[0], setState = _a[1];
    useEffect(function () {
        var sub = getUpdates().subscribe(setState);
        return function () { return sub.unsubscribe(); };
    }, [getCurrent, getUpdates]);
    return state;
}
// export function useCosmosPreloadData(): CosmosPreloadData {
//   const [state, setState] = useState(getCurrentCosmosPreloadData);
//   useEffect(() => {
//     const sub = getCosmosPreloadDataUpdates().subscribe(setState);
//     return () => sub.unsubscribe();
//   }, []);
//   return state;
// }
export function useCosmosFamilyMappedDelegations(account, mode) {
    var _a;
    var currencyName = account.currency.name.toLowerCase();
    var validators = useCosmosFamilyPreloadData(currencyName).validators;
    var delegations = (_a = account.cosmosResources) === null || _a === void 0 ? void 0 : _a.delegations;
    invariant(delegations, "cosmos: delegations is required");
    var unit = getAccountUnit(account);
    return useMemo(function () {
        var mappedDelegations = mapDelegations(delegations || [], validators, unit);
        return mode === "claimReward"
            ? mappedDelegations.filter(function (_a) {
                var pendingRewards = _a.pendingRewards;
                return pendingRewards.gt(0);
            })
            : mappedDelegations;
    }, [delegations, validators, mode, unit]);
}
export function useCosmosFamilyDelegationsQuerySelector(account, transaction, delegationSearchFilter) {
    if (delegationSearchFilter === void 0) { delegationSearchFilter = defaultSearchFilter; }
    var _a = __read(useState(""), 2), query = _a[0], setQuery = _a[1];
    var delegations = useCosmosFamilyMappedDelegations(account, transaction.mode);
    var options = useMemo(function () { return delegations.filter(delegationSearchFilter(query)); }, [query, delegations, delegationSearchFilter]);
    var selectedValidator = transaction.validators && transaction.validators[0];
    var value = useMemo(function () {
        switch (transaction.mode) {
            case "redelegate":
                invariant(transaction.sourceValidator, "cosmos: sourceValidator is required");
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
/** Hook to search and sort SR list according to initial votes and query */
export function useSortedValidators(search, validators, delegations, validatorSearchFilter) {
    if (validatorSearchFilter === void 0) { validatorSearchFilter = defaultSearchFilter; }
    var initialVotes = delegations.map(function (_a) {
        var address = _a.address;
        return address;
    });
    var mappedValidators = useMemo(function () {
        return validators.map(function (validator, rank) { return ({
            rank: rank + 1,
            validator: validator
        }); });
    }, [validators]);
    var sortedVotes = useMemo(function () {
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
    var sr = useMemo(function () {
        return search
            ? mappedValidators.filter(validatorSearchFilter(search))
            : sortedVotes;
    }, [search, mappedValidators, sortedVotes, validatorSearchFilter]);
    return sr;
}
// Nothing using this function?
export function useMappedExtraOperationDetails(_a) {
    var account = _a.account, extra = _a.extra;
    var validators = useCosmosFamilyPreloadData("cosmos").validators;
    var unit = getAccountUnit(account);
    return {
        validators: extra.validators
            ? mapDelegationInfo(extra.validators, validators, unit)
            : undefined,
        validator: extra.validator
            ? mapDelegationInfo([extra.validator], validators, unit)[0]
            : undefined,
        sourceValidator: extra.sourceValidator ? extra.sourceValidator : undefined,
        autoClaimedRewards: extra.autoClaimedRewards != null
            ? extra.autoClaimedRewards
            : "empty string"
    };
}
export function useLedgerFirstShuffledValidatorsCosmosFamily(currencyName, searchInput) {
    var data;
    var ledgerValidatorAddress;
    if (currencyName == "osmosis") {
        data = getCurrentOsmosisPreloadData();
        ledgerValidatorAddress = LEDGER_OSMOSIS_VALIDATOR_ADDRESS;
    }
    else {
        data = getCurrentCosmosPreloadData();
        ledgerValidatorAddress = LEDGER_VALIDATOR_ADDRESS;
    }
    return useMemo(function () {
        var _a;
        return reorderValidators((_a = data === null || data === void 0 ? void 0 : data.validators) !== null && _a !== void 0 ? _a : [], ledgerValidatorAddress, searchInput);
    }, [data, ledgerValidatorAddress, searchInput]);
}
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