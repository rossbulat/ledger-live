import { Observable } from "rxjs";
import { AttemptToQuitAppEvent } from "./attemptToQuitApp";
export declare type FetchImageEvent = AttemptToQuitAppEvent | {
    type: "progress";
    progress: number;
} | {
    type: "imageFetched";
    hexImage: string;
};
export declare type FetchImageRequest = {
    deviceId: string;
};
export default function fetchImage({ deviceId, }: FetchImageRequest): Observable<FetchImageEvent>;
//# sourceMappingURL=ftsFetchImage.d.ts.map