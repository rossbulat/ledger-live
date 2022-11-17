import { getSeparators } from "./localeUtility";
var numbers = "0123456789";
export var sanitizeValueString = function (unit, valueString, locale) {
    var s = getSeparators(locale || "en-US");
    var dot = s.decimal || ".";
    var display = "";
    var value = "";
    var decimals = -1;
    for (var i = 0; i < valueString.length; i++) {
        var c = valueString[i];
        if (numbers.indexOf(c) !== -1) {
            if (decimals >= 0) {
                decimals++;
                if (decimals > unit.magnitude)
                    break;
                value = value === "0" ? c : value + c;
                display += c;
            }
            else if (value !== "0") {
                value += c;
                display += c;
            }
            else {
                value = c;
                display = c;
            }
        }
        else if (decimals === -1 && (c === "," || c === ".")) {
            if (unit.magnitude === 0) {
                // in this specific case, we will never allow commas
                return {
                    display: display,
                    value: value
                };
            }
            if (i === 0)
                display = "0";
            decimals = 0;
            display += dot;
        }
    }
    for (var i = Math.max(0, decimals); i < unit.magnitude; ++i) {
        value += "0";
    }
    if (!value)
        value = "0";
    return {
        display: display,
        value: value
    };
};
//# sourceMappingURL=sanitizeValueString.js.map