import { Observable } from "rxjs";
import { DeviceInfo } from "@ledgerhq/types-live";
import type { ListAppsEvent } from "../apps";
import { AttemptToQuitAppEvent } from "./attemptToQuitApp";
import { LockedDeviceEvent } from "./actions/types";
export declare type Input = {
    devicePath: string;
    managerRequest: {
        autoQuitAppDisabled?: boolean;
    } | null | undefined;
};
export declare type ConnectManagerEvent = AttemptToQuitAppEvent | {
    type: "osu";
    deviceInfo: DeviceInfo;
} | {
    type: "bootloader";
    deviceInfo: DeviceInfo;
} | {
    type: "listingApps";
    deviceInfo: DeviceInfo;
} | ListAppsEvent | LockedDeviceEvent;
declare const cmd: ({ devicePath, managerRequest, }: Input) => Observable<ConnectManagerEvent>;
export default cmd;
//# sourceMappingURL=connectManager.d.ts.map