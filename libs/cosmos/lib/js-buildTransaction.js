"use strict";
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
exports.postBuildTransaction = exports.buildTransaction = void 0;
var proto_signing_1 = require("@cosmjs/proto-signing");
var tx_1 = require("cosmjs-types/cosmos/staking/v1beta1/tx");
var tx_2 = require("cosmjs-types/cosmos/distribution/v1beta1/tx");
var signing_1 = require("cosmjs-types/cosmos/tx/signing/v1beta1/signing");
var tx_3 = require("cosmjs-types/cosmos/tx/v1beta1/tx");
var Cosmos_1 = require("./api/Cosmos");
var bignumber_js_1 = __importDefault(require("bignumber.js"));
var buildTransaction = function (account, transaction) { return __awaiter(void 0, void 0, void 0, function () {
    var msg, isComplete, validator;
    return __generator(this, function (_a) {
        msg = [];
        isComplete = true;
        switch (transaction.mode) {
            case "send":
                if (!transaction.recipient || transaction.amount.lte(0)) {
                    isComplete = false;
                }
                else {
                    msg.push({
                        typeUrl: "/cosmos.bank.v1beta1.MsgSend",
                        value: {
                            fromAddress: account.freshAddress,
                            toAddress: transaction.recipient,
                            amount: [
                                {
                                    denom: account.currency.units[1].code,
                                    amount: transaction.amount.toString()
                                },
                            ]
                        }
                    });
                }
                break;
            case "delegate":
                if (!transaction.validators || transaction.validators.length < 1) {
                    isComplete = false;
                }
                else {
                    validator = transaction.validators[0];
                    if (!validator) {
                        isComplete = false;
                        break;
                    }
                    else if (!validator.address || transaction.amount.lte(0)) {
                        isComplete = false;
                    }
                    msg.push({
                        typeUrl: "/cosmos.staking.v1beta1.MsgDelegate",
                        value: {
                            delegatorAddress: account.freshAddress,
                            validatorAddress: validator.address,
                            amount: {
                                denom: account.currency.units[1].code,
                                amount: transaction.amount.toString()
                            }
                        }
                    });
                }
                break;
            case "undelegate":
                if (!transaction.validators ||
                    transaction.validators.length < 1 ||
                    !transaction.validators[0].address ||
                    transaction.validators[0].amount.lte(0)) {
                    isComplete = false;
                }
                else {
                    msg.push({
                        typeUrl: "/cosmos.staking.v1beta1.MsgUndelegate",
                        value: {
                            delegatorAddress: account.freshAddress,
                            validatorAddress: transaction.validators[0].address,
                            amount: {
                                denom: account.currency.units[1].code,
                                amount: transaction.validators[0].amount.toString()
                            }
                        }
                    });
                }
                break;
            case "redelegate":
                if (!transaction.sourceValidator ||
                    !transaction.validators ||
                    transaction.validators.length < 1 ||
                    !transaction.validators[0].address ||
                    transaction.validators[0].amount.lte(0)) {
                    isComplete = false;
                }
                else {
                    msg.push({
                        typeUrl: "/cosmos.staking.v1beta1.MsgBeginRedelegate",
                        value: {
                            validatorSrcAddress: transaction.sourceValidator,
                            delegatorAddress: account.freshAddress,
                            validatorDstAddress: transaction.validators[0].address,
                            amount: {
                                denom: account.currency.units[1].code,
                                amount: transaction.validators[0].amount.toString()
                            }
                        }
                    });
                }
                break;
            case "claimReward":
                if (!transaction.validators ||
                    transaction.validators.length < 1 ||
                    !transaction.validators[0].address) {
                    isComplete = false;
                }
                else {
                    msg.push({
                        typeUrl: "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward",
                        value: {
                            delegatorAddress: account.freshAddress,
                            validatorAddress: transaction.validators[0].address
                        }
                    });
                }
                break;
            case "claimRewardCompound":
                if (!transaction.validators ||
                    transaction.validators.length < 1 ||
                    !transaction.validators[0].address ||
                    transaction.validators[0].amount.lte(0)) {
                    isComplete = false;
                }
                else {
                    msg.push({
                        typeUrl: "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward",
                        value: {
                            delegatorAddress: account.freshAddress,
                            validatorAddress: transaction.validators[0].address
                        }
                    });
                    msg.push({
                        typeUrl: "/cosmos.staking.v1beta1.MsgDelegate",
                        value: {
                            delegatorAddress: account.freshAddress,
                            validatorAddress: transaction.validators[0].address,
                            amount: {
                                denom: account.currency.units[1].code,
                                amount: transaction.validators[0].amount.toString()
                            }
                        }
                    });
                }
                break;
        }
        if (!isComplete) {
            return [2 /*return*/, []];
        }
        return [2 /*return*/, msg];
    });
}); };
exports.buildTransaction = buildTransaction;
var postBuildTransaction = function (account, transaction, pubkey, unsignedPayload, signature) { return __awaiter(void 0, void 0, void 0, function () {
    var txBodyFields, registry, sequence, txBodyBytes, authInfoBytes, txRaw, tx_bytes;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                txBodyFields = {
                    typeUrl: "/cosmos.tx.v1beta1.TxBody",
                    value: {
                        messages: unsignedPayload,
                        memo: transaction.memo || ""
                    }
                };
                registry = new proto_signing_1.Registry([
                    ["/cosmos.staking.v1beta1.MsgDelegate", tx_1.MsgDelegate],
                    ["/cosmos.staking.v1beta1.MsgUndelegate", tx_1.MsgUndelegate],
                    ["/cosmos.staking.v1beta1.MsgBeginRedelegate", tx_1.MsgBeginRedelegate],
                    [
                        "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward",
                        tx_2.MsgWithdrawDelegatorReward,
                    ],
                ]);
                return [4 /*yield*/, Cosmos_1.defaultCosmosAPI.getAccount(account.freshAddress)];
            case 1:
                sequence = (_c.sent()).sequence;
                txBodyBytes = registry.encode(txBodyFields);
                authInfoBytes = (0, proto_signing_1.makeAuthInfoBytes)([{ pubkey: pubkey, sequence: sequence }], [
                    {
                        amount: ((_a = transaction.fees) === null || _a === void 0 ? void 0 : _a.toString()) || new bignumber_js_1["default"](2500).toString(),
                        denom: account.currency.units[1].code
                    },
                ], ((_b = transaction.gas) === null || _b === void 0 ? void 0 : _b.toNumber()) || new bignumber_js_1["default"](250000).toNumber(), signing_1.SignMode.SIGN_MODE_LEGACY_AMINO_JSON);
                txRaw = tx_3.TxRaw.fromPartial({
                    bodyBytes: txBodyBytes,
                    authInfoBytes: authInfoBytes,
                    signatures: [signature]
                });
                tx_bytes = Array.from(Uint8Array.from(tx_3.TxRaw.encode(txRaw).finish()));
                return [2 /*return*/, tx_bytes];
        }
    });
}); };
exports.postBuildTransaction = postBuildTransaction;
exports["default"] = exports.buildTransaction;
//# sourceMappingURL=js-buildTransaction.js.map