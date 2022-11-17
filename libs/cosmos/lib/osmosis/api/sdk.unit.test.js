"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var bignumber_js_1 = __importDefault(require("bignumber.js"));
var sdk_1 = require("./sdk");
var sdk_types_1 = require("./sdk.types");
jest.mock("../../../network");
var mockOsmosisAmount = {
    text: "",
    currency: "",
    numeric: "300"
};
var mockOsmosisSendEventContent = {
    type: ["", ""],
    module: "",
    sender: [{ account: {}, amounts: [mockOsmosisAmount] }],
    recipient: [{ account: {}, amounts: [mockOsmosisAmount] }],
    transfers: []
};
var mockOsmosisEvent = {
    id: "",
    kind: sdk_types_1.OsmosisTransactionTypeEnum,
    sub: [mockOsmosisSendEventContent]
};
var mockOsmosisAccountTransaction = {
    id: "",
    hash: "",
    block_hash: "",
    height: 0,
    chain_id: "",
    time: new Date(),
    transaction_fee: [mockOsmosisAmount],
    gas_wanted: 0,
    gas_used: 0,
    version: "",
    events: [mockOsmosisEvent],
    has_errors: false,
    memo: ""
};
test("getOperationValue", function () {
    expect((0, sdk_1.getOperationValue)(mockOsmosisSendEventContent, "UNKNOWN", new bignumber_js_1["default"](100)).toString()).toBe("0");
});
test("convertTransactionToOperation", function () {
    var result = (0, sdk_1.convertTransactionToOperation)("test", "OUT", new bignumber_js_1["default"](123), mockOsmosisAccountTransaction, ["test_sender"], ["test_recipient"], {});
    expect(result.senders.length).toBe(1);
    expect(result.recipients.length).toBe(1);
});
//# sourceMappingURL=sdk.unit.test.js.map