import { Observable } from "rxjs";
import type { AppAndVersion, ConnectAppEvent, Input as ConnectAppInput } from "../connectApp";
import type { Device, Action } from "./types";
import { AppOp } from "../../apps/types";
import type { Account, DeviceInfo, FirmwareUpdateContext } from "@ledgerhq/types-live";
import type { CryptoCurrency, TokenCurrency } from "@ledgerhq/types-cryptoassets";
export declare type State = {
    isLoading: boolean;
    requestQuitApp: boolean;
    requestOpenApp: string | null | undefined;
    requiresAppInstallation: {
        appName: string;
        appNames: string[];
    } | null | undefined;
    opened: boolean;
    appAndVersion: AppAndVersion | null | undefined;
    unresponsive: boolean;
    allowOpeningRequestedWording: string | null | undefined;
    allowOpeningGranted: boolean;
    allowManagerRequestedWording: string | null | undefined;
    allowManagerGranted: boolean;
    device: Device | null | undefined;
    deviceInfo?: DeviceInfo | null | undefined;
    latestFirmware?: FirmwareUpdateContext | null | undefined;
    error: Error | null | undefined;
    derivation: {
        address: string;
    } | null | undefined;
    displayUpgradeWarning: boolean;
    installingApp?: boolean;
    progress?: number;
    listingApps?: boolean;
    request: AppRequest | undefined;
    installQueue?: string[];
    currentAppOp?: AppOp;
    itemProgress?: number;
    isLocked: boolean;
};
export declare type AppState = State & {
    onRetry: () => void;
    passWarning: () => void;
    inWrongDeviceForAccount: {
        accountName: string;
    } | null | undefined;
};
export declare type AppRequest = {
    appName?: string;
    currency?: CryptoCurrency | null;
    account?: Account;
    tokenCurrency?: TokenCurrency;
    dependencies?: AppRequest[];
    withInlineInstallProgress?: boolean;
    requireLatestFirmware?: boolean;
};
export declare type AppResult = {
    device: Device;
    appAndVersion: AppAndVersion | null | undefined;
    appName?: string;
    currency?: CryptoCurrency;
    account?: Account;
    tokenCurrency?: TokenCurrency;
    dependencies?: AppRequest[];
    withInlineInstallProgress?: boolean;
    requireLatestFirmware?: boolean;
};
declare type AppAction = Action<AppRequest, AppState, AppResult>;
declare const implementations: {
    event: ({ deviceSubject, connectApp, params }: {
        deviceSubject: any;
        connectApp: any;
        params: any;
    }) => any;
    polling: ({ deviceSubject, params, connectApp }: {
        deviceSubject: any;
        params: any;
        connectApp: any;
    }) => any;
};
export declare let currentMode: keyof typeof implementations;
export declare function setDeviceMode(mode: keyof typeof implementations): void;
export declare const createAction: (connectAppExec: (arg0: ConnectAppInput) => Observable<ConnectAppEvent>) => AppAction;
export {};
//# sourceMappingURL=app.d.ts.map