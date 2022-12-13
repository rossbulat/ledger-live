/// <reference types="node" />
import Transport from "@ledgerhq/hw-transport";
declare const _default: (transport: Transport) => Promise<{
    name: string;
    version: string;
    flags: number | Buffer;
}>;
export default _default;
//# sourceMappingURL=getAppAndVersion.d.ts.map