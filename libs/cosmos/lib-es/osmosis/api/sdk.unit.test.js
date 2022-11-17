import BigNumber from "bignumber.js";
import { getOperationValue, convertTransactionToOperation } from "./sdk";
import { OsmosisTransactionTypeEnum } from "./sdk.types";
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
    kind: OsmosisTransactionTypeEnum,
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
    expect(getOperationValue(mockOsmosisSendEventContent, "UNKNOWN", new BigNumber(100)).toString()).toBe("0");
});
test("convertTransactionToOperation", function () {
    var result = convertTransactionToOperation("test", "OUT", new BigNumber(123), mockOsmosisAccountTransaction, ["test_sender"], ["test_recipient"], {});
    expect(result.senders.length).toBe(1);
    expect(result.recipients.length).toBe(1);
});
//# sourceMappingURL=sdk.unit.test.js.map