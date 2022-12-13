"use strict";
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
exports.__esModule = true;
exports.createAction = void 0;
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var react_1 = require("react");
var logs_1 = require("@ledgerhq/logs");
var mapResult = function (_a) {
    var completeExchangeResult = _a.completeExchangeResult, completeExchangeError = _a.completeExchangeError;
    return completeExchangeResult
        ? {
            completeExchangeResult: completeExchangeResult
        }
        : completeExchangeError
            ? {
                completeExchangeError: completeExchangeError
            }
            : null;
};
var initialState = {
    completeExchangeResult: null,
    completeExchangeError: null,
    completeExchangeRequested: false,
    freezeReduxDevice: false,
    isLoading: true
};
var reducer = function (state, e) {
    switch (e.type) {
        case "complete-exchange":
            return __assign(__assign({}, state), { completeExchangeStarted: true, freezeReduxDevice: true });
        case "complete-exchange-error":
            return __assign(__assign({}, state), { completeExchangeError: e.error, isLoading: false });
        case "complete-exchange-requested":
            return __assign(__assign({}, state), { completeExchangeRequested: true, isLoading: false });
        case "complete-exchange-result":
            return __assign(__assign({}, state), { completeExchangeResult: e.completeExchangeResult, isLoading: false });
    }
    return state;
};
function useFrozenValue(value, frozen) {
    var _a = __read((0, react_1.useState)(value), 2), state = _a[0], setState = _a[1];
    (0, react_1.useEffect)(function () {
        if (!frozen) {
            setState(value);
        }
    }, [value, frozen]);
    return state;
}
var createAction = function (completeExchangeExec) {
    var useHook = function (reduxDevice, completeExchangeRequest) {
        var _a = __read((0, react_1.useState)(initialState), 2), state = _a[0], setState = _a[1];
        var reduxDeviceFrozen = useFrozenValue(reduxDevice, state === null || state === void 0 ? void 0 : state.freezeReduxDevice);
        var provider = completeExchangeRequest.provider, transaction = completeExchangeRequest.transaction, binaryPayload = completeExchangeRequest.binaryPayload, signature = completeExchangeRequest.signature, exchange = completeExchangeRequest.exchange, exchangeType = completeExchangeRequest.exchangeType, rateType = completeExchangeRequest.rateType;
        (0, react_1.useEffect)(function () {
            var sub = (0, rxjs_1.concat)((0, rxjs_1.of)({
                type: "complete-exchange"
            }), completeExchangeExec({
                deviceId: reduxDeviceFrozen === null || reduxDeviceFrozen === void 0 ? void 0 : reduxDeviceFrozen.deviceId,
                provider: provider,
                transaction: transaction,
                binaryPayload: binaryPayload,
                signature: signature,
                exchange: exchange,
                exchangeType: exchangeType,
                rateType: rateType
            }))
                .pipe((0, operators_1.tap)(function (e) {
                (0, logs_1.log)("actions-completeExchange-event", JSON.stringify(e));
            }), (0, operators_1.scan)(reducer, initialState))
                .subscribe(setState);
            return function () {
                sub.unsubscribe();
            };
        }, [
            provider,
            transaction,
            binaryPayload,
            signature,
            exchange,
            exchangeType,
            rateType,
            reduxDeviceFrozen,
        ]);
        return __assign(__assign({}, state), { device: reduxDeviceFrozen });
    };
    return {
        useHook: useHook,
        mapResult: mapResult
    };
};
exports.createAction = createAction;
//# sourceMappingURL=completeExchange.js.map