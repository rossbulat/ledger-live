"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var errors_1 = require("@ledgerhq/errors");
var Manager_1 = __importDefault(require("../api/Manager"));
var polyfill_1 = require("../apps/polyfill");
function installApp(transport, targetId, app) {
    return Manager_1["default"].install(transport, "install-app", {
        targetId: targetId,
        perso: app.perso,
        deleteKey: app.delete_key,
        firmware: app.firmware,
        firmwareKey: app.firmware_key,
        hash: app.hash
    }).pipe((0, operators_1.filter)(function (e) { return e.type === "bulk-progress"; }), // only bulk progress interests the UI
    (0, operators_1.throttleTime)(100), // throttle to only emit 10 event/s max, to not spam the UI
    (0, operators_1.map)(function (e) { return ({
        progress: e.progress
    }); }), // extract a stream of progress percentage
    (0, operators_1.catchError)(function (e) {
        if (!e || !e.message)
            return (0, rxjs_1.throwError)(e);
        var status = e.message.slice(e.message.length - 4);
        if (status === "6a83" || status === "6811") {
            var dependencies = (0, polyfill_1.getDependencies)(app.name);
            return (0, rxjs_1.throwError)(new errors_1.ManagerAppDepInstallRequired("", {
                appName: app.name,
                dependency: dependencies.join(", ")
            }));
        }
        return (0, rxjs_1.throwError)(e);
    }));
}
exports["default"] = installApp;
//# sourceMappingURL=installApp.js.map