import { BigNumber } from "bignumber.js";
import type { AccountLike, Account } from "@ledgerhq/types-live";
import { CosmosOperationMode } from "../types";
/**
 * Returns the maximum possible amount for transaction, considering fees
 *
 * @param {Object} param - account, parentAccount
 */
declare const estimateMaxSpendable: ({ account, parentAccount, mode, }: {
    account: AccountLike;
    parentAccount: Account | null | undefined;
    mode: CosmosOperationMode;
}) => Promise<BigNumber>;
export default estimateMaxSpendable;
//# sourceMappingURL=js-estimateMaxSpendable.d.ts.map