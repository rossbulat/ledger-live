import { DeviceInfo } from "@ledgerhq/types-live";
import { Observable } from "rxjs";
export declare type CheckDeviceModeArgs = {
    deviceId: string;
    unresponsiveTimeoutMs?: number;
    cantOpenDeviceRetryLimit?: number;
};
export declare type GetDeviceRunningModeResult = {
    type: "lockedDevice";
} | {
    type: "disconnectedOrlockedDevice";
} | {
    type: "mainMode";
    deviceInfo: DeviceInfo;
} | {
    type: "bootloaderMode";
    deviceInfo: DeviceInfo;
};
/**
 * Get the mode in which is device is: bootloader, main, locked device, maybe disconnected or locked device
 * It will retry on all errors from getDeviceInfo, except the ones that implies that the device is
 * disconnected (number of retry can be tweaked) or locked.
 *
 * Note: If no device is found, the current Transport implementations throw a CantOpenDevice error
 * And if the device was cold started and not yet unlocked, the current Transport implementations
 * don't see the device yet, and also throw a CantOpenDevice error.
 *
 * Does NOT handle recovery mode for now.
 * @param deviceId A device id
 * @param unresponsiveTimeoutMs Time in ms of the timeout before considering the device unresponsive
 * @param cantOpenDeviceRetryLimit Number of received CantOpenDevice errors while retrying before considering
 *   the device as maybe disconnected or cold-started-locked
 * @returns An object GetDeviceRunningModeEvent
 */
export declare const getDeviceRunningMode: ({ deviceId, unresponsiveTimeoutMs, cantOpenDeviceRetryLimit, }: CheckDeviceModeArgs) => Observable<GetDeviceRunningModeResult>;
//# sourceMappingURL=getDeviceRunningMode.d.ts.map