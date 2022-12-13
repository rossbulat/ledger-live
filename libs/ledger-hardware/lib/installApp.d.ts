import { Observable } from "rxjs";
import Transport from "@ledgerhq/hw-transport";
import type { ApplicationVersion, App } from "@ledgerhq/types-live";
export default function installApp(transport: Transport, targetId: string | number, app: ApplicationVersion | App): Observable<{
    progress: number;
}>;
//# sourceMappingURL=installApp.d.ts.map