import { Observable } from "rxjs";
import type { Transaction, TransactionStatus } from "../../generated/types";
import type { ConnectAppEvent, Input as ConnectAppInput } from "../connectApp";
import type { Action, Device } from "./types";
import type { AppRequest, AppState } from "./app";
import type { Account, AccountLike, SignedOperation } from "@ledgerhq/types-live";
import type { TokenCurrency } from "@ledgerhq/types-cryptoassets";
declare type State = {
    signedOperation: SignedOperation | null | undefined;
    deviceSignatureRequested: boolean;
    deviceStreamingProgress: number | null | undefined;
    transactionSignError: Error | null | undefined;
};
declare type TransactionState = AppState & State;
declare type TransactionRequest = {
    tokenCurrency?: TokenCurrency | null | undefined;
    parentAccount: Account | null | undefined;
    account: AccountLike;
    transaction: Transaction;
    status: TransactionStatus;
    appName?: string;
    dependencies?: AppRequest[];
    requireLatestFirmware?: boolean;
};
declare type TransactionResult = {
    signedOperation: SignedOperation;
    device: Device;
    swapId?: string;
} | {
    transactionSignError: Error;
};
declare type TransactionAction = Action<TransactionRequest, TransactionState, TransactionResult>;
export declare const createAction: (connectAppExec: (arg0: ConnectAppInput) => Observable<ConnectAppEvent>) => TransactionAction;
export {};
//# sourceMappingURL=transaction.d.ts.map