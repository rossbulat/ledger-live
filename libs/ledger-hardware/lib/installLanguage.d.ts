import { Observable } from "rxjs";
import { Language } from "@ledgerhq/types-live";
import { AttemptToQuitAppEvent } from "./attemptToQuitApp";
export declare type InstallLanguageEvent = AttemptToQuitAppEvent | {
    type: "progress";
    progress: number;
} | {
    type: "devicePermissionRequested";
} | {
    type: "languageInstalled";
};
export declare type InstallLanguageRequest = {
    deviceId: string;
    language: Language;
};
export default function installLanguage({ deviceId, language, }: InstallLanguageRequest): Observable<InstallLanguageEvent>;
//# sourceMappingURL=installLanguage.d.ts.map