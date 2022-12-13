var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
import BigNumber from "bignumber.js";
import { getEnv } from "@ledgerhq/ledger-common/lib/env";
import network from "@ledgerhq/ledger-common/lib/network";
import { encodeOperationId } from "@ledgerhq/ledger-common/lib/operation";
import { CosmosAPI } from "../../api/Cosmos";
import { OsmosisCurrency, OsmosisTransactionTypeEnum, } from "./sdk.types";
export var nodeEndpoint = getEnv("API_OSMOSIS_NODE").replace(/\/$/, "");
var indexerEndpoint = getEnv("API_OSMOSIS_INDEXER").replace(/\/$/, "");
/**
 * Returns true if account is the signer
 */
function isSender(content, addr) {
    return content.account.id === addr;
}
/**
 * Map transaction to an Operation Type
 */
function getOperationType(eventContent, addr) {
    return isSender(eventContent.sender[0], addr) ? "OUT" : "IN";
}
/**
 * Map a send transaction as returned by the indexer to a Ledger Live Operation
 */
export var convertTransactionToOperation = function (accountId, type, value, transaction, senders, recipients, extra) {
    if (senders === void 0) { senders = []; }
    if (recipients === void 0) { recipients = []; }
    return {
        id: encodeOperationId(accountId, transaction.hash, type),
        accountId: accountId,
        fee: new BigNumber(getMicroOsmoAmount(transaction.transaction_fee)),
        value: value,
        type: type,
        hash: transaction.hash,
        blockHash: transaction.block_hash,
        blockHeight: transaction.height,
        date: new Date(transaction.time),
        senders: senders,
        recipients: recipients,
        hasFailed: transaction.has_errors,
        extra: extra
    };
};
/**
 * Map transaction to a correct Operation Value (affecting account balance)
 */
export function getOperationValue(eventContent, type, fee) {
    var _a, _b;
    var amount;
    switch (type) {
        // Per operation.ts, in "OUT" case, it includes the fees. in "IN" case, it excludes them.
        case "OUT":
            amount = BigNumber.sum(getMicroOsmoAmount((_a = eventContent.sender[0]) === null || _a === void 0 ? void 0 : _a.amounts), fee);
            break;
        case "IN":
            amount = getMicroOsmoAmount((_b = eventContent.recipient[0]) === null || _b === void 0 ? void 0 : _b.amounts);
            break;
        default:
            // defaults to received funds (i.e. no fee is added)
            // amount = getMicroOsmoAmount(eventContent.recipient[0]?.amounts);
            amount = new BigNumber(0);
    }
    return amount;
}
/**
 * Extract only the amount from a list of type OsmosisAmount
 */
export var getMicroOsmoAmount = function (amounts) {
    return amounts.reduce(function (result, current) {
        return current.currency === OsmosisCurrency
            ? result.plus(new BigNumber(current.numeric))
            : result;
    }, new BigNumber(0));
};
var OsmosisAPI = /** @class */ (function (_super) {
    __extends(OsmosisAPI, _super);
    function OsmosisAPI() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._defaultEndpoint = nodeEndpoint;
        _this._namespace = "osmosis";
        _this._defaultTransactionsLimit = 100;
        _this.getOperations = function (accountId, address, startDate, startAt, transactionsLimit) {
            if (startAt === void 0) { startAt = 0; }
            if (transactionsLimit === void 0) { transactionsLimit = _this._defaultTransactionsLimit; }
            return __awaiter(_this, void 0, void 0, function () {
                var now, operations, accountTransactions, i, events, memo, j, transactionType, _a, operation, ops, ops, ops, ops;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            now = new Date().toISOString();
                            operations = [];
                            return [4 /*yield*/, network({
                                    method: "POST",
                                    url: "".concat(indexerEndpoint, "/transactions_search/"),
                                    data: {
                                        network: "osmosis",
                                        // type: [OsmosisTransactionTypeEnum.Redelegate], // if no type is specified, all transaction types will be returned
                                        account: [address],
                                        before_time: now,
                                        after_time: startDate !== null ? startDate.toISOString() : null,
                                        limit: transactionsLimit,
                                        offset: startAt
                                    }
                                })];
                        case 1:
                            accountTransactions = (_b.sent()).data;
                            if (!accountTransactions || !accountTransactions.length) {
                                return [2 /*return*/, operations];
                            }
                            i = 0;
                            _b.label = 2;
                        case 2:
                            if (!(i < accountTransactions.length)) return [3 /*break*/, 17];
                            events = accountTransactions[i].events;
                            memo = accountTransactions[i].memo || "";
                            j = 0;
                            _b.label = 3;
                        case 3:
                            if (!(j < events.length)) return [3 /*break*/, 16];
                            transactionType = events[j].kind ? events[j].kind : "n/a";
                            // Example: "send". See: OsmosisTransactionTypeEnum.
                            // Note: "send" means all transactions where some party was sending some OSMO,
                            // which means it shouldn't be interpreted as OUT transactions. See isSender()
                            // for context on how we determine if a "send" transaction is IN or OUT.
                            _a = transactionType;
                            switch (_a) {
                                case OsmosisTransactionTypeEnum.Send: return [3 /*break*/, 4];
                                case OsmosisTransactionTypeEnum.Delegate: return [3 /*break*/, 6];
                                case OsmosisTransactionTypeEnum.Redelegate: return [3 /*break*/, 8];
                                case OsmosisTransactionTypeEnum.Undelegate: return [3 /*break*/, 10];
                                case OsmosisTransactionTypeEnum.Reward: return [3 /*break*/, 12];
                            }
                            return [3 /*break*/, 14];
                        case 4: return [4 /*yield*/, this.convertSendTransactionToOperation(accountId, address, events[j], accountTransactions[i], memo)];
                        case 5:
                            operation = _b.sent();
                            if (operation != null) {
                                operations.push(operation);
                            }
                            return [3 /*break*/, 15];
                        case 6: return [4 /*yield*/, this.convertDelegateTransactionToOperation(accountId, events[j], accountTransactions[i], memo)];
                        case 7:
                            ops = _b.sent();
                            if (ops.length > 0) {
                                ops.forEach(function (op) { return operations.push(op); });
                            }
                            return [3 /*break*/, 15];
                        case 8: return [4 /*yield*/, this.convertRedelegateTransactionToOperation(accountId, events[j], accountTransactions[i], memo)];
                        case 9:
                            ops = _b.sent();
                            if (ops.length > 0) {
                                ops.forEach(function (op) { return operations.push(op); });
                            }
                            return [3 /*break*/, 15];
                        case 10: return [4 /*yield*/, this.convertUndelegateTransactionToOperation(accountId, events[j], accountTransactions[i], memo)];
                        case 11:
                            ops = _b.sent();
                            if (ops.length > 0) {
                                ops.forEach(function (op) { return operations.push(op); });
                            }
                            return [3 /*break*/, 15];
                        case 12: return [4 /*yield*/, this.convertRewardTransactionToOperation(accountId, accountTransactions[i], memo)];
                        case 13:
                            ops = _b.sent();
                            if (ops.length > 0) {
                                ops.forEach(function (op) { return operations.push(op); });
                            }
                            return [3 /*break*/, 15];
                        case 14: return [3 /*break*/, 15];
                        case 15:
                            j++;
                            return [3 /*break*/, 3];
                        case 16:
                            i++;
                            return [3 /*break*/, 2];
                        case 17: return [2 /*return*/, operations];
                    }
                });
            });
        };
        _this.convertSendTransactionToOperation = function (accountId, address, event, tx, memo) { return __awaiter(_this, void 0, void 0, function () {
            var eventContent, sendEvent, type, senders, recipients, fee;
            var _a, _b, _c, _d, _e, _f, _g, _h;
            return __generator(this, function (_j) {
                // Check "sub" array exists. The "sub" array contains transactions messages. If there isn't one, skip the tx
                if (!Object.prototype.hasOwnProperty.call(event, "sub")) {
                    return [2 /*return*/];
                }
                eventContent = event.sub;
                // Check that sub array is not empty
                if (!(eventContent.length > 0))
                    return [2 /*return*/];
                sendEvent = eventContent.find(function (event) { return event.type[0] === OsmosisTransactionTypeEnum.Send; });
                if (sendEvent == null)
                    return [2 /*return*/];
                type = getOperationType(sendEvent, address);
                senders = ((_b = (_a = sendEvent.sender[0]) === null || _a === void 0 ? void 0 : _a.account) === null || _b === void 0 ? void 0 : _b.id)
                    ? [(_d = (_c = sendEvent.sender[0]) === null || _c === void 0 ? void 0 : _c.account) === null || _d === void 0 ? void 0 : _d.id]
                    : [];
                recipients = ((_f = (_e = sendEvent.recipient[0]) === null || _e === void 0 ? void 0 : _e.account) === null || _f === void 0 ? void 0 : _f.id)
                    ? [(_h = (_g = sendEvent.recipient[0]) === null || _g === void 0 ? void 0 : _g.account) === null || _h === void 0 ? void 0 : _h.id]
                    : [];
                fee = new BigNumber(getMicroOsmoAmount(tx.transaction_fee));
                return [2 /*return*/, convertTransactionToOperation(accountId, type, getOperationValue(sendEvent, type, fee), tx, senders, recipients, { memo: memo })];
            });
        }); };
        _this.convertDelegateTransactionToOperation = function (accountId, event, tx, memo) { return __awaiter(_this, void 0, void 0, function () {
            var ops, eventContent, delegateEvent, type, extra;
            return __generator(this, function (_a) {
                ops = [];
                if (!Object.prototype.hasOwnProperty.call(event, "sub")) {
                    return [2 /*return*/, ops];
                }
                eventContent = event.sub;
                if (!(eventContent.length > 0))
                    return [2 /*return*/, ops];
                delegateEvent = eventContent.find(function (event) { return event.type[0] === OsmosisTransactionTypeEnum.Delegate; });
                if (delegateEvent == null)
                    return [2 /*return*/, ops];
                type = "DELEGATE";
                extra = {
                    memo: memo,
                    validators: [
                        {
                            address: delegateEvent.node.validator[0].id,
                            amount: new BigNumber(getMicroOsmoAmount([delegateEvent.amount.delegate]))
                        },
                    ],
                    autoClaimedRewards: this.calculateAutoClaimedRewards(tx).toString()
                };
                ops.push(convertTransactionToOperation(accountId, type, extra.validators[0].amount, tx, [], [], extra));
                return [2 /*return*/, ops];
            });
        }); };
        _this.calculateAutoClaimedRewards = function (tx) {
            //  These types are the only types for which auto claim rewards are supported
            var SUPPORTED_TYPES = [
                OsmosisTransactionTypeEnum.Delegate,
                OsmosisTransactionTypeEnum.Redelegate,
                OsmosisTransactionTypeEnum.Undelegate,
            ];
            var totalRewardsAmount = new BigNumber(0);
            tx.events.forEach(function (event) {
                if (Object.prototype.hasOwnProperty.call(event, "sub")) {
                    var eventContent = event.sub;
                    if (eventContent.length > 0) {
                        var rewardEvent = eventContent[0];
                        if (rewardEvent != null &&
                            SUPPORTED_TYPES.includes(rewardEvent.type[0])) {
                            var amount = new BigNumber(0);
                            if (rewardEvent.transfers != null) {
                                if (rewardEvent.transfers.reward) {
                                    amount = getMicroOsmoAmount(rewardEvent.transfers.reward[0].amounts);
                                    totalRewardsAmount = totalRewardsAmount.plus(amount);
                                }
                            }
                        }
                    }
                }
            });
            return totalRewardsAmount;
        };
        _this.convertRedelegateTransactionToOperation = function (accountId, event, tx, memo) { return __awaiter(_this, void 0, void 0, function () {
            var ops, eventContent, redelegEvent, type, extra;
            return __generator(this, function (_a) {
                ops = [];
                if (!Object.prototype.hasOwnProperty.call(event, "sub")) {
                    return [2 /*return*/, ops];
                }
                eventContent = event.sub;
                if (!(eventContent.length > 0))
                    return [2 /*return*/, ops];
                redelegEvent = eventContent.find(function (event) { return event.type[0] === OsmosisTransactionTypeEnum.Redelegate; });
                if (redelegEvent == null)
                    return [2 /*return*/, ops];
                type = "REDELEGATE";
                extra = {
                    memo: memo,
                    validators: [
                        {
                            address: redelegEvent.node.validator_destination[0].id,
                            amount: new BigNumber(getMicroOsmoAmount([redelegEvent.amount.delegate]))
                        },
                    ],
                    sourceValidator: redelegEvent.node.validator_source[0].id,
                    autoClaimedRewards: this.calculateAutoClaimedRewards(tx).toString()
                };
                ops.push(convertTransactionToOperation(accountId, type, extra.validators[0].amount, tx, [], [], extra));
                return [2 /*return*/, ops];
            });
        }); };
        _this.convertUndelegateTransactionToOperation = function (accountId, event, tx, memo) { return __awaiter(_this, void 0, void 0, function () {
            var ops, eventContent, undelegEvent, type, extra;
            return __generator(this, function (_a) {
                ops = [];
                if (!Object.prototype.hasOwnProperty.call(event, "sub")) {
                    return [2 /*return*/, ops];
                }
                eventContent = event.sub;
                if (!(eventContent.length > 0))
                    return [2 /*return*/, ops];
                undelegEvent = eventContent.find(function (event) { return event.type[0] === OsmosisTransactionTypeEnum.Undelegate; });
                if (undelegEvent == null)
                    return [2 /*return*/, ops];
                type = "UNDELEGATE";
                extra = {
                    memo: memo,
                    validators: [
                        {
                            address: undelegEvent.node.validator[0].id,
                            amount: new BigNumber(getMicroOsmoAmount([undelegEvent.amount.undelegate]))
                        },
                    ],
                    autoClaimedRewards: this.calculateAutoClaimedRewards(tx).toString()
                };
                ops.push(convertTransactionToOperation(accountId, type, extra.validators[0].amount, tx, [], [], extra));
                return [2 /*return*/, ops];
            });
        }); };
        _this.convertRewardTransactionToOperation = function (accountId, tx, memo) { return __awaiter(_this, void 0, void 0, function () {
            var ops, totalRewardsAmount, rewardValidators, type, extra;
            return __generator(this, function (_a) {
                ops = [];
                totalRewardsAmount = new BigNumber(0);
                rewardValidators = [];
                tx.events.forEach(function (event) {
                    if (!Object.prototype.hasOwnProperty.call(event, "sub")) {
                        return ops;
                    }
                    var eventContent = event.sub;
                    if (!(eventContent.length > 0))
                        return ops;
                    var rewardEvent = eventContent.find(function (event) { return event.type[0] === OsmosisTransactionTypeEnum.Reward; });
                    if (rewardEvent == null)
                        return ops;
                    var amount = new BigNumber(0);
                    if (rewardEvent.transfers != null) {
                        if (rewardEvent.transfers.reward) {
                            amount = getMicroOsmoAmount(rewardEvent.transfers.reward[0].amounts);
                            totalRewardsAmount = totalRewardsAmount.plus(amount);
                            rewardValidators.push({
                                address: rewardEvent.node.validator[0].id,
                                amount: amount
                            });
                        }
                    }
                });
                type = "REWARD";
                extra = {
                    memo: memo,
                    validators: rewardValidators
                };
                ops.push(convertTransactionToOperation(accountId, type, totalRewardsAmount, tx, [], [], extra));
                return [2 /*return*/, ops];
            });
        }); };
        _this.queryTotalSupply = function (minDenomUnit) { return __awaiter(_this, void 0, void 0, function () {
            var data, amount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, network({
                            method: "GET",
                            url: "".concat(this._defaultEndpoint, "/cosmos/bank/v1beta1/supply/").concat(minDenomUnit)
                        })];
                    case 1:
                        data = (_a.sent()).data;
                        amount = data.amount;
                        return [2 /*return*/, __assign({}, amount)];
                }
            });
        }); };
        _this.queryPool = function () { return __awaiter(_this, void 0, void 0, function () {
            var data, pool;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, network({
                            method: "GET",
                            url: "".concat(this._defaultEndpoint, "/cosmos/staking/v1beta1/pool")
                        })];
                    case 1:
                        data = (_a.sent()).data;
                        pool = data.pool;
                        return [2 /*return*/, __assign({}, pool)];
                }
            });
        }); };
        _this.queryDistributionParams = function () { return __awaiter(_this, void 0, void 0, function () {
            var data, params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, network({
                            method: "GET",
                            url: "".concat(this._defaultEndpoint, "/cosmos/distribution/v1beta1/params")
                        })];
                    case 1:
                        data = (_a.sent()).data;
                        params = data.params;
                        return [2 /*return*/, __assign({}, params)];
                }
            });
        }); };
        return _this;
    }
    return OsmosisAPI;
}(CosmosAPI));
export { OsmosisAPI };
export var osmosisAPI = new OsmosisAPI();
//# sourceMappingURL=sdk.js.map