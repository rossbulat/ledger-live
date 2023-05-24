import { log } from "@ledgerhq/logs";
import { decodeOperationId } from "@ledgerhq/coin-framework/operation";
import { CryptoCurrency, TokenCurrency } from "@ledgerhq/types-cryptoassets";
import { Account, Operation, SubAccount } from "@ledgerhq/types-live";
import { getSyncHash, mergeSubAccounts } from "./logic";
import { nftsFromOperations } from "../../nft";
import etherscanLikeApi from "./api/etherscan";
import {
  mergeOps,
  makeSync,
  makeScanAccounts,
  GetAccountShape,
  AccountShapeInfo,
  mergeNfts,
} from "../../bridge/jsHelpers";
import {
  decodeAccountId,
  decodeTokenAccountId,
  emptyHistoryCache,
  encodeAccountId,
  encodeTokenAccountId,
  shouldRetainPendingOperation,
} from "../../account";
import {
  getBalanceAndBlock,
  getBlock,
  getTokenBalance,
  getTransaction,
} from "./api/rpc";

/**
 * Switch to select one of the compatible explorer
 */
const getExplorerApi = (currency: CryptoCurrency) => {
  const apiType = currency.ethereumLikeInfo?.explorer?.type;

  switch (apiType) {
    case "etherscan":
    case "blockscout":
      return etherscanLikeApi;

    default:
      throw new Error("API type not supported");
  }
};

/**
 * Main synchronization process
 * Get the main Account and the potential TokenAccounts linked to it
 */
export const getAccountShape: GetAccountShape = async (infos) => {
  const { initialAccount, address, derivationMode, currency } = infos;
  const { blockHeight, balance } = await getBalanceAndBlock(currency, address);
  const accountId = encodeAccountId({
    type: "js",
    version: "2",
    currencyId: currency.id,
    xpubOrAddress: address,
    derivationMode,
  });
  const syncHash = getSyncHash(currency);
  // Due to some changes (as of now: new/updated tokens) we could need to force a sync from 0
  const shouldSyncFromScratch = syncHash !== initialAccount?.syncHash;

  // Get the latest stored operation to know where to start the new sync
  const latestSyncedOperation = shouldSyncFromScratch
    ? null
    : initialAccount?.operations?.reduce<Operation | null>((acc, curr) => {
        if (!acc) {
          return curr;
        }
        return (acc?.blockHeight || 0) > (curr?.blockHeight || 0) ? acc : curr;
      }, null);

  const { lastCoinOperations, lastTokenOperations, lastNftOperations } =
    await (async () => {
      try {
        const { getLastOperations } = getExplorerApi(currency);
        return await getLastOperations(
          currency,
          address,
          accountId,
          latestSyncedOperation?.blockHeight || 0
        );
      } catch (e) {
        log("EVM Family", "Failed to get latest transactions", {
          address,
          currency,
          error: e,
        });
        throw e;
      }
    })();

  const newSubAccounts = await getSubAccounts(
    infos,
    accountId,
    lastTokenOperations
  );
  const subAccounts = mergeSubAccounts(initialAccount, newSubAccounts); // Merging potential new subAccouns while preserving the references

  const newNfts = nftsFromOperations(lastNftOperations);
  // Merging potential new nfts while preserving the references
  const nfts = mergeNfts(initialAccount?.nfts || [], newNfts).filter((nft) =>
    nft.amount.gt(0)
  );

  // Trying to confirm pending operations that we are sure of
  // because they were made in the live
  // Useful for integrations without explorers
  const confirmPendingOperations =
    initialAccount?.pendingOperations?.map((op) =>
      getOperationStatus(currency, op)
    ) || [];
  const confirmedOperations = await Promise.all(confirmPendingOperations).then(
    (ops) => ops.filter((op): op is Operation => !!op)
  );

  const newOperations = [...confirmedOperations, ...lastCoinOperations];
  const operations = mergeOps(initialAccount?.operations || [], newOperations);
  const lastSyncDate = new Date();

  return {
    type: "Account",
    id: accountId,
    syncHash,
    balance,
    spendableBalance: balance,
    blockHeight,
    operations,
    operationsCount: operations.length,
    subAccounts,
    nfts,
    lastSyncDate,
  } as Partial<Account>;
};

/**
 * Getting all token related operations in order to provide TokenAccounts
 */
export const getSubAccounts = async (
  infos: AccountShapeInfo,
  accountId: string,
  lastTokenOperations: Operation[]
): Promise<Partial<SubAccount>[]> => {
  const { currency } = infos;

  // Creating a Map of Operations by TokenCurrencies in order to know which TokenAccounts should be synced as well
  const erc20OperationsByToken = lastTokenOperations.reduce<
    Map<TokenCurrency, Operation[]>
  >((acc, operation) => {
    const { accountId } = decodeOperationId(operation.id);
    const { token } = decodeTokenAccountId(accountId);
    if (!token) return acc;

    if (!acc.has(token)) {
      acc.set(token, []);
    }
    acc.get(token)?.push(operation);

    return acc;
  }, new Map<TokenCurrency, Operation[]>());

  // Fetching all TokenAccounts possible and providing already filtered operations
  const subAccountsPromises: Promise<Partial<SubAccount>>[] = [];
  for (const [token, ops] of erc20OperationsByToken.entries()) {
    subAccountsPromises.push(
      getSubAccountShape(currency, accountId, token, ops)
    );
  }

  return Promise.all(subAccountsPromises);
};

/**
 * Fetch the balance for a token and creates a TokenAccount based on this and the provided operations
 */
export const getSubAccountShape = async (
  currency: CryptoCurrency,
  parentId: string,
  token: TokenCurrency,
  operations: Operation[]
): Promise<Partial<SubAccount>> => {
  const { xpubOrAddress: address } = decodeAccountId(parentId);
  const tokenAccountId = encodeTokenAccountId(parentId, token);
  const balance = await getTokenBalance(
    currency,
    address,
    token.contractAddress
  );

  return {
    type: "TokenAccount",
    id: tokenAccountId,
    parentId,
    token,
    balance,
    spendableBalance: balance,
    creationDate: new Date(),
    operations,
    operationsCount: operations.length,
    pendingOperations: [],
    balanceHistoryCache: emptyHistoryCache,
    swapHistory: [],
  };
};

/**
 * Get a finalized operation depending on it status (confirmed or not)
 */
export const getOperationStatus = async (
  currency: CryptoCurrency,
  op: Operation
): Promise<Operation | null> => {
  try {
    const {
      blockNumber: blockHeight,
      blockHash,
      timestamp,
      nonce,
    } = await getTransaction(currency, op.hash);

    if (!blockHeight) {
      throw new Error("getOperationStatus: Transaction has no block");
    }

    const date = await (async () => {
      // timestamp can be missing depending on the node
      if (timestamp) {
        return new Date(timestamp * 1000);
      }

      // Without timestamp, we directly look for the block
      const { timestamp: blockTimestamp } = await getBlock(
        currency,
        blockHeight
      );
      return new Date(blockTimestamp * 1000);
    })();

    return {
      ...op,
      transactionSequenceNumber: nonce,
      blockHash,
      blockHeight,
      date,
    } as Operation;
  } catch (e) {
    return null;
  }
};

/**
 * After each sync, it might be necessary to remove pending operations
 * inside of subAccounts.
 */
export const postSync = (initial: Account, synced: Account): Account => {
  // Set of hashes from the pending operations of the main account
  const coinPendingOperationsHashes = new Set();
  for (const coinPendingOperation of synced.pendingOperations) {
    coinPendingOperationsHashes.add(coinPendingOperation.hash);
  }
  // Set of ids from the already existing subAccount from previous sync
  const initialSubAccountsIds = new Set();
  for (const subAccount of initial.subAccounts || []) {
    initialSubAccountsIds.add(subAccount.id);
  }

  return {
    ...synced,
    subAccounts: synced.subAccounts?.map((subAccount) => {
      // If the subAccount is new, just return the freshly synced subAccount
      if (!initialSubAccountsIds.has(subAccount.id)) return subAccount;

      return {
        ...subAccount,
        pendingOperations: subAccount.pendingOperations.filter(
          (tokenPendingOperation) =>
            // if the pending operation got removed from the main account, remove it as well
            coinPendingOperationsHashes.has(tokenPendingOperation.hash) &&
            // if the transaction has been confirmed, remove it
            !subAccount.operations.some(
              (op) => op.hash === tokenPendingOperation.hash
            ) &&
            // common rule for pending operations retention in the live
            shouldRetainPendingOperation(synced, tokenPendingOperation)
        ),
      };
    }),
  };
};

export const scanAccounts = makeScanAccounts({ getAccountShape });
export const sync = makeSync({
  getAccountShape,
  postSync,
  shouldMergeOps: false,
});
