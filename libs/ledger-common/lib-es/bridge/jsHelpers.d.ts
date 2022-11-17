import { Observable } from "rxjs";
import Transport from "@ledgerhq/hw-transport";
import type { Account, AccountBridge, CurrencyBridge, Operation, ProtoNFT, SyncConfig } from "@ledgerhq/types-live";
import { DerivationMode } from "../derivation";
import type { Result, GetAddressOptions } from "../hw/getAddress/types";
import type { CryptoCurrency } from "@ledgerhq/types-cryptoassets";
import { Resolver } from "../hw/getAddress/types";
declare type IterateResult = ({ transport, index, derivationsCache, derivationScheme, derivationMode, currency, }: {
    transport: Transport;
    index: number;
    derivationsCache: Record<string, unknown>;
    derivationScheme: string;
    derivationMode: DerivationMode;
    currency: CryptoCurrency;
}) => Promise<Result | null>;
export declare type IterateResultBuilder = ({ result, // derivation on the "root" of the derivation
derivationMode, // identify the current derivation scheme
derivationScheme, }: {
    result: Result;
    derivationMode: DerivationMode;
    derivationScheme: string;
}) => Promise<IterateResult>;
export declare type GetAccountShapeArg0 = {
    currency: CryptoCurrency;
    address: string;
    index: number;
    initialAccount?: Account;
    derivationPath: string;
    derivationMode: DerivationMode;
    transport?: Transport;
    rest?: any;
};
export declare type GetAccountShape = (arg0: GetAccountShapeArg0, arg1: SyncConfig) => Promise<Partial<Account>>;
export declare const sameOp: (a: Operation, b: Operation) => boolean;
export declare function mergeOps(// existing operations. sorted (newer to older). deduped.
existing: Operation[], // new fetched operations. not sorted. not deduped. time is allowed to overlap inside existing.
newFetched: Operation[]): Operation[];
export declare const mergeNfts: (oldNfts: ProtoNFT[], newNfts: ProtoNFT[]) => ProtoNFT[];
export declare const makeSync: ({ getAccountShape, postSync, shouldMergeOps, }: {
    getAccountShape: GetAccountShape;
    postSync?: ((initial: Account, synced: Account) => Account) | undefined;
    shouldMergeOps?: boolean | undefined;
}) => AccountBridge<any>["sync"];
export declare const makeScanAccounts: ({ getAccountShape, getAddressFn, buildIterateResult, }: {
    getAccountShape: GetAccountShape;
    getAddressFn: (transport: Transport, opts: GetAddressOptions) => Promise<Result>;
    buildIterateResult?: IterateResultBuilder | undefined;
}) => CurrencyBridge["scanAccounts"];
export declare function makeAccountBridgeReceive(getAddressFn: Resolver, { injectGetAddressParams, }?: {
    injectGetAddressParams?: (arg0: Account) => any;
}): (account: Account, arg1: {
    verify?: boolean;
    deviceId: string;
    subAccountId?: string;
    freshAddressIndex?: number;
}) => Observable<{
    address: string;
    path: string;
}>;
export {};
//# sourceMappingURL=jsHelpers.d.ts.map