"use strict";
exports.__esModule = true;
/**
 * In order to mitigate users on odd firmware versions reporting
 * connectivity errors when interacting with the app. Attempt to detect
 * those versions and set a flag for UI.
 */
var isDevFirmware = function (seVersion) {
    if (!seVersion)
        return false;
    var knownDevSuffixes = ["lo", "rc", "il", "tr"]; // FW can't guarantee non digits in versions
    return knownDevSuffixes.some(function (suffix) { return seVersion.includes("-" + suffix); });
};
exports["default"] = isDevFirmware;
//# sourceMappingURL=isDevFirmware.js.map