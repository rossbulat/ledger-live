import React, {
  useContext,
  useEffect,
  createContext,
  useMemo,
  useState,
  useCallback,
} from "react";
import { LiveAppRegistry } from "./types";
import { AppPlatform, LiveAppManifest, Loadable } from "../../types";

import api from "./api";
import { FilterParams } from "../../filters";
import { getEnv } from "../../../env";
import useIsMounted from "../../../hooks/useIsMounted";

const initialState: Loadable<LiveAppRegistry> = {
  isLoading: false,
  value: null,
  error: null,
};

const initialProvider = "production";

const initialParams: FilterParams = {
  branches: ["stable", "soon"],
};

type LiveAppContextType = {
  state: Loadable<LiveAppRegistry>;
  provider: string;
  setProvider: React.Dispatch<React.SetStateAction<string>>;
  updateManifests: () => Promise<void>;
};

export const liveAppContext = createContext<LiveAppContextType>({
  state: initialState,
  provider: initialProvider,
  setProvider: () => {},
  updateManifests: () => Promise.resolve(),
});

type FetchLiveAppCatalogPrams = {
  apiVersions?: string[];
  platform: AppPlatform;
  allowDebugApps: boolean;
  allowExperimentalApps: boolean;
};

type LiveAppProviderProps = {
  children: React.ReactNode;
  parameters: FetchLiveAppCatalogPrams;
  updateFrequency: number;
};

export function useRemoteLiveAppManifest(
  appId?: string
): LiveAppManifest | undefined {
  const liveAppRegistry = useContext(liveAppContext).state;

  if (!liveAppRegistry.value || !appId) {
    return undefined;
  }

  return liveAppRegistry.value.liveAppById[appId];
}

export function useRemoteLiveAppContext(): LiveAppContextType {
  return useContext(liveAppContext);
}

export function useManifests(
  options: Partial<LiveAppManifest> = {}
): LiveAppManifest[] {
  const liveAppFiltered =
    useRemoteLiveAppContext().state?.value?.liveAppFiltered ?? [];

  const filteredList = useMemo(() => {
    if (Object.keys(options).length === 0) {
      return liveAppFiltered;
    }
    return liveAppFiltered.filter((manifest) =>
      Object.keys(options).some((key) => manifest[key] === options[key])
    );
  }, [options, liveAppFiltered]);
  return filteredList;
}

export function RemoteLiveAppProvider({
  children,
  parameters,
  updateFrequency,
}: LiveAppProviderProps): JSX.Element {
  const isMounted = useIsMounted();
  const [state, setState] = useState<Loadable<LiveAppRegistry>>(initialState);
  const [provider, setProvider] = useState<string>(initialProvider);

  const { allowExperimentalApps, allowDebugApps, apiVersions, platform } =
    parameters;

  // apiVersion renamed without (s) because param
  const apiVersion = apiVersions ? apiVersions : ["1.0.0", "2.0.0"];

  const providerURL: string =
    provider === "production" ? getEnv("PLATFORM_MANIFEST_API_URL") : provider;

  const updateManifests = useCallback(async () => {
    setState((currentState) => ({
      ...currentState,
      isLoading: true,
      error: null,
    }));

    const branches = [...(initialParams.branches || [])];
    allowExperimentalApps && branches.push("experimental");
    allowDebugApps && branches.push("debug");

    try {
      const allManifests = await api.fetchLiveAppManifests(providerURL);

      const catalogManifests = await api.fetchLiveAppManifests(providerURL, {
        apiVersion,
        branches,
        platform,
        private: false,
      });

      if (!isMounted()) return;
      setState(() => ({
        isLoading: false,
        value: {
          liveAppByIndex: allManifests,
          liveAppFiltered: catalogManifests,
          liveAppById: allManifests.reduce((acc, liveAppManifest) => {
            acc[liveAppManifest.id] = liveAppManifest;
            return acc;
          }, {}),
        },
        error: null,
      }));
    } catch (error) {
      if (!isMounted()) return;
      setState((currentState) => ({
        ...currentState,
        isLoading: false,
        error,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowDebugApps, allowExperimentalApps, providerURL, isMounted]);

  const value: LiveAppContextType = useMemo(
    () => ({
      state,
      provider,
      setProvider,
      updateManifests,
    }),
    [state, provider, setProvider, updateManifests]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      updateManifests();
    }, updateFrequency);
    updateManifests();
    return () => {
      clearInterval(interval);
    };
  }, [updateFrequency, updateManifests]);

  return (
    <liveAppContext.Provider value={value}>{children}</liveAppContext.Provider>
  );
}
