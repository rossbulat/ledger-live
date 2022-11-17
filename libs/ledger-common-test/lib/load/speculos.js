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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.createImplicitSpeculos = exports.findAppCandidate = exports.appCandidatesMatches = exports.listAppCandidates = exports.createSpeculosDevice = exports.closeAllSpeculosDevices = exports.releaseSpeculosDevice = void 0;
// Ledger internal speculos testing framework.
// loading this file have side effects and is only for Node.
var sample_1 = __importDefault(require("lodash/sample"));
var invariant_1 = __importDefault(require("invariant"));
var path_1 = __importDefault(require("path"));
var semver_1 = __importDefault(require("semver"));
var child_process_1 = require("child_process");
var fs_1 = require("fs");
var logs_1 = require("@ledgerhq/logs");
var hw_transport_node_speculos_1 = __importDefault(require("@ledgerhq/hw-transport-node-speculos"));
var hw_1 = require("../hw");
var env_1 = require("@ledgerhq/common/lib/env");
var polyfill_1 = require("../apps/polyfill");
var currencies_1 = require("@ledgerhq/common/lib/currencies");
var formatters_1 = require("../bot/formatters");
var promise_1 = require("@ledgerhq/common/lib/promise");
var apps_1 = require("../apps");
var idCounter = 0;
var data = {};
var modelMap = {
    nanos: "nanoS",
    "nanos+": "nanoSP",
    nanox: "nanoX",
    blue: "blue"
};
var reverseModelMap = {};
for (var k in modelMap) {
    reverseModelMap[modelMap[k]] = k;
}
var modelMapPriority = {
    nanos: 4,
    "nanos+": 3,
    nanox: 2,
    blue: 1
};
var defaultFirmware = {};
function releaseSpeculosDevice(id) {
    return __awaiter(this, void 0, void 0, function () {
        var obj;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    (0, logs_1.log)("speculos", "release " + id);
                    obj = data[id];
                    if (!obj) return [3 /*break*/, 2];
                    return [4 /*yield*/, obj.destroy()];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
exports.releaseSpeculosDevice = releaseSpeculosDevice;
function closeAllSpeculosDevices() {
    return Promise.all(Object.keys(data).map(releaseSpeculosDevice));
}
exports.closeAllSpeculosDevices = closeAllSpeculosDevices;
// to keep in sync from https://github.com/LedgerHQ/speculos/tree/master/speculos/cxlib
var existingSdks = [
    "nanos-cx-2.0.elf",
    "nanos-cx-2.1.elf",
    "nanosp-cx-1.0.3.elf",
    "nanosp-cx-1.0.elf",
    "nanox-cx-2.0.2.elf",
    "nanox-cx-2.0.elf",
];
function inferSDK(firmware, model) {
    var begin = "".concat(model.toLowerCase(), "-cx-");
    if (existingSdks.includes(begin + firmware + ".elf"))
        return firmware;
    var shortVersion = firmware.slice(0, 3);
    if (existingSdks.includes(begin + shortVersion + ".elf"))
        return shortVersion;
}
function createSpeculosDevice(arg, maxRetry) {
    if (maxRetry === void 0) { maxRetry = 3; }
    return __awaiter(this, void 0, void 0, function () {
        var model, firmware, appName, appVersion, seed, coinapps, dependency, speculosID, apduPort, vncPort, buttonPort, automationPort, sdk, appPath, params, p, resolveReady, rejectReady, ready, destroyed, destroy, latestStderr, hasSucceed, transport;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    model = arg.model, firmware = arg.firmware, appName = arg.appName, appVersion = arg.appVersion, seed = arg.seed, coinapps = arg.coinapps, dependency = arg.dependency;
                    speculosID = "speculosID-".concat(++idCounter);
                    apduPort = 40000 + idCounter;
                    vncPort = 41000 + idCounter;
                    buttonPort = 42000 + idCounter;
                    automationPort = 43000 + idCounter;
                    sdk = inferSDK(firmware, model);
                    appPath = "./apps/".concat(reverseModelMap[model], "/").concat(firmware, "/").concat(appName.replace(/ /g, ""), "/app_").concat(appVersion, ".elf");
                    params = __spreadArray(__spreadArray(__spreadArray([
                        "run",
                        "-v",
                        "".concat(coinapps, ":/speculos/apps"),
                        "-p",
                        "".concat(apduPort, ":40000"),
                        "-p",
                        "".concat(vncPort, ":41000"),
                        "-p",
                        "".concat(buttonPort, ":42000"),
                        "-p",
                        "".concat(automationPort, ":43000"),
                        "-e",
                        "SPECULOS_APPNAME=".concat(appName, ":").concat(appVersion),
                        "--name",
                        "".concat(speculosID),
                        "ghcr.io/ledgerhq/speculos",
                        "--model",
                        model.toLowerCase(),
                        appPath
                    ], __read((dependency
                        ? [
                            "-l",
                            "".concat(dependency, ":").concat("./apps/".concat(reverseModelMap[model], "/").concat(firmware, "/").concat(dependency, "/app_").concat(appVersion, ".elf")),
                        ]
                        : [])), false), __read((sdk ? ["--sdk", sdk] : [])), false), [
                        "--display",
                        "headless",
                        "--vnc-password",
                        "live",
                        "--apdu-port",
                        "40000",
                        "--vnc-port",
                        "41000",
                        "--button-port",
                        "42000",
                        "--automation-port",
                        "43000",
                    ], false);
                    (0, logs_1.log)("speculos", "".concat(speculosID, ": spawning = ").concat(params.join(" ")));
                    p = (0, child_process_1.spawn)("docker", __spreadArray(__spreadArray([], __read(params), false), ["--seed", "".concat(seed)], false));
                    ready = new Promise(function (resolve, reject) {
                        resolveReady = resolve;
                        rejectReady = reject;
                    });
                    destroyed = false;
                    destroy = function () {
                        if (destroyed)
                            return;
                        destroyed = true;
                        new Promise(function (resolve, reject) {
                            if (!data[speculosID])
                                return;
                            delete data[speculosID];
                            (0, child_process_1.exec)("docker rm -f ".concat(speculosID), function (error, stdout, stderr) {
                                if (error) {
                                    (0, logs_1.log)("speculos-error", "".concat(speculosID, " not destroyed ").concat(error, " ").concat(stderr));
                                    reject(error);
                                }
                                else {
                                    (0, logs_1.log)("speculos", "destroyed ".concat(speculosID));
                                    resolve(undefined);
                                }
                            });
                        });
                    };
                    p.stdout.on("data", function (data) {
                        if (data) {
                            (0, logs_1.log)("speculos-stdout", "".concat(speculosID, ": ").concat(String(data).trim()));
                        }
                    });
                    p.stderr.on("data", function (data) {
                        if (!data)
                            return;
                        latestStderr = data;
                        if (!data.includes("apdu: ")) {
                            (0, logs_1.log)("speculos-stderr", "".concat(speculosID, ": ").concat(String(data).trim()));
                        }
                        if (data.includes("using SDK")) {
                            setTimeout(function () { return resolveReady(true); }, 500);
                        }
                        else if (data.includes("is already in use by container")) {
                            rejectReady(new Error("speculos already in use! Try `ledger-live cleanSpeculos` or check logs"));
                        }
                        else if (data.includes("address already in use")) {
                            if (maxRetry > 0) {
                                (0, logs_1.log)("speculos", "retrying speculos connection");
                                destroy();
                                resolveReady(false);
                            }
                        }
                    });
                    p.on("close", function () {
                        (0, logs_1.log)("speculos", "".concat(speculosID, " closed"));
                        if (!destroyed) {
                            destroy();
                            rejectReady(new Error("speculos process failure. ".concat(latestStderr || "")));
                        }
                    });
                    return [4 /*yield*/, ready];
                case 1:
                    hasSucceed = _a.sent();
                    if (!!hasSucceed) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, promise_1.delay)(1000)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, createSpeculosDevice(arg, maxRetry - 1)];
                case 3: return [4 /*yield*/, hw_transport_node_speculos_1["default"].open({
                        apduPort: apduPort,
                        buttonPort: buttonPort,
                        automationPort: automationPort
                    })];
                case 4:
                    transport = _a.sent();
                    data[speculosID] = {
                        process: p,
                        apduPort: apduPort,
                        buttonPort: buttonPort,
                        automationPort: automationPort,
                        transport: transport,
                        destroy: destroy
                    };
                    return [2 /*return*/, {
                            id: speculosID,
                            transport: transport,
                            appPath: appPath
                        }];
            }
        });
    });
}
exports.createSpeculosDevice = createSpeculosDevice;
function hackBadSemver(str) {
    var split = str.split(".");
    var _a = __read(split), x = _a[0], y = _a[1], rest = _a.slice(3);
    var _b = __read(split, 3), z = _b[2];
    if (rest.length) {
        z += "-" + rest.join("-");
    }
    return [x, y, z].filter(Boolean).join(".");
}
// list all possible apps. sorted by latest first
function listAppCandidates(cwd) {
    return __awaiter(this, void 0, void 0, function () {
        var candidates, models, models_1, models_1_1, modelName, model, p1, firmwares, firmwares_1, firmwares_1_1, firmware, p2, appNames, appNames_1, appNames_1_1, appName, p3, elfs, c, elfs_1, elfs_1_1, elf, p4, appVersion, e_1_1, e_2_1, e_3_1;
        var e_3, _a, e_2, _b, e_1, _c, e_4, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    candidates = [];
                    return [4 /*yield*/, fs_1.promises.readdir(cwd)];
                case 1:
                    models = (_e.sent())
                        .map(function (modelName) { return [modelName, modelMapPriority[modelName.toLowerCase()]]; })
                        .filter(function (_a) {
                        var _b = __read(_a, 2), priority = _b[1];
                        return priority;
                    })
                        .sort(function (a, b) { return b[1] - a[1]; })
                        .map(function (a) { return a[0]; });
                    _e.label = 2;
                case 2:
                    _e.trys.push([2, 21, 22, 23]);
                    models_1 = __values(models), models_1_1 = models_1.next();
                    _e.label = 3;
                case 3:
                    if (!!models_1_1.done) return [3 /*break*/, 20];
                    modelName = models_1_1.value;
                    model = modelMap[modelName.toLowerCase()];
                    p1 = path_1["default"].join(cwd, modelName);
                    return [4 /*yield*/, fs_1.promises.readdir(p1)];
                case 4:
                    firmwares = _e.sent();
                    firmwares.sort(function (a, b) {
                        return semver_1["default"].compare(hackBadSemver(a), hackBadSemver(b));
                    });
                    firmwares.reverse();
                    _e.label = 5;
                case 5:
                    _e.trys.push([5, 17, 18, 19]);
                    firmwares_1 = (e_2 = void 0, __values(firmwares)), firmwares_1_1 = firmwares_1.next();
                    _e.label = 6;
                case 6:
                    if (!!firmwares_1_1.done) return [3 /*break*/, 16];
                    firmware = firmwares_1_1.value;
                    p2 = path_1["default"].join(p1, firmware);
                    return [4 /*yield*/, fs_1.promises.readdir(p2)];
                case 7:
                    appNames = _e.sent();
                    _e.label = 8;
                case 8:
                    _e.trys.push([8, 13, 14, 15]);
                    appNames_1 = (e_1 = void 0, __values(appNames)), appNames_1_1 = appNames_1.next();
                    _e.label = 9;
                case 9:
                    if (!!appNames_1_1.done) return [3 /*break*/, 12];
                    appName = appNames_1_1.value;
                    p3 = path_1["default"].join(p2, appName);
                    return [4 /*yield*/, fs_1.promises.readdir(p3)];
                case 10:
                    elfs = _e.sent();
                    c = [];
                    try {
                        for (elfs_1 = (e_4 = void 0, __values(elfs)), elfs_1_1 = elfs_1.next(); !elfs_1_1.done; elfs_1_1 = elfs_1.next()) {
                            elf = elfs_1_1.value;
                            if (elf.startsWith("app_") && elf.endsWith(".elf")) {
                                p4 = path_1["default"].join(p3, elf);
                                appVersion = elf.slice(4, elf.length - 4);
                                if (semver_1["default"].valid(appVersion) &&
                                    !(0, apps_1.shouldUpgrade)(model, appName, appVersion) &&
                                    !(0, apps_1.mustUpgrade)(model, appName, appVersion)) {
                                    c.push({
                                        path: p4,
                                        model: model,
                                        firmware: firmware,
                                        appName: appName,
                                        appVersion: appVersion
                                    });
                                }
                            }
                        }
                    }
                    catch (e_4_1) { e_4 = { error: e_4_1 }; }
                    finally {
                        try {
                            if (elfs_1_1 && !elfs_1_1.done && (_d = elfs_1["return"])) _d.call(elfs_1);
                        }
                        finally { if (e_4) throw e_4.error; }
                    }
                    c.sort(function (a, b) { return semver_1["default"].compare(a.appVersion, b.appVersion); });
                    c.reverse();
                    candidates = candidates.concat(c);
                    _e.label = 11;
                case 11:
                    appNames_1_1 = appNames_1.next();
                    return [3 /*break*/, 9];
                case 12: return [3 /*break*/, 15];
                case 13:
                    e_1_1 = _e.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 15];
                case 14:
                    try {
                        if (appNames_1_1 && !appNames_1_1.done && (_c = appNames_1["return"])) _c.call(appNames_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                    return [7 /*endfinally*/];
                case 15:
                    firmwares_1_1 = firmwares_1.next();
                    return [3 /*break*/, 6];
                case 16: return [3 /*break*/, 19];
                case 17:
                    e_2_1 = _e.sent();
                    e_2 = { error: e_2_1 };
                    return [3 /*break*/, 19];
                case 18:
                    try {
                        if (firmwares_1_1 && !firmwares_1_1.done && (_b = firmwares_1["return"])) _b.call(firmwares_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                    return [7 /*endfinally*/];
                case 19:
                    models_1_1 = models_1.next();
                    return [3 /*break*/, 3];
                case 20: return [3 /*break*/, 23];
                case 21:
                    e_3_1 = _e.sent();
                    e_3 = { error: e_3_1 };
                    return [3 /*break*/, 23];
                case 22:
                    try {
                        if (models_1_1 && !models_1_1.done && (_a = models_1["return"])) _a.call(models_1);
                    }
                    finally { if (e_3) throw e_3.error; }
                    return [7 /*endfinally*/];
                case 23: return [2 /*return*/, candidates];
            }
        });
    });
}
exports.listAppCandidates = listAppCandidates;
function appCandidatesMatches(appCandidate, search) {
    var searchFirmware = search.firmware || defaultFirmware[appCandidate.model];
    return !!((!search.model || search.model === appCandidate.model) &&
        (!search.appName ||
            search.appName.replace(/ /g, "").toLowerCase() ===
                appCandidate.appName.replace(/ /g, "").toLowerCase()) &&
        ((!searchFirmware && !appCandidate.firmware.includes("rc")) ||
            appCandidate.firmware === searchFirmware ||
            (searchFirmware &&
                semver_1["default"].satisfies(hackBadSemver(appCandidate.firmware), searchFirmware))) &&
        (appCandidate.appVersion === search.appVersion ||
            (!search.appVersion && !appCandidate.appVersion.includes("-")) ||
            (search.appVersion &&
                semver_1["default"].satisfies(appCandidate.appVersion, search.appVersion))));
}
exports.appCandidatesMatches = appCandidatesMatches;
var findAppCandidate = function (appCandidates, search, picker) {
    if (picker === void 0) { picker = sample_1["default"]; }
    var apps = appCandidates.filter(function (c) { return appCandidatesMatches(c, search); });
    if (!search.appVersion && apps.length > 0) {
        var appVersion_1 = apps[0].appVersion;
        apps = apps.filter(function (a) { return a.appVersion === appVersion_1; });
    }
    var app = picker(apps);
    if (apps.length > 1) {
        (0, logs_1.log)("speculos", apps.length +
            " app candidates (out of " +
            appCandidates.length +
            "):\n" +
            apps.map(function (a, i) { return " [" + i + "] " + (0, formatters_1.formatAppCandidate)(a); }).join("\n"));
    }
    return app;
};
exports.findAppCandidate = findAppCandidate;
function eatDevice(parts) {
    if (parts.length > 0) {
        var _a = __read(parts[0].split("@"), 2), modelQ = _a[0], firmware = _a[1];
        var model = modelMap[(modelQ || "").toLowerCase()];
        if (model) {
            parts.shift();
            if (firmware) {
                return {
                    model: model,
                    firmware: firmware
                };
            }
            return {
                model: model
            };
        }
    }
    return {};
}
function parseAppSearch(query) {
    var _a;
    var parts = query.slice(9).split(":");
    var _b = eatDevice(parts), model = _b.model, firmware = _b.firmware;
    if (parts.length === 0)
        return;
    var _c = __read(parts[0].split("@"), 2), nameQ = _c[0], versionQ = _c[1];
    var currency = (0, currencies_1.findCryptoCurrencyByKeyword)(nameQ);
    var appName = currency ? currency.managerAppName : nameQ;
    var appVersion = versionQ || undefined;
    var dependency;
    if (currency) {
        dependency = (_a = (0, polyfill_1.getDependencies)(currency.managerAppName)[0]) === null || _a === void 0 ? void 0 : _a.replace(/ /g, "");
    }
    return {
        search: {
            model: model,
            firmware: firmware,
            appName: appName,
            appVersion: appVersion
        },
        appName: appName,
        dependency: dependency
    };
}
function createImplicitSpeculos(query) {
    return __awaiter(this, void 0, void 0, function () {
        var coinapps, seed, apps, match, _a, search, dependency, appName, appCandidate, _b;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    coinapps = (0, env_1.getEnv)("COINAPPS");
                    (0, invariant_1["default"])(coinapps, "COINAPPS folder is missing!");
                    seed = (0, env_1.getEnv)("SEED");
                    (0, invariant_1["default"])(seed, "SEED is missing!");
                    return [4 /*yield*/, listAppCandidates(coinapps)];
                case 1:
                    apps = _d.sent();
                    match = parseAppSearch(query);
                    (0, invariant_1["default"])(match, "speculos: invalid format of '%s'. Usage example: speculos:nanoS:bitcoin@1.3.x", query);
                    _a = match, search = _a.search, dependency = _a.dependency, appName = _a.appName;
                    appCandidate = (0, exports.findAppCandidate)(apps, search);
                    (0, invariant_1["default"])(appCandidate, "could not find an app that matches '%s'", query);
                    (0, logs_1.log)("speculos", "using app " + (0, formatters_1.formatAppCandidate)(appCandidate));
                    if (!appCandidate) return [3 /*break*/, 3];
                    _c = {};
                    return [4 /*yield*/, createSpeculosDevice(__assign(__assign({}, appCandidate), { coinapps: coinapps, appName: appName, dependency: dependency, seed: seed }))];
                case 2:
                    _b = (_c.device = _d.sent(),
                        _c.appCandidate = appCandidate,
                        _c);
                    return [3 /*break*/, 4];
                case 3:
                    _b = null;
                    _d.label = 4;
                case 4: return [2 /*return*/, _b];
            }
        });
    });
}
exports.createImplicitSpeculos = createImplicitSpeculos;
function openImplicitSpeculos(query) {
    return __awaiter(this, void 0, void 0, function () {
        var r;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, createImplicitSpeculos(query)];
                case 1:
                    r = _a.sent();
                    return [2 /*return*/, r === null || r === void 0 ? void 0 : r.device.transport];
            }
        });
    });
}
(0, hw_1.registerTransportModule)({
    id: "speculos",
    open: function (id) {
        if (!id)
            return;
        if (id.startsWith("speculosID")) {
            var obj = data[id];
            if (!obj) {
                throw new Error("speculos transport was destroyed");
            }
            return Promise.resolve(obj.transport);
        }
        if (id.startsWith("speculos:")) {
            return openImplicitSpeculos(id);
        }
    },
    close: function (transport, id) {
        if (id.startsWith("speculos")) {
            return Promise.resolve();
        } // todo close the speculos: case
    },
    disconnect: releaseSpeculosDevice
});
//# sourceMappingURL=speculos.js.map