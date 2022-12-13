"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var sdk_1 = require("./api/sdk");
var rxjs_1 = require("rxjs");
var deviceAccess_1 = require("@ledgerhq/ledger-common/lib/hw/deviceAccess");
var operation_1 = require("@ledgerhq/ledger-common/lib/operation");
var ledger_amino_1 = require("@cosmjs/ledger-amino");
var crypto_1 = require("@cosmjs/crypto");
var js_buildTransaction_1 = require("./js-buildTransaction");
var bignumber_js_1 = __importDefault(require("bignumber.js"));
var launchpad_1 = require("@cosmjs/launchpad");
var js_getFeesForTransaction_1 = __importStar(require("./js-getFeesForTransaction"));
var signOperation = function (_a) {
    var account = _a.account, deviceId = _a.deviceId, transaction = _a.transaction;
    return (0, deviceAccess_1.withDevice)(deviceId)(function (transport) {
        return rxjs_1.Observable.create(function (o) {
            var cancelled;
            function main() {
                return __awaiter(this, void 0, void 0, function () {
                    var _a, accountNumber, sequence, chainId, hdPaths, ledgerSigner, _b, aminoMsgs, protoMsgs, feeToEncode, _c, _d, _e, _f, signDoc, signResponse, signed_tx_bytes, signature, hash, accountId, fee, extra, type, senders, recipients, operation;
                    var _g, _h;
                    return __generator(this, function (_j) {
                        switch (_j.label) {
                            case 0: return [4 /*yield*/, sdk_1.osmosisAPI.getAccount(account.freshAddress)];
                            case 1:
                                _a = _j.sent(), accountNumber = _a.accountNumber, sequence = _a.sequence;
                                return [4 /*yield*/, sdk_1.osmosisAPI.getChainId()];
                            case 2:
                                chainId = _j.sent();
                                hdPaths = (0, crypto_1.stringToPath)("m/" + account.freshAddressPath);
                                ledgerSigner = new ledger_amino_1.LedgerSigner(transport, {
                                    hdPaths: [hdPaths],
                                    prefix: account.currency.id
                                });
                                o.next({ type: "device-signature-requested" });
                                return [4 /*yield*/, (0, js_buildTransaction_1.buildTransaction)(account, transaction)];
                            case 3:
                                _b = _j.sent(), aminoMsgs = _b.aminoMsgs, protoMsgs = _b.protoMsgs;
                                if (aminoMsgs.length === 0 || protoMsgs.length === 0) {
                                    return [2 /*return*/];
                                }
                                _g = {};
                                _h = {
                                    denom: account.currency.units[1].code
                                };
                                if (!transaction.fees) return [3 /*break*/, 4];
                                _c = transaction.fees.toNumber().toString();
                                return [3 /*break*/, 6];
                            case 4:
                                _d = String;
                                return [4 /*yield*/, (0, js_getFeesForTransaction_1["default"])(transaction.mode)];
                            case 5:
                                _c = _d.apply(void 0, [_j.sent()]);
                                _j.label = 6;
                            case 6:
                                _g.amount = [
                                    (_h.amount = _c,
                                        _h)
                                ];
                                if (!transaction.gas) return [3 /*break*/, 7];
                                _e = transaction.gas.toString();
                                return [3 /*break*/, 9];
                            case 7:
                                _f = String;
                                return [4 /*yield*/, (0, js_getFeesForTransaction_1.getEstimatedGas)(transaction.mode)];
                            case 8:
                                _e = _f.apply(void 0, [_j.sent()]);
                                _j.label = 9;
                            case 9:
                                feeToEncode = (_g.gas = _e,
                                    _g);
                                signDoc = (0, launchpad_1.makeSignDoc)(aminoMsgs, feeToEncode, chainId, transaction.memo || "", accountNumber.toString(), sequence.toString());
                                return [4 /*yield*/, ledgerSigner.signAmino(account.freshAddress, signDoc)];
                            case 10:
                                signResponse = _j.sent();
                                return [4 /*yield*/, (0, js_buildTransaction_1.postBuildTransaction)(signResponse, protoMsgs)];
                            case 11:
                                signed_tx_bytes = _j.sent();
                                signature = Buffer.from(signed_tx_bytes).toString("hex");
                                if (cancelled) {
                                    return [2 /*return*/];
                                }
                                o.next({ type: "device-signature-granted" });
                                hash = "";
                                accountId = account.id;
                                fee = transaction.fees || new bignumber_js_1["default"](js_getFeesForTransaction_1.DEFAULT_FEES);
                                extra = { memo: transaction.memo || {} };
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
                                    id: (0, operation_1.encodeOperationId)(accountId, hash, type),
                                    hash: hash,
                                    type: type,
                                    value: transaction.amount,
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
                                        signature: signature,
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
exports["default"] = signOperation;
//# sourceMappingURL=js-signOperation.js.map