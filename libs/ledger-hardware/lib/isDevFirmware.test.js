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
var isDevFirmware_1 = __importDefault(require("./isDevFirmware"));
describe("isDevFirmware sanity checks", function () {
    var dataSet = {
        "10.10.10.10": false,
        "1.0.0.0": false,
        "1.0.0": false,
        "2.0.2": false,
        "2": false,
        "1.2": false,
        "2-rc1": true,
        "2.0.2-rc1": true,
        "12.0.2-lo": true,
        "23.01.2-il123": true,
        "23.01.2-tr123": true
    };
    Object.entries(dataSet).forEach(function (_a) {
        var _b = __read(_a, 2), key = _b[0], value = _b[1];
        it("\t Testing ".concat(key), function () {
            expect((0, isDevFirmware_1["default"])(key)).toBe(value);
        });
    });
});
//# sourceMappingURL=isDevFirmware.test.js.map