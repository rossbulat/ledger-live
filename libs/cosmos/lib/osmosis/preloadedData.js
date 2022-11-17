"use strict";
exports.__esModule = true;
exports.asSafeOsmosisPreloadData = exports.getOsmosisPreloadDataUpdates = exports.getCurrentOsmosisPreloadData = exports.setOsmosisPreloadData = void 0;
var rxjs_1 = require("rxjs");
var preloadedData_1 = require("../preloadedData");
// this module holds the cached state of preload()
// eslint-disable-next-line no-unused-vars
var currentOsmosisPreloadedData = {
    // NB initial state because UI need to work even if it's currently "loading", typically after clear cache
    validators: []
};
var updates = new rxjs_1.Subject();
function setOsmosisPreloadData(data) {
    if (data === currentOsmosisPreloadedData)
        return;
    currentOsmosisPreloadedData = data;
    updates.next(data);
}
exports.setOsmosisPreloadData = setOsmosisPreloadData;
function getCurrentOsmosisPreloadData() {
    return currentOsmosisPreloadedData;
}
exports.getCurrentOsmosisPreloadData = getCurrentOsmosisPreloadData;
function getOsmosisPreloadDataUpdates() {
    return updates.asObservable();
}
exports.getOsmosisPreloadDataUpdates = getOsmosisPreloadDataUpdates;
function asSafeOsmosisPreloadData(data) {
    return (0, preloadedData_1.asSafeCosmosPreloadData)(data);
}
exports.asSafeOsmosisPreloadData = asSafeOsmosisPreloadData;
//# sourceMappingURL=preloadedData.js.map