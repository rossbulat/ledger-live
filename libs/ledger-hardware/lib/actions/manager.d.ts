import { Observable } from "rxjs";
import type { ListAppsResult } from "../../apps/types";
import type { ConnectManagerEvent, Input as ConnectManagerInput } from "../connectManager";
import type { Action, Device } from "./types";
import type { DeviceInfo } from "@ledgerhq/types-live";
declare type State = {
    isLoading: boolean;
    requestQuitApp: boolean;
    unresponsive: boolean;
    allowManagerRequestedWording: string | null | undefined;
    allowManagerGranted: boolean;
    device: Device | null | undefined;
    deviceInfo: DeviceInfo | null | undefined;
    result: ListAppsResult | null | undefined;
    error: Error | null | undefined;
    isLocked: boolean;
};
declare type ManagerState = State & {
    repairModalOpened: {
        auto: boolean;
    } | null | undefined;
    onRetry: () => void;
    onAutoRepair: () => void;
    onRepairModal: (arg0: boolean) => void;
    closeRepairModal: () => void;
};
export declare type ManagerRequest = {
    autoQuitAppDisabled?: boolean;
} | null | undefined;
export declare type Result = {
    device: Device;
    deviceInfo: DeviceInfo;
    result: ListAppsResult | null | undefined;
};
declare type ManagerAction = Action<ManagerRequest, ManagerState, Result>;
export declare const createAction: (connectManagerExec: (arg0: ConnectManagerInput) => Observable<ConnectManagerEvent>) => ManagerAction;
export {};
//# sourceMappingURL=manager.d.ts.map