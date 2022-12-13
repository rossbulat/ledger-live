import { DeviceModelId } from "@ledgerhq/devices";
import Transport from "@ledgerhq/hw-transport";
import type { FirmwareInfo } from "@ledgerhq/types-live";
export declare const isBootloaderVersionSupported: (seVersion: string, modelId?: DeviceModelId) => boolean;
/**
 * @returns whether the Hardware Version bytes are included in the result of the
 * getVersion APDU
 * */
export declare const isHardwareVersionSupported: (seVersion: string, modelId?: DeviceModelId) => boolean;
export default function getVersion(transport: Transport): Promise<FirmwareInfo>;
//# sourceMappingURL=getVersion.d.ts.map