import type { FirmwareUpdateContext } from "@ledgerhq/types-live";
import { Observable } from "rxjs";
declare const checkId: (deviceId: string, { osu }: FirmwareUpdateContext) => Observable<{
    progress: number;
    displayedOnDevice: boolean;
}>;
export default checkId;
//# sourceMappingURL=firmwareUpdate-prepare.d.ts.map