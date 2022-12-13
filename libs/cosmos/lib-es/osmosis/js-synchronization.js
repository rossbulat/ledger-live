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
import { pubkeyToAddress, decodeBech32Pubkey } from "@cosmjs/amino";
import { BigNumber } from "bignumber.js";
import { encodeAccountId } from "@ledgerhq/ledger-common/lib/account";
import { makeSync, makeScanAccounts, mergeOps, } from "@ledgerhq/ledger-common/lib/bridge/jsHelpers";
import { osmosisAPI } from "./api/sdk";
import getAddressFn from "./hw-getAddress";
var accountPubPrefix = "osmopub";
var accountAddressPrefix = "osmo";
var getAccountShape = function (info) { return __awaiter(void 0, void 0, void 0, function () {
    var address, currency, derivationMode, initialAccount, xpubOrAddress, pubkey, accountId, _a, balances, blockHeight, delegations, redelegations, unbondings, withdrawAddress, oldOperations, operations, lastOperationDate, newOperations, balance, delegatedBalance, pendingRewardsBalance, unbondingBalance, delegations_1, delegations_1_1, delegation, unbondings_1, unbondings_1_1, unbonding, spendableBalance, shape;
    var e_1, _b, e_2, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                address = info.address, currency = info.currency, derivationMode = info.derivationMode, initialAccount = info.initialAccount;
                xpubOrAddress = address;
                if (address.match(accountPubPrefix)) {
                    pubkey = decodeBech32Pubkey(address);
                    xpubOrAddress = pubkeyToAddress(pubkey, accountAddressPrefix);
                }
                accountId = encodeAccountId({
                    type: "js",
                    version: "2",
                    currencyId: currency.id,
                    xpubOrAddress: xpubOrAddress,
                    derivationMode: derivationMode
                });
                return [4 /*yield*/, osmosisAPI.getAccountInfo(xpubOrAddress, currency)];
            case 1:
                _a = _d.sent(), balances = _a.balances, blockHeight = _a.blockHeight, delegations = _a.delegations, redelegations = _a.redelegations, unbondings = _a.unbondings, withdrawAddress = _a.withdrawAddress;
                oldOperations = (initialAccount === null || initialAccount === void 0 ? void 0 : initialAccount.operations) || [];
                operations = oldOperations;
                lastOperationDate = null;
                if (operations.length > 0) {
                    operations.forEach(function (o) {
                        if (o.date != null) {
                            if (lastOperationDate !== null) {
                                if (o.date.valueOf() > lastOperationDate.valueOf()) {
                                    lastOperationDate = o.date;
                                }
                            }
                            else {
                                lastOperationDate = o.date;
                            }
                        }
                    });
                }
                return [4 /*yield*/, osmosisAPI.getOperations(accountId, address, lastOperationDate)];
            case 2:
                newOperations = _d.sent();
                // Merge new operations with the previously synced ones
                operations = mergeOps(operations, newOperations);
                balance = balances;
                delegatedBalance = new BigNumber(0);
                pendingRewardsBalance = new BigNumber(0);
                unbondingBalance = new BigNumber(0);
                try {
                    for (delegations_1 = __values(delegations), delegations_1_1 = delegations_1.next(); !delegations_1_1.done; delegations_1_1 = delegations_1.next()) {
                        delegation = delegations_1_1.value;
                        delegatedBalance = delegatedBalance.plus(delegation.amount);
                        balance = balance.plus(delegation.amount);
                        pendingRewardsBalance = pendingRewardsBalance.plus(delegation.pendingRewards);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (delegations_1_1 && !delegations_1_1.done && (_b = delegations_1["return"])) _b.call(delegations_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                try {
                    for (unbondings_1 = __values(unbondings), unbondings_1_1 = unbondings_1.next(); !unbondings_1_1.done; unbondings_1_1 = unbondings_1.next()) {
                        unbonding = unbondings_1_1.value;
                        unbondingBalance = unbondingBalance.plus(unbonding.amount);
                        balance = balance.plus(unbonding.amount);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (unbondings_1_1 && !unbondings_1_1.done && (_c = unbondings_1["return"])) _c.call(unbondings_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                spendableBalance = balance.minus(unbondingBalance.plus(delegatedBalance));
                if (spendableBalance.lt(0)) {
                    spendableBalance = new BigNumber(0);
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
                    shape.spendableBalance = new BigNumber(0);
                }
                return [2 /*return*/, __assign(__assign({}, shape), { operations: operations })];
        }
    });
}); };
export var scanAccounts = makeScanAccounts({ getAccountShape: getAccountShape, getAddressFn: getAddressFn });
export var sync = makeSync({ getAccountShape: getAccountShape });
//# sourceMappingURL=js-synchronization.js.map