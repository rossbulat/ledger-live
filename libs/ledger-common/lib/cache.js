"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.makeLRUCache = void 0;
var lru_cache_1 = __importDefault(require("lru-cache"));
var makeLRUCache = function (f, keyExtractor, lruOpts) {
    if (keyExtractor === void 0) { keyExtractor = function () { return ""; }; }
    if (lruOpts === void 0) { lruOpts = {
        max: 100,
        maxAge: 5 * 60 * 1000
    }; }
    var cache = new lru_cache_1["default"](lruOpts);
    var result = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var key = keyExtractor.apply(void 0, __spreadArray([], __read(args), false));
        var promise = cache.get(key);
        if (promise)
            return promise;
        promise = f.apply(void 0, __spreadArray([], __read(args), false))["catch"](function (e) {
            cache.del(key);
            throw e;
        });
        cache.set(key, promise);
        return promise;
    };
    result.force = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var key = keyExtractor.apply(void 0, __spreadArray([], __read(args), false));
        var promise = f.apply(void 0, __spreadArray([], __read(args), false))["catch"](function (e) {
            cache.del(key);
            throw e;
        });
        cache.set(key, promise);
        return promise;
    };
    result.hydrate = function (key, value) {
        cache.set(key, Promise.resolve(value));
    };
    result.clear = function (key) {
        cache.del(key);
    };
    result.reset = function () {
        cache.reset();
    };
    return result;
};
exports.makeLRUCache = makeLRUCache;
//# sourceMappingURL=cache.js.map