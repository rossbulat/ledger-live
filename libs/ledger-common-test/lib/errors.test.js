"use strict";
exports.__esModule = true;
var errors_1 = require("./errors");
function functionA() {
    throw new errors_1.AccessDeniedError();
}
describe("custom errors", function () {
    test("error instanceof", function () {
        try {
            functionA();
        }
        catch (e) {
            expect(e).toBeInstanceOf(errors_1.AccessDeniedError);
        }
    });
    test("promise error instanceof", function () {
        expect(Promise.reject(new errors_1.AccessDeniedError())).rejects.toBeInstanceOf(errors_1.AccessDeniedError);
    });
});
//# sourceMappingURL=errors.test.js.map