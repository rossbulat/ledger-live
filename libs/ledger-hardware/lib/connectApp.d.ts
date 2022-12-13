/// <reference types="node" />
import { Observable } from "rxjs";
import type Transport from "@ledgerhq/hw-transport";
import type { DeviceModelId } from "@ledgerhq/devices";
import { DeviceInfo, FirmwareUpdateContext } from "@ledgerhq/types-live";
import type { DerivationMode } from "../derivation";
import type { AppOp } from "../apps/types";
import { LockedDeviceEvent } from "./actions/types";
export declare type RequiresDerivation = {
    currencyId: string;
    path: string;
    derivationMode: DerivationMode;
    forceFormat?: string;
};
export declare type Input = {
    modelId: DeviceModelId;
    devicePath: string;
    appName: string;
    requiresDerivation?: RequiresDerivation;
    dependencies?: string[];
    requireLatestFirmware?: boolean;
    outdatedApp?: AppAndVersion;
};
export declare type AppAndVersion = {
    name: string;
    version: string;
    flags: number | Buffer;
};
export declare type ConnectAppEvent = {
    type: "unresponsiveDevice";
} | {
    type: "disconnected";
    expected?: boolean;
} | {
    type: "device-update-last-seen";
    deviceInfo: DeviceInfo;
    latestFirmware: FirmwareUpdateContext | null | undefined;
} | {
    type: "device-permission-requested";
    wording: string;
} | {
    type: "device-permission-granted";
} | {
    type: "app-not-installed";
    appNames: string[];
    appName: string;
} | {
    type: "stream-install";
    progress: number;
    itemProgress: number;
    currentAppOp: AppOp;
    installQueue: string[];
} | {
    type: "listing-apps";
} | {
    type: "dependencies-resolved";
} | {
    type: "latest-firmware-resolved";
} | {
    type: "ask-quit-app";
} | {
    type: "ask-open-app";
    appName: string;
} | {
    type: "has-outdated-app";
    outdatedApp: AppAndVersion;
} | {
    type: "opened";
    app?: AppAndVersion;
    derivation?: {
        address: string;
    };
} | {
    type: "display-upgrade-warning";
    displayUpgradeWarning: boolean;
} | LockedDeviceEvent;
export declare const openAppFromDashboard: (transport: Transport, appName: string) => Observable<ConnectAppEvent>;
declare const cmd: ({ modelId, devicePath, appName, requiresDerivation, dependencies, requireLatestFirmware, outdatedApp, }: Input) => Observable<ConnectAppEvent>;
export default cmd;
//# sourceMappingURL=connectApp.d.ts.map