import Transport from "@ledgerhq/hw-transport";
import { Observable } from "rxjs";
import type { DeviceInfo, FinalFirmware } from "@ledgerhq/types-live";
export declare const fetchNextFirmware: (deviceInfo: DeviceInfo) => Observable<FinalFirmware>;
declare const _default: (transport: Transport) => Observable<any>;
export default _default;
//# sourceMappingURL=installFinalFirmware.d.ts.map