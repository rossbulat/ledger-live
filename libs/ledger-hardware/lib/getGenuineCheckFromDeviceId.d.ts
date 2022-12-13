import type { SocketEvent } from "@ledgerhq/types-live";
import { Observable } from "rxjs";
export declare type GetGenuineCheckFromDeviceIdArgs = {
    deviceId: string;
    lockedDeviceTimeoutMs?: number;
};
export declare type GetGenuineCheckFromDeviceIdResult = {
    socketEvent: SocketEvent | null;
    deviceIsLocked: boolean;
};
export declare type GetGenuineCheckFromDeviceIdOutput = Observable<GetGenuineCheckFromDeviceIdResult>;
/**
 * Get a genuine check for a device only from its id
 * @param deviceId A device id, or an empty string if device is usb plugged
 * @param lockedDeviceTimeoutMs Time of no response from device after which the device is considered locked, in ms. Default 1000ms.
 * @returns An Observable pushing objects containing:
 * - socketEvent: a SocketEvent giving the current status of the genuine check,
 *     null if the genuine check process did not reach any state yet
 * - deviceIsLocked: a boolean set to true if the device is currently locked, false otherwise
 */
export declare const getGenuineCheckFromDeviceId: ({ deviceId, lockedDeviceTimeoutMs, }: GetGenuineCheckFromDeviceIdArgs) => GetGenuineCheckFromDeviceIdOutput;
//# sourceMappingURL=getGenuineCheckFromDeviceId.d.ts.map