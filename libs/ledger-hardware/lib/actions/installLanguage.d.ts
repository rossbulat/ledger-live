import { Observable } from "rxjs";
import type { DeviceInfo } from "@ledgerhq/types-live";
import type { InstallLanguageEvent, InstallLanguageRequest } from "../installLanguage";
import type { Action, Device } from "./types";
import { Language } from "@ledgerhq/types-live";
declare type State = {
    isLoading: boolean;
    requestQuitApp: boolean;
    unresponsive: boolean;
    languageInstallationRequested?: boolean;
    installingLanguage?: boolean;
    languageInstalled?: boolean;
    device: Device | null | undefined;
    deviceInfo: DeviceInfo | null | undefined;
    error: Error | null | undefined;
    progress?: number;
};
declare type InstallLanguageAction = Action<Language | undefined, State, boolean | undefined>;
export declare const createAction: (installLanuageExec: (arg0: InstallLanguageRequest) => Observable<InstallLanguageEvent>) => InstallLanguageAction;
export {};
//# sourceMappingURL=installLanguage.d.ts.map