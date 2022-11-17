import { GetAccountShape } from "@ledgerhq/common/lib/bridge/jsHelpers";
export declare const getAccountShape: GetAccountShape;
export declare const scanAccounts: (arg0: {
    currency: import("@ledgerhq/types-cryptoassets").CryptoCurrency;
    deviceId: string;
    scheme?: string | null | undefined;
    syncConfig: import("@ledgerhq/types-live").SyncConfig;
    preferredNewAccountScheme?: string | undefined;
}) => import("rxjs").Observable<import("@ledgerhq/types-live").ScanAccountEvent>;
export declare const sync: (initialAccount: import("@ledgerhq/types-live").Account, syncConfig: import("@ledgerhq/types-live").SyncConfig) => import("rxjs").Observable<(arg0: import("@ledgerhq/types-live").Account) => import("@ledgerhq/types-live").Account>;
//# sourceMappingURL=js-synchronisation.d.ts.map