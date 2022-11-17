"use strict";
exports.__esModule = true;
exports.groupAccountOperationsByDay = exports.groupAccountsOperationsByDay = void 0;
var helpers_1 = require("./helpers");
var operation_1 = require("../operation");
function startOfDay(t) {
    return new Date(t.getFullYear(), t.getMonth(), t.getDate());
}
var emptyDailyOperations = {
    sections: [],
    completed: true
};
var hasStableOperation = function (account, hash) {
    return account.operations.some(function (op) { return op.hash === hash; });
};
/**
 * @memberof account
 */
function groupAccountsOperationsByDay(inputAccounts, _a) {
    var count = _a.count, withSubAccounts = _a.withSubAccounts, filterOperation = _a.filterOperation;
    var accounts = withSubAccounts
        ? (0, helpers_1.flattenAccounts)(inputAccounts)
        : inputAccounts;
    // Track indexes of account.operations[] for each account
    var indexes = Array(accounts.length).fill(0);
    // Track indexes of account.pendingOperations[] for each account
    var indexesPending = Array(accounts.length).fill(0);
    // Returns the next most recent operation from the account with current indexes
    function getNext() {
        var bestOp;
        var bestOpInfo = {
            accountI: 0,
            fromPending: false
        };
        for (var i = 0; i < accounts.length; i++) {
            var account = accounts[i];
            // look in operations
            var op = account.operations[indexes[i]];
            if (filterOperation) {
                // skip operation we want to filter out
                while (op && !filterOperation(op, account)) {
                    op = account.operations[++indexes[i]];
                }
            }
            if (op && (!bestOp || op.date > bestOp.date)) {
                bestOp = op;
                bestOpInfo = {
                    accountI: i,
                    fromPending: false
                };
            }
            // look in pending operations
            var opP = account.pendingOperations[indexesPending[i]];
            while (opP && // skip all pending operations that are already in operations
                (hasStableOperation(account, opP.hash) || // but also if we want to filter it
                    (filterOperation && !filterOperation(opP, account)))) {
                opP = account.pendingOperations[++indexesPending[i]];
            }
            if (opP && (!bestOp || opP.date > bestOp.date)) {
                bestOp = opP;
                bestOpInfo = {
                    accountI: i,
                    fromPending: true
                };
            }
        }
        if (bestOp) {
            if (bestOpInfo.fromPending) {
                indexesPending[bestOpInfo.accountI]++;
            }
            else {
                indexes[bestOpInfo.accountI]++;
            }
            var ops = (0, operation_1.flattenOperationWithInternalsAndNfts)(bestOp);
            return {
                ops: ops,
                date: bestOp.date
            };
        }
    }
    var next = getNext();
    if (!next)
        return emptyDailyOperations;
    var sections = [];
    var totalOperations = 0;
    var day = startOfDay(next.date);
    var data = [];
    while (totalOperations < count && next) {
        if (next.date < day) {
            if (data.length > 0) {
                var slicedData = data.slice(0, count - totalOperations);
                sections.push({
                    day: day,
                    data: slicedData
                });
                totalOperations += slicedData.length;
            }
            day = startOfDay(next.date);
            data = next.ops;
        }
        else {
            data = data.concat(next.ops);
        }
        next = getNext();
    }
    if (data.length > 0 && totalOperations < count) {
        sections.push({
            day: day,
            data: data
        });
    }
    return {
        sections: sections,
        completed: !next
    };
}
exports.groupAccountsOperationsByDay = groupAccountsOperationsByDay;
/**
 * Return a list of `{count}` operations grouped by day.
 * @memberof account
 */
function groupAccountOperationsByDay(account, arg) {
    var accounts = [account];
    return groupAccountsOperationsByDay(accounts, arg);
}
exports.groupAccountOperationsByDay = groupAccountOperationsByDay;
//# sourceMappingURL=groupOperations.js.map