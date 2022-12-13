import type { DeviceId } from "@ledgerhq/types-live";
import type { GetGenuineCheckFromDeviceIdArgs, GetGenuineCheckFromDeviceIdOutput } from "../getGenuineCheckFromDeviceId";
export declare type GenuineState = "unchecked" | "genuine" | "non-genuine";
export declare type DevicePermissionState = "unrequested" | "unlock-needed" | "unlocked" | "requested" | "granted" | "refused";
export declare type UseGenuineCheckArgs = {
    isHookEnabled?: boolean;
    deviceId: DeviceId;
    lockedDeviceTimeoutMs?: number;
};
export declare type UseGenuineCheckDependencies = {
    getGenuineCheckFromDeviceId?: (args: GetGenuineCheckFromDeviceIdArgs) => GetGenuineCheckFromDeviceIdOutput;
};
export declare type UseGenuineCheckResult = {
    genuineState: GenuineState;
    devicePermissionState: DevicePermissionState;
    error: Error | null;
    resetGenuineCheckState: () => void;
};
/**
 * Hook to check that a device is genuine
 * It replaces a DeviceAction if we're only interested in getting the genuine check
 * @param getGenuineCheckFromDeviceId An optional function to get a genuine check for a given device id,
 * by default set to live-common/hw/getGenuineCheckFromDeviceId.
 * This dependency injection is needed for LLD to have the hook working on the internal thread
 * @param isHookEnabled A boolean to enable (true, default value) or disable (false) the hook
 * @param deviceId A device id, or an empty string if device is usb plugged
 * @param lockedDeviceTimeoutMs Time of no response from device after which the device is considered locked, in ms. Default 1000ms.
 * @returns An object containing:
 * - genuineState: the current GenuineState
 * - devicePermissionState: the current DevicePermissionState
 * - error: any error that occurred during the genuine check, or null
 */
export declare const useGenuineCheck: ({ getGenuineCheckFromDeviceId, isHookEnabled, deviceId, lockedDeviceTimeoutMs, }: UseGenuineCheckArgs & UseGenuineCheckDependencies) => UseGenuineCheckResult;
//# sourceMappingURL=useGenuineCheck.d.ts.map