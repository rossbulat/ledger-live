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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { log } from "@ledgerhq/logs";
export var delay = function (ms) {
    return new Promise(function (f) { return setTimeout(f, ms); });
};
var defaults = {
    maxRetry: 4,
    interval: 300,
    intervalMultiplicator: 1.5,
    context: ""
};
export function retry(f, options) {
    var _a = __assign(__assign({}, defaults), options), maxRetry = _a.maxRetry, interval = _a.interval, intervalMultiplicator = _a.intervalMultiplicator, context = _a.context;
    function rec(remainingTry, i) {
        var result = f();
        if (remainingTry <= 0) {
            return result;
        }
        // In case of failure, wait the interval, retry the action
        return result["catch"](function (e) {
            log("promise-retry", context + " failed. " + remainingTry + " retry remain. " + String(e));
            return delay(i).then(function () {
                return rec(remainingTry - 1, i * intervalMultiplicator);
            });
        });
    }
    return rec(maxRetry, interval);
}
export var atomicQueue = function (job, queueIdentifier) {
    if (queueIdentifier === void 0) { queueIdentifier = function () { return ""; }; }
    var queues = {};
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var id = queueIdentifier.apply(void 0, __spreadArray([], __read(args), false));
        var queue = queues[id] || Promise.resolve();
        var p = queue.then(function () { return job.apply(void 0, __spreadArray([], __read(args), false)); });
        queues[id] = p["catch"](function () { });
        return p;
    };
};
export function execAndWaitAtLeast(ms, cb) {
    var startTime = Date.now();
    return cb().then(function (r) {
        var remaining = ms - (Date.now() - startTime);
        if (remaining <= 0)
            return r;
        return delay(remaining).then(function () { return r; });
    });
}
/**
 * promiseAllBatched(n, items, i => f(i))
 * is essentially like
 * Promise.all(items.map(i => f(i)))
 * but with a guarantee that it will not create more than n concurrent call to f
 * where f is a function that returns a promise
 */
export function promiseAllBatched(batch, items, fn) {
    return __awaiter(this, void 0, void 0, function () {
        function step() {
            return __awaiter(this, void 0, void 0, function () {
                var first, item, index, _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (queue.length === 0)
                                return [2 /*return*/];
                            first = queue.shift();
                            if (!first) return [3 /*break*/, 2];
                            item = first.item, index = first.index;
                            _a = data;
                            _b = index;
                            return [4 /*yield*/, fn(item, index)];
                        case 1:
                            _a[_b] = _c.sent();
                            _c.label = 2;
                        case 2: return [4 /*yield*/, step()];
                        case 3:
                            _c.sent(); // each time an item redeem, we schedule another one
                            return [2 /*return*/];
                    }
                });
            });
        }
        var data, queue;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    data = Array(items.length);
                    queue = items.map(function (item, index) { return ({
                        item: item,
                        index: index
                    }); });
                    // initially, we schedule <batch> items in parallel
                    return [4 /*yield*/, Promise.all(Array(Math.min(batch, items.length))
                            .fill(function () { return undefined; })
                            .map(step))];
                case 1:
                    // initially, we schedule <batch> items in parallel
                    _a.sent();
                    return [2 /*return*/, data];
            }
        });
    });
}
//# sourceMappingURL=promise.js.map