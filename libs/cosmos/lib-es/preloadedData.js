import { Subject } from "rxjs";
// this module holds the cached state of preload()
// eslint-disable-next-line no-unused-vars
var currentCosmosPreloadedData = {
    // NB initial state because UI need to work even if it's currently "loading", typically after clear cache
    validators: []
};
export function asSafeCosmosPreloadData(data) {
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
var updates = new Subject();
export function setCosmosPreloadData(data) {
    if (data === currentCosmosPreloadedData)
        return;
    currentCosmosPreloadedData = data;
    updates.next(data);
}
export function getCurrentCosmosPreloadData() {
    return currentCosmosPreloadedData;
}
export function getCosmosPreloadDataUpdates() {
    return updates.asObservable();
}
//# sourceMappingURL=preloadedData.js.map