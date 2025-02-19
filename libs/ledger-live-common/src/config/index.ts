import { getEnv } from "@ledgerhq/live-env";
import { CryptoCurrency } from "@ledgerhq/types-cryptoassets";
import { makeLRUCache } from "../cache";
import network from "../network";
import { CurrencyConfigCommon } from "./types";
import defaultConfig from "./defaultConfig";

export const getCurrencyConfiguration = makeLRUCache(
  async (
    currency: CryptoCurrency
  ): Promise<CurrencyConfigCommon | undefined> => {
    const currencyConfigUrl = getEnv("CURRENCY_CONFIG_BASE_URL");
    try {
      const remoteConfig = await network({
        method: "GET",
        url: `${currencyConfigUrl}/config/${currency.family}/${currency.id}.json`,
      });
      if (remoteConfig.data != null) {
        return remoteConfig.data;
      } else {
        throw new Error(
          `No currency configuration available remotely for ${currency.id}`
        );
      }
    } catch (e) {
      if (
        defaultConfig &&
        defaultConfig.config &&
        defaultConfig.config[currency.family] &&
        defaultConfig.config[currency.family][currency.id]
      ) {
        console.warn(
          `No currency configuration available for ${currency.id}, using local configuration as backup`
        );
        return Promise.resolve(
          defaultConfig.config[currency.family][currency.id]
        );
      } else {
        throw new Error(
          `No currency configuration available for ${currency.id}`
        );
      }
    }
  },
  (currency) => currency.id,
  { ttl: 30 * 60 * 1000 } // 30mn
);
