import { Observable } from "rxjs";
import { Account } from "@ledgerhq/types-live";
import type { AppRequest, AppState } from "../actions/app";
import type { Device } from "../actions/types";
import type { ConnectAppEvent, Input as ConnectAppInput } from "../connectApp";
import type { MessageData, SignMessage, Result } from "./types";
import { TypedMessageData } from "../../families/ethereum/types";
export declare const prepareMessageToSign: (account: Account, message: string) => MessageData | TypedMessageData;
declare const signMessage: SignMessage;
declare type BaseState = {
    signMessageRequested: MessageData | TypedMessageData | null | undefined;
    signMessageError: Error | null | undefined;
    signMessageResult: string | null | undefined;
};
export declare type State = AppState & BaseState;
export declare type Request = AppRequest & {
    message: MessageData | TypedMessageData;
};
export declare type Input = {
    request: Request;
    deviceId: string;
};
export declare const signMessageExec: ({ request, deviceId, }: Input) => Observable<Result>;
export declare const createAction: (connectAppExec: (connectAppInput: ConnectAppInput) => Observable<ConnectAppEvent>, signMessage?: (input: Input) => Observable<Result>) => {
    useHook: (reduxDevice: Device | null | undefined, request: Request) => State;
    mapResult: (state: State) => {
        signature: string | null | undefined;
        error: Error | null | undefined;
    };
};
export default signMessage;
//# sourceMappingURL=index.d.ts.map