import type { Account } from "@ledgerhq/types-live";
import { Transaction } from "./types";
import { AminoMsg, AminoSignResponse } from "@cosmjs/amino";
declare type ProtoMsg = {
    typeUrl: string;
    value: Uint8Array;
};
export declare const buildTransaction: (account: Account, transaction: Transaction) => Promise<{
    aminoMsgs: AminoMsg[];
    protoMsgs: ProtoMsg[];
}>;
export declare const postBuildTransaction: (signResponse: AminoSignResponse, protoMsgs: Array<ProtoMsg>) => Promise<Uint8Array>;
export default buildTransaction;
//# sourceMappingURL=js-buildTransaction.d.ts.map