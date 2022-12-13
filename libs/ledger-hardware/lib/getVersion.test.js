"use strict";
exports.__esModule = true;
var devices_1 = require("@ledgerhq/devices");
var getVersion_1 = require("./getVersion");
var nanoS = devices_1.DeviceModelId.nanoS, nanoSP = devices_1.DeviceModelId.nanoSP, nanoX = devices_1.DeviceModelId.nanoX, nanoFTS = devices_1.DeviceModelId.nanoFTS;
test("isBootloaderVersionSupported", function () {
    /**
     * Nano S
     * */
    expect((0, getVersion_1.isBootloaderVersionSupported)("1.9.0", nanoS)).toBe(false);
    expect((0, getVersion_1.isBootloaderVersionSupported)("1.9.0-whatever0", nanoS)).toBe(false);
    expect((0, getVersion_1.isBootloaderVersionSupported)("2.0.0", nanoS)).toBe(true);
    expect((0, getVersion_1.isBootloaderVersionSupported)("2.0.0-rc1", nanoS)).toBe(true);
    expect((0, getVersion_1.isBootloaderVersionSupported)("2.0.1", nanoS)).toBe(true);
    expect((0, getVersion_1.isBootloaderVersionSupported)("2.0.1-whatever0", nanoS)).toBe(true);
    expect((0, getVersion_1.isBootloaderVersionSupported)("2.1.0", nanoS)).toBe(true);
    expect((0, getVersion_1.isBootloaderVersionSupported)("2.1.0-whatever0", nanoS)).toBe(true);
    expect((0, getVersion_1.isBootloaderVersionSupported)("3.0.0", nanoS)).toBe(true);
    expect((0, getVersion_1.isBootloaderVersionSupported)("3.0.0-whatever0", nanoS)).toBe(true);
    /**
     * Nano X
     * */
    expect((0, getVersion_1.isBootloaderVersionSupported)("1.9.0", nanoX)).toBe(false);
    expect((0, getVersion_1.isBootloaderVersionSupported)("1.9.0-whatever0", nanoX)).toBe(false);
    expect((0, getVersion_1.isBootloaderVersionSupported)("2.0.0", nanoX)).toBe(true);
    expect((0, getVersion_1.isBootloaderVersionSupported)("2.0.0-rc1", nanoX)).toBe(true);
    expect((0, getVersion_1.isBootloaderVersionSupported)("2.0.1", nanoX)).toBe(true);
    expect((0, getVersion_1.isBootloaderVersionSupported)("2.0.1-whatever0", nanoX)).toBe(true);
    expect((0, getVersion_1.isBootloaderVersionSupported)("2.1.0", nanoX)).toBe(true);
    expect((0, getVersion_1.isBootloaderVersionSupported)("2.1.0-whatever0", nanoX)).toBe(true);
    expect((0, getVersion_1.isBootloaderVersionSupported)("3.0.0", nanoX)).toBe(true);
    expect((0, getVersion_1.isBootloaderVersionSupported)("3.0.0-whatever0", nanoX)).toBe(true);
    /**
     * Nano SP
     * */
    expect((0, getVersion_1.isBootloaderVersionSupported)("0.9.0", nanoSP)).toBe(false);
    expect((0, getVersion_1.isBootloaderVersionSupported)("0.9.0-whatever0", nanoSP)).toBe(false);
    expect((0, getVersion_1.isBootloaderVersionSupported)("1.0.0", nanoSP)).toBe(true);
    expect((0, getVersion_1.isBootloaderVersionSupported)("1.0.0-rc1", nanoSP)).toBe(true);
    expect((0, getVersion_1.isBootloaderVersionSupported)("1.0.1", nanoSP)).toBe(true);
    expect((0, getVersion_1.isBootloaderVersionSupported)("1.0.1-whatever0", nanoSP)).toBe(true);
    expect((0, getVersion_1.isBootloaderVersionSupported)("1.1.0", nanoSP)).toBe(true);
    expect((0, getVersion_1.isBootloaderVersionSupported)("1.1.0-whatever0", nanoSP)).toBe(true);
    expect((0, getVersion_1.isBootloaderVersionSupported)("1.0.0", nanoSP)).toBe(true);
    expect((0, getVersion_1.isBootloaderVersionSupported)("1.0.0-whatever0", nanoSP)).toBe(true);
    /**
     * Nano FTS
     * */
    expect((0, getVersion_1.isBootloaderVersionSupported)("1.0.0", nanoFTS)).toBe(false);
    expect((0, getVersion_1.isBootloaderVersionSupported)("1.0.0-whatever0", nanoFTS)).toBe(false);
});
test("isHardwareVersionSupported", function () {
    /**
     * Nano S
     * */
    expect((0, getVersion_1.isHardwareVersionSupported)("2.0.0", nanoS)).toBe(false);
    expect((0, getVersion_1.isHardwareVersionSupported)("2.0.0-whatever0", nanoS)).toBe(false);
    /**
     * Nano X
     * */
    expect((0, getVersion_1.isHardwareVersionSupported)("1.9.0", nanoX)).toBe(false);
    expect((0, getVersion_1.isHardwareVersionSupported)("1.9.0-whatever0", nanoX)).toBe(false);
    expect((0, getVersion_1.isHardwareVersionSupported)("2.0.0", nanoX)).toBe(true);
    expect((0, getVersion_1.isHardwareVersionSupported)("2.0.0-rc1", nanoX)).toBe(true);
    expect((0, getVersion_1.isHardwareVersionSupported)("2.0.1", nanoX)).toBe(true);
    expect((0, getVersion_1.isHardwareVersionSupported)("2.0.1-whatever0", nanoX)).toBe(true);
    expect((0, getVersion_1.isHardwareVersionSupported)("2.1.0", nanoX)).toBe(true);
    expect((0, getVersion_1.isHardwareVersionSupported)("2.1.0-whatever0", nanoX)).toBe(true);
    expect((0, getVersion_1.isHardwareVersionSupported)("3.0.0", nanoX)).toBe(true);
    expect((0, getVersion_1.isHardwareVersionSupported)("3.0.0-whatever0", nanoX)).toBe(true);
    /**
     * Nano SP
     * */
    expect((0, getVersion_1.isHardwareVersionSupported)("2.0.0", nanoSP)).toBe(false);
    expect((0, getVersion_1.isHardwareVersionSupported)("2.0.0-whatever0", nanoSP)).toBe(false);
    /**
     * Nano FTS
     * */
    expect((0, getVersion_1.isHardwareVersionSupported)("2.0.0", nanoFTS)).toBe(false);
    expect((0, getVersion_1.isHardwareVersionSupported)("2.0.0-whatever0", nanoFTS)).toBe(false);
});
//# sourceMappingURL=getVersion.test.js.map