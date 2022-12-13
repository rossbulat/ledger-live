"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var appSupportsQuitApp_1 = __importDefault(require("../appSupportsQuitApp"));
var quitApp_1 = __importDefault(require("./quitApp"));
var attemptToQuitApp = function (transport, appAndVersion) {
    return appAndVersion && (0, appSupportsQuitApp_1["default"])(appAndVersion)
        ? (0, rxjs_1.from)((0, quitApp_1["default"])(transport)).pipe((0, operators_1.concatMap)(function () {
            return (0, rxjs_1.of)({
                type: "unresponsiveDevice"
            });
        }), (0, operators_1.catchError)(function (e) { return (0, rxjs_1.throwError)(e); }))
        : (0, rxjs_1.of)({
            type: "appDetected"
        });
};
exports["default"] = attemptToQuitApp;
//# sourceMappingURL=attemptToQuitApp.js.map