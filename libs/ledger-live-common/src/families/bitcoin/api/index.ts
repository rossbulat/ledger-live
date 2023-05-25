import { FeeEstimationFailed } from "@ledgerhq/errors";
import { makeLRUCache } from "@ledgerhq/live-network/src/cache";
import network from "@ledgerhq/live-network/src/network";
import type { CryptoCurrency } from "@ledgerhq/types-cryptoassets";
import { BigNumber } from "bignumber.js";
import invariant from "invariant";
import { blockchainBaseURL } from "../../../explorer";
import type { FeeItems } from "../types";

type Fees = Record<string, number>;

const getEstimatedFees: (currency: CryptoCurrency) => Promise<Fees> =
  makeLRUCache(
    async (currency) => {
      const baseURL = blockchainBaseURL(currency);
      invariant(baseURL, `Fees for ${currency.id} are not supported`);
      const { data, status } = await network({
        method: "GET",
        url: `${baseURL}/fees`,
      });

      if (data) {
        return data;
      }

      throw new FeeEstimationFailed(`FeeEstimationFailed ${status}`, {
        httpStatus: status,
      });
    },
    (c) => c.id
  );

export const speeds = {
  "1": "fast",
  "3": "medium",
  "6": "slow",
};

export const defaultBlockCount = 3;

export const getFeeItems = async (
  currency: CryptoCurrency
): Promise<FeeItems> => {
  const all: Array<{
    key: string;
    speed: string;
    blockCount: number;
    feePerByte: BigNumber;
  }> = [];
  const fees = await getEstimatedFees(currency);
  let defaultFeePerByte = new BigNumber(0);

  for (const key of Object.keys(fees)) {
    const feePerByte = new BigNumber(Math.ceil(fees[key] / 1000));
    const blockCount = parseInt(key, 10);
    if (blockCount === defaultBlockCount) defaultFeePerByte = feePerByte;

    if (
      !Number.isNaN(blockCount) &&
      !feePerByte.isNaN() &&
      blockCount in speeds
    ) {
      all.push({
        key,
        speed: speeds[blockCount],
        blockCount,
        feePerByte,
      });
    }
  }

  const items = all
    .sort((a, b) => a.blockCount - b.blockCount)
    .map(({ key, speed, feePerByte }) => ({
      key,
      speed,
      feePerByte,
    }));
  return {
    items,
    defaultFeePerByte,
  };
};
