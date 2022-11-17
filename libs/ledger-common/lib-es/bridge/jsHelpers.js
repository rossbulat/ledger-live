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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
import isEqual from "lodash/isEqual";
import { BigNumber } from "bignumber.js";
import { Observable, from } from "rxjs";
import { log } from "@ledgerhq/logs";
import { WrongDeviceForAccount } from "@ledgerhq/errors";
import { getSeedIdentifierDerivation, getDerivationModesForCurrency, getDerivationScheme, runDerivationScheme, isIterableDerivationMode, derivationModeSupportsIndex, getMandatoryEmptyAccountSkip, getDerivationModeStartsAt, } from "../derivation";
import { getAccountPlaceholderName, getNewAccountPlaceholderName, shouldRetainPendingOperation, isAccountEmpty, shouldShowNewAccount, clearAccount, emptyHistoryCache, generateHistoryFromOperations, recalculateAccountBalanceHistories, encodeAccountId, } from "../account";
import { FreshAddressIndexInvalid, UnsupportedDerivation } from "../errors";
import getAddressWrapper from "../hw/getAddress";
import { withDevice } from "../hw/deviceAccess";
// compare that two dates are roughly the same date in order to update the case it would have drastically changed
var sameDate = function (a, b) { return Math.abs(a - b) < 1000 * 60 * 30; };
// an operation is relatively immutable, however we saw that sometimes it can temporarily change due to reorg,..
export var sameOp = function (a, b) {
    var _a, _b;
    return a === b ||
        (a.id === b.id && // hash, accountId, type are in id
            (a.fee ? a.fee.isEqualTo(b.fee) : a.fee === b.fee) &&
            (a.value ? a.value.isEqualTo(b.value) : a.value === b.value) &&
            ((_a = a.nftOperations) === null || _a === void 0 ? void 0 : _a.length) === ((_b = b.nftOperations) === null || _b === void 0 ? void 0 : _b.length) &&
            sameDate(a.date, b.date) &&
            a.blockHeight === b.blockHeight &&
            isEqual(a.senders, b.senders) &&
            isEqual(a.recipients, b.recipients));
};
// efficiently prepend newFetched operations to existing operations
export function mergeOps(// existing operations. sorted (newer to older). deduped.
existing, // new fetched operations. not sorted. not deduped. time is allowed to overlap inside existing.
newFetched) {
    var e_1, _a, e_2, _b;
    // there is new fetched
    if (newFetched.length === 0)
        return existing;
    // efficient lookup map of id.
    var existingIds = {};
    try {
        for (var existing_1 = __values(existing), existing_1_1 = existing_1.next(); !existing_1_1.done; existing_1_1 = existing_1.next()) {
            var o = existing_1_1.value;
            existingIds[o.id] = o;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (existing_1_1 && !existing_1_1.done && (_a = existing_1["return"])) _a.call(existing_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    // only keep the newFetched that are not in existing. this array will be mutated
    var newOps = newFetched
        .filter(function (o) { return !existingIds[o.id] || !sameOp(existingIds[o.id], o); })
        .sort(function (a, b) { return b.date.valueOf() - a.date.valueOf(); });
    // Deduplicate new ops to guarantee operations don't have dups
    var newOpsIds = {};
    newOps.forEach(function (op) {
        newOpsIds[op.id] = op;
    });
    newOps = Object.values(newOpsIds);
    // return existing when there is no real new operations
    if (newOps.length === 0)
        return existing;
    // edge case, existing can be empty. return the sorted list.
    if (existing.length === 0)
        return newOps;
    // building up merging the ops
    var all = [];
    try {
        for (var existing_2 = __values(existing), existing_2_1 = existing_2.next(); !existing_2_1.done; existing_2_1 = existing_2.next()) {
            var o = existing_2_1.value;
            // prepend all the new ops that have higher date
            while (newOps.length > 0 && newOps[0].date >= o.date) {
                all.push(newOps.shift());
            }
            if (!newOpsIds[o.id]) {
                all.push(o);
            }
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (existing_2_1 && !existing_2_1.done && (_b = existing_2["return"])) _b.call(existing_2);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return all;
}
export var mergeNfts = function (oldNfts, newNfts) {
    // Getting a map of id => NFT
    var newNftsPerId = {};
    newNfts.forEach(function (n) {
        newNftsPerId[n.id] = n;
    });
    // copying the argument to avoid mutating it
    var nfts = oldNfts.slice();
    for (var i = 0; i < nfts.length; i++) {
        var nft = nfts[i];
        // The NFTs are the same, do don't anything
        if (!newNftsPerId[nft.id]) {
            nfts.splice(i, 1);
            i--;
        }
        else if (!isEqual(nft, newNftsPerId[nft.id])) {
            // Use the new NFT instead
            nfts[i] = newNftsPerId[nft.id];
        }
        // Delete it from the newNfts to keep only the un-added ones at the end
        delete newNftsPerId[nft.id];
    }
    // Prepending newNfts to respect nfts's newest to oldest order
    return Object.values(newNftsPerId).concat(nfts);
};
export var makeSync = function (_a) {
    var getAccountShape = _a.getAccountShape, _b = _a.postSync, postSync = _b === void 0 ? function (_, a) { return a; } : _b, _c = _a.shouldMergeOps, shouldMergeOps = _c === void 0 ? true : _c;
    return function (initial, syncConfig) {
        return Observable.create(function (o) {
            function main() {
                return __awaiter(this, void 0, void 0, function () {
                    var accountId, needClear, freshAddressPath, shape_1, updater, e_3;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                accountId = encodeAccountId({
                                    type: "js",
                                    version: "2",
                                    currencyId: initial.currency.id,
                                    xpubOrAddress: initial.xpub || initial.freshAddress,
                                    derivationMode: initial.derivationMode
                                });
                                needClear = initial.id !== accountId;
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                freshAddressPath = getSeedIdentifierDerivation(initial.currency, initial.derivationMode);
                                return [4 /*yield*/, getAccountShape({
                                        currency: initial.currency,
                                        index: initial.index,
                                        address: initial.freshAddress,
                                        derivationPath: freshAddressPath,
                                        derivationMode: initial.derivationMode,
                                        initialAccount: needClear ? clearAccount(initial) : initial
                                    }, syncConfig)];
                            case 2:
                                shape_1 = _a.sent();
                                updater = function (acc) {
                                    var a = acc; // a is a immutable version of Account, based on acc
                                    if (needClear) {
                                        a = clearAccount(acc);
                                    }
                                    // FIXME reconsider doing mergeOps here. work is redundant for impl like eth
                                    var operations = shouldMergeOps
                                        ? mergeOps(a.operations, shape_1.operations || [])
                                        : shape_1.operations || [];
                                    a = postSync(a, __assign(__assign(__assign(__assign({}, a), { id: accountId, spendableBalance: shape_1.balance || a.balance, operationsCount: shape_1.operationsCount || operations.length, lastSyncDate: new Date(), creationDate: operations.length > 0
                                            ? operations[operations.length - 1].date
                                            : new Date() }), shape_1), { operations: operations, pendingOperations: a.pendingOperations.filter(function (op) {
                                            return shouldRetainPendingOperation(a, op);
                                        }) }));
                                    a = recalculateAccountBalanceHistories(a, acc);
                                    if (!a.used) {
                                        a.used = !isAccountEmpty(a);
                                    }
                                    return a;
                                };
                                o.next(updater);
                                o.complete();
                                return [3 /*break*/, 4];
                            case 3:
                                e_3 = _a.sent();
                                o.error(e_3);
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                });
            }
            main();
        });
    };
};
var defaultIterateResultBuilder2 = function (getAddressFn) { return function () {
    return Promise.resolve(function (_a) {
        var transport = _a.transport, index = _a.index, derivationsCache = _a.derivationsCache, derivationScheme = _a.derivationScheme, derivationMode = _a.derivationMode, currency = _a.currency;
        return __awaiter(void 0, void 0, void 0, function () {
            var freshAddressPath, res;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        freshAddressPath = runDerivationScheme(derivationScheme, currency, {
                            account: index
                        });
                        res = derivationsCache[freshAddressPath];
                        if (!!res) return [3 /*break*/, 2];
                        return [4 /*yield*/, getAddressWrapper(getAddressFn)(transport, {
                                currency: currency,
                                path: freshAddressPath,
                                derivationMode: derivationMode
                            })];
                    case 1:
                        res = _b.sent();
                        derivationsCache[freshAddressPath] = res;
                        _b.label = 2;
                    case 2: return [2 /*return*/, res];
                }
            });
        });
    });
}; };
export var makeScanAccounts = function (_a) {
    var getAccountShape = _a.getAccountShape, getAddressFn = _a.getAddressFn, buildIterateResult = _a.buildIterateResult;
    return function (_a) {
        var currency = _a.currency, deviceId = _a.deviceId, syncConfig = _a.syncConfig;
        return withDevice(deviceId)(function (transport) {
            return Observable.create(function (o) {
                var finished = false;
                var unsubscribe = function () {
                    finished = true;
                };
                var derivationsCache = {};
                function stepAccount(index, res, derivationMode, seedIdentifier, transport) {
                    return __awaiter(this, void 0, void 0, function () {
                        var address, freshAddressPath, rest, accountShape, freshAddress, operations, operationsCount, creationDate, balance, spendableBalance, initialAccount, account, showNewAccount;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (finished)
                                        return [2 /*return*/];
                                    address = res.address, freshAddressPath = res.path, rest = __rest(res, ["address", "path"]);
                                    return [4 /*yield*/, getAccountShape({
                                            transport: transport,
                                            currency: currency,
                                            index: index,
                                            address: address,
                                            derivationPath: freshAddressPath,
                                            derivationMode: derivationMode,
                                            rest: rest
                                        }, syncConfig)];
                                case 1:
                                    accountShape = _a.sent();
                                    if (finished)
                                        return [2 /*return*/];
                                    freshAddress = address;
                                    operations = accountShape.operations || [];
                                    operationsCount = accountShape.operationsCount || operations.length;
                                    creationDate = operations.length > 0
                                        ? operations[operations.length - 1].date
                                        : new Date();
                                    balance = accountShape.balance || new BigNumber(0);
                                    spendableBalance = accountShape.spendableBalance || new BigNumber(0);
                                    if (!accountShape.id)
                                        throw new Error("account ID must be provided");
                                    if (balance.isNaN())
                                        throw new Error("invalid balance NaN");
                                    initialAccount = {
                                        type: "Account",
                                        id: accountShape.id,
                                        seedIdentifier: seedIdentifier,
                                        freshAddress: freshAddress,
                                        freshAddressPath: freshAddressPath,
                                        freshAddresses: [
                                            {
                                                address: freshAddress,
                                                derivationPath: freshAddressPath
                                            },
                                        ],
                                        derivationMode: derivationMode,
                                        name: "",
                                        starred: false,
                                        used: false,
                                        index: index,
                                        currency: currency,
                                        operationsCount: operationsCount,
                                        operations: [],
                                        swapHistory: [],
                                        pendingOperations: [],
                                        unit: currency.units[0],
                                        lastSyncDate: new Date(),
                                        creationDate: creationDate,
                                        // overrides
                                        balance: balance,
                                        spendableBalance: spendableBalance,
                                        blockHeight: 0,
                                        balanceHistoryCache: emptyHistoryCache
                                    };
                                    account = __assign(__assign({}, initialAccount), accountShape);
                                    if (account.balanceHistoryCache === emptyHistoryCache) {
                                        account.balanceHistoryCache =
                                            generateHistoryFromOperations(account);
                                    }
                                    if (!account.used) {
                                        account.used = !isAccountEmpty(account);
                                    }
                                    // Bitcoin needs to compute the freshAddressPath itself,
                                    // so we update it afterwards
                                    if (account === null || account === void 0 ? void 0 : account.freshAddressPath) {
                                        res.address = account.freshAddress;
                                        derivationsCache[account.freshAddressPath] = res;
                                    }
                                    log("scanAccounts", "derivationsCache", res);
                                    log("scanAccounts", "scanning ".concat(currency.id, " at ").concat(freshAddressPath, ": ").concat(res.address, " resulted of ").concat(account
                                        ? "Account with ".concat(account.operations.length, " txs")
                                        : "no account"));
                                    if (!account)
                                        return [2 /*return*/];
                                    account.name = !account.used
                                        ? getNewAccountPlaceholderName({
                                            currency: currency,
                                            index: index,
                                            derivationMode: derivationMode
                                        })
                                        : getAccountPlaceholderName({
                                            currency: currency,
                                            index: index,
                                            derivationMode: derivationMode
                                        });
                                    showNewAccount = shouldShowNewAccount(currency, derivationMode);
                                    if (account.used || showNewAccount) {
                                        log("debug", "Emit 'discovered' event for a new account found. AccountUsed: ".concat(account.used, " - showNewAccount: ").concat(showNewAccount));
                                        o.next({
                                            type: "discovered",
                                            account: account
                                        });
                                    }
                                    return [2 /*return*/, account];
                            }
                        });
                    });
                }
                // STP: to fix
                if (buildIterateResult === undefined) {
                    buildIterateResult = defaultIterateResultBuilder2(getAddressFn);
                }
                function main() {
                    return __awaiter(this, void 0, void 0, function () {
                        var derivationModes, derivationModes_1, derivationModes_1_1, derivationMode, path, result, e_4, seedIdentifier, emptyCount, mandatoryEmptyAccountSkip, derivationScheme, stopAt, startsAt, iterateResult, index, res, account, e_5_1, e_6;
                        var e_5, _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 17, , 18]);
                                    derivationModes = getDerivationModesForCurrency(currency);
                                    _b.label = 1;
                                case 1:
                                    _b.trys.push([1, 14, 15, 16]);
                                    derivationModes_1 = __values(derivationModes), derivationModes_1_1 = derivationModes_1.next();
                                    _b.label = 2;
                                case 2:
                                    if (!!derivationModes_1_1.done) return [3 /*break*/, 13];
                                    derivationMode = derivationModes_1_1.value;
                                    if (finished)
                                        return [3 /*break*/, 13];
                                    path = getSeedIdentifierDerivation(currency, derivationMode);
                                    log("scanAccounts", "scanning ".concat(currency.id, " on derivationMode=").concat(derivationMode));
                                    result = derivationsCache[path];
                                    if (!!result) return [3 /*break*/, 6];
                                    _b.label = 3;
                                case 3:
                                    _b.trys.push([3, 5, , 6]);
                                    return [4 /*yield*/, getAddressFn(transport, {
                                            currency: currency,
                                            path: path,
                                            derivationMode: derivationMode
                                        })];
                                case 4:
                                    result = _b.sent();
                                    derivationsCache[path] = result;
                                    return [3 /*break*/, 6];
                                case 5:
                                    e_4 = _b.sent();
                                    if (e_4 instanceof UnsupportedDerivation) {
                                        log("scanAccounts", "ignore derivationMode=" + derivationMode);
                                        return [3 /*break*/, 12];
                                    }
                                    throw e_4;
                                case 6:
                                    if (!result)
                                        return [3 /*break*/, 12];
                                    seedIdentifier = result.publicKey;
                                    emptyCount = 0;
                                    mandatoryEmptyAccountSkip = getMandatoryEmptyAccountSkip(derivationMode);
                                    derivationScheme = getDerivationScheme({
                                        derivationMode: derivationMode,
                                        currency: currency
                                    });
                                    stopAt = isIterableDerivationMode(derivationMode) ? 255 : 1;
                                    startsAt = getDerivationModeStartsAt(derivationMode);
                                    log("debug", "start scanning account process. MandatoryEmptyAccountSkip ".concat(mandatoryEmptyAccountSkip, " / StartsAt: ").concat(startsAt, " - StopAt: ").concat(stopAt));
                                    return [4 /*yield*/, buildIterateResult({
                                            result: result,
                                            derivationMode: derivationMode,
                                            derivationScheme: derivationScheme
                                        })];
                                case 7:
                                    iterateResult = _b.sent();
                                    index = startsAt;
                                    _b.label = 8;
                                case 8:
                                    if (!(index < stopAt)) return [3 /*break*/, 12];
                                    log("debug", "start to scan a new account. Index: ".concat(index));
                                    if (finished) {
                                        log("debug", "new account scanning process has been finished");
                                        return [3 /*break*/, 12];
                                    }
                                    if (!derivationModeSupportsIndex(derivationMode, index))
                                        return [3 /*break*/, 11];
                                    return [4 /*yield*/, iterateResult({
                                            transport: transport,
                                            index: index,
                                            derivationsCache: derivationsCache,
                                            derivationMode: derivationMode,
                                            derivationScheme: derivationScheme,
                                            currency: currency
                                        })];
                                case 9:
                                    res = _b.sent();
                                    if (!res)
                                        return [3 /*break*/, 12];
                                    return [4 /*yield*/, stepAccount(index, res, derivationMode, seedIdentifier, transport)];
                                case 10:
                                    account = _b.sent();
                                    if (account && !account.used) {
                                        if (emptyCount >= mandatoryEmptyAccountSkip)
                                            return [3 /*break*/, 12];
                                        emptyCount++;
                                    }
                                    _b.label = 11;
                                case 11:
                                    index++;
                                    return [3 /*break*/, 8];
                                case 12:
                                    derivationModes_1_1 = derivationModes_1.next();
                                    return [3 /*break*/, 2];
                                case 13: return [3 /*break*/, 16];
                                case 14:
                                    e_5_1 = _b.sent();
                                    e_5 = { error: e_5_1 };
                                    return [3 /*break*/, 16];
                                case 15:
                                    try {
                                        if (derivationModes_1_1 && !derivationModes_1_1.done && (_a = derivationModes_1["return"])) _a.call(derivationModes_1);
                                    }
                                    finally { if (e_5) throw e_5.error; }
                                    return [7 /*endfinally*/];
                                case 16:
                                    o.complete();
                                    return [3 /*break*/, 18];
                                case 17:
                                    e_6 = _b.sent();
                                    o.error(e_6);
                                    return [3 /*break*/, 18];
                                case 18: return [2 /*return*/];
                            }
                        });
                    });
                }
                main();
                return unsubscribe;
            });
        });
    };
};
export function makeAccountBridgeReceive(getAddressFn, _a) {
    var _b = _a === void 0 ? {} : _a, injectGetAddressParams = _b.injectGetAddressParams;
    return function (account, _a) {
        var verify = _a.verify, deviceId = _a.deviceId, freshAddressIndex = _a.freshAddressIndex;
        var freshAddress;
        if (freshAddressIndex !== undefined && freshAddressIndex !== null) {
            freshAddress = account.freshAddresses[freshAddressIndex];
            if (freshAddress === undefined) {
                throw new FreshAddressIndexInvalid();
            }
        }
        var arg = __assign({ verify: verify, currency: account.currency, derivationMode: account.derivationMode, path: freshAddress
                ? freshAddress.derivationPath
                : account.freshAddressPath }, (injectGetAddressParams && injectGetAddressParams(account)));
        return withDevice(deviceId)(function (transport) {
            return from(getAddressWrapper(getAddressFn)(transport, arg).then(function (r) {
                var accountAddress = freshAddress
                    ? freshAddress.address
                    : account.freshAddress;
                if (r.address !== accountAddress) {
                    throw new WrongDeviceForAccount("WrongDeviceForAccount ".concat(account.name), {
                        accountName: account.name
                    });
                }
                return r;
            }));
        });
    };
}
//# sourceMappingURL=jsHelpers.js.map