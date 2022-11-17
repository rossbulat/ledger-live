"use strict";
exports.__esModule = true;
exports.getContext = exports.botTest = void 0;
// This provides a botTest("description", () => {}) helper in order to give context in bot expect tests
function botTest(description, f) {
    try {
        f();
    }
    catch (e) {
        if (e instanceof Error) {
            var err = e;
            err._bot_context = [description].concat(err._bot_context || []);
            throw err;
        }
        throw e;
    }
}
exports.botTest = botTest;
// retrieve the text context of a given error that was thrown from inside a botTest(...)
function getContext(error) {
    if (error instanceof Error) {
        return (error._bot_context || []).join(" > ");
    }
}
exports.getContext = getContext;
//# sourceMappingURL=bot-test-context.js.map