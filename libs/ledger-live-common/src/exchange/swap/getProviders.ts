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
import type { GetProviders, ProvidersResponseV4, ProvidersResponseV5, Pair } from "./types";
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
      const responseV4 = res.data as ProvidersResponseV4;
      if (!responseV4.providers || !Object.keys(responseV4.providers).length) {
        throw new SwapNoAvailableProviders();
      }
      return Object.entries(responseV4.providers).flatMap(([provider, groups]) => ({
        provider: provider,
        pairs: groups.flatMap((group) =>
          group.methods.flatMap((tradeMethod) =>
            Object.entries(group.pairs).flatMap(([from, toArray]) =>
              (toArray as number[]).map((to) => ({
                from: responseV4.currencies[from],
                to: responseV4.currencies[to.toString()],
                tradeMethod,
              }))
            )
          )
        ),
      }));    
    }
    case 5: {
      const response = res.data as ProvidersResponseV5;
      if (!response.providers || !Object.keys(response.providers).length) {
        throw new SwapNoAvailableProviders();
      }
      
      return Object.entries(response.providers).map( provider => {
        const providerCurrency = provider[1]
        let pairs: Pair[] = []

        if (isProviderPermutationV5(providerCurrency)) {
          const availableCurrencies = providerCurrency.currencies.map( currencyIdx => response.currencies[currencyIdx])
          
          availableCurrencies.forEach( fromCurrency =>
            availableCurrencies.forEach( toCurrency => {
              if (fromCurrency !== toCurrency) {
                if (providerCurrency.float) {
                  pairs = [
                    ...pairs,
                    {
                      from: fromCurrency,
                      to: toCurrency,
                      tradeMethod: "float"
                    }
                  ];  
                }
                if (providerCurrency.fixed) {
                  pairs = [
                    ...pairs,
                    {
                      from: fromCurrency,
                      to: toCurrency,
                      tradeMethod: "fixed"
                    }
                  ];
                  }
              }
            })
          );
        } else {
          const availableCurrencies = Object.entries(providerCurrency.currencies)
            .filter( currencyInfo => currencyInfo[1].to ?? providerCurrency.to )
            .map( currencyInfo => response.currencies[currencyInfo[0]])
    
          Object.entries(providerCurrency.currencies).forEach( currencyInfo => {
            const isFloat = currencyInfo[1].float ?? providerCurrency.float;
            const isFixed = currencyInfo[1].fixed ?? providerCurrency.fixed;
            const isFrom = currencyInfo[1].from ?? providerCurrency.from;

            if (isFrom) {
              availableCurrencies.forEach( toCurrency => {
                const fromCurrency = response.currencies[currencyInfo[0]]
                if (fromCurrency === toCurrency) return;
                if (isFloat) {
                  pairs = [
                    ...pairs,
                    {
                      from: response.currencies[currencyInfo[0]],
                      to: toCurrency,
                      tradeMethod: "float"
                    }
                  ];
                }
                if (isFixed) {
                  pairs = [
                    ...pairs,
                    {
                      from: response.currencies[currencyInfo[0]],
                      to: toCurrency,
                      tradeMethod: "fixed"
                    }
                  ];
                }
              });
            }
          });
        }

        return {
          provider: provider[0],
          pairs
        }
      });
    }
    default: {
      if (!res.data.length) {
        throw new SwapNoAvailableProviders();
      }
      return res.data;
    }
  }
};

export default getProviders;
