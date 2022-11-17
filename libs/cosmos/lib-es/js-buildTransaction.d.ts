import { CosmosAccount, Transaction } from "./types";
export declare const buildTransaction: (account: CosmosAccount, transaction: Transaction) => Promise<any>;
export declare const postBuildTransaction: (account: CosmosAccount, transaction: Transaction, pubkey: any, unsignedPayload: any, signature: Uint8Array) => Promise<any>;
export default buildTransaction;
//# sourceMappingURL=js-buildTransaction.d.ts.map