import type { Account, DeviceId, SignOperationEvent } from "@ledgerhq/types-live";
import type { Transaction } from "./types";
import { Observable } from "rxjs";
declare const signOperation: ({ account, deviceId, transaction, }: {
    account: Account;
    deviceId: DeviceId;
    transaction: Transaction;
}) => Observable<SignOperationEvent>;
export default signOperation;
//# sourceMappingURL=js-signOperation.d.ts.map