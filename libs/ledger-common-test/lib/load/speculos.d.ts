import type { DeviceModelId } from "@ledgerhq/devices";
import SpeculosTransport from "@ledgerhq/hw-transport-node-speculos";
export declare function releaseSpeculosDevice(id: string): Promise<void>;
export declare function closeAllSpeculosDevices(): Promise<void[]>;
export declare function createSpeculosDevice(arg: {
    model: DeviceModelId;
    firmware: string;
    appName: string;
    appVersion: string;
    dependency?: string;
    seed: string;
    coinapps: string;
}, maxRetry?: number): Promise<{
    transport: SpeculosTransport;
    id: string;
    appPath: string;
}>;
export declare type AppCandidate = {
    path: string;
    model: DeviceModelId;
    firmware: string;
    appName: string;
    appVersion: string;
};
export declare function listAppCandidates(cwd: string): Promise<AppCandidate[]>;
export declare type AppSearch = {
    model?: DeviceModelId;
    firmware?: string;
    appName?: string;
    appVersion?: string;
};
export declare function appCandidatesMatches(appCandidate: AppCandidate, search: AppSearch): boolean;
export declare const findAppCandidate: (appCandidates: AppCandidate[], search: AppSearch, picker?: (arg0: AppCandidate[]) => AppCandidate) => AppCandidate | null | undefined;
export declare function createImplicitSpeculos(query: string): Promise<{
    device: {
        transport: SpeculosTransport;
        id: string;
    };
    appCandidate: AppCandidate;
} | null>;
//# sourceMappingURL=speculos.d.ts.map