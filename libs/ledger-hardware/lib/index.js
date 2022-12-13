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
exports.__esModule = true;
exports.disconnect = exports.setAllowAutoDisconnect = exports.close = exports.open = exports.discoverDevices = exports.registerTransportModule = void 0;
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var modules = [];
var registerTransportModule = function (module) {
    modules.push(module);
};
exports.registerTransportModule = registerTransportModule;
var discoverDevices = function (accept) {
    if (accept === void 0) { accept = function () { return true; }; }
    var all = [];
    for (var i = 0; i < modules.length; i++) {
        var m = modules[i];
        if (m.discovery && accept(m)) {
            all.push(m.discovery);
        }
    }
    return rxjs_1.merge.apply(void 0, __spreadArray([], __read(all.map(function (o) {
        return o.pipe((0, operators_1.catchError)(function (e) {
            console.warn("One Transport provider failed: ".concat(e));
            return rxjs_1.EMPTY;
        }));
    })), false));
};
exports.discoverDevices = discoverDevices;
var open = function (deviceId) {
    for (var i = 0; i < modules.length; i++) {
        var m = modules[i];
        var p = m.open(deviceId);
        if (p)
            return p;
    }
    return Promise.reject(new Error("Can't find handler to open ".concat(deviceId)));
};
exports.open = open;
var close = function (transport, deviceId) {
    for (var i = 0; i < modules.length; i++) {
        var m = modules[i];
        var p = m.close && m.close(transport, deviceId);
        if (p)
            return p;
    }
    // fallback on an actual close
    return transport.close();
};
exports.close = close;
var setAllowAutoDisconnect = function (transport, deviceId, allow) {
    for (var i = 0; i < modules.length; i++) {
        var m = modules[i];
        var p = m.setAllowAutoDisconnect &&
            m.setAllowAutoDisconnect(transport, deviceId, allow);
        if (p)
            return p;
    }
};
exports.setAllowAutoDisconnect = setAllowAutoDisconnect;
var disconnect = function (deviceId) {
    for (var i = 0; i < modules.length; i++) {
        var dis = modules[i].disconnect;
        var p = dis(deviceId);
        if (p) {
            return p;
        }
    }
    return Promise.reject(new Error("Can't find handler to disconnect ".concat(deviceId)));
};
exports.disconnect = disconnect;
//# sourceMappingURL=index.js.map