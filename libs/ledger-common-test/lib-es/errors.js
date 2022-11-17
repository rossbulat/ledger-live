import { createCustomErrorClass } from "@ledgerhq/errors";
// TODO we need to migrate in all errors that are in @ledgerhq/errors
// but only make sense to live-common to not pollute ledgerjs
export var ConnectAppTimeout = createCustomErrorClass("ConnectAppTimeout");
export var ConnectManagerTimeout = createCustomErrorClass("ConnectManagerTimeout");
export var GetAppAndVersionUnsupportedFormat = createCustomErrorClass("GetAppAndVersionUnsupportedFormat");
export var AccountNeedResync = createCustomErrorClass("AccountNeedResync");
export var LatestFirmwareVersionRequired = createCustomErrorClass("LatestFirmwareVersionRequired");
export var FeeEstimationFailed = createCustomErrorClass("FeeEstimationFailed");
export var LowerThanMinimumRelayFee = createCustomErrorClass("LowerThanMinimumRelayFee");
export var TransactionRefusedOnDevice = createCustomErrorClass("TransactionRefusedOnDevice");
export var LanguageInstallRefusedOnDevice = createCustomErrorClass("LanguageInstallRefusedOnDevice");
export var ImageLoadRefusedOnDevice = createCustomErrorClass("ImageLoadRefusedOnDevice");
export var ImageDoesNotExistOnDevice = createCustomErrorClass("ImageDoesNotExistOnDevice");
export var ImageCommitRefusedOnDevice = createCustomErrorClass("ImageCommitRefusedOnDevice");
export var LanguageInstallTimeout = createCustomErrorClass("LanguageInstallTimeout");
export var DeviceNotOnboarded = createCustomErrorClass("DeviceNotOnboarded");
export var InvalidAddressBecauseAlreadyDelegated = createCustomErrorClass("InvalidAddressBecauseAlreadyDelegated");
export var TronNoFrozenForBandwidth = createCustomErrorClass("TronNoFrozenForBandwidth");
export var TronNoFrozenForEnergy = createCustomErrorClass("TronNoFrozenForEnergy");
export var TronUnfreezeNotExpired = createCustomErrorClass("TronUnfreezeNotExpired");
export var TronVoteRequired = createCustomErrorClass("TronVoteRequired");
export var TronInvalidVoteCount = createCustomErrorClass("TronInvalidVoteCount");
export var TronRewardNotAvailable = createCustomErrorClass("TronRewardNotAvailable");
export var TronNoReward = createCustomErrorClass("TronNoReward");
export var TronInvalidFreezeAmount = createCustomErrorClass("TronInvalidFreezeAmount");
export var TronSendTrc20ToNewAccountForbidden = createCustomErrorClass("TronSendTrc20ToNewAccountForbidden");
export var TronUnexpectedFees = createCustomErrorClass("TronUnexpectedFees");
export var TronNotEnoughTronPower = createCustomErrorClass("TronNotEnoughTronPower");
export var TronTransactionExpired = createCustomErrorClass("TronTransactionExpired");
export var TronNotEnoughEnergy = createCustomErrorClass("TronNotEnoughEnergy");
export var AccountAwaitingSendPendingOperations = createCustomErrorClass("AccountAwaitingSendPendingOperations");
export var SourceHasMultiSign = createCustomErrorClass("SourceHasMultiSign");
export var CosmosRedelegationInProgress = createCustomErrorClass("CosmosRedelegationInProgress");
export var ClaimRewardsFeesWarning = createCustomErrorClass("ClaimRewardsFeesWarning");
export var CosmosDelegateAllFundsWarning = createCustomErrorClass("CosmosDelegateAllFundsWarning");
export var CosmosTooManyValidators = createCustomErrorClass("CosmosTooManyValidators");
export var NotEnoughDelegationBalance = createCustomErrorClass("NotEnoughDelegationBalance");
export var RPCHostRequired = createCustomErrorClass("RPCHostRequired");
export var RPCHostInvalid = createCustomErrorClass("RPCHostInvalid");
export var RPCUserRequired = createCustomErrorClass("RPCUserRequired");
export var RPCPassRequired = createCustomErrorClass("RPCPassRequired");
// Note : info of this code can be found here :
// https://github.com/cosmos/cosmos-sdk/blob/v0.40.0-rc3/types/errors/errors.go#L16
export var CosmosBroadcastError = {
    "1": createCustomErrorClass("CosmosBroadcastCodeInternal"),
    "2": createCustomErrorClass("CosmosBroadcastCodeTxDecode"),
    "3": createCustomErrorClass("CosmosBroadcastCodeInvalidSequence"),
    "4": createCustomErrorClass("CosmosBroadcastCodeUnauthorized"),
    "5": createCustomErrorClass("CosmosBroadcastCodeInsufficientFunds"),
    "6": createCustomErrorClass("CosmosBroadcastCodeUnknownRequest"),
    "7": createCustomErrorClass("CosmosBroadcastCodeInvalidAddress"),
    "8": createCustomErrorClass("CosmosBroadcastCodeInvalidPubKey"),
    "9": createCustomErrorClass("CosmosBroadcastCodeUnknownAddress"),
    "10": createCustomErrorClass("CosmosBroadcastCodeInvalidCoins"),
    "11": createCustomErrorClass("CosmosBroadcastCodeOutOfGas"),
    "12": createCustomErrorClass("CosmosBroadcastCodeMemoTooLarge"),
    "13": createCustomErrorClass("CosmosBroadcastCodeInsufficientFee"),
    "14": createCustomErrorClass("CosmosBroadcastCodeTooManySignatures"),
    "15": createCustomErrorClass("CosmosBroadcastCodeNoSignatures"),
    "16": createCustomErrorClass("CosmosBroadcastCodeJSONMarshal"),
    "17": createCustomErrorClass("CosmosBroadcastCodeJSONUnmarshal"),
    "18": createCustomErrorClass("CosmosBroadcastCodeInvalidRequest"),
    "19": createCustomErrorClass("CosmosBroadcastCodeTxInMempoolCache"),
    "20": createCustomErrorClass("CosmosBroadcastCodeMempoolIsFull"),
    "21": createCustomErrorClass("CosmosBroadcastTxTooLarge"),
    "22": createCustomErrorClass("CosmosBroadcastKeyNotFound"),
    "23": createCustomErrorClass("CosmosBroadcastWrongPassword"),
    "24": createCustomErrorClass("CosmosBroadcastInvalidSigner"),
    "25": createCustomErrorClass("CosmosBroadcastInvalidGasAdjustment"),
    "26": createCustomErrorClass("CosmosBroadcastInvalidHeight"),
    "27": createCustomErrorClass("CosmosBroadcastInvalidVersion"),
    "28": createCustomErrorClass("CosmosBroadcastInvalidChainID"),
    "29": createCustomErrorClass("CosmosBroadcastInvalidType"),
    "30": createCustomErrorClass("CosmosBroadcastTimeoutHeight"),
    "31": createCustomErrorClass("CosmosBroadcastUnknownExtensionOptions"),
    "32": createCustomErrorClass("CosmosBroadcastWrongSequence"),
    "33": createCustomErrorClass("CosmosBroadcastPackAny"),
    "34": createCustomErrorClass("CosmosBroadcastUnpackAny"),
    "35": createCustomErrorClass("CosmosBroadcastLogic"),
    "36": createCustomErrorClass("CosmosBroadcastConflict")
};
export var SatStackVersionTooOld = createCustomErrorClass("SatStackVersionTooOld");
export var SatStackAccessDown = createCustomErrorClass("SatStackAccessDown");
export var SatStackStillSyncing = createCustomErrorClass("SatStackStillSyncing");
export var SatStackDescriptorNotImported = createCustomErrorClass("SatStackDescriptorNotImported");
export var SwapNoAvailableProviders = createCustomErrorClass("SwapNoAvailableProviders");
export var NoSuchAppOnProvider = createCustomErrorClass("NoSuchAppOnProvider");
export var SwapExchangeRateAmountTooLow = createCustomErrorClass("SwapExchangeRateAmountTooLow");
export var SwapExchangeRateAmountTooHigh = createCustomErrorClass("SwapExchangeRateAmountTooHigh");
export var SwapCheckKYCStatusFailed = createCustomErrorClass("SwapCheckKYCStatusFailed");
export var SwapSubmitKYCFailed = createCustomErrorClass("SwapSubmitKYCFailed");
export var SwapGenericAPIError = createCustomErrorClass("SwapGenericAPIError");
export var JSONRPCResponseError = createCustomErrorClass("JSONRPCResponseError");
export var JSONDecodeError = createCustomErrorClass("JSONDecodeError");
export var NoIPHeaderError = createCustomErrorClass("NoIPHeaderError");
export var CurrencyNotSupportedError = createCustomErrorClass("CurrencyNotSupportedError");
export var CurrencyDisabledError = createCustomErrorClass("CurrencyDisabledError");
export var CurrencyDisabledAsInputError = createCustomErrorClass("CurrencyDisabledAsInputError");
export var CurrencyDisabledAsOutputError = createCustomErrorClass("CurrencyDisabledAsOutputError");
export var CurrencyNotSupportedByProviderError = createCustomErrorClass("CurrencyNotSupportedByProviderError");
export var TradeMethodNotSupportedError = createCustomErrorClass("TradeMethodNotSupportedError");
export var UnexpectedError = createCustomErrorClass("UnexpectedError");
export var NotImplementedError = createCustomErrorClass("NotImplementedError");
export var ValidationError = createCustomErrorClass("ValidationError");
export var AccessDeniedError = createCustomErrorClass("AccessDeniedError");
export var AlgorandASANotOptInInRecipient = createCustomErrorClass("AlgorandASANotOptInInRecipient");
export var CompoundLowerAllowanceOfActiveAccountError = createCustomErrorClass("CompoundLowerAllowanceOfActiveAccountError");
export var OutdatedApp = createCustomErrorClass("OutdatedApp");
export var FreshAddressIndexInvalid = createCustomErrorClass("FreshAddressIndexInvalid");
export var BluetoothNotSupportedError = createCustomErrorClass("FwUpdateBluetoothNotSupported");
export var UnsupportedDerivation = createCustomErrorClass("UnsupportedDerivation");
//# sourceMappingURL=errors.js.map