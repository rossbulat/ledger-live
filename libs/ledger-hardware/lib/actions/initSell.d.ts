import { Observable } from "rxjs";
import type { ConnectAppEvent, Input as ConnectAppInput } from "../connectApp";
import type { Action } from "./types";
import type { Transaction, TransactionStatus } from "../../generated/types";
import type { AppState } from "./app";
import type { InitSellResult, SellRequestEvent } from "../../exchange/sell/types";
import type { Account, AccountLike } from "@ledgerhq/types-live";
declare type State = {
    initSellResult: InitSellResult | null | undefined;
    initSellRequested: boolean;
    initSellError: Error | null | undefined;
    isLoading: boolean;
    freezeReduxDevice: boolean;
};
declare type InitSellState = AppState & State;
declare type InitSellRequest = {
    account: AccountLike;
    parentAccount: Account | null | undefined;
};
declare type Result = {
    initSellResult: InitSellResult;
} | {
    initSellError: Error;
};
declare type InitSellAction = Action<InitSellRequest, InitSellState, Result>;
export declare const createAction: (connectAppExec: (arg0: ConnectAppInput) => Observable<ConnectAppEvent>, getTransactionId: (arg0: {
    deviceId: string;
}) => Observable<SellRequestEvent>, checkSignatureAndPrepare: (arg0: {
    deviceId: string;
    binaryPayload: string;
    payloadSignature: string;
    account: AccountLike;
    parentAccount: Account | null | undefined;
    transaction: Transaction;
    status: TransactionStatus;
}) => Observable<SellRequestEvent>, onTransactionId: (arg0: string) => Promise<any>) => InitSellAction;
export {};
//# sourceMappingURL=initSell.d.ts.map