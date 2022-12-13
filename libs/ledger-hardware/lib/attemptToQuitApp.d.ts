import { Observable } from "rxjs";
import type { AppAndVersion } from "./connectApp";
export declare type AttemptToQuitAppEvent = {
    type: "unresponsiveDevice";
} | {
    type: "appDetected";
};
declare const attemptToQuitApp: (transport: any, appAndVersion?: AppAndVersion) => Observable<AttemptToQuitAppEvent>;
export default attemptToQuitApp;
//# sourceMappingURL=attemptToQuitApp.d.ts.map