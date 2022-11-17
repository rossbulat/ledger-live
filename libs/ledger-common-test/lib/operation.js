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
exports.__esModule = true;
exports.isConfirmedOperation = exports.getOperationConfirmationDisplayableNumber = exports.getOperationConfirmationNumber = exports.getOperationAmountNumberWithInternals = exports.getOperationAmountNumber = exports.flattenOperationWithInternalsAndNfts = exports.patchOperationWithHash = exports.decodeSubOperationId = exports.encodeSubOperationId = exports.decodeOperationId = exports.encodeOperationId = exports.findOperationInAccount = void 0;
var bignumber_js_1 = require("bignumber.js");
// STP: to fix
// const nftOperationIdEncoderPerStandard: Record<
//   NFTStandard,
//   (...args: any[]) => string
// > = {
//   ERC721: encodeERC721OperationId,
//   ERC1155: encodeERC1155OperationId,
// };
function findOperationInAccount(_a, operationId) {
    var operations = _a.operations, pendingOperations = _a.pendingOperations;
    for (var i = 0; i < operations.length; i++) {
        var op = operations[i];
        if (op.id === operationId)
            return op;
        if (op.internalOperations) {
            var internalOps = op.internalOperations;
            for (var j = 0; j < internalOps.length; j++) {
                var internalOp = internalOps[j];
                if (internalOp.id === operationId)
                    return internalOp;
            }
        }
        if (op.nftOperations) {
            var nftOps = op.nftOperations;
            for (var j = 0; j < nftOps.length; j++) {
                var nftOp = nftOps[j];
                if (nftOp.id === operationId)
                    return nftOp;
            }
        }
    }
    for (var i = 0; i < pendingOperations.length; i++) {
        var op = pendingOperations[i];
        if (op.id === operationId)
            return op;
        if (op.nftOperations) {
            var nftOps = op.nftOperations;
            for (var j = 0; j < nftOps.length; j++) {
                var nftOp = nftOps[j];
                if (nftOp.id === operationId)
                    return nftOp;
            }
        }
    }
    return null;
}
exports.findOperationInAccount = findOperationInAccount;
function encodeOperationId(accountId, hash, type) {
    return "".concat(accountId, "-").concat(hash, "-").concat(type);
}
exports.encodeOperationId = encodeOperationId;
function decodeOperationId(id) {
    var _a = __read(id.split("-"), 3), accountId = _a[0], hash = _a[1], type = _a[2];
    return {
        accountId: accountId,
        hash: hash,
        type: type
    };
}
exports.decodeOperationId = decodeOperationId;
function encodeSubOperationId(accountId, hash, type, index) {
    return "".concat(accountId, "-").concat(hash, "-").concat(type, "-i").concat(index);
}
exports.encodeSubOperationId = encodeSubOperationId;
function decodeSubOperationId(id) {
    var _a = __read(id.split("-"), 4), accountId = _a[0], hash = _a[1], type = _a[2], index = _a[3];
    return {
        accountId: accountId,
        hash: hash,
        type: type,
        index: Number(index)
    };
}
exports.decodeSubOperationId = decodeSubOperationId;
function patchOperationWithHash(operation, hash) {
    return __assign(__assign({}, operation), { hash: hash, id: encodeOperationId(operation.accountId, hash, operation.type), subOperations: operation.subOperations &&
            operation.subOperations.map(function (op) { return (__assign(__assign({}, op), { hash: hash, id: encodeOperationId(op.accountId, hash, op.type) })); }) });
}
exports.patchOperationWithHash = patchOperationWithHash;
function flattenOperationWithInternalsAndNfts(op) {
    var ops = [];
    // ops of type NONE does not appear in lists
    if (op.type !== "NONE") {
        ops.push(op);
    }
    // all internal operations are expanded after the main op
    if (op.internalOperations) {
        ops = ops.concat(op.internalOperations);
    }
    // all nfts operations are expanded after the main op
    if (op.nftOperations) {
        ops = ops.concat(op.nftOperations);
    }
    return ops;
}
exports.flattenOperationWithInternalsAndNfts = flattenOperationWithInternalsAndNfts;
function getOperationAmountNumber(op) {
    switch (op.type) {
        case "IN":
        case "REWARD":
        case "REWARD_PAYOUT":
        case "SUPPLY":
        case "WITHDRAW":
            return op.value;
        case "OUT":
        case "REVEAL":
        case "CREATE":
        case "FEES":
        case "DELEGATE":
        case "REDELEGATE":
        case "UNDELEGATE":
        case "OPT_IN":
        case "OPT_OUT":
        case "REDEEM":
        case "SLASH":
        case "LOCK":
            return op.value.negated();
        case "FREEZE":
        case "UNFREEZE":
        case "VOTE":
        case "BOND":
        case "UNBOND":
        case "WITHDRAW_UNBONDED":
        case "SET_CONTROLLER":
        case "NOMINATE":
        case "CHILL":
        case "REVOKE":
        case "APPROVE":
        case "ACTIVATE":
        case "UNLOCK":
            return op.fee.negated();
        default:
            return new bignumber_js_1.BigNumber(0);
    }
}
exports.getOperationAmountNumber = getOperationAmountNumber;
function getOperationAmountNumberWithInternals(op) {
    return flattenOperationWithInternalsAndNfts(op).reduce(function (amount, op) { return amount.plus(getOperationAmountNumber(op)); }, new bignumber_js_1.BigNumber(0));
}
exports.getOperationAmountNumberWithInternals = getOperationAmountNumberWithInternals;
var getOperationConfirmationNumber = function (operation, account) {
    return operation.blockHeight ? account.blockHeight - operation.blockHeight + 1 : 0;
};
exports.getOperationConfirmationNumber = getOperationConfirmationNumber;
var getOperationConfirmationDisplayableNumber = function (operation, account) {
    return account.blockHeight && operation.blockHeight && account.currency.blockAvgTime
        ? String(account.blockHeight - operation.blockHeight + 1)
        : "";
};
exports.getOperationConfirmationDisplayableNumber = getOperationConfirmationDisplayableNumber;
var isConfirmedOperation = function (operation, account, confirmationsNb) {
    return operation.blockHeight
        ? account.blockHeight - operation.blockHeight + 1 >= confirmationsNb
        : false;
};
exports.isConfirmedOperation = isConfirmedOperation;
//# sourceMappingURL=operation.js.map