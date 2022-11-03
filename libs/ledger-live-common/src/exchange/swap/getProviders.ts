import qs from "qs";
import { getEnv } from "../../env";
import { SwapNoAvailableProviders } from "../../errors";
import network from "../../network";
import {
  getAvailableProviders,
  getSwapAPIBaseURL,
  getSwapAPIVersion,
} from "./";
import { mockGetProviders } from "./mock";
import type { GetProviders, ProvidersResponseV4, ProvidersResponseV5, AvailableProviderV3, Pair } from "./types";
import { isProviderPerCurrencyV5, isProviderPermutationV5 } from "./types";

const getProviders: GetProviders = async () => {
  if (getEnv("MOCK")) return mockGetProviders();

  const version = getSwapAPIVersion();

  const res = await network({
    method: "GET",
    url: `${getSwapAPIBaseURL()}/providers`,
    params: version >= 3 ? { whitelist: getAvailableProviders() } : undefined,
    paramsSerializer: (params) =>
      qs.stringify(params, { arrayFormat: "comma" }),
  });

  switch(version) {
    case 4: {
      return parseV4(res.data);
    }
    case 5: {
      return parseV5(res.data);
    }
    default: {
      if (!res.data.length) {
        throw new SwapNoAvailableProviders();
      }
      return res.data;
    }
  }
};

function parseV4(response: ProvidersResponseV4): AvailableProviderV3[] {
  raiseIfNoProviders(response)

  return Object.entries(response.providers).flatMap(([provider, groups]) => ({
    provider: provider,
    pairs: groups.flatMap((group) =>
      group.methods.flatMap((tradeMethod) =>
        Object.entries(group.pairs).flatMap(([from, toArray]) =>
          (toArray as number[]).map((to) => ({
            from: response.currencies[from],
            to: response.currencies[to.toString()],
            tradeMethod,
          }))
        )
      )
    ),
  }));
}

function parseV5(response: ProvidersResponseV5): AvailableProviderV3[] {
  raiseIfNoProviders(response)

  return Object.entries(response.providers).map( provider => {
    const providerCurrency = provider[1]
    let pairs: Pair[] = []

    if (isProviderPermutationV5(providerCurrency)) {
      const currencies = providerCurrency.currencies.map( currencyIdx => response.currencies[currencyIdx])
      const isFloat = providerCurrency.float;
      const isFixed = providerCurrency.fixed;
  
      currencies.forEach( fromCurrency => {
        pairs = scanCurrenciesForPairs(currencies, pairs, fromCurrency, isFloat, isFixed)
      });
    } else {
      const toCurrencies = Object.entries(providerCurrency.currencies)
        .filter( currencyInfo => currencyInfo[1].to ?? providerCurrency.to )
        .map( currencyInfo => response.currencies[currencyInfo[0]])

      Object.entries(providerCurrency.currencies)
        .filter( currencyInfo => currencyInfo[1].from ?? providerCurrency.from )
        .forEach( currencyInfo => {
          const fromCurrency = response.currencies[currencyInfo[0]]
          const isFloat = currencyInfo[1].float ?? providerCurrency.float;
          const isFixed = currencyInfo[1].fixed ?? providerCurrency.fixed;

          pairs = scanCurrenciesForPairs(toCurrencies, pairs, fromCurrency, isFloat, isFixed)
        });
    }

    return {
      provider: provider[0],
      pairs
    }
  });
}

function scanCurrenciesForPairs(toCurrencies: string[], pairs: Pair[], fromCurrency: string, isFloat: boolean, isFixed: boolean): Pair[] {
  toCurrencies.forEach( toCurrency => {
    pairs = concatPair(pairs, fromCurrency, toCurrency, isFloat, isFixed)
  });
  return pairs;
}

function concatPair(pairs: Pair[], fromCurrency: string, toCurrency: string, isFloat: boolean, isFixed: boolean): Pair[] {
  if (fromCurrency === toCurrency) return pairs;

  if (isFloat) {
    pairs = [
      ...pairs,
      {
        from: fromCurrency,
        to: toCurrency,
        tradeMethod: "float"
      }
    ];
  }
  if (isFixed) {
    pairs = [
      ...pairs,
      {
        from: fromCurrency,
        to: toCurrency,
        tradeMethod: "fixed"
      }
    ];
  }
  return pairs;
}

function raiseIfNoProviders(response: ProvidersResponseV4 | ProvidersResponseV5) {
  if (!response.providers || !Object.keys(response.providers).length) {
    throw new SwapNoAvailableProviders();
  }
}

export default getProviders;
