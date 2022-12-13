import { Observable } from "rxjs";
import { AttemptToQuitAppEvent } from "./attemptToQuitApp";
export declare type LoadImageEvent = AttemptToQuitAppEvent | {
    type: "progress";
    progress: number;
} | {
    type: "loadImagePermissionRequested";
} | {
    type: "commitImagePermissionRequested";
} | {
    type: "imageLoaded";
};
export declare type LoadImageRequest = {
    deviceId: string;
    hexImage: string;
};
export default function loadImage({ deviceId, hexImage, }: LoadImageRequest): Observable<LoadImageEvent>;
//# sourceMappingURL=ftsLoadImage.d.ts.map