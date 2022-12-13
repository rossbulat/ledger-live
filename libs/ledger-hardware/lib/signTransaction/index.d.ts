import type { CryptoCurrency } from "@ledgerhq/types-cryptoassets";
import Transport from "@ledgerhq/hw-transport";
declare type Resolver = (currency: CryptoCurrency, transport: Transport, path: string, transaction: any) => Promise<string>;
declare const m: Resolver;
export default m;
//# sourceMappingURL=index.d.ts.map