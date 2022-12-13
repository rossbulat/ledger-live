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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.sync = exports.scanAccounts = exports.getAccountShape = void 0;
var bignumber_js_1 = require("bignumber.js");
var jsHelpers_1 = require("@ledgerhq/ledger-common/lib/bridge/jsHelpers");
var account_1 = require("@ledgerhq/ledger-common/lib/account");
var Cosmos_1 = require("./api/Cosmos");
var amino_1 = require("@cosmjs/amino");
var operation_1 = require("@ledgerhq/ledger-common/lib/operation");
var helpers_1 = require("./helpers");
var hw_getAddress_1 = __importDefault(require("./hw-getAddress"));
var getBlankOperation = function (tx, fees, id) { return ({
    id: "",
    hash: tx.txhash,
    type: "",
    value: new bignumber_js_1.BigNumber(0),
    fee: fees,
    blockHash: null,
    blockHeight: tx.height,
    senders: [],
    recipients: [],
    accountId: id,
    date: new Date(tx.timestamp),
    extra: {
        validators: []
    },
    transactionSequenceNumber: parseInt(tx.tx.auth_info.signer_infos[0].sequence)
}); };
var txToOps = function (info, id, txs) {
    var e_1, _a;
    var address = info.address, currency = info.currency;
    var ops = [];
    var _loop_1 = function (tx) {
        var fees = new bignumber_js_1.BigNumber(0);
        tx.tx.auth_info.fee.amount.forEach(function (elem) {
            if (elem.denom === currency.units[1].code)
                fees = fees.plus(elem.amount);
        });
        var op = getBlankOperation(tx, fees, id);
        var messages = tx.logs.map(function (log) { return log.events; }).flat(1);
        var message = (0, helpers_1.getMainMessage)(messages);
        if (message == null) {
            return "continue";
        }
        // parse attributes as key:value
        var attributes = {};
        message.attributes.forEach(function (item) { return (attributes[item.key] = item.value); });
        // https://docs.cosmos.network/v0.42/modules/staking/07_events.html
        switch (message.type) {
            case "transfer":
                if (attributes.sender && attributes.recipient && attributes.amount) {
                    op.senders.push(attributes.sender);
                    op.recipients.push(attributes.recipient);
                    if (attributes.amount.indexOf(currency.units[1].code) != -1) {
                        op.value = op.value.plus(attributes.amount.replace(currency.units[1].code, ""));
                    }
                    if (!op.type && attributes.sender === address) {
                        op.type = "OUT";
                        op.value = op.value.plus(fees);
                    }
                    else if (!op.type && attributes.recipient === address) {
                        op.type = "IN";
                    }
                }
                break;
            case "withdraw_rewards":
                if ((attributes.amount &&
                    attributes.amount.indexOf(currency.units[1].code) != -1) ||
                    // handle specifc case with empty amount value like
                    // tx DF458FE6A82C310837D7A33735FA5298BCF71B0BFF7A4134641AAE30F6F1050
                    attributes.amount === "") {
                    op.type = "REWARD";
                    var reward = message.attributes
                        .find(function (attr) { return attr.key === "amount"; })
                        .value.replace("uatom", "");
                    op.value = new bignumber_js_1.BigNumber(reward || 0);
                    op.extra.validators.push({
                        address: attributes.validator,
                        amount: attributes.amount.replace(currency.units[1].code, "") || 0
                    });
                }
                break;
            case "delegate":
                if (attributes.amount &&
                    attributes.amount.indexOf(currency.units[1].code) != -1) {
                    op.type = "DELEGATE";
                    op.value = new bignumber_js_1.BigNumber(fees);
                    op.extra.validators.push({
                        address: attributes.validator,
                        amount: attributes.amount.replace(currency.units[1].code, "")
                    });
                }
                break;
            case "redelegate":
                if (attributes.amount &&
                    attributes.amount.indexOf(currency.units[1].code) != -1 &&
                    attributes.destination_validator &&
                    attributes.source_validator) {
                    op.type = "REDELEGATE";
                    op.value = new bignumber_js_1.BigNumber(fees);
                    op.extra.validators.push({
                        address: attributes.destination_validator,
                        amount: attributes.amount.replace(currency.units[1].code, "")
                    });
                    op.extra.sourceValidator = attributes.source_validator;
                }
                break;
            case "unbond":
                if (attributes.amount &&
                    attributes.amount.indexOf(currency.units[1].code) != -1 &&
                    attributes.validator) {
                    op.type = "UNDELEGATE";
                    op.value = new bignumber_js_1.BigNumber(fees);
                    op.extra.validators.push({
                        address: attributes.validator,
                        amount: attributes.amount.replace(currency.units[1].code, "")
                    });
                }
                break;
        }
        if (!["IN", "OUT"].includes(op.type)) {
            op.senders = [];
            op.recipients = [];
        }
        op.id = (0, operation_1.encodeOperationId)(id, tx.txhash, op.type);
        if (op.type) {
            ops.push(op);
        }
    };
    try {
        for (var txs_1 = __values(txs), txs_1_1 = txs_1.next(); !txs_1_1.done; txs_1_1 = txs_1.next()) {
            var tx = txs_1_1.value;
            _loop_1(tx);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (txs_1_1 && !txs_1_1.done && (_a = txs_1["return"])) _a.call(txs_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return ops;
};
var getAccountShape = function (info) { return __awaiter(void 0, void 0, void 0, function () {
    var address, currency, derivationMode, initialAccount, xpubOrAddress, pubkey, accountId, _a, balances, blockHeight, txs, delegations, redelegations, unbondings, withdrawAddress, oldOperations, newOperations, operations, balance, delegatedBalance, pendingRewardsBalance, unbondingBalance, delegations_1, delegations_1_1, delegation, unbondings_1, unbondings_1_1, unbonding, spendableBalance, shape;
    var e_2, _b, e_3, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                address = info.address, currency = info.currency, derivationMode = info.derivationMode, initialAccount = info.initialAccount;
                xpubOrAddress = address;
                if (address.match("cosmospub")) {
                    pubkey = (0, amino_1.decodeBech32Pubkey)(address);
                    xpubOrAddress = (0, amino_1.pubkeyToAddress)(pubkey, "cosmos");
                }
                accountId = (0, account_1.encodeAccountId)({
                    type: "js",
                    version: "2",
                    currencyId: currency.id,
                    xpubOrAddress: xpubOrAddress,
                    derivationMode: derivationMode
                });
                return [4 /*yield*/, Cosmos_1.defaultCosmosAPI.getAccountInfo(xpubOrAddress, currency)];
            case 1:
                _a = _d.sent(), balances = _a.balances, blockHeight = _a.blockHeight, txs = _a.txs, delegations = _a.delegations, redelegations = _a.redelegations, unbondings = _a.unbondings, withdrawAddress = _a.withdrawAddress;
                oldOperations = (initialAccount === null || initialAccount === void 0 ? void 0 : initialAccount.operations) || [];
                newOperations = txToOps(info, accountId, txs);
                operations = (0, jsHelpers_1.mergeOps)(oldOperations, newOperations);
                balance = balances;
                delegatedBalance = new bignumber_js_1.BigNumber(0);
                pendingRewardsBalance = new bignumber_js_1.BigNumber(0);
                unbondingBalance = new bignumber_js_1.BigNumber(0);
                try {
                    for (delegations_1 = __values(delegations), delegations_1_1 = delegations_1.next(); !delegations_1_1.done; delegations_1_1 = delegations_1.next()) {
                        delegation = delegations_1_1.value;
                        delegatedBalance = delegatedBalance.plus(delegation.amount);
                        balance = balance.plus(delegation.amount);
                        pendingRewardsBalance = pendingRewardsBalance.plus(delegation.pendingRewards);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (delegations_1_1 && !delegations_1_1.done && (_b = delegations_1["return"])) _b.call(delegations_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                try {
                    for (unbondings_1 = __values(unbondings), unbondings_1_1 = unbondings_1.next(); !unbondings_1_1.done; unbondings_1_1 = unbondings_1.next()) {
                        unbonding = unbondings_1_1.value;
                        unbondingBalance = unbondingBalance.plus(unbonding.amount);
                        balance = balance.plus(unbonding.amount);
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (unbondings_1_1 && !unbondings_1_1.done && (_c = unbondings_1["return"])) _c.call(unbondings_1);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
                spendableBalance = balance.minus(unbondingBalance.plus(delegatedBalance));
                if (spendableBalance.lt(0)) {
                    spendableBalance = new bignumber_js_1.BigNumber(0);
                }
                shape = {
                    id: accountId,
                    xpub: xpubOrAddress,
                    balance: balance,
                    spendableBalance: spendableBalance,
                    operationsCount: operations.length,
                    blockHeight: blockHeight,
                    cosmosResources: {
                        delegations: delegations,
                        redelegations: redelegations,
                        unbondings: unbondings,
                        delegatedBalance: delegatedBalance,
                        pendingRewardsBalance: pendingRewardsBalance,
                        unbondingBalance: unbondingBalance,
                        withdrawAddress: withdrawAddress
                    }
                };
                if (shape.spendableBalance && shape.spendableBalance.lt(0)) {
                    shape.spendableBalance = new bignumber_js_1.BigNumber(0);
                }
                return [2 /*return*/, __assign(__assign({}, shape), { operations: operations })];
        }
    });
}); };
exports.getAccountShape = getAccountShape;
exports.scanAccounts = (0, jsHelpers_1.makeScanAccounts)({ getAccountShape: exports.getAccountShape, getAddressFn: hw_getAddress_1["default"] });
exports.sync = (0, jsHelpers_1.makeSync)({ getAccountShape: exports.getAccountShape });
//# sourceMappingURL=js-synchronisation.js.map