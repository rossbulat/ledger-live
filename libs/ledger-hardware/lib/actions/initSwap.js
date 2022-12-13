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
var logs_1 = require("@ledgerhq/logs");
var react_1 = require("react");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var account_1 = require("../../account");
var app_1 = require("./app");
var mapResult = function (_a) {
    var initSwapResult = _a.initSwapResult, initSwapError = _a.initSwapError, swapId = _a.swapId;
    return initSwapResult
        ? {
            initSwapResult: initSwapResult
        }
        : initSwapError
            ? {
                initSwapError: initSwapError,
                swapId: swapId
            }
            : null;
};
var initialState = {
    initSwapResult: null,
    initSwapError: null,
    swapId: undefined,
    initSwapRequested: false,
    isLoading: true,
    freezeReduxDevice: false
};
var reducer = function (state, e) {
    switch (e.type) {
        case "init-swap":
            return __assign(__assign({}, state), { freezeReduxDevice: true });
        case "init-swap-error":
            return __assign(__assign({}, state), { initSwapError: e.error, swapId: e.swapId, isLoading: false });
        case "init-swap-requested":
            return __assign(__assign({}, state), { initSwapRequested: true, isLoading: false, amountExpectedTo: e.amountExpectedTo, estimatedFees: e.estimatedFees });
        case "init-swap-result":
            return __assign(__assign({}, state), { initSwapResult: e.initSwapResult, isLoading: false });
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
var createAction = function (connectAppExec, initSwapExec) {
    var useHook = function (reduxDevice, initSwapRequest) {
        var _a = __read((0, react_1.useState)(initialState), 2), state = _a[0], setState = _a[1];
        var reduxDeviceFrozen = useFrozenValue(reduxDevice, state.freezeReduxDevice);
        var exchange = initSwapRequest.exchange, exchangeRate = initSwapRequest.exchangeRate, transaction = initSwapRequest.transaction, userId = initSwapRequest.userId, requireLatestFirmware = initSwapRequest.requireLatestFirmware;
        var fromAccount = exchange.fromAccount, fromParentAccount = exchange.fromParentAccount, toAccount = exchange.toAccount, toParentAccount = exchange.toParentAccount;
        var mainFromAccount = (0, account_1.getMainAccount)(fromAccount, fromParentAccount);
        var maintoAccount = (0, account_1.getMainAccount)(toAccount, toParentAccount);
        var appState = (0, app_1.createAction)(connectAppExec).useHook(reduxDeviceFrozen, {
            appName: "Exchange",
            dependencies: [
                {
                    account: mainFromAccount
                },
                {
                    account: maintoAccount
                },
            ],
            requireLatestFirmware: requireLatestFirmware
        });
        var device = appState.device, opened = appState.opened, error = appState.error;
        var hasError = error || state.error;
        (0, react_1.useEffect)(function () {
            if (!opened || !device) {
                setState(__assign(__assign({}, initialState), { isLoading: !!device }));
                return;
            }
            var sub = (0, rxjs_1.concat)((0, rxjs_1.of)({
                type: "init-swap"
            }), initSwapExec({
                exchange: exchange,
                exchangeRate: exchangeRate,
                transaction: transaction,
                deviceId: device.deviceId,
                userId: userId
            }))
                .pipe((0, operators_1.tap)(function (e) {
                (0, logs_1.log)("actions-initSwap-event", e.type, e);
            }), (0, operators_1.catchError)(function (error) {
                return (0, rxjs_1.of)({
                    type: "init-swap-error",
                    error: error
                });
            }), (0, operators_1.scan)(reducer, __assign(__assign({}, initialState), { isLoading: !hasError })))
                .subscribe(setState);
            return function () {
                sub.unsubscribe();
            };
        }, [exchange, exchangeRate, transaction, device, opened, hasError, userId]);
        return __assign(__assign({}, appState), state);
    };
    return {
        useHook: useHook,
        mapResult: mapResult
    };
};
exports.createAction = createAction;
//# sourceMappingURL=initSwap.js.map