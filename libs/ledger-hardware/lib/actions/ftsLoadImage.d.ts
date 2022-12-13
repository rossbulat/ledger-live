import { Observable } from "rxjs";
import type { DeviceInfo } from "@ledgerhq/types-live";
import type { LoadImageEvent, LoadImageRequest } from "../ftsLoadImage";
import type { Action, Device } from "./types";
declare type State = {
    isLoading: boolean;
    requestQuitApp: boolean;
    unresponsive: boolean;
    imageLoadRequested?: boolean;
    loadingImage?: boolean;
    imageLoaded?: boolean;
    imageCommitRequested?: boolean;
    imageHash?: string;
    device: Device | null | undefined;
    deviceInfo: DeviceInfo | null | undefined;
    error: Error | null | undefined;
    progress?: number;
};
declare type LoadImageAction = Action<string, State, {
    imageHash?: string;
}>;
export declare const createAction: (loadImageExec: (arg0: LoadImageRequest) => Observable<LoadImageEvent>) => LoadImageAction;
export {};
//# sourceMappingURL=ftsLoadImage.d.ts.map