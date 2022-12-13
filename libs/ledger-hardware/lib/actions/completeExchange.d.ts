import { Observable } from "rxjs";
import type { Action } from "./types";
import type { AppState } from "./app";
import { Exchange } from "../../exchange/swap/types";
import { Transaction } from "../../generated/types";
declare type State = {
    completeExchangeResult: Transaction | null | undefined;
    completeExchangeError: Error | null | undefined;
    freezeReduxDevice: boolean;
    completeExchangeRequested: boolean;
    isLoading: boolean;
};
declare type CompleteExchangeState = AppState & State;
declare type CompleteExchangeRequest = {
    deviceId?: string;
    provider: string;
    transaction: Transaction;
    binaryPayload: string;
    signature: string;
    exchange: Exchange;
    exchangeType: number;
    rateType: number;
};
declare type Result = {
    completeExchangeResult: Transaction;
} | {
    completeExchangeError: Error;
};
declare type CompleteExchangeAction = Action<CompleteExchangeRequest, CompleteExchangeState, Result>;
export declare type ExchangeRequestEvent = {
    type: "complete-exchange";
} | {
    type: "complete-exchange-requested";
} | {
    type: "complete-exchange-error";
    error: Error;
} | {
    type: "complete-exchange-result";
    completeExchangeResult: Transaction;
};
export declare const createAction: (completeExchangeExec: (arg0: CompleteExchangeRequest) => Observable<ExchangeRequestEvent>) => CompleteExchangeAction;
export {};
//# sourceMappingURL=completeExchange.d.ts.map