"use strict";
exports.__esModule = true;
var rxjs_1 = require("rxjs");
var deviceAccess_1 = require("./deviceAccess");
var promise_1 = require("../promise");
var flush = function (deviceId) {
    return (0, promise_1.delay)(1000).then(function () { return (0, deviceAccess_1.withDevice)(deviceId)(function () { return (0, rxjs_1.of)(null); }).toPromise(); });
};
exports["default"] = flush;
//# sourceMappingURL=flush.js.map