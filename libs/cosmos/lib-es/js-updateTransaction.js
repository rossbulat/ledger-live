var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var updateTransaction = function (t, patch) {
    var _a;
    if ("mode" in patch && patch.mode !== t.mode) {
        return __assign(__assign(__assign({}, t), patch), { gas: null, fees: null });
    }
    if ("validators" in patch &&
        ((_a = patch.validators) === null || _a === void 0 ? void 0 : _a.length) !== t.validators.length) {
        return __assign(__assign(__assign({}, t), patch), { gas: null, fees: null });
    }
    return __assign(__assign({}, t), patch);
};
export default updateTransaction;
//# sourceMappingURL=js-updateTransaction.js.map