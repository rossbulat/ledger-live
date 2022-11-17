"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.errorInterceptor = exports.responseInterceptor = exports.requestInterceptor = void 0;
var invariant_1 = __importDefault(require("invariant"));
var axios_1 = __importDefault(require("axios"));
var logs_1 = require("@ledgerhq/logs");
var errors_1 = require("@ledgerhq/errors");
var promise_1 = require("./promise");
var env_1 = require("./env");
var requestInterceptor = function (request) {
    var baseURL = request.baseURL, url = request.url, _a = request.method, method = _a === void 0 ? "" : _a, data = request.data;
    (0, logs_1.log)("network", "".concat(method, " ").concat(baseURL || "").concat(url), { data: data });
    // $FlowFixMe (LLD side)
    var req = request;
    req.metadata = {
        startTime: Date.now()
    };
    return req;
};
exports.requestInterceptor = requestInterceptor;
var responseInterceptor = function (response) {
    var _a = response.config, baseURL = _a.baseURL, url = _a.url, _b = _a.method, method = _b === void 0 ? "" : _b, metadata = _a.metadata;
    var _c = (metadata || {}).startTime, startTime = _c === void 0 ? 0 : _c;
    (0, logs_1.log)("network-success", "".concat(response.status, " ").concat(method, " ").concat(baseURL || "").concat(url, " (").concat((Date.now() - startTime).toFixed(0), "ms)"), (0, env_1.getEnv)("DEBUG_HTTP_RESPONSE") ? { data: response.data } : undefined);
    return response;
};
exports.responseInterceptor = responseInterceptor;
var errorInterceptor = function (error) {
    var _a;
    var config = (_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.config;
    if (!config)
        throw error;
    var baseURL = config.baseURL, url = config.url, _b = config.method, method = _b === void 0 ? "" : _b, metadata = config.metadata;
    var _c = (metadata || {}).startTime, startTime = _c === void 0 ? 0 : _c;
    var errorToThrow;
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        var _d = error.response, data = _d.data, status_1 = _d.status;
        var msg = void 0;
        try {
            if (data && typeof data === "string") {
                msg = extractErrorMessage(data);
            }
            else if (data && typeof data === "object") {
                msg = getErrorMessage(data);
            }
        }
        catch (e) {
            (0, logs_1.log)("warn", "can't parse server result " + String(e));
        }
        if (msg) {
            errorToThrow = makeError(msg, status_1, url, method);
        }
        else {
            errorToThrow = makeError("API HTTP ".concat(status_1), status_1, url, method);
        }
        (0, logs_1.log)("network-error", "".concat(status_1, " ").concat(method, " ").concat(baseURL || "").concat(url, " (").concat((Date.now() - startTime).toFixed(0), "ms): ").concat(errorToThrow.message), (0, env_1.getEnv)("DEBUG_HTTP_RESPONSE") ? { data: data } : {});
        throw errorToThrow;
    }
    else if (error.request) {
        (0, logs_1.log)("network-down", "DOWN ".concat(method, " ").concat(baseURL || "").concat(url, " (").concat((Date.now() - startTime).toFixed(0), "ms)"));
        throw new errors_1.NetworkDown();
    }
    throw error;
};
exports.errorInterceptor = errorInterceptor;
axios_1["default"].interceptors.request.use(exports.requestInterceptor);
// $FlowFixMe LLD raise issues here
axios_1["default"].interceptors.response.use(exports.responseInterceptor, exports.errorInterceptor);
var makeError = function (msg, status, url, method) {
    var obj = {
        status: status,
        url: url,
        method: method
    };
    return (status || "").toString().startsWith("4")
        ? new errors_1.LedgerAPI4xx(msg, obj)
        : new errors_1.LedgerAPI5xx(msg, obj);
};
var getErrorMessage = function (data) {
    if (!data)
        return "";
    if (typeof data === "string")
        return data;
    if (data.errors) {
        return getErrorMessage(data.errors[0]);
    }
    return data.message || data.error_message || data.error || data.msg;
};
var extractErrorMessage = function (raw) {
    var data = JSON.parse(raw);
    if (data && Array.isArray(data))
        data = data[0];
    var msg = getErrorMessage(data);
    if (typeof msg === "string") {
        var m = msg.match(/^JsDefined\((.*)\)$/);
        var innerPart = m ? m[1] : msg;
        var r = JSON.parse(innerPart);
        var message = r.message;
        if (typeof message === "object") {
            message = message.message;
        }
        if (typeof message === "string") {
            msg = message;
        }
        return msg ? String(msg) : undefined;
    }
    return;
};
var implementation = function (arg) {
    (0, invariant_1["default"])(typeof arg === "object", "network takes an object as parameter");
    var promise;
    if (arg.method === "GET") {
        if (!("timeout" in arg)) {
            arg.timeout = (0, env_1.getEnv)("GET_CALLS_TIMEOUT");
        }
        promise = (0, promise_1.retry)(function () { return (0, axios_1["default"])(arg); }, {
            maxRetry: (0, env_1.getEnv)("GET_CALLS_RETRY")
        });
    }
    else {
        promise = (0, axios_1["default"])(arg);
    }
    return promise;
};
exports["default"] = implementation;
//# sourceMappingURL=network.js.map