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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { defaultCosmosAPI } from "./api/Cosmos";
import { Observable } from "rxjs";
import { withDevice } from "@ledgerhq/ledger-common/lib/hw/deviceAccess";
import { encodeOperationId } from "@ledgerhq/ledger-common/lib/operation";
import Cosmos from "@ledgerhq/hw-app-cosmos";
import { AminoTypes } from "@cosmjs/stargate";
import { buildTransaction, postBuildTransaction } from "./js-buildTransaction";
import BigNumber from "bignumber.js";
import { Secp256k1Signature } from "@cosmjs/crypto";
var aminoTypes = new AminoTypes({ prefix: "cosmos" });
var signOperation = function (_a) {
    var account = _a.account, deviceId = _a.deviceId, transaction = _a.transaction;
    return withDevice(deviceId)(function (transport) {
        return Observable.create(function (o) {
            var cancelled;
            function main() {
                var _a, _b;
                return __awaiter(this, void 0, void 0, function () {
                    var hwApp, _c, accountNumber, sequence, chainId, publicKey, pubkey, unsignedPayload, msgs, message, signature, secp256k1Signature, tx_bytes, signed, hash, accountId, fee, extra, type, senders, recipients, operation;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                hwApp = new Cosmos(transport);
                                return [4 /*yield*/, defaultCosmosAPI.getAccount(account.freshAddress)];
                            case 1:
                                _c = _d.sent(), accountNumber = _c.accountNumber, sequence = _c.sequence;
                                return [4 /*yield*/, defaultCosmosAPI.getChainId()];
                            case 2:
                                chainId = _d.sent();
                                o.next({ type: "device-signature-requested" });
                                return [4 /*yield*/, hwApp.getAddress(account.freshAddressPath, "cosmos", false)];
                            case 3:
                                publicKey = (_d.sent()).publicKey;
                                pubkey = {
                                    typeUrl: "/cosmos.crypto.secp256k1.PubKey",
                                    value: new Uint8Array(__spreadArray(__spreadArray([], __read(new Uint8Array([10, 33])), false), __read(new Uint8Array(Buffer.from(publicKey, "hex"))), false))
                                };
                                return [4 /*yield*/, buildTransaction(account, transaction)];
                            case 4:
                                unsignedPayload = _d.sent();
                                msgs = unsignedPayload.map(function (msg) { return aminoTypes.toAmino(msg); });
                                message = {
                                    chain_id: chainId,
                                    account_number: accountNumber.toString(),
                                    sequence: sequence.toString(),
                                    fee: {
                                        amount: [
                                            {
                                                denom: account.currency.units[1].code,
                                                amount: (_a = transaction.fees) === null || _a === void 0 ? void 0 : _a.toString()
                                            },
                                        ],
                                        gas: (_b = transaction.gas) === null || _b === void 0 ? void 0 : _b.toString()
                                    },
                                    msgs: msgs,
                                    memo: transaction.memo || ""
                                };
                                return [4 /*yield*/, hwApp.sign(account.freshAddressPath, JSON.stringify(sortedObject(message)))];
                            case 5:
                                signature = (_d.sent()).signature;
                                if (!signature) {
                                    throw new Error("Cosmos: no Signature Found");
                                }
                                secp256k1Signature = Secp256k1Signature.fromDer(new Uint8Array(signature)).toFixedLength();
                                return [4 /*yield*/, postBuildTransaction(account, transaction, pubkey, unsignedPayload, secp256k1Signature)];
                            case 6:
                                tx_bytes = _d.sent();
                                signed = Buffer.from(tx_bytes).toString("hex");
                                if (cancelled) {
                                    return [2 /*return*/];
                                }
                                o.next({ type: "device-signature-granted" });
                                hash = "";
                                accountId = account.id;
                                fee = transaction.fees || new BigNumber(0);
                                extra = {};
                                type = transaction.mode === "undelegate"
                                    ? "UNDELEGATE"
                                    : transaction.mode === "delegate"
                                        ? "DELEGATE"
                                        : transaction.mode === "redelegate"
                                            ? "REDELEGATE"
                                            : ["claimReward", "claimRewardCompound"].includes(transaction.mode)
                                                ? "REWARD"
                                                : "OUT";
                                senders = [];
                                recipients = [];
                                if (transaction.mode === "send") {
                                    senders.push(account.freshAddress);
                                    recipients.push(transaction.recipient);
                                }
                                if (transaction.mode === "redelegate") {
                                    Object.assign(extra, {
                                        sourceValidator: transaction.sourceValidator
                                    });
                                }
                                if (transaction.mode !== "send") {
                                    Object.assign(extra, {
                                        validators: transaction.validators
                                    });
                                }
                                operation = {
                                    id: encodeOperationId(accountId, hash, type),
                                    hash: hash,
                                    type: type,
                                    value: type === "REWARD"
                                        ? new BigNumber(0)
                                        : transaction.useAllAmount
                                            ? account.spendableBalance
                                            : transaction.amount.plus(fee),
                                    fee: fee,
                                    extra: extra,
                                    blockHash: null,
                                    blockHeight: null,
                                    senders: senders,
                                    recipients: recipients,
                                    accountId: accountId,
                                    date: new Date(),
                                    transactionSequenceNumber: sequence
                                };
                                o.next({
                                    type: "signed",
                                    signedOperation: {
                                        operation: operation,
                                        signature: signed,
                                        expirationDate: null
                                    }
                                });
                                return [2 /*return*/];
                        }
                    });
                });
            }
            main().then(function () { return o.complete(); }, function (e) { return o.error(e); });
            return function () {
                cancelled = true;
            };
        });
    });
};
var sortedObject = function (obj) {
    if (typeof obj !== "object" || obj === null) {
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map(sortedObject);
    }
    var sortedKeys = Object.keys(obj).sort();
    var result = {};
    sortedKeys.forEach(function (key) {
        result[key] = sortedObject(obj[key]);
    });
    return result;
};
export default signOperation;
//# sourceMappingURL=js-signOperation.js.map