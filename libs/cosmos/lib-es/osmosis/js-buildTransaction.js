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
import { SignMode } from "cosmjs-types/cosmos/tx/signing/v1beta1/signing";
import { cosmos } from "@keplr-wallet/cosmos";
import { MsgBeginRedelegate, MsgDelegate, MsgUndelegate, } from "cosmjs-types/cosmos/staking/v1beta1/tx";
import Long from "long";
import { PubKey } from "@keplr-wallet/proto-types/cosmos/crypto/secp256k1/keys";
import { AuthInfo, TxRaw, Fee, } from "@keplr-wallet/proto-types/cosmos/tx/v1beta1/tx";
import { TxBody } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import { MsgWithdrawDelegatorReward } from "cosmjs-types/cosmos/distribution/v1beta1/tx";
export var buildTransaction = function (account, transaction) { return __awaiter(void 0, void 0, void 0, function () {
    var aminoMsgs, protoMsgs, aminoMsg, validator, aminoMsg, validator, aminoMsg, validator, aminoMsg, validator, aminoMsg, validator, aminoWithdrawRewardMsg, aminoDelegateMsg;
    return __generator(this, function (_a) {
        aminoMsgs = [];
        protoMsgs = [];
        switch (transaction.mode) {
            case "send":
                if (transaction.recipient && transaction.amount.gt(0)) {
                    aminoMsg = {
                        type: "cosmos-sdk/MsgSend",
                        value: {
                            from_address: account.freshAddress,
                            to_address: transaction.recipient,
                            amount: [
                                {
                                    denom: account.currency.units[1].code,
                                    amount: transaction.amount.toString()
                                },
                            ]
                        }
                    };
                    aminoMsgs.push(aminoMsg);
                    // PROTO MESSAGE
                    protoMsgs.push({
                        typeUrl: "/cosmos.bank.v1beta1.MsgSend",
                        value: cosmos.bank.v1beta1.MsgSend.encode({
                            fromAddress: account.freshAddress,
                            toAddress: transaction.recipient,
                            amount: [
                                {
                                    denom: account.currency.units[1].code,
                                    amount: transaction.amount.toString()
                                },
                            ]
                        }).finish()
                    });
                }
                break;
            case "delegate":
                if (transaction.validators && transaction.validators.length > 0) {
                    validator = transaction.validators[0];
                    if (validator && validator.address && transaction.amount.gt(0)) {
                        aminoMsg = {
                            type: "cosmos-sdk/MsgDelegate",
                            value: {
                                delegator_address: account.freshAddress,
                                validator_address: validator.address,
                                amount: {
                                    denom: account.currency.units[1].code,
                                    amount: transaction.amount.toString()
                                }
                            }
                        };
                        aminoMsgs.push(aminoMsg);
                        // PROTO MESSAGE
                        protoMsgs.push({
                            typeUrl: "/cosmos.staking.v1beta1.MsgDelegate",
                            value: MsgDelegate.encode({
                                delegatorAddress: account.freshAddress,
                                validatorAddress: validator.address,
                                amount: {
                                    denom: account.currency.units[1].code,
                                    amount: transaction.amount.toString()
                                }
                            }).finish()
                        });
                    }
                }
                break;
            case "redelegate":
                if (transaction.sourceValidator &&
                    transaction.validators &&
                    transaction.validators.length > 0 &&
                    transaction.validators[0].address &&
                    transaction.validators[0].amount.gt(0)) {
                    validator = transaction.validators[0];
                    aminoMsg = {
                        type: "cosmos-sdk/MsgBeginRedelegate",
                        value: {
                            delegator_address: account.freshAddress,
                            validator_src_address: transaction.sourceValidator,
                            validator_dst_address: validator.address,
                            amount: {
                                denom: account.currency.units[1].code,
                                amount: validator.amount.toString()
                            }
                        }
                    };
                    aminoMsgs.push(aminoMsg);
                    // PROTO MESSAGE
                    protoMsgs.push({
                        typeUrl: "/cosmos.staking.v1beta1.MsgBeginRedelegate",
                        value: MsgBeginRedelegate.encode({
                            delegatorAddress: account.freshAddress,
                            validatorSrcAddress: transaction.sourceValidator,
                            validatorDstAddress: validator.address,
                            amount: {
                                denom: account.currency.units[1].code,
                                amount: validator.amount.toString()
                            }
                        }).finish()
                    });
                }
                break;
            case "undelegate":
                if (transaction.validators && transaction.validators.length > 0) {
                    validator = transaction.validators[0];
                    if (validator && validator.address /*&& transaction.amount.gt(0)*/) {
                        aminoMsg = {
                            type: "cosmos-sdk/MsgUndelegate",
                            value: {
                                delegator_address: account.freshAddress,
                                validator_address: validator.address,
                                amount: {
                                    denom: account.currency.units[1].code,
                                    amount: validator.amount.toString()
                                }
                            }
                        };
                        aminoMsgs.push(aminoMsg);
                        // PROTO MESSAGE
                        protoMsgs.push({
                            typeUrl: "/cosmos.staking.v1beta1.MsgUndelegate",
                            value: MsgUndelegate.encode({
                                delegatorAddress: account.freshAddress,
                                validatorAddress: validator.address,
                                amount: {
                                    denom: account.currency.units[1].code,
                                    amount: validator.amount.toString()
                                }
                            }).finish()
                        });
                    }
                }
                break;
            case "claimReward":
                if (transaction.validators &&
                    transaction.validators.length > 0 &&
                    transaction.validators[0].address) {
                    validator = transaction.validators[0];
                    aminoMsg = {
                        type: "cosmos-sdk/MsgWithdrawDelegationReward",
                        value: {
                            delegator_address: account.freshAddress,
                            validator_address: validator.address
                        }
                    };
                    aminoMsgs.push(aminoMsg);
                    // PROTO MESSAGE
                    protoMsgs.push({
                        typeUrl: "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward",
                        value: MsgWithdrawDelegatorReward.encode({
                            delegatorAddress: account.freshAddress,
                            validatorAddress: validator.address
                        }).finish()
                    });
                }
                break;
            case "claimRewardCompound":
                if (transaction.validators &&
                    transaction.validators.length > 0 &&
                    transaction.validators[0].address &&
                    transaction.validators[0].amount.gt(0)) {
                    validator = transaction.validators[0];
                    aminoWithdrawRewardMsg = {
                        type: "cosmos-sdk/MsgWithdrawDelegationReward",
                        value: {
                            delegator_address: account.freshAddress,
                            validator_address: validator.address
                        }
                    };
                    aminoDelegateMsg = {
                        type: "cosmos-sdk/MsgDelegate",
                        value: {
                            delegator_address: account.freshAddress,
                            validator_address: validator.address,
                            amount: {
                                denom: account.currency.units[1].code,
                                amount: validator.amount.toString()
                            }
                        }
                    };
                    aminoMsgs.push(aminoWithdrawRewardMsg, aminoDelegateMsg);
                    // PROTO MESSAGES
                    protoMsgs.push({
                        typeUrl: "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward",
                        value: MsgWithdrawDelegatorReward.encode({
                            delegatorAddress: account.freshAddress,
                            validatorAddress: validator.address
                        }).finish()
                    });
                    protoMsgs.push({
                        typeUrl: "/cosmos.staking.v1beta1.MsgDelegate",
                        value: MsgDelegate.encode({
                            delegatorAddress: account.freshAddress,
                            validatorAddress: validator.address,
                            amount: {
                                denom: account.currency.units[1].code,
                                amount: validator.amount.toString()
                            }
                        }).finish()
                    });
                }
                break;
        }
        return [2 /*return*/, { aminoMsgs: aminoMsgs, protoMsgs: protoMsgs }];
    });
}); };
export var postBuildTransaction = function (signResponse, protoMsgs) { return __awaiter(void 0, void 0, void 0, function () {
    var signed_tx_bytes;
    return __generator(this, function (_a) {
        signed_tx_bytes = TxRaw.encode({
            bodyBytes: TxBody.encode(TxBody.fromPartial({
                messages: protoMsgs,
                memo: signResponse.signed.memo,
                timeoutHeight: undefined,
                extensionOptions: [],
                nonCriticalExtensionOptions: []
            })).finish(),
            authInfoBytes: AuthInfo.encode({
                signerInfos: [
                    {
                        publicKey: {
                            typeUrl: "/cosmos.crypto.secp256k1.PubKey",
                            value: PubKey.encode({
                                key: Buffer.from(signResponse.signature.pub_key.value, "base64")
                            }).finish()
                        },
                        modeInfo: {
                            single: {
                                mode: SignMode.SIGN_MODE_LEGACY_AMINO_JSON
                            },
                            multi: undefined
                        },
                        sequence: Long.fromString(signResponse.signed.sequence)
                    },
                ],
                fee: Fee.fromPartial({
                    amount: signResponse.signed.fee.amount
                        ? signResponse.signed.fee.amount
                        : undefined,
                    gasLimit: signResponse.signed.fee.gas
                })
            }).finish(),
            signatures: [Buffer.from(signResponse.signature.signature, "base64")]
        }).finish();
        return [2 /*return*/, signed_tx_bytes];
    });
}); };
export default buildTransaction;
//# sourceMappingURL=js-buildTransaction.js.map