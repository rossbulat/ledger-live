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
    var initSellResult = _a.initSellResult, initSellError = _a.initSellError;
    return initSellResult
        ? {
            initSellResult: initSellResult
        }
        : initSellError
            ? {
                initSellError: initSellError
            }
            : null;
};
var initialState = {
    initSellResult: null,
    initSellError: null,
    initSellRequested: false,
    isLoading: true,
    freezeReduxDevice: false
};
var reducer = function (state, e) {
    switch (e.type) {
        case "init-sell":
            return __assign(__assign({}, state), { freezeReduxDevice: true });
        case "init-sell-error":
            return __assign(__assign({}, state), { initSellError: e.error, isLoading: false });
        case "init-sell-get-transaction-id":
            return __assign(__assign({}, state), { initSellRequested: true, isLoading: false });
        case "init-sell-result":
            return __assign(__assign({}, state), { initSellResult: e.initSellResult, isLoading: false });
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
var createAction = function (connectAppExec, getTransactionId, checkSignatureAndPrepare, onTransactionId // FIXME define the type for the context?
) {
    var useHook = function (reduxDevice, initSellRequest) {
        var _a = __read((0, react_1.useState)(initialState), 2), state = _a[0], setState = _a[1];
        var _b = __read((0, react_1.useState)(null), 2), coinifyContext = _b[0], setCoinifyContext = _b[1];
        var reduxDeviceFrozen = useFrozenValue(reduxDevice, state.freezeReduxDevice);
        var appState = (0, app_1.createAction)(connectAppExec).useHook(reduxDeviceFrozen, {
            appName: "Exchange"
        });
        var device = appState.device, opened = appState.opened;
        var parentAccount = initSellRequest.parentAccount, account = initSellRequest.account;
        (0, react_1.useEffect)(function () {
            if (!opened || !device) {
                setState(initialState);
                return;
            }
            var sub = (0, rxjs_1.concat)((0, rxjs_1.of)({
                type: "init-sell"
            }), getTransactionId({
                deviceId: device.deviceId
            }))
                .pipe((0, operators_1.tap)(function (e) {
                if (e && e.type === "init-sell-get-transaction-id") {
                    onTransactionId(e.value).then(setCoinifyContext);
                }
                (0, logs_1.log)("actions-initSell-event", e.type, e);
            }), (0, operators_1.catchError)(function (error) {
                return (0, rxjs_1.of)({
                    type: "init-sell-error",
                    error: error
                });
            }), (0, operators_1.scan)(reducer, initialState))
                .subscribe(setState);
            return function () {
                sub.unsubscribe();
            };
        }, [device, opened, account, parentAccount]);
        (0, react_1.useEffect)(function () {
            if (!coinifyContext || !device)
                return;
            var binaryPayload = coinifyContext.binaryPayload, payloadSignature = coinifyContext.payloadSignature, transaction = coinifyContext.transaction, status = coinifyContext.status;
            var sub = checkSignatureAndPrepare({
                deviceId: device.deviceId,
                binaryPayload: binaryPayload,
                payloadSignature: payloadSignature,
                account: account,
                parentAccount: parentAccount,
                transaction: transaction,
                status: status
            })
                .pipe((0, operators_1.catchError)(function (error) {
                return (0, rxjs_1.of)({
                    type: "init-sell-error",
                    error: error
                });
            }), (0, operators_1.scan)(reducer, initialState))
                .subscribe(setState);
            return function () {
                sub.unsubscribe();
            };
        }, [coinifyContext, device, opened, account, parentAccount]);
        return __assign(__assign({}, appState), state);
    };
    return {
        useHook: useHook,
        mapResult: mapResult
    };
};
exports.createAction = createAction;
//# sourceMappingURL=initSell.js.map