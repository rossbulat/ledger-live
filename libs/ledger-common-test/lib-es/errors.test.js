import { AccessDeniedError } from "./errors";
function functionA() {
    throw new AccessDeniedError();
}
describe("custom errors", function () {
    test("error instanceof", function () {
        try {
            functionA();
        }
        catch (e) {
            expect(e).toBeInstanceOf(AccessDeniedError);
        }
    });
    test("promise error instanceof", function () {
        expect(Promise.reject(new AccessDeniedError())).rejects.toBeInstanceOf(AccessDeniedError);
    });
});
//# sourceMappingURL=errors.test.js.map