"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var operators_1 = require("rxjs/operators");
var rxjs_1 = require("rxjs");
var errors_1 = require("@ledgerhq/errors");
var Manager_1 = __importDefault(require("../api/Manager"));
function uninstallApp(transport, targetId, app) {
    return Manager_1["default"].install(transport, "uninstall-app", {
        targetId: targetId,
        perso: app.perso,
        deleteKey: app.delete_key,
        firmware: app["delete"],
        firmwareKey: app.delete_key,
        hash: app.hash
    }, true).pipe((0, operators_1.ignoreElements)(), (0, operators_1.catchError)(function (e) {
        if (!e || !e.message)
            return (0, rxjs_1.throwError)(e);
        var status = e.message.slice(e.message.length - 4);
        if (status === "6a83") {
            return (0, rxjs_1.throwError)(new errors_1.ManagerAppDepUninstallRequired("", {
                appName: app.name
            }));
        }
        return (0, rxjs_1.throwError)(e);
    }));
}
exports["default"] = uninstallApp;
//# sourceMappingURL=uninstallApp.js.map