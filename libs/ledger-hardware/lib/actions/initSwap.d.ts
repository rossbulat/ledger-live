import { Observable } from "rxjs";
import type { Exchange, ExchangeRate, InitSwapInput, InitSwapResult, SwapRequestEvent, SwapTransaction } from "../../exchange/swap/types";
import type { ConnectAppEvent, Input as ConnectAppInput } from "../connectApp";
import type { AppState } from "./app";
import type { Action } from "./types";
declare type State = {
    initSwapResult: InitSwapResult | null | undefined;
    initSwapRequested: boolean;
    initSwapError: Error | null | undefined;
    swapId?: string;
    error?: Error;
    isLoading: boolean;
    freezeReduxDevice: boolean;
};
declare type InitSwapState = AppState & State;
declare type InitSwapRequest = {
    exchange: Exchange;
    exchangeRate: ExchangeRate;
    transaction: SwapTransaction;
    userId?: string;
    requireLatestFirmware?: boolean;
};
declare type Result = {
    initSwapResult: InitSwapResult;
} | {
    initSwapError: Error;
    swapId?: string;
};
declare type InitSwapAction = Action<InitSwapRequest, InitSwapState, Result>;
export declare const createAction: (connectAppExec: (arg0: ConnectAppInput) => Observable<ConnectAppEvent>, initSwapExec: (arg0: InitSwapInput) => Observable<SwapRequestEvent>) => InitSwapAction;
export {};
//# sourceMappingURL=initSwap.d.ts.map