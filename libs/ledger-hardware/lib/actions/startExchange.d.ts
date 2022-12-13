import { Observable } from "rxjs";
import type { ConnectAppEvent, Input as ConnectAppInput } from "../connectApp";
import type { Action } from "./types";
import type { AppState } from "./app";
import { ExchangeType } from "@ledgerhq/live-app-sdk";
declare type State = {
    startExchangeResult: string | null | undefined;
    startExchangeError: Error | null | undefined;
    freezeReduxDevice: boolean;
    isLoading: boolean;
    error?: Error;
};
declare type StartExchangeState = AppState & State;
declare type Result = {
    startExchangeResult: string;
} | {
    startExchangeError: Error;
};
declare type StartExchangeAction = Action<any, StartExchangeState, Result>;
export declare type ExchangeRequestEvent = {
    type: "start-exchange";
} | {
    type: "start-exchange-error";
    error: Error;
} | {
    type: "start-exchange-result";
    nonce: string;
};
export declare const createAction: (connectAppExec: (arg0: ConnectAppInput) => Observable<ConnectAppEvent>, startExchangeExec: (arg0: {
    deviceId: string;
    exchangeType: ExchangeType;
}) => Observable<ExchangeRequestEvent>) => StartExchangeAction;
export {};
//# sourceMappingURL=startExchange.d.ts.map