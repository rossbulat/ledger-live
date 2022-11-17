import { Subject } from "rxjs";
import { $ElementType } from "utility-types";
declare type EnvDefs = typeof envDefinitions;
declare type Env = typeof env;
export declare type EnvName = keyof EnvDefs;
export declare type EnvValue<Name extends EnvName> = $ElementType<Env, Name>;
declare type JSONValue = string | number | boolean | null | {
    [x: string]: JSONValue;
} | Array<JSONValue>;
declare const envDefinitions: {
    ANALYTICS_CONSOLE: {
        def: boolean;
        parser: (v: unknown) => boolean | null | undefined;
        desc: string;
    };
    API_ALGORAND_BLOCKCHAIN_EXPLORER_API_ENDPOINT: {
        def: string;
        parser: (v: unknown) => string | null | undefined;
        desc: string;
    };
    API_CELO_INDEXER: {
        def: string;
        parser: (v: unknown) => string | null | undefined;
        desc: string;
    };
    API_CELO_NODE: {
        def: string;
        parser: (v: unknown) => string | null | undefined;
        desc: string;
    };
    API_COSMOS_BLOCKCHAIN_EXPLORER_API_ENDPOINT: {
        def: string;
        parser: (v: unknown) => string | null | undefined;
        desc: string;
    };
    API_COSMOS_NODE: {
        def: string;
        parser: (v: unknown) => string | null | undefined;
        desc: string;
    };
    API_COSMOS_TESTNET_BLOCKCHAIN_EXPLORER_API_ENDPOINT: {
        def: string;
        parser: (v: unknown) => string | null | undefined;
        desc: string;
    };
    API_COSMOS_TESTNET_NODE: {
        def: string;
        parser: (v: unknown) => string | null | undefined;
        desc: string;
    };
    API_RIPPLE_RPC: {
        parser: (v: unknown) => string | null | undefined;
        def: string;
        desc: string;
    };
    API_FILECOIN_ENDPOINT: {
        parser: (v: unknown) => string | null | undefined;
        def: string;
        desc: string;
    };
    API_POLKADOT_INDEXER: {
        parser: (v: unknown) => string | null | undefined;
        def: string;
        desc: string;
    };
    API_POLKADOT_SIDECAR: {
        parser: (v: unknown) => string | null | undefined;
        def: string;
        desc: string;
    };
    ELROND_API_ENDPOINT: {
        parser: (v: unknown) => string | null | undefined;
        def: string;
        desc: string;
    };
    API_STELLAR_HORIZON: {
        parser: (v: unknown) => string | null | undefined;
        def: string;
        desc: string;
    };
    API_STELLAR_HORIZON_FETCH_LIMIT: {
        parser: (v: any) => number | null | undefined;
        def: number;
        desc: string;
    };
    API_STELLAR_HORIZON_STATIC_FEE: {
        def: boolean;
        parser: (v: unknown) => boolean | null | undefined;
        desc: string;
    };
    API_OSMOSIS_INDEXER: {
        def: string;
        parser: (v: unknown) => string | null | undefined;
        desc: string;
    };
    API_OSMOSIS_NODE: {
        def: string;
        parser: (v: unknown) => string | null | undefined;
        desc: string;
    };
    API_TEZOS_BAKER: {
        parser: (v: unknown) => string | null | undefined;
        def: string;
        desc: string;
    };
    API_TEZOS_BLOCKCHAIN_EXPLORER_API_ENDPOINT: {
        def: string;
        parser: (v: unknown) => string | null | undefined;
        desc: string;
    };
    API_TEZOS_TZKT_API: {
        def: string;
        parser: (v: unknown) => string | null | undefined;
        desc: string;
    };
    API_TEZOS_NODE: {
        def: string;
        parser: (v: unknown) => string | null | undefined;
        desc: string;
    };
    API_TRONGRID_PROXY: {
        parser: (v: unknown) => string | null | undefined;
        def: string;
        desc: string;
    };
    API_SOLANA_PROXY: {
        parser: (v: unknown) => string | null | undefined;
        def: string;
        desc: string;
    };
    SOLANA_VALIDATORS_APP_BASE_URL: {
        parser: (v: unknown) => string | null | undefined;
        def: string;
        desc: string;
    };
    SOLANA_TX_CONFIRMATION_TIMEOUT: {
        def: number;
        parser: (v: any) => number | null | undefined;
        desc: string;
    };
    API_HEDERA_MIRROR: {
        def: string;
        parser: (v: unknown) => string | null | undefined;
        desc: string;
    };
    BASE_SOCKET_URL: {
        def: string;
        parser: (v: unknown) => string | null | undefined;
        desc: string;
    };
    BOT_TIMEOUT_SCAN_ACCOUNTS: {
        def: number;
        parser: (v: any) => number | null | undefined;
        desc: string;
    };
    BOT_SPEC_DEFAULT_TIMEOUT: {
        def: number;
        parser: (v: any) => number | null | undefined;
        desc: string;
    };
    CARDANO_API_ENDPOINT: {
        def: string;
        parser: (v: unknown) => string | null | undefined;
        desc: string;
    };
    CARDANO_TESTNET_API_ENDPOINT: {
        def: string;
        parser: (v: unknown) => string | null | undefined;
        desc: string;
    };
    COINAPPS: {
        def: string;
        parser: (v: unknown) => string | null | undefined;
        desc: string;
    };
    COMPOUND_API: {
        def: string;
        parser: (v: unknown) => string | null | undefined;
        desc: string;
    };
    COSMOS_GAS_AMPLIFIER: {
        def: number;
        parser: (v: any) => number | null | undefined;
        desc: string;
    };
    COSMOS_GAS_PRICE: {
        def: number;
        parser: (v: any) => number | null | undefined;
        desc: string;
    };
    CRYPTO_ORG_INDEXER: {
        def: string;
        parser: (v: unknown) => string | null | undefined;
        desc: string;
    };
    CRYPTO_ORG_TESTNET_INDEXER: {
        def: string;
        parser: (v: unknown) => string | null | undefined;
        desc: string;
    };
    CRYPTO_ORG_RPC_URL: {
        def: string;
        parser: (v: unknown) => string | null | undefined;
        desc: string;
    };
    CRYPTO_ORG_TESTNET_RPC_URL: {
        def: string;
        parser: (v: unknown) => string | null | undefined;
        desc: string;
    };
    DEBUG_UTXO_DISPLAY: {
        def: number;
        parser: (v: any) => number | null | undefined;
        desc: string;
    };
    DEBUG_HTTP_RESPONSE: {
        def: boolean;
        parser: (v: unknown) => boolean | null | undefined;
        desc: string;
    };
    DEVICE_CANCEL_APDU_FLUSH_MECHANISM: {
        def: boolean;
        parser: (v: unknown) => boolean | null | undefined;
        desc: string;
    };
    DEVICE_PROXY_URL: {
        def: string;
        parser: (v: unknown) => string | null | undefined;
        desc: string;
    };
    DEVICE_PROXY_MODEL: {
        def: string;
        parser: (v: unknown) => string | null | undefined;
        desc: string;
    };
    DISABLE_TRANSACTION_BROADCAST: {
        def: boolean;
        parser: (v: unknown) => boolean | null | undefined;
        desc: string;
    };
    DISABLE_SYNC_TOKEN: {
        def: boolean;
        parser: (v: unknown) => boolean | null | undefined;
        desc: string;
    };
    ETHEREUM_GAS_LIMIT_AMPLIFIER: {
        def: number;
        parser: (v: any) => number | null | undefined;
        desc: string;
    };
    EXPERIMENTAL_BLE: {
        def: boolean;
        parser: (v: unknown) => boolean | null | undefined;
        desc: string;
    };
    EXPERIMENTAL_CURRENCIES: {
        def: string;
        parser: (v: unknown) => string | null | undefined;
        desc: string;
    };
    EXPERIMENTAL_EIP712: {
        def: boolean;
        parser: (v: unknown) => boolean | null | undefined;
        desc: string;
    };
    EXPERIMENTAL_EXPLORERS: {
        def: boolean;
        parser: (v: unknown) => boolean | null | undefined;
        desc: string;
    };
    EXPERIMENTAL_FALLBACK_APDU_LISTAPPS: {
        def: boolean;
        parser: (v: unknown) => boolean | null | undefined;
        desc: string;
    };
    EXPERIMENTAL_LANGUAGES: {
        def: boolean;
        parser: (v: unknown) => boolean | null | undefined;
        desc: string;
    };
    EXPERIMENTAL_MANAGER: {
        def: boolean;
        parser: (v: unknown) => boolean | null | undefined;
        desc: string;
    };
    EXPERIMENTAL_ROI_CALCULATION: {
        def: boolean;
        parser: (v: unknown) => boolean | null | undefined;
        desc: string;
    };
    EXPERIMENTAL_SEND_MAX: {
        def: boolean;
        parser: (v: unknown) => boolean | null | undefined;
        desc: string;
    };
    EXPERIMENTAL_USB: {
        def: boolean;
        parser: (v: unknown) => boolean | null | undefined;
        desc: string;
    };
    EXPERIMENTAL_SWAP: {
        def: boolean;
        parser: (v: unknown) => boolean | null | undefined;
        desc: string;
    };
    EXPLORER: {
        def: string;
        parser: (v: unknown) => string | null | undefined;
        desc: string;
    };
    EXPLORER_STAGING: {
        def: string;
        parser: (v: unknown) => string | null | undefined;
        desc: string;
    };
    EXPLORER_BETA: {
        def: string;
        parser: (v: unknown) => string | null | undefined;
        desc: string;
    };
    EXPLORER_SATSTACK: {
        def: string;
        parser: (v: unknown) => string | null | undefined;
        desc: string;
    };
    DISABLE_APP_VERSION_REQUIREMENTS: {
        def: boolean;
        parser: (v: unknown) => boolean | null | undefined;
        desc: string;
    };
    FORCE_PROVIDER: {
        def: number;
        parser: (v: any) => number | null | undefined;
        desc: string;
    };
    GET_CALLS_RETRY: {
        def: number;
        parser: (v: any) => number | null | undefined;
        desc: string;
    };
    GET_CALLS_TIMEOUT: {
        def: number;
        parser: (v: any) => number | null | undefined;
        desc: string;
    };
    HIDE_EMPTY_TOKEN_ACCOUNTS: {
        def: boolean;
        parser: (v: unknown) => boolean | null | undefined;
        desc: string;
    };
    KEYCHAIN_OBSERVABLE_RANGE: {
        def: number;
        parser: (v: any) => number | null | undefined;
        desc: string;
    };
    LEDGER_COUNTERVALUES_API: {
        def: string;
        parser: (v: unknown) => string | null | undefined;
        desc: string;
    };
    LEDGER_REST_API_BASE: {
        def: string;
        parser: (v: unknown) => string | null | undefined;
        desc: string;
    };
    LEGACY_KT_SUPPORT_TO_YOUR_OWN_RISK: {
        def: boolean;
        parser: (v: unknown) => boolean | null | undefined;
        desc: string;
    };
    MANAGER_API_BASE: {
        def: string;
        parser: (v: unknown) => string | null | undefined;
        desc: string;
    };
    MANAGER_DEV_MODE: {
        def: boolean;
        parser: (v: unknown) => boolean | null | undefined;
        desc: string;
    };
    MANAGER_INSTALL_DELAY: {
        def: number;
        parser: (v: any) => number | null | undefined;
        desc: string;
    };
    MAX_ACCOUNT_NAME_SIZE: {
        def: number;
        parser: (v: any) => number | null | undefined;
        desc: string;
    };
    MOCK: {
        def: string;
        parser: (v: unknown) => string | null | undefined;
        desc: string;
    };
    MOCK_COUNTERVALUES: {
        def: string;
        parser: (v: unknown) => string | null | undefined;
        desc: string;
    };
    MOCK_SWAP_KYC: {
        def: string;
        parser: (v: unknown) => string | null | undefined;
        desc: string;
    };
    MOCK_SWAP_CHECK_QUOTE: {
        def: string;
        parser: (v: unknown) => string | null | undefined;
        desc: string;
    };
    MOCK_SWAP_WIDGET_BASE_URL: {
        def: string;
        parser: (v: unknown) => string | null | undefined;
        desc: string;
    };
    /**
     * Note: the mocked cryptoassets config and test partner are signed with the
     * Ledger test private key
     */
    MOCK_EXCHANGE_TEST_CONFIG: {
        def: boolean;
        parser: (v: unknown) => boolean | null | undefined;
        desc: string;
    };
    MOCK_REMOTE_LIVE_MANIFEST: {
        def: string;
        parser: (v: unknown) => string | null | undefined;
        desc: string;
    };
    NFT_CURRENCIES: {
        def: string;
        parser: (v: unknown) => string | null | undefined;
        desc: string;
    };
    NFT_ETH_METADATA_SERVICE: {
        def: string;
        parser: (v: unknown) => string | null | undefined;
        desc: string;
    };
    OPERATION_ADDRESSES_LIMIT: {
        def: number;
        parser: (v: any) => number | null | undefined;
        desc: string;
    };
    OPERATION_OPTIMISTIC_RETENTION: {
        def: number;
        parser: (v: any) => number | null | undefined;
        desc: string;
    };
    OPERATION_PAGE_SIZE_INITIAL: {
        def: number;
        parser: (v: any) => number | null | undefined;
        desc: string;
    };
    POLKADOT_ELECTION_STATUS_THRESHOLD: {
        def: number;
        parser: (v: any) => number | null | undefined;
        desc: string;
    };
    SATSTACK: {
        def: boolean;
        parser: (v: unknown) => boolean | null | undefined;
        desc: string;
    };
    SCAN_FOR_INVALID_PATHS: {
        def: boolean;
        parser: (v: unknown) => boolean | null | undefined;
        desc: string;
    };
    SEED: {
        def: string;
        parser: (v: unknown) => string | null | undefined;
        desc: string;
    };
    SHOW_LEGACY_NEW_ACCOUNT: {
        def: boolean;
        parser: (v: unknown) => boolean | null | undefined;
        desc: string;
    };
    SKIP_ONBOARDING: {
        def: boolean;
        parser: (v: unknown) => boolean | null | undefined;
        desc: string;
    };
    SWAP_API_BASE: {
        def: string;
        parser: (v: unknown) => string | null | undefined;
        desc: string;
    };
    SYNC_ALL_INTERVAL: {
        def: number;
        parser: (v: any) => number | null | undefined;
        desc: string;
    };
    SYNC_BOOT_DELAY: {
        def: number;
        parser: (v: any) => number | null | undefined;
        desc: string;
    };
    SYNC_PENDING_INTERVAL: {
        def: number;
        parser: (v: any) => number | null | undefined;
        desc: string;
    };
    SYNC_OUTDATED_CONSIDERED_DELAY: {
        def: number;
        parser: (v: any) => number | null | undefined;
        desc: string;
    };
    SYNC_MAX_CONCURRENT: {
        def: number;
        parser: (v: any) => number | null | undefined;
        desc: string;
    };
    BOT_MAX_CONCURRENT: {
        def: number;
        parser: (v: any) => number | null | undefined;
        desc: string;
    };
    USER_ID: {
        def: string;
        parser: (v: unknown) => string | null | undefined;
        desc: string;
    };
    WALLETCONNECT: {
        def: boolean;
        parser: (v: unknown) => boolean | null | undefined;
        desc: string;
    };
    WITH_DEVICE_POLLING_DELAY: {
        def: number;
        parser: (v: any) => number | null | undefined;
        desc: string;
    };
    ANNOUNCEMENTS_API_URL: {
        def: string;
        parser: (v: unknown) => string | null | undefined;
        desc: string;
    };
    ANNOUNCEMENTS_API_VERSION: {
        def: number;
        parser: (v: any) => number | null | undefined;
        desc: string;
    };
    STATUS_API_URL: {
        def: string;
        parser: (v: unknown) => string | null | undefined;
        desc: string;
    };
    STATUS_API_VERSION: {
        def: number;
        parser: (v: any) => number | null | undefined;
        desc: string;
    };
    TEZOS_MAX_TX_QUERIES: {
        def: number;
        parser: (v: any) => number | null | undefined;
        desc: string;
    };
    PLATFORM_DEBUG: {
        def: boolean;
        parser: (v: unknown) => boolean | null | undefined;
        desc: string;
    };
    PLATFORM_EXPERIMENTAL_APPS: {
        def: boolean;
        parser: (v: unknown) => boolean | null | undefined;
        desc: string;
    };
    PLATFORM_MANIFEST_API_URL: {
        def: string;
        parser: (v: unknown) => string | null | undefined;
        desc: string;
    };
    PLATFORM_MANIFEST_STAGING_API_URL: {
        def: string;
        parser: (v: unknown) => string | null | undefined;
        desc: string;
    };
    PLATFORM_LOCAL_MANIFEST_JSON: {
        def: string;
        parser: (v: unknown) => string | null | undefined;
        desc: string;
    };
    PLATFORM_GLOBAL_CATALOG_API_URL: {
        def: string;
        parser: (v: unknown) => string | null | undefined;
        desc: string;
    };
    PLATFORM_GLOBAL_CATALOG_STAGING_API_URL: {
        def: string;
        parser: (v: unknown) => string | null | undefined;
        desc: string;
    };
    PLATFORM_RAMP_CATALOG_API_URL: {
        def: string;
        parser: (v: unknown) => string | null | undefined;
        desc: string;
    };
    PLATFORM_RAMP_CATALOG_STAGING_API_URL: {
        def: string;
        parser: (v: unknown) => string | null | undefined;
        desc: string;
    };
    PLATFORM_API_URL: {
        def: string;
        parser: (v: unknown) => string | null | undefined;
        desc: string;
    };
    PLATFORM_API_VERSION: {
        def: number;
        parser: (v: any) => number | null | undefined;
        desc: string;
    };
    PLAYWRIGHT_RUN: {
        def: boolean;
        parser: (v: unknown) => boolean | null | undefined;
        desc: string;
    };
    MARKET_API_URL: {
        def: string;
        parser: (v: unknown) => string | null | undefined;
        desc: string;
    };
    USE_LEARN_STAGING_URL: {
        def: boolean;
        parser: (v: unknown) => boolean | null | undefined;
        desc: string;
    };
    DYNAMIC_CAL_BASE_URL: {
        def: string;
        parser: (v: unknown) => string | null | undefined;
        desc: string;
    };
    FEATURE_FLAGS: {
        def: string;
        parser: (v: unknown) => JSONValue | undefined;
        desc: string;
    };
};
declare const env: Record<EnvName, any>;
export declare const getAllEnvNames: () => EnvName[];
export declare const getAllEnvs: () => Env;
export declare const getEnv: <Name extends "ANALYTICS_CONSOLE" | "API_ALGORAND_BLOCKCHAIN_EXPLORER_API_ENDPOINT" | "API_CELO_INDEXER" | "API_CELO_NODE" | "API_COSMOS_BLOCKCHAIN_EXPLORER_API_ENDPOINT" | "API_COSMOS_NODE" | "API_COSMOS_TESTNET_BLOCKCHAIN_EXPLORER_API_ENDPOINT" | "API_COSMOS_TESTNET_NODE" | "API_RIPPLE_RPC" | "API_FILECOIN_ENDPOINT" | "API_POLKADOT_INDEXER" | "API_POLKADOT_SIDECAR" | "ELROND_API_ENDPOINT" | "API_STELLAR_HORIZON" | "API_STELLAR_HORIZON_FETCH_LIMIT" | "API_STELLAR_HORIZON_STATIC_FEE" | "API_OSMOSIS_INDEXER" | "API_OSMOSIS_NODE" | "API_TEZOS_BAKER" | "API_TEZOS_BLOCKCHAIN_EXPLORER_API_ENDPOINT" | "API_TEZOS_TZKT_API" | "API_TEZOS_NODE" | "API_TRONGRID_PROXY" | "API_SOLANA_PROXY" | "SOLANA_VALIDATORS_APP_BASE_URL" | "SOLANA_TX_CONFIRMATION_TIMEOUT" | "API_HEDERA_MIRROR" | "BASE_SOCKET_URL" | "BOT_TIMEOUT_SCAN_ACCOUNTS" | "BOT_SPEC_DEFAULT_TIMEOUT" | "CARDANO_API_ENDPOINT" | "CARDANO_TESTNET_API_ENDPOINT" | "COINAPPS" | "COMPOUND_API" | "COSMOS_GAS_AMPLIFIER" | "COSMOS_GAS_PRICE" | "CRYPTO_ORG_INDEXER" | "CRYPTO_ORG_TESTNET_INDEXER" | "CRYPTO_ORG_RPC_URL" | "CRYPTO_ORG_TESTNET_RPC_URL" | "DEBUG_UTXO_DISPLAY" | "DEBUG_HTTP_RESPONSE" | "DEVICE_CANCEL_APDU_FLUSH_MECHANISM" | "DEVICE_PROXY_URL" | "DEVICE_PROXY_MODEL" | "DISABLE_TRANSACTION_BROADCAST" | "DISABLE_SYNC_TOKEN" | "ETHEREUM_GAS_LIMIT_AMPLIFIER" | "EXPERIMENTAL_BLE" | "EXPERIMENTAL_CURRENCIES" | "EXPERIMENTAL_EIP712" | "EXPERIMENTAL_EXPLORERS" | "EXPERIMENTAL_FALLBACK_APDU_LISTAPPS" | "EXPERIMENTAL_LANGUAGES" | "EXPERIMENTAL_MANAGER" | "EXPERIMENTAL_ROI_CALCULATION" | "EXPERIMENTAL_SEND_MAX" | "EXPERIMENTAL_USB" | "EXPERIMENTAL_SWAP" | "EXPLORER" | "EXPLORER_STAGING" | "EXPLORER_BETA" | "EXPLORER_SATSTACK" | "DISABLE_APP_VERSION_REQUIREMENTS" | "FORCE_PROVIDER" | "GET_CALLS_RETRY" | "GET_CALLS_TIMEOUT" | "HIDE_EMPTY_TOKEN_ACCOUNTS" | "KEYCHAIN_OBSERVABLE_RANGE" | "LEDGER_COUNTERVALUES_API" | "LEDGER_REST_API_BASE" | "LEGACY_KT_SUPPORT_TO_YOUR_OWN_RISK" | "MANAGER_API_BASE" | "MANAGER_DEV_MODE" | "MANAGER_INSTALL_DELAY" | "MAX_ACCOUNT_NAME_SIZE" | "MOCK" | "MOCK_COUNTERVALUES" | "MOCK_SWAP_KYC" | "MOCK_SWAP_CHECK_QUOTE" | "MOCK_SWAP_WIDGET_BASE_URL" | "MOCK_EXCHANGE_TEST_CONFIG" | "MOCK_REMOTE_LIVE_MANIFEST" | "NFT_CURRENCIES" | "NFT_ETH_METADATA_SERVICE" | "OPERATION_ADDRESSES_LIMIT" | "OPERATION_OPTIMISTIC_RETENTION" | "OPERATION_PAGE_SIZE_INITIAL" | "POLKADOT_ELECTION_STATUS_THRESHOLD" | "SATSTACK" | "SCAN_FOR_INVALID_PATHS" | "SEED" | "SHOW_LEGACY_NEW_ACCOUNT" | "SKIP_ONBOARDING" | "SWAP_API_BASE" | "SYNC_ALL_INTERVAL" | "SYNC_BOOT_DELAY" | "SYNC_PENDING_INTERVAL" | "SYNC_OUTDATED_CONSIDERED_DELAY" | "SYNC_MAX_CONCURRENT" | "BOT_MAX_CONCURRENT" | "USER_ID" | "WALLETCONNECT" | "WITH_DEVICE_POLLING_DELAY" | "ANNOUNCEMENTS_API_URL" | "ANNOUNCEMENTS_API_VERSION" | "STATUS_API_URL" | "STATUS_API_VERSION" | "TEZOS_MAX_TX_QUERIES" | "PLATFORM_DEBUG" | "PLATFORM_EXPERIMENTAL_APPS" | "PLATFORM_MANIFEST_API_URL" | "PLATFORM_MANIFEST_STAGING_API_URL" | "PLATFORM_LOCAL_MANIFEST_JSON" | "PLATFORM_GLOBAL_CATALOG_API_URL" | "PLATFORM_GLOBAL_CATALOG_STAGING_API_URL" | "PLATFORM_RAMP_CATALOG_API_URL" | "PLATFORM_RAMP_CATALOG_STAGING_API_URL" | "PLATFORM_API_URL" | "PLATFORM_API_VERSION" | "PLAYWRIGHT_RUN" | "MARKET_API_URL" | "USE_LEARN_STAGING_URL" | "DYNAMIC_CAL_BASE_URL" | "FEATURE_FLAGS">(name: Name) => EnvValue<Name>;
export declare const getEnvDefault: <Name extends "ANALYTICS_CONSOLE" | "API_ALGORAND_BLOCKCHAIN_EXPLORER_API_ENDPOINT" | "API_CELO_INDEXER" | "API_CELO_NODE" | "API_COSMOS_BLOCKCHAIN_EXPLORER_API_ENDPOINT" | "API_COSMOS_NODE" | "API_COSMOS_TESTNET_BLOCKCHAIN_EXPLORER_API_ENDPOINT" | "API_COSMOS_TESTNET_NODE" | "API_RIPPLE_RPC" | "API_FILECOIN_ENDPOINT" | "API_POLKADOT_INDEXER" | "API_POLKADOT_SIDECAR" | "ELROND_API_ENDPOINT" | "API_STELLAR_HORIZON" | "API_STELLAR_HORIZON_FETCH_LIMIT" | "API_STELLAR_HORIZON_STATIC_FEE" | "API_OSMOSIS_INDEXER" | "API_OSMOSIS_NODE" | "API_TEZOS_BAKER" | "API_TEZOS_BLOCKCHAIN_EXPLORER_API_ENDPOINT" | "API_TEZOS_TZKT_API" | "API_TEZOS_NODE" | "API_TRONGRID_PROXY" | "API_SOLANA_PROXY" | "SOLANA_VALIDATORS_APP_BASE_URL" | "SOLANA_TX_CONFIRMATION_TIMEOUT" | "API_HEDERA_MIRROR" | "BASE_SOCKET_URL" | "BOT_TIMEOUT_SCAN_ACCOUNTS" | "BOT_SPEC_DEFAULT_TIMEOUT" | "CARDANO_API_ENDPOINT" | "CARDANO_TESTNET_API_ENDPOINT" | "COINAPPS" | "COMPOUND_API" | "COSMOS_GAS_AMPLIFIER" | "COSMOS_GAS_PRICE" | "CRYPTO_ORG_INDEXER" | "CRYPTO_ORG_TESTNET_INDEXER" | "CRYPTO_ORG_RPC_URL" | "CRYPTO_ORG_TESTNET_RPC_URL" | "DEBUG_UTXO_DISPLAY" | "DEBUG_HTTP_RESPONSE" | "DEVICE_CANCEL_APDU_FLUSH_MECHANISM" | "DEVICE_PROXY_URL" | "DEVICE_PROXY_MODEL" | "DISABLE_TRANSACTION_BROADCAST" | "DISABLE_SYNC_TOKEN" | "ETHEREUM_GAS_LIMIT_AMPLIFIER" | "EXPERIMENTAL_BLE" | "EXPERIMENTAL_CURRENCIES" | "EXPERIMENTAL_EIP712" | "EXPERIMENTAL_EXPLORERS" | "EXPERIMENTAL_FALLBACK_APDU_LISTAPPS" | "EXPERIMENTAL_LANGUAGES" | "EXPERIMENTAL_MANAGER" | "EXPERIMENTAL_ROI_CALCULATION" | "EXPERIMENTAL_SEND_MAX" | "EXPERIMENTAL_USB" | "EXPERIMENTAL_SWAP" | "EXPLORER" | "EXPLORER_STAGING" | "EXPLORER_BETA" | "EXPLORER_SATSTACK" | "DISABLE_APP_VERSION_REQUIREMENTS" | "FORCE_PROVIDER" | "GET_CALLS_RETRY" | "GET_CALLS_TIMEOUT" | "HIDE_EMPTY_TOKEN_ACCOUNTS" | "KEYCHAIN_OBSERVABLE_RANGE" | "LEDGER_COUNTERVALUES_API" | "LEDGER_REST_API_BASE" | "LEGACY_KT_SUPPORT_TO_YOUR_OWN_RISK" | "MANAGER_API_BASE" | "MANAGER_DEV_MODE" | "MANAGER_INSTALL_DELAY" | "MAX_ACCOUNT_NAME_SIZE" | "MOCK" | "MOCK_COUNTERVALUES" | "MOCK_SWAP_KYC" | "MOCK_SWAP_CHECK_QUOTE" | "MOCK_SWAP_WIDGET_BASE_URL" | "MOCK_EXCHANGE_TEST_CONFIG" | "MOCK_REMOTE_LIVE_MANIFEST" | "NFT_CURRENCIES" | "NFT_ETH_METADATA_SERVICE" | "OPERATION_ADDRESSES_LIMIT" | "OPERATION_OPTIMISTIC_RETENTION" | "OPERATION_PAGE_SIZE_INITIAL" | "POLKADOT_ELECTION_STATUS_THRESHOLD" | "SATSTACK" | "SCAN_FOR_INVALID_PATHS" | "SEED" | "SHOW_LEGACY_NEW_ACCOUNT" | "SKIP_ONBOARDING" | "SWAP_API_BASE" | "SYNC_ALL_INTERVAL" | "SYNC_BOOT_DELAY" | "SYNC_PENDING_INTERVAL" | "SYNC_OUTDATED_CONSIDERED_DELAY" | "SYNC_MAX_CONCURRENT" | "BOT_MAX_CONCURRENT" | "USER_ID" | "WALLETCONNECT" | "WITH_DEVICE_POLLING_DELAY" | "ANNOUNCEMENTS_API_URL" | "ANNOUNCEMENTS_API_VERSION" | "STATUS_API_URL" | "STATUS_API_VERSION" | "TEZOS_MAX_TX_QUERIES" | "PLATFORM_DEBUG" | "PLATFORM_EXPERIMENTAL_APPS" | "PLATFORM_MANIFEST_API_URL" | "PLATFORM_MANIFEST_STAGING_API_URL" | "PLATFORM_LOCAL_MANIFEST_JSON" | "PLATFORM_GLOBAL_CATALOG_API_URL" | "PLATFORM_GLOBAL_CATALOG_STAGING_API_URL" | "PLATFORM_RAMP_CATALOG_API_URL" | "PLATFORM_RAMP_CATALOG_STAGING_API_URL" | "PLATFORM_API_URL" | "PLATFORM_API_VERSION" | "PLAYWRIGHT_RUN" | "MARKET_API_URL" | "USE_LEARN_STAGING_URL" | "DYNAMIC_CAL_BASE_URL" | "FEATURE_FLAGS">(name: Name) => EnvValue<Name>;
export declare const isEnvDefault: <Name extends "ANALYTICS_CONSOLE" | "API_ALGORAND_BLOCKCHAIN_EXPLORER_API_ENDPOINT" | "API_CELO_INDEXER" | "API_CELO_NODE" | "API_COSMOS_BLOCKCHAIN_EXPLORER_API_ENDPOINT" | "API_COSMOS_NODE" | "API_COSMOS_TESTNET_BLOCKCHAIN_EXPLORER_API_ENDPOINT" | "API_COSMOS_TESTNET_NODE" | "API_RIPPLE_RPC" | "API_FILECOIN_ENDPOINT" | "API_POLKADOT_INDEXER" | "API_POLKADOT_SIDECAR" | "ELROND_API_ENDPOINT" | "API_STELLAR_HORIZON" | "API_STELLAR_HORIZON_FETCH_LIMIT" | "API_STELLAR_HORIZON_STATIC_FEE" | "API_OSMOSIS_INDEXER" | "API_OSMOSIS_NODE" | "API_TEZOS_BAKER" | "API_TEZOS_BLOCKCHAIN_EXPLORER_API_ENDPOINT" | "API_TEZOS_TZKT_API" | "API_TEZOS_NODE" | "API_TRONGRID_PROXY" | "API_SOLANA_PROXY" | "SOLANA_VALIDATORS_APP_BASE_URL" | "SOLANA_TX_CONFIRMATION_TIMEOUT" | "API_HEDERA_MIRROR" | "BASE_SOCKET_URL" | "BOT_TIMEOUT_SCAN_ACCOUNTS" | "BOT_SPEC_DEFAULT_TIMEOUT" | "CARDANO_API_ENDPOINT" | "CARDANO_TESTNET_API_ENDPOINT" | "COINAPPS" | "COMPOUND_API" | "COSMOS_GAS_AMPLIFIER" | "COSMOS_GAS_PRICE" | "CRYPTO_ORG_INDEXER" | "CRYPTO_ORG_TESTNET_INDEXER" | "CRYPTO_ORG_RPC_URL" | "CRYPTO_ORG_TESTNET_RPC_URL" | "DEBUG_UTXO_DISPLAY" | "DEBUG_HTTP_RESPONSE" | "DEVICE_CANCEL_APDU_FLUSH_MECHANISM" | "DEVICE_PROXY_URL" | "DEVICE_PROXY_MODEL" | "DISABLE_TRANSACTION_BROADCAST" | "DISABLE_SYNC_TOKEN" | "ETHEREUM_GAS_LIMIT_AMPLIFIER" | "EXPERIMENTAL_BLE" | "EXPERIMENTAL_CURRENCIES" | "EXPERIMENTAL_EIP712" | "EXPERIMENTAL_EXPLORERS" | "EXPERIMENTAL_FALLBACK_APDU_LISTAPPS" | "EXPERIMENTAL_LANGUAGES" | "EXPERIMENTAL_MANAGER" | "EXPERIMENTAL_ROI_CALCULATION" | "EXPERIMENTAL_SEND_MAX" | "EXPERIMENTAL_USB" | "EXPERIMENTAL_SWAP" | "EXPLORER" | "EXPLORER_STAGING" | "EXPLORER_BETA" | "EXPLORER_SATSTACK" | "DISABLE_APP_VERSION_REQUIREMENTS" | "FORCE_PROVIDER" | "GET_CALLS_RETRY" | "GET_CALLS_TIMEOUT" | "HIDE_EMPTY_TOKEN_ACCOUNTS" | "KEYCHAIN_OBSERVABLE_RANGE" | "LEDGER_COUNTERVALUES_API" | "LEDGER_REST_API_BASE" | "LEGACY_KT_SUPPORT_TO_YOUR_OWN_RISK" | "MANAGER_API_BASE" | "MANAGER_DEV_MODE" | "MANAGER_INSTALL_DELAY" | "MAX_ACCOUNT_NAME_SIZE" | "MOCK" | "MOCK_COUNTERVALUES" | "MOCK_SWAP_KYC" | "MOCK_SWAP_CHECK_QUOTE" | "MOCK_SWAP_WIDGET_BASE_URL" | "MOCK_EXCHANGE_TEST_CONFIG" | "MOCK_REMOTE_LIVE_MANIFEST" | "NFT_CURRENCIES" | "NFT_ETH_METADATA_SERVICE" | "OPERATION_ADDRESSES_LIMIT" | "OPERATION_OPTIMISTIC_RETENTION" | "OPERATION_PAGE_SIZE_INITIAL" | "POLKADOT_ELECTION_STATUS_THRESHOLD" | "SATSTACK" | "SCAN_FOR_INVALID_PATHS" | "SEED" | "SHOW_LEGACY_NEW_ACCOUNT" | "SKIP_ONBOARDING" | "SWAP_API_BASE" | "SYNC_ALL_INTERVAL" | "SYNC_BOOT_DELAY" | "SYNC_PENDING_INTERVAL" | "SYNC_OUTDATED_CONSIDERED_DELAY" | "SYNC_MAX_CONCURRENT" | "BOT_MAX_CONCURRENT" | "USER_ID" | "WALLETCONNECT" | "WITH_DEVICE_POLLING_DELAY" | "ANNOUNCEMENTS_API_URL" | "ANNOUNCEMENTS_API_VERSION" | "STATUS_API_URL" | "STATUS_API_VERSION" | "TEZOS_MAX_TX_QUERIES" | "PLATFORM_DEBUG" | "PLATFORM_EXPERIMENTAL_APPS" | "PLATFORM_MANIFEST_API_URL" | "PLATFORM_MANIFEST_STAGING_API_URL" | "PLATFORM_LOCAL_MANIFEST_JSON" | "PLATFORM_GLOBAL_CATALOG_API_URL" | "PLATFORM_GLOBAL_CATALOG_STAGING_API_URL" | "PLATFORM_RAMP_CATALOG_API_URL" | "PLATFORM_RAMP_CATALOG_STAGING_API_URL" | "PLATFORM_API_URL" | "PLATFORM_API_VERSION" | "PLAYWRIGHT_RUN" | "MARKET_API_URL" | "USE_LEARN_STAGING_URL" | "DYNAMIC_CAL_BASE_URL" | "FEATURE_FLAGS">(name: Name) => boolean;
export declare const getEnvDesc: <Name extends "ANALYTICS_CONSOLE" | "API_ALGORAND_BLOCKCHAIN_EXPLORER_API_ENDPOINT" | "API_CELO_INDEXER" | "API_CELO_NODE" | "API_COSMOS_BLOCKCHAIN_EXPLORER_API_ENDPOINT" | "API_COSMOS_NODE" | "API_COSMOS_TESTNET_BLOCKCHAIN_EXPLORER_API_ENDPOINT" | "API_COSMOS_TESTNET_NODE" | "API_RIPPLE_RPC" | "API_FILECOIN_ENDPOINT" | "API_POLKADOT_INDEXER" | "API_POLKADOT_SIDECAR" | "ELROND_API_ENDPOINT" | "API_STELLAR_HORIZON" | "API_STELLAR_HORIZON_FETCH_LIMIT" | "API_STELLAR_HORIZON_STATIC_FEE" | "API_OSMOSIS_INDEXER" | "API_OSMOSIS_NODE" | "API_TEZOS_BAKER" | "API_TEZOS_BLOCKCHAIN_EXPLORER_API_ENDPOINT" | "API_TEZOS_TZKT_API" | "API_TEZOS_NODE" | "API_TRONGRID_PROXY" | "API_SOLANA_PROXY" | "SOLANA_VALIDATORS_APP_BASE_URL" | "SOLANA_TX_CONFIRMATION_TIMEOUT" | "API_HEDERA_MIRROR" | "BASE_SOCKET_URL" | "BOT_TIMEOUT_SCAN_ACCOUNTS" | "BOT_SPEC_DEFAULT_TIMEOUT" | "CARDANO_API_ENDPOINT" | "CARDANO_TESTNET_API_ENDPOINT" | "COINAPPS" | "COMPOUND_API" | "COSMOS_GAS_AMPLIFIER" | "COSMOS_GAS_PRICE" | "CRYPTO_ORG_INDEXER" | "CRYPTO_ORG_TESTNET_INDEXER" | "CRYPTO_ORG_RPC_URL" | "CRYPTO_ORG_TESTNET_RPC_URL" | "DEBUG_UTXO_DISPLAY" | "DEBUG_HTTP_RESPONSE" | "DEVICE_CANCEL_APDU_FLUSH_MECHANISM" | "DEVICE_PROXY_URL" | "DEVICE_PROXY_MODEL" | "DISABLE_TRANSACTION_BROADCAST" | "DISABLE_SYNC_TOKEN" | "ETHEREUM_GAS_LIMIT_AMPLIFIER" | "EXPERIMENTAL_BLE" | "EXPERIMENTAL_CURRENCIES" | "EXPERIMENTAL_EIP712" | "EXPERIMENTAL_EXPLORERS" | "EXPERIMENTAL_FALLBACK_APDU_LISTAPPS" | "EXPERIMENTAL_LANGUAGES" | "EXPERIMENTAL_MANAGER" | "EXPERIMENTAL_ROI_CALCULATION" | "EXPERIMENTAL_SEND_MAX" | "EXPERIMENTAL_USB" | "EXPERIMENTAL_SWAP" | "EXPLORER" | "EXPLORER_STAGING" | "EXPLORER_BETA" | "EXPLORER_SATSTACK" | "DISABLE_APP_VERSION_REQUIREMENTS" | "FORCE_PROVIDER" | "GET_CALLS_RETRY" | "GET_CALLS_TIMEOUT" | "HIDE_EMPTY_TOKEN_ACCOUNTS" | "KEYCHAIN_OBSERVABLE_RANGE" | "LEDGER_COUNTERVALUES_API" | "LEDGER_REST_API_BASE" | "LEGACY_KT_SUPPORT_TO_YOUR_OWN_RISK" | "MANAGER_API_BASE" | "MANAGER_DEV_MODE" | "MANAGER_INSTALL_DELAY" | "MAX_ACCOUNT_NAME_SIZE" | "MOCK" | "MOCK_COUNTERVALUES" | "MOCK_SWAP_KYC" | "MOCK_SWAP_CHECK_QUOTE" | "MOCK_SWAP_WIDGET_BASE_URL" | "MOCK_EXCHANGE_TEST_CONFIG" | "MOCK_REMOTE_LIVE_MANIFEST" | "NFT_CURRENCIES" | "NFT_ETH_METADATA_SERVICE" | "OPERATION_ADDRESSES_LIMIT" | "OPERATION_OPTIMISTIC_RETENTION" | "OPERATION_PAGE_SIZE_INITIAL" | "POLKADOT_ELECTION_STATUS_THRESHOLD" | "SATSTACK" | "SCAN_FOR_INVALID_PATHS" | "SEED" | "SHOW_LEGACY_NEW_ACCOUNT" | "SKIP_ONBOARDING" | "SWAP_API_BASE" | "SYNC_ALL_INTERVAL" | "SYNC_BOOT_DELAY" | "SYNC_PENDING_INTERVAL" | "SYNC_OUTDATED_CONSIDERED_DELAY" | "SYNC_MAX_CONCURRENT" | "BOT_MAX_CONCURRENT" | "USER_ID" | "WALLETCONNECT" | "WITH_DEVICE_POLLING_DELAY" | "ANNOUNCEMENTS_API_URL" | "ANNOUNCEMENTS_API_VERSION" | "STATUS_API_URL" | "STATUS_API_VERSION" | "TEZOS_MAX_TX_QUERIES" | "PLATFORM_DEBUG" | "PLATFORM_EXPERIMENTAL_APPS" | "PLATFORM_MANIFEST_API_URL" | "PLATFORM_MANIFEST_STAGING_API_URL" | "PLATFORM_LOCAL_MANIFEST_JSON" | "PLATFORM_GLOBAL_CATALOG_API_URL" | "PLATFORM_GLOBAL_CATALOG_STAGING_API_URL" | "PLATFORM_RAMP_CATALOG_API_URL" | "PLATFORM_RAMP_CATALOG_STAGING_API_URL" | "PLATFORM_API_URL" | "PLATFORM_API_VERSION" | "PLAYWRIGHT_RUN" | "MARKET_API_URL" | "USE_LEARN_STAGING_URL" | "DYNAMIC_CAL_BASE_URL" | "FEATURE_FLAGS">(name: Name) => string;
declare type ChangeValue<T extends EnvName> = {
    name: EnvName;
    value: EnvValue<T>;
    oldValue: EnvValue<T>;
};
export declare const changes: Subject<ChangeValue<any>>;
export declare const setEnv: <Name extends "ANALYTICS_CONSOLE" | "API_ALGORAND_BLOCKCHAIN_EXPLORER_API_ENDPOINT" | "API_CELO_INDEXER" | "API_CELO_NODE" | "API_COSMOS_BLOCKCHAIN_EXPLORER_API_ENDPOINT" | "API_COSMOS_NODE" | "API_COSMOS_TESTNET_BLOCKCHAIN_EXPLORER_API_ENDPOINT" | "API_COSMOS_TESTNET_NODE" | "API_RIPPLE_RPC" | "API_FILECOIN_ENDPOINT" | "API_POLKADOT_INDEXER" | "API_POLKADOT_SIDECAR" | "ELROND_API_ENDPOINT" | "API_STELLAR_HORIZON" | "API_STELLAR_HORIZON_FETCH_LIMIT" | "API_STELLAR_HORIZON_STATIC_FEE" | "API_OSMOSIS_INDEXER" | "API_OSMOSIS_NODE" | "API_TEZOS_BAKER" | "API_TEZOS_BLOCKCHAIN_EXPLORER_API_ENDPOINT" | "API_TEZOS_TZKT_API" | "API_TEZOS_NODE" | "API_TRONGRID_PROXY" | "API_SOLANA_PROXY" | "SOLANA_VALIDATORS_APP_BASE_URL" | "SOLANA_TX_CONFIRMATION_TIMEOUT" | "API_HEDERA_MIRROR" | "BASE_SOCKET_URL" | "BOT_TIMEOUT_SCAN_ACCOUNTS" | "BOT_SPEC_DEFAULT_TIMEOUT" | "CARDANO_API_ENDPOINT" | "CARDANO_TESTNET_API_ENDPOINT" | "COINAPPS" | "COMPOUND_API" | "COSMOS_GAS_AMPLIFIER" | "COSMOS_GAS_PRICE" | "CRYPTO_ORG_INDEXER" | "CRYPTO_ORG_TESTNET_INDEXER" | "CRYPTO_ORG_RPC_URL" | "CRYPTO_ORG_TESTNET_RPC_URL" | "DEBUG_UTXO_DISPLAY" | "DEBUG_HTTP_RESPONSE" | "DEVICE_CANCEL_APDU_FLUSH_MECHANISM" | "DEVICE_PROXY_URL" | "DEVICE_PROXY_MODEL" | "DISABLE_TRANSACTION_BROADCAST" | "DISABLE_SYNC_TOKEN" | "ETHEREUM_GAS_LIMIT_AMPLIFIER" | "EXPERIMENTAL_BLE" | "EXPERIMENTAL_CURRENCIES" | "EXPERIMENTAL_EIP712" | "EXPERIMENTAL_EXPLORERS" | "EXPERIMENTAL_FALLBACK_APDU_LISTAPPS" | "EXPERIMENTAL_LANGUAGES" | "EXPERIMENTAL_MANAGER" | "EXPERIMENTAL_ROI_CALCULATION" | "EXPERIMENTAL_SEND_MAX" | "EXPERIMENTAL_USB" | "EXPERIMENTAL_SWAP" | "EXPLORER" | "EXPLORER_STAGING" | "EXPLORER_BETA" | "EXPLORER_SATSTACK" | "DISABLE_APP_VERSION_REQUIREMENTS" | "FORCE_PROVIDER" | "GET_CALLS_RETRY" | "GET_CALLS_TIMEOUT" | "HIDE_EMPTY_TOKEN_ACCOUNTS" | "KEYCHAIN_OBSERVABLE_RANGE" | "LEDGER_COUNTERVALUES_API" | "LEDGER_REST_API_BASE" | "LEGACY_KT_SUPPORT_TO_YOUR_OWN_RISK" | "MANAGER_API_BASE" | "MANAGER_DEV_MODE" | "MANAGER_INSTALL_DELAY" | "MAX_ACCOUNT_NAME_SIZE" | "MOCK" | "MOCK_COUNTERVALUES" | "MOCK_SWAP_KYC" | "MOCK_SWAP_CHECK_QUOTE" | "MOCK_SWAP_WIDGET_BASE_URL" | "MOCK_EXCHANGE_TEST_CONFIG" | "MOCK_REMOTE_LIVE_MANIFEST" | "NFT_CURRENCIES" | "NFT_ETH_METADATA_SERVICE" | "OPERATION_ADDRESSES_LIMIT" | "OPERATION_OPTIMISTIC_RETENTION" | "OPERATION_PAGE_SIZE_INITIAL" | "POLKADOT_ELECTION_STATUS_THRESHOLD" | "SATSTACK" | "SCAN_FOR_INVALID_PATHS" | "SEED" | "SHOW_LEGACY_NEW_ACCOUNT" | "SKIP_ONBOARDING" | "SWAP_API_BASE" | "SYNC_ALL_INTERVAL" | "SYNC_BOOT_DELAY" | "SYNC_PENDING_INTERVAL" | "SYNC_OUTDATED_CONSIDERED_DELAY" | "SYNC_MAX_CONCURRENT" | "BOT_MAX_CONCURRENT" | "USER_ID" | "WALLETCONNECT" | "WITH_DEVICE_POLLING_DELAY" | "ANNOUNCEMENTS_API_URL" | "ANNOUNCEMENTS_API_VERSION" | "STATUS_API_URL" | "STATUS_API_VERSION" | "TEZOS_MAX_TX_QUERIES" | "PLATFORM_DEBUG" | "PLATFORM_EXPERIMENTAL_APPS" | "PLATFORM_MANIFEST_API_URL" | "PLATFORM_MANIFEST_STAGING_API_URL" | "PLATFORM_LOCAL_MANIFEST_JSON" | "PLATFORM_GLOBAL_CATALOG_API_URL" | "PLATFORM_GLOBAL_CATALOG_STAGING_API_URL" | "PLATFORM_RAMP_CATALOG_API_URL" | "PLATFORM_RAMP_CATALOG_STAGING_API_URL" | "PLATFORM_API_URL" | "PLATFORM_API_VERSION" | "PLAYWRIGHT_RUN" | "MARKET_API_URL" | "USE_LEARN_STAGING_URL" | "DYNAMIC_CAL_BASE_URL" | "FEATURE_FLAGS">(name: Name, value: EnvValue<Name>) => void;
export declare const setEnvUnsafe: (name: EnvName, unsafeValue: unknown) => boolean;
export {};
//# sourceMappingURL=env.d.ts.map