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
import { getEnv } from "../env";
export function shouldRetainPendingOperation(account, op) {
    // FIXME: valueOf to compare dates in typescript
    var delay = new Date().valueOf() - op.date.valueOf();
    var last = account.operations[0];
    if (last &&
        last.transactionSequenceNumber &&
        op.transactionSequenceNumber &&
        op.transactionSequenceNumber <= last.transactionSequenceNumber) {
        return false;
    }
    return delay < getEnv("OPERATION_OPTIMISTIC_RETENTION");
}
var appendPendingOp = function (ops, op) {
    var filtered = ops.filter(function (o) { return o.transactionSequenceNumber !== op.transactionSequenceNumber; });
    filtered.unshift(op);
    return filtered;
};
export var addPendingOperation = function (account, operation) {
    var accountCopy = __assign({}, account);
    var subOperations = operation.subOperations;
    var subAccounts = account.subAccounts;
    function addInSubAccount(subaccounts, op) {
        var acc = subaccounts.find(function (sub) { return sub.id === op.accountId; });
        if (acc) {
            // $FlowFixMe
            var copy = __assign({}, acc);
            copy.pendingOperations = appendPendingOp(acc.pendingOperations, op);
            subaccounts[subaccounts.indexOf(acc)] = copy;
        }
    }
    if (subOperations && subAccounts) {
        var taCopy_1 = subAccounts.slice(0);
        subOperations.forEach(function (op) {
            addInSubAccount(taCopy_1, op);
        });
        accountCopy.subAccounts = taCopy_1;
    }
    if (accountCopy.id === operation.accountId) {
        accountCopy.pendingOperations = appendPendingOp(accountCopy.pendingOperations, operation);
    }
    else if (subAccounts) {
        var taCopy = subAccounts.slice(0);
        addInSubAccount(taCopy, operation);
        accountCopy.subAccounts = taCopy;
    }
    return accountCopy;
};
//# sourceMappingURL=pending.js.map