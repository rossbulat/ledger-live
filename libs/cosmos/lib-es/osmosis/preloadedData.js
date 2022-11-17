import { Subject } from "rxjs";
import { asSafeCosmosPreloadData } from "../preloadedData";
// this module holds the cached state of preload()
// eslint-disable-next-line no-unused-vars
var currentOsmosisPreloadedData = {
    // NB initial state because UI need to work even if it's currently "loading", typically after clear cache
    validators: []
};
var updates = new Subject();
export function setOsmosisPreloadData(data) {
    if (data === currentOsmosisPreloadedData)
        return;
    currentOsmosisPreloadedData = data;
    updates.next(data);
}
export function getCurrentOsmosisPreloadData() {
    return currentOsmosisPreloadedData;
}
export function getOsmosisPreloadDataUpdates() {
    return updates.asObservable();
}
export function asSafeOsmosisPreloadData(data) {
    return asSafeCosmosPreloadData(data);
}
//# sourceMappingURL=preloadedData.js.map