"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var invariant_1 = __importDefault(require("invariant"));
var flatMap_1 = __importDefault(require("lodash/flatMap"));
var zipWith_1 = __importDefault(require("lodash/zipWith"));
var bignumber_js_1 = require("bignumber.js");
var validators_1 = __importDefault(require("./validators"));
var options = [
    {
        name: "mode",
        type: String,
        desc: "mode of transaction: send, deletage, undelegate"
    },
    {
        name: "fees",
        type: String,
        desc: "how much fees"
    },
    {
        name: "gasLimit",
        type: String,
        desc: "how much gasLimit. default is estimated with the recipient"
    },
    {
        name: "memo",
        type: String,
        desc: "add a memo to a transaction"
    },
    {
        name: "sourceValidator",
        type: String,
        desc: "for redelegate, add a source validator"
    },
    {
        name: "cosmosValidator",
        type: String,
        multiple: true,
        desc: "address of recipient validator that will receive the delegate"
    },
    {
        name: "cosmosAmountValidator",
        type: String,
        multiple: true,
        desc: "Amount that the validator will receive"
    },
];
function inferTransactions(transactions, opts, _a) {
    var inferAmount = _a.inferAmount;
    return (0, flatMap_1["default"])(transactions, function (_a) {
        var transaction = _a.transaction, account = _a.account;
        (0, invariant_1["default"])(transaction.family === "cosmos", "cosmos family");
        var validatorsAddresses = opts["cosmosValidator"] || [];
        var validatorsAmounts = (opts["cosmosAmountValidator"] || []).map(function (value) {
            return inferAmount(account, value);
        });
        var validators = (0, zipWith_1["default"])(validatorsAddresses, validatorsAmounts, function (address, amount) { return ({
            address: address,
            amount: amount || new bignumber_js_1.BigNumber(0)
        }); });
        return __assign(__assign({}, transaction), { family: "cosmos", mode: opts.mode || "send", memo: opts.memo, fees: opts.fees ? inferAmount(account, opts.fees) : null, gas: opts.gasLimit ? new bignumber_js_1.BigNumber(opts.gasLimit) : null, validators: validators, sourceValidator: opts.sourceValidator });
    });
}
var cosmosValidatorsFormatters = {
    json: function (list) { return JSON.stringify(list); },
    "default": function (list) {
        return list
            .map(function (v) {
            return "".concat(v.validatorAddress, " \"").concat(v.name, "\" ").concat(v.votingPower, " ").concat(v.commission, " ").concat(v.estimatedYearlyRewardsRate);
        })
            .join("\n");
    }
};
var cosmosValidators = {
    args: [
        {
            name: "format",
            desc: Object.keys(cosmosValidatorsFormatters).join(" | "),
            type: String
        },
    ],
    job: function (_a) {
        var format = _a.format;
        return (0, rxjs_1.from)(validators_1["default"].getValidators()).pipe((0, operators_1.map)(function (validators) {
            var f = (format && cosmosValidatorsFormatters[format]) ||
                cosmosValidatorsFormatters["default"];
            return f(validators);
        }));
    }
};
exports["default"] = {
    options: options,
    inferTransactions: inferTransactions,
    commands: {
        cosmosValidators: cosmosValidators
    }
};
//# sourceMappingURL=cli-transaction.js.map