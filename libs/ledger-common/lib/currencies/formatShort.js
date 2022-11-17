"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.formatShort = void 0;
var numeral_1 = __importDefault(require("numeral"));
var bignumber_js_1 = require("bignumber.js");
var formatCurrencyUnit_1 = require("./formatCurrencyUnit");
/**
 * This will format in a very concise way a valid, typically to be used on axis.
 * For instance 15k 20k ,...
 */
function formatShort(unit, value) {
    var magnitude = unit.magnitude;
    var floatValue = value.div(new bignumber_js_1.BigNumber(10).pow(magnitude));
    if (floatValue.isZero()) {
        return "0";
    }
    if (new bignumber_js_1.BigNumber(-1).isLessThan(floatValue) && floatValue.isLessThan(1)) {
        // numeral have issues with low values, fallback on formatCurrencyUnit
        return (0, formatCurrencyUnit_1.formatCurrencyUnit)(unit, value);
    }
    return (0, numeral_1["default"])(floatValue.toNumber()).format("0[.]0a");
}
exports.formatShort = formatShort;
//# sourceMappingURL=formatShort.js.map