"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var bignumber_js_1 = __importDefault(require("bignumber.js"));
var cryptoCurrencies_1 = require("../../mock/fixtures/cryptoCurrencies");
var index_1 = require("./index");
var signResult = {
    message: "Sign results",
    rawMessage: "Sign raw results"
};
var signFunction = jest.fn(function () { return signResult; });
jest.mock("../../generated/hw-signMessage", function () {
    return {
        signExistFamily: {
            prepareMessageToSign: function () {
                return signFunction();
            }
        },
        bitcoin: {
            otherMethod: function () { }
        }
    };
});
describe("prepareMessageToSign", function () {
    it("calls the perFamily function if it's exist and returns this function results", function () {
        // Given
        var crypto = (0, cryptoCurrencies_1.createFixtureCryptoCurrency)("signExistFamily");
        var account = createAccount(crypto);
        var message = "whatever";
        // When
        var result;
        var error = null;
        try {
            result = (0, index_1.prepareMessageToSign)(account, message);
        }
        catch (err) {
            error = err;
        }
        // Then
        expect(error).toBeNull();
        expect(signFunction).toBeCalledTimes(1);
        expect(result).toEqual(signResult);
    });
    it("returns a default implementation if account is linked to a crypto able to sign but with no prepareMessageToSign function", function () {
        // Given
        var currency = (0, cryptoCurrencies_1.createFixtureCryptoCurrency)("bitcoin");
        var account = createAccount(currency);
        var message = "4d6573736167652064652074657374";
        var expectedPath = "44'/60'/0'/0/0";
        var expectedRawMessage = "0x4d6573736167652064652074657374";
        // // When
        var result = (0, index_1.prepareMessageToSign)(account, message);
        // // Then
        expect(result).toEqual({
            currency: currency,
            path: expectedPath,
            derivationMode: account.derivationMode,
            message: "Message de test",
            rawMessage: expectedRawMessage
        });
    });
    it("returns an error if account is not linked to a crypto able to sign a message", function () {
        // Given
        var crypto = (0, cryptoCurrencies_1.createFixtureCryptoCurrency)("mycoin");
        var account = createAccount(crypto);
        var message = "whatever";
        // When
        var result;
        var error = null;
        try {
            result = (0, index_1.prepareMessageToSign)(account, message);
        }
        catch (err) {
            error = err;
        }
        // Then
        expect(result).toBeUndefined();
        expect(error).toEqual(Error("Crypto does not support signMessage"));
    });
});
var createAccount = function (crypto) { return ({
    type: "Account",
    id: "ethereumjs:2:ethereum:0x01:",
    seedIdentifier: "0x01",
    derivationMode: "ethM",
    index: 0,
    freshAddress: "0x01",
    freshAddressPath: "44'/60'/0'/0/0",
    freshAddresses: [],
    name: "Ethereum 1",
    starred: false,
    used: false,
    balance: new bignumber_js_1["default"]("51281813126095913"),
    spendableBalance: new bignumber_js_1["default"]("51281813126095913"),
    creationDate: new Date(),
    blockHeight: 8168983,
    currency: crypto,
    unit: {
        name: "satoshi",
        code: "BTC",
        magnitude: 5
    },
    operationsCount: 0,
    operations: [],
    pendingOperations: [],
    lastSyncDate: new Date(),
    balanceHistoryCache: {
        HOUR: {
            balances: [],
            latestDate: undefined
        },
        DAY: {
            balances: [],
            latestDate: undefined
        },
        WEEK: {
            balances: [],
            latestDate: undefined
        }
    },
    swapHistory: []
}); };
//# sourceMappingURL=index.test.js.map