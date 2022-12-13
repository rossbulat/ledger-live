import { Observable } from "rxjs";
import type { FirmwareUpdateContext } from "@ledgerhq/types-live";
declare type Res = {
    installing: string | null | undefined;
    progress: number;
};
declare const main: (deviceId: string, { final, shouldFlashMCU }: FirmwareUpdateContext) => Observable<Res>;
export default main;
//# sourceMappingURL=firmwareUpdate-main.d.ts.map