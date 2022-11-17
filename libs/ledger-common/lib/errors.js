"use strict";
exports.__esModule = true;
exports.SwapSubmitKYCFailed = exports.SwapCheckKYCStatusFailed = exports.SwapExchangeRateAmountTooHigh = exports.SwapExchangeRateAmountTooLow = exports.NoSuchAppOnProvider = exports.SwapNoAvailableProviders = exports.SatStackDescriptorNotImported = exports.SatStackStillSyncing = exports.SatStackAccessDown = exports.SatStackVersionTooOld = exports.CosmosBroadcastError = exports.RPCPassRequired = exports.RPCUserRequired = exports.RPCHostInvalid = exports.RPCHostRequired = exports.NotEnoughDelegationBalance = exports.CosmosTooManyValidators = exports.CosmosDelegateAllFundsWarning = exports.ClaimRewardsFeesWarning = exports.CosmosRedelegationInProgress = exports.SourceHasMultiSign = exports.AccountAwaitingSendPendingOperations = exports.TronNotEnoughEnergy = exports.TronTransactionExpired = exports.TronNotEnoughTronPower = exports.TronUnexpectedFees = exports.TronSendTrc20ToNewAccountForbidden = exports.TronInvalidFreezeAmount = exports.TronNoReward = exports.TronRewardNotAvailable = exports.TronInvalidVoteCount = exports.TronVoteRequired = exports.TronUnfreezeNotExpired = exports.TronNoFrozenForEnergy = exports.TronNoFrozenForBandwidth = exports.InvalidAddressBecauseAlreadyDelegated = exports.DeviceNotOnboarded = exports.LanguageInstallTimeout = exports.ImageCommitRefusedOnDevice = exports.ImageDoesNotExistOnDevice = exports.ImageLoadRefusedOnDevice = exports.LanguageInstallRefusedOnDevice = exports.TransactionRefusedOnDevice = exports.LowerThanMinimumRelayFee = exports.FeeEstimationFailed = exports.LatestFirmwareVersionRequired = exports.AccountNeedResync = exports.GetAppAndVersionUnsupportedFormat = exports.ConnectManagerTimeout = exports.ConnectAppTimeout = void 0;
exports.UnsupportedDerivation = exports.BluetoothNotSupportedError = exports.FreshAddressIndexInvalid = exports.OutdatedApp = exports.CompoundLowerAllowanceOfActiveAccountError = exports.AlgorandASANotOptInInRecipient = exports.AccessDeniedError = exports.ValidationError = exports.NotImplementedError = exports.UnexpectedError = exports.TradeMethodNotSupportedError = exports.CurrencyNotSupportedByProviderError = exports.CurrencyDisabledAsOutputError = exports.CurrencyDisabledAsInputError = exports.CurrencyDisabledError = exports.CurrencyNotSupportedError = exports.NoIPHeaderError = exports.JSONDecodeError = exports.JSONRPCResponseError = exports.SwapGenericAPIError = void 0;
var errors_1 = require("@ledgerhq/errors");
// TODO we need to migrate in all errors that are in @ledgerhq/errors
// but only make sense to live-common to not pollute ledgerjs
exports.ConnectAppTimeout = (0, errors_1.createCustomErrorClass)("ConnectAppTimeout");
exports.ConnectManagerTimeout = (0, errors_1.createCustomErrorClass)("ConnectManagerTimeout");
exports.GetAppAndVersionUnsupportedFormat = (0, errors_1.createCustomErrorClass)("GetAppAndVersionUnsupportedFormat");
exports.AccountNeedResync = (0, errors_1.createCustomErrorClass)("AccountNeedResync");
exports.LatestFirmwareVersionRequired = (0, errors_1.createCustomErrorClass)("LatestFirmwareVersionRequired");
exports.FeeEstimationFailed = (0, errors_1.createCustomErrorClass)("FeeEstimationFailed");
exports.LowerThanMinimumRelayFee = (0, errors_1.createCustomErrorClass)("LowerThanMinimumRelayFee");
exports.TransactionRefusedOnDevice = (0, errors_1.createCustomErrorClass)("TransactionRefusedOnDevice");
exports.LanguageInstallRefusedOnDevice = (0, errors_1.createCustomErrorClass)("LanguageInstallRefusedOnDevice");
exports.ImageLoadRefusedOnDevice = (0, errors_1.createCustomErrorClass)("ImageLoadRefusedOnDevice");
exports.ImageDoesNotExistOnDevice = (0, errors_1.createCustomErrorClass)("ImageDoesNotExistOnDevice");
exports.ImageCommitRefusedOnDevice = (0, errors_1.createCustomErrorClass)("ImageCommitRefusedOnDevice");
exports.LanguageInstallTimeout = (0, errors_1.createCustomErrorClass)("LanguageInstallTimeout");
exports.DeviceNotOnboarded = (0, errors_1.createCustomErrorClass)("DeviceNotOnboarded");
exports.InvalidAddressBecauseAlreadyDelegated = (0, errors_1.createCustomErrorClass)("InvalidAddressBecauseAlreadyDelegated");
exports.TronNoFrozenForBandwidth = (0, errors_1.createCustomErrorClass)("TronNoFrozenForBandwidth");
exports.TronNoFrozenForEnergy = (0, errors_1.createCustomErrorClass)("TronNoFrozenForEnergy");
exports.TronUnfreezeNotExpired = (0, errors_1.createCustomErrorClass)("TronUnfreezeNotExpired");
exports.TronVoteRequired = (0, errors_1.createCustomErrorClass)("TronVoteRequired");
exports.TronInvalidVoteCount = (0, errors_1.createCustomErrorClass)("TronInvalidVoteCount");
exports.TronRewardNotAvailable = (0, errors_1.createCustomErrorClass)("TronRewardNotAvailable");
exports.TronNoReward = (0, errors_1.createCustomErrorClass)("TronNoReward");
exports.TronInvalidFreezeAmount = (0, errors_1.createCustomErrorClass)("TronInvalidFreezeAmount");
exports.TronSendTrc20ToNewAccountForbidden = (0, errors_1.createCustomErrorClass)("TronSendTrc20ToNewAccountForbidden");
exports.TronUnexpectedFees = (0, errors_1.createCustomErrorClass)("TronUnexpectedFees");
exports.TronNotEnoughTronPower = (0, errors_1.createCustomErrorClass)("TronNotEnoughTronPower");
exports.TronTransactionExpired = (0, errors_1.createCustomErrorClass)("TronTransactionExpired");
exports.TronNotEnoughEnergy = (0, errors_1.createCustomErrorClass)("TronNotEnoughEnergy");
exports.AccountAwaitingSendPendingOperations = (0, errors_1.createCustomErrorClass)("AccountAwaitingSendPendingOperations");
exports.SourceHasMultiSign = (0, errors_1.createCustomErrorClass)("SourceHasMultiSign");
exports.CosmosRedelegationInProgress = (0, errors_1.createCustomErrorClass)("CosmosRedelegationInProgress");
exports.ClaimRewardsFeesWarning = (0, errors_1.createCustomErrorClass)("ClaimRewardsFeesWarning");
exports.CosmosDelegateAllFundsWarning = (0, errors_1.createCustomErrorClass)("CosmosDelegateAllFundsWarning");
exports.CosmosTooManyValidators = (0, errors_1.createCustomErrorClass)("CosmosTooManyValidators");
exports.NotEnoughDelegationBalance = (0, errors_1.createCustomErrorClass)("NotEnoughDelegationBalance");
exports.RPCHostRequired = (0, errors_1.createCustomErrorClass)("RPCHostRequired");
exports.RPCHostInvalid = (0, errors_1.createCustomErrorClass)("RPCHostInvalid");
exports.RPCUserRequired = (0, errors_1.createCustomErrorClass)("RPCUserRequired");
exports.RPCPassRequired = (0, errors_1.createCustomErrorClass)("RPCPassRequired");
// Note : info of this code can be found here :
// https://github.com/cosmos/cosmos-sdk/blob/v0.40.0-rc3/types/errors/errors.go#L16
exports.CosmosBroadcastError = {
    "1": (0, errors_1.createCustomErrorClass)("CosmosBroadcastCodeInternal"),
    "2": (0, errors_1.createCustomErrorClass)("CosmosBroadcastCodeTxDecode"),
    "3": (0, errors_1.createCustomErrorClass)("CosmosBroadcastCodeInvalidSequence"),
    "4": (0, errors_1.createCustomErrorClass)("CosmosBroadcastCodeUnauthorized"),
    "5": (0, errors_1.createCustomErrorClass)("CosmosBroadcastCodeInsufficientFunds"),
    "6": (0, errors_1.createCustomErrorClass)("CosmosBroadcastCodeUnknownRequest"),
    "7": (0, errors_1.createCustomErrorClass)("CosmosBroadcastCodeInvalidAddress"),
    "8": (0, errors_1.createCustomErrorClass)("CosmosBroadcastCodeInvalidPubKey"),
    "9": (0, errors_1.createCustomErrorClass)("CosmosBroadcastCodeUnknownAddress"),
    "10": (0, errors_1.createCustomErrorClass)("CosmosBroadcastCodeInvalidCoins"),
    "11": (0, errors_1.createCustomErrorClass)("CosmosBroadcastCodeOutOfGas"),
    "12": (0, errors_1.createCustomErrorClass)("CosmosBroadcastCodeMemoTooLarge"),
    "13": (0, errors_1.createCustomErrorClass)("CosmosBroadcastCodeInsufficientFee"),
    "14": (0, errors_1.createCustomErrorClass)("CosmosBroadcastCodeTooManySignatures"),
    "15": (0, errors_1.createCustomErrorClass)("CosmosBroadcastCodeNoSignatures"),
    "16": (0, errors_1.createCustomErrorClass)("CosmosBroadcastCodeJSONMarshal"),
    "17": (0, errors_1.createCustomErrorClass)("CosmosBroadcastCodeJSONUnmarshal"),
    "18": (0, errors_1.createCustomErrorClass)("CosmosBroadcastCodeInvalidRequest"),
    "19": (0, errors_1.createCustomErrorClass)("CosmosBroadcastCodeTxInMempoolCache"),
    "20": (0, errors_1.createCustomErrorClass)("CosmosBroadcastCodeMempoolIsFull"),
    "21": (0, errors_1.createCustomErrorClass)("CosmosBroadcastTxTooLarge"),
    "22": (0, errors_1.createCustomErrorClass)("CosmosBroadcastKeyNotFound"),
    "23": (0, errors_1.createCustomErrorClass)("CosmosBroadcastWrongPassword"),
    "24": (0, errors_1.createCustomErrorClass)("CosmosBroadcastInvalidSigner"),
    "25": (0, errors_1.createCustomErrorClass)("CosmosBroadcastInvalidGasAdjustment"),
    "26": (0, errors_1.createCustomErrorClass)("CosmosBroadcastInvalidHeight"),
    "27": (0, errors_1.createCustomErrorClass)("CosmosBroadcastInvalidVersion"),
    "28": (0, errors_1.createCustomErrorClass)("CosmosBroadcastInvalidChainID"),
    "29": (0, errors_1.createCustomErrorClass)("CosmosBroadcastInvalidType"),
    "30": (0, errors_1.createCustomErrorClass)("CosmosBroadcastTimeoutHeight"),
    "31": (0, errors_1.createCustomErrorClass)("CosmosBroadcastUnknownExtensionOptions"),
    "32": (0, errors_1.createCustomErrorClass)("CosmosBroadcastWrongSequence"),
    "33": (0, errors_1.createCustomErrorClass)("CosmosBroadcastPackAny"),
    "34": (0, errors_1.createCustomErrorClass)("CosmosBroadcastUnpackAny"),
    "35": (0, errors_1.createCustomErrorClass)("CosmosBroadcastLogic"),
    "36": (0, errors_1.createCustomErrorClass)("CosmosBroadcastConflict")
};
exports.SatStackVersionTooOld = (0, errors_1.createCustomErrorClass)("SatStackVersionTooOld");
exports.SatStackAccessDown = (0, errors_1.createCustomErrorClass)("SatStackAccessDown");
exports.SatStackStillSyncing = (0, errors_1.createCustomErrorClass)("SatStackStillSyncing");
exports.SatStackDescriptorNotImported = (0, errors_1.createCustomErrorClass)("SatStackDescriptorNotImported");
exports.SwapNoAvailableProviders = (0, errors_1.createCustomErrorClass)("SwapNoAvailableProviders");
exports.NoSuchAppOnProvider = (0, errors_1.createCustomErrorClass)("NoSuchAppOnProvider");
exports.SwapExchangeRateAmountTooLow = (0, errors_1.createCustomErrorClass)("SwapExchangeRateAmountTooLow");
exports.SwapExchangeRateAmountTooHigh = (0, errors_1.createCustomErrorClass)("SwapExchangeRateAmountTooHigh");
exports.SwapCheckKYCStatusFailed = (0, errors_1.createCustomErrorClass)("SwapCheckKYCStatusFailed");
exports.SwapSubmitKYCFailed = (0, errors_1.createCustomErrorClass)("SwapSubmitKYCFailed");
exports.SwapGenericAPIError = (0, errors_1.createCustomErrorClass)("SwapGenericAPIError");
exports.JSONRPCResponseError = (0, errors_1.createCustomErrorClass)("JSONRPCResponseError");
exports.JSONDecodeError = (0, errors_1.createCustomErrorClass)("JSONDecodeError");
exports.NoIPHeaderError = (0, errors_1.createCustomErrorClass)("NoIPHeaderError");
exports.CurrencyNotSupportedError = (0, errors_1.createCustomErrorClass)("CurrencyNotSupportedError");
exports.CurrencyDisabledError = (0, errors_1.createCustomErrorClass)("CurrencyDisabledError");
exports.CurrencyDisabledAsInputError = (0, errors_1.createCustomErrorClass)("CurrencyDisabledAsInputError");
exports.CurrencyDisabledAsOutputError = (0, errors_1.createCustomErrorClass)("CurrencyDisabledAsOutputError");
exports.CurrencyNotSupportedByProviderError = (0, errors_1.createCustomErrorClass)("CurrencyNotSupportedByProviderError");
exports.TradeMethodNotSupportedError = (0, errors_1.createCustomErrorClass)("TradeMethodNotSupportedError");
exports.UnexpectedError = (0, errors_1.createCustomErrorClass)("UnexpectedError");
exports.NotImplementedError = (0, errors_1.createCustomErrorClass)("NotImplementedError");
exports.ValidationError = (0, errors_1.createCustomErrorClass)("ValidationError");
exports.AccessDeniedError = (0, errors_1.createCustomErrorClass)("AccessDeniedError");
exports.AlgorandASANotOptInInRecipient = (0, errors_1.createCustomErrorClass)("AlgorandASANotOptInInRecipient");
exports.CompoundLowerAllowanceOfActiveAccountError = (0, errors_1.createCustomErrorClass)("CompoundLowerAllowanceOfActiveAccountError");
exports.OutdatedApp = (0, errors_1.createCustomErrorClass)("OutdatedApp");
exports.FreshAddressIndexInvalid = (0, errors_1.createCustomErrorClass)("FreshAddressIndexInvalid");
exports.BluetoothNotSupportedError = (0, errors_1.createCustomErrorClass)("FwUpdateBluetoothNotSupported");
exports.UnsupportedDerivation = (0, errors_1.createCustomErrorClass)("UnsupportedDerivation");
//# sourceMappingURL=errors.js.map