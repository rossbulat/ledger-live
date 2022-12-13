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
var app_1 = require("./app");
var mapResult = function (_a) {
    var startExchangeResult = _a.startExchangeResult, startExchangeError = _a.startExchangeError;
    return startExchangeResult
        ? {
            startExchangeResult: startExchangeResult
        }
        : startExchangeError
            ? {
                startExchangeError: startExchangeError
            }
            : null;
};
var initialState = {
    startExchangeResult: null,
    startExchangeError: null,
    freezeReduxDevice: false,
    isLoading: false
};
var reducer = function (state, e) {
    switch (e.type) {
        case "start-exchange":
            return __assign(__assign({}, state), { freezeReduxDevice: true });
        case "start-exchange-error":
            return __assign(__assign({}, state), { startExchangeError: e.error, isLoading: false });
        case "start-exchange-result":
            return __assign(__assign({}, state), { startExchangeResult: e.nonce, isLoading: false });
    }
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
var createAction = function (connectAppExec, startExchangeExec) {
    var useHook = function (reduxDevice, startExchangeRequest) {
        var _a = __read((0, react_1.useState)(initialState), 2), state = _a[0], setState = _a[1];
        var reduxDeviceFrozen = useFrozenValue(reduxDevice, state.freezeReduxDevice);
        var exchangeType = startExchangeRequest.exchangeType;
        var appState = (0, app_1.createAction)(connectAppExec).useHook(reduxDeviceFrozen, {
            appName: "Exchange"
        });
        var device = appState.device, opened = appState.opened, error = appState.error;
        var hasError = error || state.error;
        (0, react_1.useEffect)(function () {
            if (!opened || !device) {
                // isLoading should be false until we have a device to show the correct animation
                setState(__assign(__assign({}, initialState), { isLoading: device ? !hasError : false }));
                return;
            }
            var sub = (0, rxjs_1.concat)((0, rxjs_1.of)({
                type: "start-exchange"
            }), startExchangeExec({ deviceId: device.deviceId, exchangeType: exchangeType }))
                .pipe((0, operators_1.tap)(function (e) {
                (0, logs_1.log)("actions-startExchange-event", JSON.stringify(e));
            }), (0, operators_1.scan)(reducer, initialState))
                .subscribe(setState);
            return function () {
                sub.unsubscribe();
            };
        }, [device, opened, exchangeType, hasError]);
        return __assign(__assign({}, appState), state);
    };
    return {
        useHook: useHook,
        mapResult: mapResult
    };
};
exports.createAction = createAction;
//# sourceMappingURL=startExchange.js.map