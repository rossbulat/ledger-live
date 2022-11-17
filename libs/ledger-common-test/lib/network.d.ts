import { AxiosResponse } from "axios";
import type { AxiosError, AxiosRequestConfig } from "axios";
declare type Metadata = {
    startTime: number;
};
declare type ExtendedXHRConfig = AxiosRequestConfig & {
    metadata?: Metadata;
};
export declare const requestInterceptor: (request: AxiosRequestConfig) => ExtendedXHRConfig;
export declare const responseInterceptor: (response: {
    config: ExtendedXHRConfig;
} & AxiosResponse<any>) => {
    config: ExtendedXHRConfig;
} & AxiosResponse<any, any>;
export declare const errorInterceptor: (error: AxiosError<any>) => never;
declare const implementation: (arg: AxiosRequestConfig) => Promise<any>;
export default implementation;
//# sourceMappingURL=network.d.ts.map