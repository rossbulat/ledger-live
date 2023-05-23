import { delay } from "@ledgerhq/live-promise";
import { Operation } from "@ledgerhq/types-live";
import axios, { AxiosRequestConfig } from "axios";
import { CryptoCurrency } from "@ledgerhq/types-cryptoassets";
import { makeLRUCache } from "../../../cache";
import { EtherscanAPIError } from "../errors";
import { isNFTActive } from "../../../nft";
import {
  etherscanOperationToOperation,
  etherscanERC20EventToOperation,
  etherscanERC721EventToOperation,
  etherscanERC1155EventToOperation,
} from "../adapters";
import {
  EtherscanERC1155Event,
  EtherscanERC20Event,
  EtherscanERC721Event,
  EtherscanOperation,
} from "../types";

export const ETHERSCAN_TIMEOUT = 5000; // 5 seconds between 2 calls
export const DEFAULT_RETRIES_API = 8;

async function fetchWithRetries<T>(
  params: AxiosRequestConfig,
  retries = DEFAULT_RETRIES_API
): Promise<T> {
  try {
    const { data } = await axios.request<{
      status: string;
      message: string;
      result: T;
    }>(params);

    if (!Number(data.status) && data.message === "NOTOK") {
      throw new EtherscanAPIError(
        "Error while fetching data from Etherscan like API",
        { params, data }
      );
    }

    return data.result;
  } catch (e) {
    if (retries) {
      // wait the API timeout before trying again
      await delay(ETHERSCAN_TIMEOUT);
      // decrement with prefix here or it won't work
      return fetchWithRetries<T>(params, --retries);
    }
    throw e;
  }
}

/**
 * Get all the last "normal" transactions (no tokens / NFTs)
 */
export const getLastCoinOperations = makeLRUCache<
  [
    currency: CryptoCurrency,
    address: string,
    accountId: string,
    fromBlock: number
  ],
  Operation[]
>(
  async (currency, address, accountId, fromBlock) => {
    const apiDomain = currency.ethereumLikeInfo?.explorer?.uri;
    if (!apiDomain) {
      return [];
    }

    let url = `${apiDomain}/api?module=account&action=txlist&address=${address}&tag=latest&page=1&sort=desc`;
    if (fromBlock) {
      url += `&startBlock=${fromBlock}`;
    }

    const ops = await fetchWithRetries<EtherscanOperation[]>({
      method: "GET",
      url,
    });

    return ops
      .map((tx) => etherscanOperationToOperation(accountId, tx))
      .filter(Boolean) as Operation[];
  },
  (currency, address, accountId, fromBlock) => accountId + fromBlock,
  { ttl: 5 * 1000 }
);

/**
 * Get all the last ERC20 transactions
 */
export const getLastTokenOperations = makeLRUCache<
  [
    currency: CryptoCurrency,
    address: string,
    accountId: string,
    fromBlock: number
  ],
  Operation[]
>(
  async (currency, address, accountId, fromBlock) => {
    const apiDomain = currency.ethereumLikeInfo?.explorer?.uri;
    if (!apiDomain) {
      return [];
    }

    let url = `${apiDomain}/api?module=account&action=tokentx&address=${address}&tag=latest&page=1&sort=desc`;
    if (fromBlock) {
      url += `&startBlock=${fromBlock}`;
    }

    const ops = await fetchWithRetries<EtherscanERC20Event[]>({
      method: "GET",
      url,
    });

    return ops
      .map((event) => etherscanERC20EventToOperation(accountId, event))
      .filter(Boolean) as Operation[];
  },
  (currency, address, accountId, fromBlock) => accountId + fromBlock,
  { ttl: 5 * 1000 }
);

/**
 * Get all the last ERC721 transactions
 */
export const getLastERC721Operations = makeLRUCache<
  [
    currency: CryptoCurrency,
    address: string,
    accountId: string,
    fromBlock: number
  ],
  Operation[]
>(
  async (currency, address, accountId, fromBlock) => {
    const apiDomain = currency.ethereumLikeInfo?.explorer?.uri;
    if (!apiDomain) {
      return [];
    }

    let url = `${apiDomain}/api?module=account&action=tokennfttx&address=${address}&tag=latest&page=1&sort=desc`;
    if (fromBlock) {
      url += `&startBlock=${fromBlock}`;
    }

    const ops = await fetchWithRetries<EtherscanERC721Event[]>({
      method: "GET",
      url,
    });

    return ops.map((event) =>
      etherscanERC721EventToOperation(accountId, event)
    );
  },
  (currency, address, accountId, fromBlock) => accountId + fromBlock,
  { ttl: 5 * 1000 }
);

/**
 * Get all the last ERC71155 transactions
 */
export const getLastERC1155Operations = makeLRUCache<
  [
    currency: CryptoCurrency,
    address: string,
    accountId: string,
    fromBlock: number
  ],
  Operation[]
>(
  async (currency, address, accountId, fromBlock) => {
    const apiDomain = currency.ethereumLikeInfo?.explorer?.uri;
    if (!apiDomain) {
      return [];
    }

    let url = `${apiDomain}/api?module=account&action=token1155tx&address=${address}&tag=latest&page=1&sort=desc`;
    if (fromBlock) {
      url += `&startBlock=${fromBlock}`;
    }

    const ops = await fetchWithRetries<EtherscanERC1155Event[]>({
      method: "GET",
      url,
    });

    return ops.map((event) =>
      etherscanERC1155EventToOperation(accountId, event)
    );
  },
  (currency, address, accountId, fromBlock) => accountId + fromBlock,
  { ttl: 5 * 1000 }
);

/**
 * Get all NFT related operations (ERC721 + ERC1155)
 */
export const getLastNftOperations = async (
  currency: CryptoCurrency,
  address: string,
  accountId: string,
  fromBlock: number
): Promise<Operation[]> => {
  const erc721Ops = await getLastERC721Operations(
    currency,
    address,
    accountId,
    fromBlock
  );
  const erc1155Ops = await getLastERC1155Operations(
    currency,
    address,
    accountId,
    fromBlock
  );

  return [...erc721Ops, ...erc1155Ops].sort(
    // sorting DESC order
    (a, b) => b.date.getTime() - a.date.getTime()
  );
};

/**
 * Wrapper around all operation types' requests
 *
 * ⚠ The lack of parallelization is on purpose,
 * do not use a Promise.all here, it would
 * break because of the rate limits
 */
export const getLastOperations = async (
  currency: CryptoCurrency,
  address: string,
  accountId: string,
  fromBlock: number
): Promise<{
  lastCoinOperations: Operation[];
  lastTokenOperations: Operation[];
  lastNftOperations: Operation[];
}> => {
  const lastCoinOperations = await getLastCoinOperations(
    currency,
    address,
    accountId,
    fromBlock
  );
  // Create a Map of hash => operation
  const coinOperationsByHash: Record<string, Operation> = {};
  lastCoinOperations.forEach((op) => {
    coinOperationsByHash[op.hash] = op;
  });

  const lastTokenOperations = await getLastTokenOperations(
    currency,
    address,
    accountId,
    fromBlock
  );
  // Looping through token operations to potentially copy them as a sub operation of a coin operation
  for (const tokenOperation of lastTokenOperations) {
    const mainOperation = coinOperationsByHash[tokenOperation.hash];
    if (mainOperation) {
      if (!mainOperation.subOperations) {
        mainOperation.subOperations = [];
      }
      mainOperation.subOperations.push(tokenOperation);
    }
  }

  const lastNftOperations = isNFTActive(currency)
    ? await getLastNftOperations(currency, address, accountId, fromBlock)
    : [];
  // Looping through nft operations to potentially copy them as a sub operation of a coin operation
  for (const nftOperation of lastNftOperations) {
    const mainOperation = coinOperationsByHash[nftOperation.hash];
    if (mainOperation) {
      if (!mainOperation.nftOperations) {
        mainOperation.nftOperations = [];
      }
      mainOperation.nftOperations.push(nftOperation);
    }
  }

  return {
    lastCoinOperations,
    lastTokenOperations,
    lastNftOperations,
  };
};

export default {
  getLastCoinOperations,
  getLastTokenOperations,
  getLastERC721Operations,
  getLastERC1155Operations,
  getLastNftOperations,
  getLastOperations,
};
