/// <reference types="node" />
import Transport from "@ledgerhq/hw-transport";
declare const getBitcoinLikeInfo: (transport: Transport) => Promise<{
    P2PKH: number;
    P2SH: number;
    message: Buffer;
    short: Buffer;
} | null | undefined>;
export default getBitcoinLikeInfo;
//# sourceMappingURL=getBitcoinLikeInfo.d.ts.map