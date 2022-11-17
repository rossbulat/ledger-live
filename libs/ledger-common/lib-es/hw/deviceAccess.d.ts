import { Observable } from "rxjs";
import Transport from "@ledgerhq/hw-transport";
export declare type AccessHook = () => () => void;
export declare const addAccessHook: (accessHook: AccessHook) => void;
export declare const setErrorRemapping: (f: (arg0: Error) => Observable<never>) => void;
export declare const cancelDeviceAction: (transport: Transport) => void;
export declare const withDevice: (deviceId: string) => <T>(job: (t: Transport) => Observable<T>) => Observable<T>;
export declare const genericCanRetryOnError: (err: unknown) => boolean;
export declare const retryWhileErrors: (acceptError: (arg0: Error) => boolean) => (attempts: Observable<any>) => Observable<any>;
export declare const withDevicePolling: (deviceId: string) => <T>(job: (arg0: Transport) => Observable<T>, acceptError?: (arg0: Error) => boolean) => Observable<T>;
//# sourceMappingURL=deviceAccess.d.ts.map