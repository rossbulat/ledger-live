import invariant from "invariant";
import axios from "axios";
import { log } from "@ledgerhq/logs";
import { NetworkDown, LedgerAPI5xx, LedgerAPI4xx } from "@ledgerhq/errors";
import { retry } from "./promise";
import { getEnv } from "./env";
export var requestInterceptor = function (request) {
    var baseURL = request.baseURL, url = request.url, _a = request.method, method = _a === void 0 ? "" : _a, data = request.data;
    log("network", "".concat(method, " ").concat(baseURL || "").concat(url), { data: data });
    // $FlowFixMe (LLD side)
    var req = request;
    req.metadata = {
        startTime: Date.now()
    };
    return req;
};
export var responseInterceptor = function (response) {
    var _a = response.config, baseURL = _a.baseURL, url = _a.url, _b = _a.method, method = _b === void 0 ? "" : _b, metadata = _a.metadata;
    var _c = (metadata || {}).startTime, startTime = _c === void 0 ? 0 : _c;
    log("network-success", "".concat(response.status, " ").concat(method, " ").concat(baseURL || "").concat(url, " (").concat((Date.now() - startTime).toFixed(0), "ms)"), getEnv("DEBUG_HTTP_RESPONSE") ? { data: response.data } : undefined);
    return response;
};
export var errorInterceptor = function (error) {
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
            log("warn", "can't parse server result " + String(e));
        }
        if (msg) {
            errorToThrow = makeError(msg, status_1, url, method);
        }
        else {
            errorToThrow = makeError("API HTTP ".concat(status_1), status_1, url, method);
        }
        log("network-error", "".concat(status_1, " ").concat(method, " ").concat(baseURL || "").concat(url, " (").concat((Date.now() - startTime).toFixed(0), "ms): ").concat(errorToThrow.message), getEnv("DEBUG_HTTP_RESPONSE") ? { data: data } : {});
        throw errorToThrow;
    }
    else if (error.request) {
        log("network-down", "DOWN ".concat(method, " ").concat(baseURL || "").concat(url, " (").concat((Date.now() - startTime).toFixed(0), "ms)"));
        throw new NetworkDown();
    }
    throw error;
};
axios.interceptors.request.use(requestInterceptor);
// $FlowFixMe LLD raise issues here
axios.interceptors.response.use(responseInterceptor, errorInterceptor);
var makeError = function (msg, status, url, method) {
    var obj = {
        status: status,
        url: url,
        method: method
    };
    return (status || "").toString().startsWith("4")
        ? new LedgerAPI4xx(msg, obj)
        : new LedgerAPI5xx(msg, obj);
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
    invariant(typeof arg === "object", "network takes an object as parameter");
    var promise;
    if (arg.method === "GET") {
        if (!("timeout" in arg)) {
            arg.timeout = getEnv("GET_CALLS_TIMEOUT");
        }
        promise = retry(function () { return axios(arg); }, {
            maxRetry: getEnv("GET_CALLS_RETRY")
        });
    }
    else {
        promise = axios(arg);
    }
    return promise;
};
export default implementation;
//# sourceMappingURL=network.js.map