import type { Account, AccountLike, Operation } from "@ledgerhq/types-live";
import { BigNumber } from "bignumber.js";
export declare function findOperationInAccount({ operations, pendingOperations }: AccountLike, operationId: string): Operation | null | undefined;
export declare function encodeOperationId(accountId: string, hash: string, type: string): string;
export declare function decodeOperationId(id: string): {
    accountId: string;
    hash: string;
    type: string;
};
export declare function encodeSubOperationId(accountId: string, hash: string, type: string, index: string | number): string;
export declare function decodeSubOperationId(id: string): {
    accountId: string;
    hash: string;
    type: string;
    index: number;
};
export declare function patchOperationWithHash(operation: Operation, hash: string): Operation;
export declare function flattenOperationWithInternalsAndNfts(op: Operation): Operation[];
export declare function getOperationAmountNumber(op: Operation): BigNumber;
export declare function getOperationAmountNumberWithInternals(op: Operation): BigNumber;
export declare const getOperationConfirmationNumber: (operation: Operation, account: Account) => number;
export declare const getOperationConfirmationDisplayableNumber: (operation: Operation, account: Account) => string;
export declare const isConfirmedOperation: (operation: Operation, account: Account, confirmationsNb: number) => boolean;
//# sourceMappingURL=operation.d.ts.map