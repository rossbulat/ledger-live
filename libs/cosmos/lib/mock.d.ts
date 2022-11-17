import Prando from "prando";
import type { Account } from "@ledgerhq/types-live";
import type { CosmosAccount } from "./types";
/**
 * add in specific cosmos operations
 * @memberof cosmos/mock
 * @param {CosmosAccount} account
 * @param {Prando} rng
 */
declare function genAccountEnhanceOperations(account: CosmosAccount, rng: Prando): Account;
/**
 * Update spendable balance for the account based on delegation data
 * @memberof cosmos/mock
 * @param {CosmosAccount} account
 */
declare function postSyncAccount(account: CosmosAccount): Account;
/**
 * post account scan data logic
 * clears account cosmos resources if supposed to be empty
 * @memberof cosmos/mock
 * @param {Account} account
 */
declare function postScanAccount(account: CosmosAccount, { isEmpty, }: {
    isEmpty: boolean;
}): CosmosAccount;
declare const _default: {
    genAccountEnhanceOperations: typeof genAccountEnhanceOperations;
    postSyncAccount: typeof postSyncAccount;
    postScanAccount: typeof postScanAccount;
};
export default _default;
//# sourceMappingURL=mock.d.ts.map