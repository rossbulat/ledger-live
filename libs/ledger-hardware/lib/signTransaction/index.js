"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var ripple_1 = __importDefault(require("./ripple"));
var tron_1 = __importDefault(require("./tron"));
var all = {
    ripple: ripple_1["default"],
    tron: tron_1["default"]
};
var m = function (currency, transport, path, transaction) {
    var r = all[currency.id];
    if (r)
        return r(currency, transport, path, transaction);
    throw new Error("unsupported signTransaction(".concat(currency.id, ")"));
};
exports["default"] = m;
//# sourceMappingURL=index.js.map