import type { Observable } from "rxjs";
import type { DeviceModel } from "@ledgerhq/types-devices";
import Transport from "@ledgerhq/hw-transport";
export declare type DeviceEvent = {
    type: "add" | "remove";
    id: string;
    name: string;
    deviceModel?: DeviceModel | null;
    wired?: boolean;
};
export declare type Discovery = Observable<DeviceEvent>;
export declare type TransportModule = {
    id: string;
    open: (id: string) => Promise<Transport> | null | undefined;
    close?: (transport: Transport, id: string) => Promise<void> | null | undefined;
    disconnect: (id: string) => Promise<void> | null | undefined;
    setAllowAutoDisconnect?: (transport: Transport, id: string, allow: boolean) => Promise<void> | null | undefined;
    discovery?: Discovery;
};
export declare const registerTransportModule: (module: TransportModule) => void;
export declare const discoverDevices: (accept?: (module: TransportModule) => boolean) => Discovery;
export declare const open: (deviceId: string) => Promise<Transport>;
export declare const close: (transport: Transport, deviceId: string) => Promise<void>;
export declare const setAllowAutoDisconnect: (transport: Transport, deviceId: string, allow: boolean) => Promise<void> | null | undefined;
export declare const disconnect: (deviceId: string) => Promise<void>;
//# sourceMappingURL=index.d.ts.map