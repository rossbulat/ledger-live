import { Observable } from "rxjs";
import type { FirmwareUpdateContext, DeviceId } from "@ledgerhq/types-live";
export declare type GetLatestAvailableFirmwareFromDeviceIdArgs = {
    deviceId: DeviceId;
};
export declare type GetLatestAvailableFirmwareFromDeviceIdResult = {
    firmwareUpdateContext: FirmwareUpdateContext | null | undefined;
};
export declare type GetLatestAvailableFirmwareFromDeviceIdOutput = Observable<GetLatestAvailableFirmwareFromDeviceIdResult>;
/**
 * Get the latest available firmware for a device only from its id
 * @param deviceId A device id, or an empty string if device is usb plugged
 * @returns An Observable pushing objects containing:
 * - firmwareUpdateContext A FirmwareUpdateContext if found, or null or undefined otherwise
 */
export declare const getLatestAvailableFirmwareFromDeviceId: ({ deviceId, }: GetLatestAvailableFirmwareFromDeviceIdArgs) => GetLatestAvailableFirmwareFromDeviceIdOutput;
//# sourceMappingURL=getLatestAvailableFirmwareFromDeviceId.d.ts.map