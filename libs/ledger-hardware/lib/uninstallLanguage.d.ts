import { Observable } from "rxjs";
import { Language } from "@ledgerhq/types-live";
export declare type UninstallLanguageEvent = {
    type: "appDetected";
} | {
    type: "unresponsiveDevice";
} | {
    type: "languageUninstalled";
};
export declare type UninstallLanguageRequest = {
    deviceId: string;
    language: Language;
};
export default function unistallLanguage({ deviceId, language, }: UninstallLanguageRequest): Observable<UninstallLanguageEvent>;
//# sourceMappingURL=uninstallLanguage.d.ts.map