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
var errors_1 = require("@ledgerhq/errors");
var errors_2 = require("../../errors");
var account_1 = require("../../account");
var bridge_1 = require("../../bridge");
var app_1 = require("./app");
var mapResult = function (_a) {
    var device = _a.device, signedOperation = _a.signedOperation, transactionSignError = _a.transactionSignError;
    return signedOperation && device
        ? {
            signedOperation: signedOperation,
            device: device
        }
        : transactionSignError
            ? {
                transactionSignError: transactionSignError
            }
            : null;
};
var initialState = {
    signedOperation: null,
    deviceSignatureRequested: false,
    deviceStreamingProgress: null,
    transactionSignError: null
};
var reducer = function (state, e) {
    switch (e.type) {
        case "error": {
            var error = e.error;
            var transactionSignError = 
            // @ts-expect-error typescript doesn't check against the TransportStatusError type
            error instanceof errors_1.TransportStatusError && error.statusCode === 0x6985
                ? new errors_2.TransactionRefusedOnDevice()
                : error;
            return __assign(__assign({}, initialState), { transactionSignError: transactionSignError });
        }
        case "signed":
            return __assign(__assign({}, state), { signedOperation: e.signedOperation });
        case "device-signature-requested":
            return __assign(__assign({}, state), { deviceSignatureRequested: true });
        case "device-signature-granted":
            return __assign(__assign({}, state), { deviceSignatureRequested: false });
        case "device-streaming":
            return __assign(__assign({}, state), { deviceStreamingProgress: e.progress });
    }
    return state;
};
var createAction = function (connectAppExec) {
    var useHook = function (reduxDevice, txRequest) {
        var transaction = txRequest.transaction, appName = txRequest.appName, dependencies = txRequest.dependencies, requireLatestFirmware = txRequest.requireLatestFirmware;
        var mainAccount = (0, account_1.getMainAccount)(txRequest.account, txRequest.parentAccount);
        var appState = (0, app_1.createAction)(connectAppExec).useHook(reduxDevice, {
            account: mainAccount,
            appName: appName,
            dependencies: dependencies,
            requireLatestFirmware: requireLatestFirmware
        });
        var device = appState.device, opened = appState.opened, inWrongDeviceForAccount = appState.inWrongDeviceForAccount, error = appState.error;
        var _a = __read((0, react_1.useState)(initialState), 2), state = _a[0], setState = _a[1];
        (0, react_1.useEffect)(function () {
            if (!device || !opened || inWrongDeviceForAccount || error) {
                setState(initialState);
                return;
            }
            var bridge = (0, bridge_1.getAccountBridge)(mainAccount);
            var sub = bridge
                .signOperation({
                account: mainAccount,
                transaction: transaction,
                deviceId: device.deviceId
            })
                .pipe((0, operators_1.catchError)(function (error) {
                return (0, rxjs_1.of)({
                    type: "error",
                    error: error
                });
            }), (0, operators_1.tap)(function (e) { return (0, logs_1.log)("actions-transaction-event", e.type, e); }), (0, operators_1.scan)(reducer, initialState))
                .subscribe(function (x) { return setState(x); });
            return function () {
                sub.unsubscribe();
            };
        }, [
            device,
            mainAccount,
            transaction,
            opened,
            inWrongDeviceForAccount,
            error,
        ]);
        return __assign(__assign(__assign({}, appState), state), { deviceStreamingProgress: state.signedOperation || state.transactionSignError
                ? null // when good app is opened, we start the progress so it doesn't "blink"
                : state.deviceStreamingProgress || (appState.opened ? 0 : null) });
    };
    return {
        useHook: useHook,
        mapResult: mapResult
    };
};
exports.createAction = createAction;
//# sourceMappingURL=transaction.js.map