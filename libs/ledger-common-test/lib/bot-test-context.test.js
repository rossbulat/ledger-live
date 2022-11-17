"use strict";
exports.__esModule = true;
var bot_test_context_1 = require("./bot-test-context");
var formatters_1 = require("./formatters");
describe("test the botTest context itself", function () {
    test("botTest", function () {
        var f = function () {
            try {
                (0, bot_test_context_1.botTest)("CTX", function () { return expect(true).toEqual(false); });
            }
            catch (e) {
                return (0, bot_test_context_1.getContext)(e);
            }
        };
        expect(f()).toEqual("CTX");
    });
    test("double botTest", function () {
        var f = function () {
            try {
                (0, bot_test_context_1.botTest)("1", function () { return (0, bot_test_context_1.botTest)("2", function () { return expect(true).toEqual(false); }); });
            }
            catch (e) {
                return (0, bot_test_context_1.getContext)(e);
            }
        };
        expect(f()).toEqual("1 > 2");
    });
    test("formatError", function () {
        var _a;
        var f = function () {
            try {
                (0, bot_test_context_1.botTest)("CTX", function () { return expect(true).toEqual(false); });
            }
            catch (e) {
                return (0, formatters_1.formatError)(e);
            }
        };
        expect((_a = f()) === null || _a === void 0 ? void 0 : _a.slice(0, 8)).toEqual("TEST CTX");
    });
});
//# sourceMappingURL=bot-test-context.test.js.map