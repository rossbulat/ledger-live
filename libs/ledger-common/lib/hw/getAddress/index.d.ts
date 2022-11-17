import Transport from "@ledgerhq/hw-transport";
import { GetAddressOptions, Resolver } from "./types";
declare const getAddressWrapper: (getAddressFn: Resolver) => (transport: Transport, opts: GetAddressOptions) => Promise<import("./types").Result>;
export default getAddressWrapper;
//# sourceMappingURL=index.d.ts.map