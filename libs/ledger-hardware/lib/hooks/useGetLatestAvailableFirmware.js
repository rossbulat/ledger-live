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
exports.__esModule = true;
exports.useGetLatestAvailableFirmware = void 0;
var react_1 = require("react");
var getLatestAvailableFirmwareFromDeviceId_1 = require("../getLatestAvailableFirmwareFromDeviceId");
/**
 * Hook to get the latest available firmware for a device
 * @param getLatestAvailableFirmwareFromDeviceId An optional function to get the latest available firmware
 * for a given device id, by default set to live-common/hw/getLatestAvailableFirmwareFromDeviceId.
 * This dependency injection is needed for LLD to have the hook working on the internal thread
 * @param isHookEnabled A boolean to enable (true, default value) or disable (false) the hook
 * @param deviceId A device id, or an empty string if device is usb plugged
 * @returns An object containing:
 * - latestFirmware A FirmwareUpdateContext if found, or null if still processing or no available firmware update
 * - status A FirmwareUpdateGettingStatus to notify consumer on the hook state
 * - error: any error that occurred during the process, or null
 */
var useGetLatestAvailableFirmware = function (_a) {
    var _b = _a.getLatestAvailableFirmwareFromDeviceId, getLatestAvailableFirmwareFromDeviceId = _b === void 0 ? getLatestAvailableFirmwareFromDeviceId_1.getLatestAvailableFirmwareFromDeviceId : _b, _c = _a.isHookEnabled, isHookEnabled = _c === void 0 ? true : _c, deviceId = _a.deviceId;
    var _d = __read((0, react_1.useState)(null), 2), latestFirmware = _d[0], setLatestFirmware = _d[1];
    var _e = __read((0, react_1.useState)(null), 2), error = _e[0], setError = _e[1];
    var _f = __read((0, react_1.useState)("unchecked"), 2), status = _f[0], setStatus = _f[1];
    (0, react_1.useEffect)(function () {
        if (!isHookEnabled) {
            return;
        }
        setStatus("checking");
        var sub = getLatestAvailableFirmwareFromDeviceId({ deviceId: deviceId }).subscribe({
            next: function (_a) {
                var firmwareUpdateContext = _a.firmwareUpdateContext;
                if (!firmwareUpdateContext) {
                    setLatestFirmware(null);
                    setStatus("no-available-firmware");
                }
                else {
                    setLatestFirmware(firmwareUpdateContext);
                    setStatus("available-firmware");
                }
            },
            error: function (e) {
                if (e instanceof Error) {
                    setError(e);
                }
                else {
                    setError(new Error("Unknown error: ".concat(e)));
                }
            }
        });
        return function () {
            sub.unsubscribe();
        };
    }, [deviceId, getLatestAvailableFirmwareFromDeviceId, isHookEnabled]);
    return { latestFirmware: latestFirmware, error: error, status: status };
};
exports.useGetLatestAvailableFirmware = useGetLatestAvailableFirmware;
//# sourceMappingURL=useGetLatestAvailableFirmware.js.map