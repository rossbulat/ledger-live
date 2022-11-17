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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { getEnv } from "@ledgerhq/common/lib/env";
import BigNumber from "bignumber.js";
import network from "@ledgerhq/common/lib/network";
import { patchOperationWithHash } from "@ledgerhq/common/lib/operation";
var defaultEndpoint = getEnv("API_COSMOS_BLOCKCHAIN_EXPLORER_API_ENDPOINT").replace(/\/$/, "");
var CosmosAPI = /** @class */ (function () {
    function CosmosAPI() {
        var _this = this;
        this._defaultEndpoint = defaultEndpoint;
        this._namespace = "cosmos";
        this.getAccountInfo = function (address, currency) { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, accountNumber, sequence, balances, blockHeight, txs, delegations, redelegations, unbondings, withdrawAddress, e_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, Promise.all([
                                this.getAccount(address),
                                this.getAllBalances(address, currency),
                                this.getHeight(),
                                this.getTransactions(address),
                                this.getDelegations(address, currency),
                                this.getRedelegations(address),
                                this.getUnbondings(address),
                                this.getWithdrawAddress(address),
                            ])];
                    case 1:
                        _a = __read.apply(void 0, [_c.sent(), 8]), _b = _a[0], accountNumber = _b.accountNumber, sequence = _b.sequence, balances = _a[1], blockHeight = _a[2], txs = _a[3], delegations = _a[4], redelegations = _a[5], unbondings = _a[6], withdrawAddress = _a[7];
                        return [2 /*return*/, {
                                balances: balances,
                                blockHeight: blockHeight,
                                txs: txs,
                                delegations: delegations,
                                redelegations: redelegations,
                                unbondings: unbondings,
                                withdrawAddress: withdrawAddress,
                                accountNumber: accountNumber,
                                sequence: sequence
                            }];
                    case 2:
                        e_1 = _c.sent();
                        throw new Error("\"Error during cosmos synchronization: \"".concat(e_1.message));
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.getAccount = function (address) { return __awaiter(_this, void 0, void 0, function () {
            var response, data, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        response = {
                            address: address,
                            accountNumber: 0,
                            sequence: 0
                        };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, network({
                                method: "GET",
                                url: "".concat(this._defaultEndpoint, "/cosmos/auth/v1beta1/accounts/").concat(address)
                            })];
                    case 2:
                        data = (_a.sent()).data;
                        if (data.account.address) {
                            response.address = data.account.address;
                        }
                        if (data.account.account_number) {
                            response.accountNumber = parseInt(data.account.account_number);
                        }
                        if (data.account.sequence) {
                            response.sequence = parseInt(data.account.sequence);
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        e_2 = _a.sent();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, response];
                }
            });
        }); };
        this.getChainId = function () { return __awaiter(_this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, network({
                            method: "GET",
                            url: "".concat(this._defaultEndpoint, "/node_info")
                        })];
                    case 1:
                        data = (_a.sent()).data;
                        return [2 /*return*/, data.node_info.network];
                }
            });
        }); };
        this.getHeight = function () { return __awaiter(_this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, network({
                            method: "GET",
                            url: "".concat(this._defaultEndpoint, "/cosmos/base/tendermint/v1beta1/blocks/latest")
                        })];
                    case 1:
                        data = (_a.sent()).data;
                        return [2 /*return*/, data.block.header.height];
                }
            });
        }); };
        this.getAllBalances = function (address, currency) { return __awaiter(_this, void 0, void 0, function () {
            var data, amount, _a, _b, elem;
            var e_3, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, network({
                            method: "GET",
                            url: "".concat(this._defaultEndpoint, "/cosmos/bank/v1beta1/balances/").concat(address)
                        })];
                    case 1:
                        data = (_d.sent()).data;
                        amount = new BigNumber(0);
                        try {
                            for (_a = __values(data.balances), _b = _a.next(); !_b.done; _b = _a.next()) {
                                elem = _b.value;
                                if (elem.denom === currency.units[1].code)
                                    amount = amount.plus(elem.amount);
                            }
                        }
                        catch (e_3_1) { e_3 = { error: e_3_1 }; }
                        finally {
                            try {
                                if (_b && !_b.done && (_c = _a["return"])) _c.call(_a);
                            }
                            finally { if (e_3) throw e_3.error; }
                        }
                        return [2 /*return*/, amount];
                }
            });
        }); };
        this.getDelegations = function (address, currency) { return __awaiter(_this, void 0, void 0, function () {
            var delegations, data1, status, statusMap, _a, _b, d, data2, e_4_1, data3, _c, _d, r, delegations_1, delegations_1_1, d, _e, _f, reward;
            var e_4, _g, e_5, _h, e_6, _j, e_7, _k;
            return __generator(this, function (_l) {
                switch (_l.label) {
                    case 0:
                        delegations = [];
                        return [4 /*yield*/, network({
                                method: "GET",
                                url: "".concat(this._defaultEndpoint, "/cosmos/staking/v1beta1/delegations/").concat(address)
                            })];
                    case 1:
                        data1 = (_l.sent()).data;
                        data1.delegation_responses = data1.delegation_responses.filter(function (d) { return d.balance.amount !== "0"; });
                        status = "unbonded";
                        statusMap = {
                            BOND_STATUS_UNBONDED: "unbonded",
                            BOND_STATUS_UNBONDING: "unbonding",
                            BOND_STATUS_BONDED: "bonded"
                        };
                        _l.label = 2;
                    case 2:
                        _l.trys.push([2, 7, 8, 9]);
                        _a = __values(data1.delegation_responses), _b = _a.next();
                        _l.label = 3;
                    case 3:
                        if (!!_b.done) return [3 /*break*/, 6];
                        d = _b.value;
                        return [4 /*yield*/, network({
                                method: "GET",
                                url: "".concat(this._defaultEndpoint, "/cosmos/staking/v1beta1/validators/").concat(d.delegation.validator_address)
                            })];
                    case 4:
                        data2 = (_l.sent()).data;
                        status = statusMap[data2.validator.status] || "unbonded";
                        delegations.push({
                            validatorAddress: d.delegation.validator_address,
                            amount: d.balance.denom === currency.units[1].code
                                ? new BigNumber(d.balance.amount)
                                : new BigNumber(0),
                            pendingRewards: new BigNumber(0),
                            status: status
                        });
                        _l.label = 5;
                    case 5:
                        _b = _a.next();
                        return [3 /*break*/, 3];
                    case 6: return [3 /*break*/, 9];
                    case 7:
                        e_4_1 = _l.sent();
                        e_4 = { error: e_4_1 };
                        return [3 /*break*/, 9];
                    case 8:
                        try {
                            if (_b && !_b.done && (_g = _a["return"])) _g.call(_a);
                        }
                        finally { if (e_4) throw e_4.error; }
                        return [7 /*endfinally*/];
                    case 9: return [4 /*yield*/, network({
                            method: "GET",
                            url: "".concat(this._defaultEndpoint, "/cosmos/distribution/v1beta1/delegators/").concat(address, "/rewards")
                        })];
                    case 10:
                        data3 = (_l.sent()).data;
                        try {
                            for (_c = __values(data3.rewards), _d = _c.next(); !_d.done; _d = _c.next()) {
                                r = _d.value;
                                try {
                                    for (delegations_1 = (e_6 = void 0, __values(delegations)), delegations_1_1 = delegations_1.next(); !delegations_1_1.done; delegations_1_1 = delegations_1.next()) {
                                        d = delegations_1_1.value;
                                        if (r.validator_address === d.validatorAddress) {
                                            try {
                                                for (_e = (e_7 = void 0, __values(r.reward)), _f = _e.next(); !_f.done; _f = _e.next()) {
                                                    reward = _f.value;
                                                    d.pendingRewards = d.pendingRewards.plus(new BigNumber(reward.amount).integerValue());
                                                }
                                            }
                                            catch (e_7_1) { e_7 = { error: e_7_1 }; }
                                            finally {
                                                try {
                                                    if (_f && !_f.done && (_k = _e["return"])) _k.call(_e);
                                                }
                                                finally { if (e_7) throw e_7.error; }
                                            }
                                        }
                                    }
                                }
                                catch (e_6_1) { e_6 = { error: e_6_1 }; }
                                finally {
                                    try {
                                        if (delegations_1_1 && !delegations_1_1.done && (_j = delegations_1["return"])) _j.call(delegations_1);
                                    }
                                    finally { if (e_6) throw e_6.error; }
                                }
                            }
                        }
                        catch (e_5_1) { e_5 = { error: e_5_1 }; }
                        finally {
                            try {
                                if (_d && !_d.done && (_h = _c["return"])) _h.call(_c);
                            }
                            finally { if (e_5) throw e_5.error; }
                        }
                        return [2 /*return*/, delegations];
                }
            });
        }); };
        this.getRedelegations = function (address) { return __awaiter(_this, void 0, void 0, function () {
            var redelegations, data, _a, _b, r, _c, _d, entry;
            var e_8, _e, e_9, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        redelegations = [];
                        return [4 /*yield*/, network({
                                method: "GET",
                                url: "".concat(this._defaultEndpoint, "/cosmos/staking/v1beta1/delegators/").concat(address, "/redelegations")
                            })];
                    case 1:
                        data = (_g.sent()).data;
                        try {
                            for (_a = __values(data.redelegation_responses), _b = _a.next(); !_b.done; _b = _a.next()) {
                                r = _b.value;
                                try {
                                    for (_c = (e_9 = void 0, __values(r.entries)), _d = _c.next(); !_d.done; _d = _c.next()) {
                                        entry = _d.value;
                                        redelegations.push({
                                            validatorSrcAddress: r.redelegation.validator_src_address,
                                            validatorDstAddress: r.redelegation.validator_dst_address,
                                            amount: new BigNumber(entry.redelegation_entry.initial_balance),
                                            completionDate: new Date(entry.redelegation_entry.completion_time)
                                        });
                                    }
                                }
                                catch (e_9_1) { e_9 = { error: e_9_1 }; }
                                finally {
                                    try {
                                        if (_d && !_d.done && (_f = _c["return"])) _f.call(_c);
                                    }
                                    finally { if (e_9) throw e_9.error; }
                                }
                            }
                        }
                        catch (e_8_1) { e_8 = { error: e_8_1 }; }
                        finally {
                            try {
                                if (_b && !_b.done && (_e = _a["return"])) _e.call(_a);
                            }
                            finally { if (e_8) throw e_8.error; }
                        }
                        return [2 /*return*/, redelegations];
                }
            });
        }); };
        this.getUnbondings = function (address) { return __awaiter(_this, void 0, void 0, function () {
            var unbondings, data, _a, _b, u, _c, _d, entry;
            var e_10, _e, e_11, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        unbondings = [];
                        return [4 /*yield*/, network({
                                method: "GET",
                                url: "".concat(this._defaultEndpoint, "/cosmos/staking/v1beta1/delegators/").concat(address, "/unbonding_delegations")
                            })];
                    case 1:
                        data = (_g.sent()).data;
                        try {
                            for (_a = __values(data.unbonding_responses), _b = _a.next(); !_b.done; _b = _a.next()) {
                                u = _b.value;
                                try {
                                    for (_c = (e_11 = void 0, __values(u.entries)), _d = _c.next(); !_d.done; _d = _c.next()) {
                                        entry = _d.value;
                                        unbondings.push({
                                            validatorAddress: u.validator_address,
                                            amount: new BigNumber(entry.initial_balance),
                                            completionDate: new Date(entry.completion_time)
                                        });
                                    }
                                }
                                catch (e_11_1) { e_11 = { error: e_11_1 }; }
                                finally {
                                    try {
                                        if (_d && !_d.done && (_f = _c["return"])) _f.call(_c);
                                    }
                                    finally { if (e_11) throw e_11.error; }
                                }
                            }
                        }
                        catch (e_10_1) { e_10 = { error: e_10_1 }; }
                        finally {
                            try {
                                if (_b && !_b.done && (_e = _a["return"])) _e.call(_a);
                            }
                            finally { if (e_10) throw e_10.error; }
                        }
                        return [2 /*return*/, unbondings];
                }
            });
        }); };
        this.getWithdrawAddress = function (address) { return __awaiter(_this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, network({
                            method: "GET",
                            url: "".concat(this._defaultEndpoint, "/cosmos/distribution/v1beta1/delegators/").concat(address, "/withdraw_address")
                        })];
                    case 1:
                        data = (_a.sent()).data;
                        return [2 /*return*/, data.withdraw_address];
                }
            });
        }); };
        this.getTransactions = function (address) { return __awaiter(_this, void 0, void 0, function () {
            var receive, send;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this._namespace === "osmosis") {
                            return [2 /*return*/, []];
                        }
                        return [4 /*yield*/, network({
                                method: "GET",
                                url: "".concat(this._defaultEndpoint, "/cosmos/tx/v1beta1/txs?events=") +
                                    encodeURI("transfer.recipient='".concat(address, "'"))
                            })];
                    case 1:
                        receive = _a.sent();
                        return [4 /*yield*/, network({
                                method: "GET",
                                url: "".concat(this._defaultEndpoint, "/cosmos/tx/v1beta1/txs?events=") +
                                    encodeURI("message.sender='".concat(address, "'"))
                            })];
                    case 2:
                        send = _a.sent();
                        return [2 /*return*/, __spreadArray(__spreadArray([], __read(receive.data.tx_responses), false), __read(send.data.tx_responses), false)];
                }
            });
        }); };
        this.isValidRecipent = function (address) { return __awaiter(_this, void 0, void 0, function () {
            var e_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, network({
                                method: "GET",
                                url: "".concat(this._defaultEndpoint, "/cosmos/bank/v1beta1/balances/").concat(address)
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        e_12 = _a.sent();
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.simulate = function (tx_bytes) { return __awaiter(_this, void 0, void 0, function () {
            var data, e_13;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, network({
                                method: "POST",
                                url: "".concat(this._defaultEndpoint, "/cosmos/tx/v1beta1/simulate"),
                                data: {
                                    tx_bytes: tx_bytes
                                }
                            })];
                    case 1:
                        data = (_b.sent()).data;
                        return [2 /*return*/, new BigNumber(((_a = data === null || data === void 0 ? void 0 : data.gas_info) === null || _a === void 0 ? void 0 : _a.gas_used) || 0)];
                    case 2:
                        e_13 = _b.sent();
                        return [2 /*return*/, new BigNumber(0)];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.broadcast = function (_a) {
            var _b = _a.signedOperation, operation = _b.operation, signature = _b.signature;
            return __awaiter(_this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, network({
                                method: "POST",
                                url: "".concat(this._defaultEndpoint, "/cosmos/tx/v1beta1/txs"),
                                data: {
                                    tx_bytes: Array.from(Uint8Array.from(Buffer.from(signature, "hex"))),
                                    mode: "BROADCAST_MODE_SYNC"
                                }
                            })];
                        case 1:
                            data = (_c.sent()).data;
                            if (data.tx_response.code != 0) {
                                // error codes: https://github.com/cosmos/cosmos-sdk/blob/master/types/errors/errors.go
                                throw new Error("invalid broadcast return (code: " +
                                    (data.tx_response.code || "?") +
                                    ", message: '" +
                                    (data.tx_response.raw_log || "") +
                                    "')");
                            }
                            return [2 /*return*/, patchOperationWithHash(operation, data.tx_response.txhash)];
                    }
                });
            });
        };
    }
    return CosmosAPI;
}());
export { CosmosAPI };
export var defaultCosmosAPI = new CosmosAPI();
//# sourceMappingURL=Cosmos.js.map