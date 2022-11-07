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
import type {
  GetProviders,
  ProvidersResponseV4,
  ProvidersResponseV5,
  PermutationProviderV5,
  PerCurrencyProviderV5,
  PerCurrencyProviderCurrencyV5,
  AvailableProviderV3,
  Pair,
} from "./types";
import { isPermutationProviderV5 } from "./types";

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

  switch (version) {
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
  raiseIfNoProviders(response);

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

type IdsToCurrencies = { [index: string]: string };
function parseV5(response: ProvidersResponseV5): AvailableProviderV3[] {
  raiseIfNoProviders(response);

  const availableCurrencies = response.currencies as IdsToCurrencies;

  return Object.entries(response.providers).map((provider) => {
    const providerName = provider[0];
    const providerInfo = provider[1];
    let pairs: Pair[] = [];

    if (isPermutationProviderV5(providerInfo)) {
      pairs = extractPairsFromPermutationProvider(
        providerInfo,
        availableCurrencies
      );
    } else {
      pairs = extractPairsFromPerCurrencyProvider(
        providerInfo,
        availableCurrencies
      );
    }

    return {
      provider: providerName,
      pairs,
    };
  });
}

function extractPairsFromPermutationProvider(
  providerInfo: PermutationProviderV5,
  availableCurrencies: IdsToCurrencies
): Pair[] {
  const providerCurrencies = providerInfo.currencies.map(
    (currencyIdx) => availableCurrencies[currencyIdx]
  );
  const isFloat = providerInfo.float;
  const isFixed = providerInfo.fixed;

  return providerCurrencies.reduce(
    (pairs: Pair[], fromCurrency: string) =>
      scanCurrenciesForPairs(
        providerCurrencies,
        pairs,
        fromCurrency,
        isFloat,
        isFixed
      ),
    []
  );
}

function extractPairsFromPerCurrencyProvider(
  providerInfo: PerCurrencyProviderV5,
  availableCurrencies: IdsToCurrencies
): Pair[] {
  const toCurrencies = Object.entries(providerInfo.currencies)
    .filter((currencyInfo) => currencyInfo[1].to ?? providerInfo.to)
    .map((currencyInfo) => availableCurrencies[currencyInfo[0]]);

  return Object.entries(providerInfo.currencies)
    .filter((currencyInfo) => currencyInfo[1].from ?? providerInfo.from)
    .reduce(
      (
        pairs: Pair[],
        currencyInfo: [string, PerCurrencyProviderCurrencyV5]
      ) => {
        const fromCurrency = availableCurrencies[currencyInfo[0]];
        const isFloat = currencyInfo[1].float ?? providerInfo.float;
        const isFixed = currencyInfo[1].fixed ?? providerInfo.fixed;

        return scanCurrenciesForPairs(
          toCurrencies,
          pairs,
          fromCurrency,
          isFloat,
          isFixed
        );
      },
      []
    );
}

function scanCurrenciesForPairs(
  toCurrencies: string[],
  pairs: Pair[],
  fromCurrency: string,
  isFloat: boolean,
  isFixed: boolean
): Pair[] {
  return toCurrencies.reduce(
    (pairs: Pair[], toCurrency: string) =>
      concatPair(pairs, fromCurrency, toCurrency, isFloat, isFixed),
    pairs
  );
}

function concatPair(
  pairs: Pair[],
  fromCurrency: string,
  toCurrency: string,
  isFloat: boolean,
  isFixed: boolean
): Pair[] {
  if (fromCurrency === toCurrency) return pairs;

  if (isFloat) {
    pairs = [
      ...pairs,
      {
        from: fromCurrency,
        to: toCurrency,
        tradeMethod: "float",
      },
    ];
  }
  if (isFixed) {
    pairs = [
      ...pairs,
      {
        from: fromCurrency,
        to: toCurrency,
        tradeMethod: "fixed",
      },
    ];
  }
  return pairs;
}

function raiseIfNoProviders(
  response: ProvidersResponseV4 | ProvidersResponseV5
) {
  if (!response.providers || !Object.keys(response.providers).length) {
    throw new SwapNoAvailableProviders();
  }
}

export default getProviders;
