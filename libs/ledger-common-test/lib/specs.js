"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.genericTestDestination = exports.expectSiblingsHaveSpendablePartGreaterThan = exports.formatDeviceAmount = exports.deviceActionFlow = exports.pickSiblings = exports.botTest = void 0;
// helpers for spec
var invariant_1 = __importDefault(require("invariant"));
var logs_1 = require("@ledgerhq/logs");
var expect_1 = __importDefault(require("expect"));
var sample_1 = __importDefault(require("lodash/sample"));
var account_1 = require("../account");
var bot_test_context_1 = require("./bot-test-context");
exports.botTest = bot_test_context_1.botTest;
var bignumber_js_1 = __importDefault(require("bignumber.js"));
var stepValueTransformDefault = function (s) { return s.trim(); };
// TODO should weight the choice to favorize accounts with small amounts
function pickSiblings(siblings, maxAccount) {
    if (maxAccount === void 0) { maxAccount = 5; }
    var withoutEmpties = siblings.filter(function (a) { return a.used; });
    if (withoutEmpties.length >= maxAccount) {
        // we are no longer creating accounts
        var maybeAccount_1 = (0, sample_1["default"])(withoutEmpties);
        if (!maybeAccount_1) {
            throw new Error("at least one non-empty sibling account exists. maxAccount=" +
                maxAccount);
        }
        return maybeAccount_1;
    }
    // we are only keeping empty account that have smaller index to favorize creation of non created derivation modes
    var empties = siblings.filter(account_1.isAccountEmpty);
    empties.sort(function (a, b) { return a.index - b.index; });
    if (empties.length > 0) {
        empties = empties.filter(function (e) { return e.index === empties[0].index; });
    }
    var maybeAccount = (0, sample_1["default"])(withoutEmpties.concat(empties));
    if (!maybeAccount) {
        throw new Error("at least one sibling account exists. maxAccount=" + maxAccount);
    }
    return maybeAccount;
}
exports.pickSiblings = pickSiblings;
// generalized logic of device actions
function deviceActionFlow(description) {
    return function (arg) {
        (0, invariant_1["default"])(arg.appCandidate.model === "nanoS", "FIXME: stepper logic is only implemented for Nano S");
        var transport = arg.transport, event = arg.event, state = arg.state;
        var _a = state || {
            finalState: false,
            stepTitle: "",
            stepValue: "",
            acc: [],
            currentStep: null
        }, finalState = _a.finalState, stepTitle = _a.stepTitle, stepValue = _a.stepValue, acc = _a.acc, currentStep = _a.currentStep;
        function runStep(step) {
            var final = step.final, title = step.title, button = step.button;
            if (stepValue && step.title !== stepTitle) {
                // there were accumulated text and we are on new step, we need to release it and compare to expected
                if (currentStep && currentStep.expectedValue) {
                    var expectedValue_1 = currentStep.expectedValue, ignoreAssertionFailure = currentStep.ignoreAssertionFailure;
                    var stepValueTransform_1 = currentStep.stepValueTransform || stepValueTransformDefault;
                    if (!ignoreAssertionFailure) {
                        (0, bot_test_context_1.botTest)("deviceAction confirm step '" + stepTitle + "'", function () {
                            var _a, _b;
                            return (0, expect_1["default"])((_a = {},
                                _a[stepTitle] = stepValueTransform_1(stepValue),
                                _a)).toMatchObject((_b = {},
                                _b[stepTitle] = expectedValue_1(arg, acc).trim(),
                                _b));
                        });
                    }
                }
                acc = acc.concat({
                    title: stepTitle,
                    value: stepValue
                });
                // a new step reset back the value for the next
                stepValue = "";
            }
            if (button) {
                // some step trigger navigation action
                transport.button(button);
            }
            // text is the title of the step. we assume screen event starts / ends.
            stepTitle = title;
            currentStep = step;
            if (final) {
                finalState = true;
            }
        }
        if (!finalState) {
            var possibleKnownStep = description.steps.find(function (s) {
                if (s.maxY) {
                    return event.text.startsWith(s.title) && event.y < s.maxY;
                }
                return event.text.startsWith(s.title);
            });
            // if there is a fallback provided, we will run it to try to detect another possible known step
            if (!possibleKnownStep && description.fallback) {
                possibleKnownStep = description.fallback(arg);
            }
            if (possibleKnownStep) {
                // a step title was recognized. run it as a new step
                runStep(possibleKnownStep);
            }
            else if (currentStep) {
                // there is a current ongoing step so we need to accumulate all text we see
                var text = event.text;
                if (currentStep.trimValue)
                    text = text.trim();
                stepValue += text;
            }
        }
        (0, logs_1.log)("bot/flow", "'".concat(event.text, "' ~> ").concat(stepTitle, ": ").concat(stepValue));
        return {
            finalState: finalState,
            stepTitle: stepTitle,
            stepValue: stepValue,
            acc: acc,
            currentStep: currentStep
        };
    };
}
exports.deviceActionFlow = deviceActionFlow;
var defaultFormatOptions = {
    postfixCode: false,
    forceFloating: false,
    hideCode: false,
    showAllDigits: false
};
var sep = " ";
function formatDeviceAmount(currency, value, options) {
    if (options === void 0) { options = defaultFormatOptions; }
    var _a = __read(currency.units, 1), unit = _a[0];
    var code = unit.code;
    if (currency.type === "CryptoCurrency") {
        var deviceTicker = currency.deviceTicker;
        if (deviceTicker)
            code = deviceTicker;
    }
    var fValue = value.div(new bignumber_js_1["default"](10).pow(unit.magnitude));
    var v = options.showAllDigits
        ? fValue.toFixed(unit.magnitude)
        : fValue.toString(10);
    if (options.forceFloating) {
        if (!v.includes(".")) {
            // if the value is pure integer, in the app it will automatically add an .0
            v += ".0";
        }
    }
    if (options.hideCode)
        return v;
    return options.postfixCode ? v + sep + code : code + sep + v;
}
exports.formatDeviceAmount = formatDeviceAmount;
// this function throw if the portion of undelegated funds is smaller than the threshold
// where threshold is a value from 0.0 to 1.0, percentage of the total amount of funds
// Usage: put these in your spec, on the mutation transaction functions that intend to do more "delegations"
function expectSiblingsHaveSpendablePartGreaterThan(siblings, threshold) {
    var spendableTotal = siblings.reduce(function (acc, a) { return acc.plus(a.spendableBalance); }, new bignumber_js_1["default"](0));
    var total = siblings.reduce(function (acc, a) { return acc.plus(a.balance); }, new bignumber_js_1["default"](0));
    (0, invariant_1["default"])(spendableTotal.div(total).gt(threshold), "the spendable part of accounts is sufficient (threshold: %s)", threshold);
}
exports.expectSiblingsHaveSpendablePartGreaterThan = expectSiblingsHaveSpendablePartGreaterThan;
var genericTestDestination = function (_a) {
    var destination = _a.destination, operation = _a.operation, destinationBeforeTransaction = _a.destinationBeforeTransaction, sendingOperation = _a.sendingOperation;
    var amount = sendingOperation.value.minus(sendingOperation.fee);
    (0, bot_test_context_1.botTest)("account balance increased with transaction amount", function () {
        return (0, expect_1["default"])(destination.balance.toString()).toBe(destinationBeforeTransaction.balance.plus(amount).toString());
    });
    (0, bot_test_context_1.botTest)("operation amount is consistent with sendingOperation", function () {
        return (0, expect_1["default"])({
            type: operation.type,
            amount: operation.value.toString()
        }).toMatchObject({
            type: "IN",
            amount: amount.toString()
        });
    });
};
exports.genericTestDestination = genericTestDestination;
//# sourceMappingURL=specs.js.map