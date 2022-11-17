"use strict";
exports.__esModule = true;
exports.getCosmosPreloadDataUpdates = exports.getCurrentCosmosPreloadData = exports.setCosmosPreloadData = exports.asSafeCosmosPreloadData = void 0;
var rxjs_1 = require("rxjs");
// this module holds the cached state of preload()
// eslint-disable-next-line no-unused-vars
var currentCosmosPreloadedData = {
    // NB initial state because UI need to work even if it's currently "loading", typically after clear cache
    validators: []
};
function asSafeCosmosPreloadData(data) {
    // NB this function must not break and be resilient to changes in data
    var validators = [];
    if (typeof data === "object" && data) {
        var validatorsUnsafe = data.validators;
        if (typeof validatorsUnsafe === "object" &&
            validatorsUnsafe &&
            Array.isArray(validatorsUnsafe)) {
            validatorsUnsafe.forEach(function (v) {
                // FIXME if model changes, we should validate the object
                validators.push(v);
            });
        }
    }
    return {
        validators: validators
    };
}
exports.asSafeCosmosPreloadData = asSafeCosmosPreloadData;
var updates = new rxjs_1.Subject();
function setCosmosPreloadData(data) {
    if (data === currentCosmosPreloadedData)
        return;
    currentCosmosPreloadedData = data;
    updates.next(data);
}
exports.setCosmosPreloadData = setCosmosPreloadData;
function getCurrentCosmosPreloadData() {
    return currentCosmosPreloadedData;
}
exports.getCurrentCosmosPreloadData = getCurrentCosmosPreloadData;
function getCosmosPreloadDataUpdates() {
    return updates.asObservable();
}
exports.getCosmosPreloadDataUpdates = getCosmosPreloadDataUpdates;
//# sourceMappingURL=preloadedData.js.map