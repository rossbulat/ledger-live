import type { Transaction } from "./types";
import { Observable } from "rxjs";
import type { Account, SignOperationEvent } from "@ledgerhq/types-live";
declare const signOperation: ({ account, deviceId, transaction, }: {
    account: Account;
    deviceId: any;
    transaction: Transaction;
}) => Observable<SignOperationEvent>;
export default signOperation;
//# sourceMappingURL=js-signOperation.d.ts.map