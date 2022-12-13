import type { FirmwareUpdateContext, DeviceId } from "@ledgerhq/types-live";
import type { GetLatestAvailableFirmwareFromDeviceIdArgs, GetLatestAvailableFirmwareFromDeviceIdOutput } from "../getLatestAvailableFirmwareFromDeviceId";
export declare type FirmwareUpdateGettingStatus = "unchecked" | "checking" | "no-available-firmware" | "available-firmware";
export declare type useGetLatestAvailableFirmwareDependencies = {
    getLatestAvailableFirmwareFromDeviceId?: (args: GetLatestAvailableFirmwareFromDeviceIdArgs) => GetLatestAvailableFirmwareFromDeviceIdOutput;
};
export declare type useGetLatestAvailableFirmwareArgs = {
    isHookEnabled?: boolean;
    deviceId: DeviceId;
};
export declare type useGetLatestAvailableFirmwareResult = {
    latestFirmware: FirmwareUpdateContext | null;
    status: FirmwareUpdateGettingStatus;
    error: Error | null;
};
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
export declare const useGetLatestAvailableFirmware: ({ getLatestAvailableFirmwareFromDeviceId, isHookEnabled, deviceId, }: useGetLatestAvailableFirmwareArgs & useGetLatestAvailableFirmwareDependencies) => useGetLatestAvailableFirmwareResult;
//# sourceMappingURL=useGetLatestAvailableFirmware.d.ts.map