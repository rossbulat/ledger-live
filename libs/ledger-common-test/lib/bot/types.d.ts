import { BigNumber } from "bignumber.js";
import Transport from "@ledgerhq/hw-transport";
import type { TransactionCommon, TransactionStatusCommon } from "@ledgerhq/types-live";
import type { DeviceModelId } from "@ledgerhq/devices";
import type { AppCandidate } from "../load/speculos";
import { Account, AccountBridge, AccountRaw, Operation, SignedOperation, SignOperationEvent } from "@ledgerhq/types-live";
import type { CryptoCurrency } from "@ledgerhq/types-cryptoassets";
export type { AppCandidate };
export declare type DeviceActionEvent = {
    text: string;
    x: number;
    y: number;
};
export declare type TransactionTestInput<T> = {
    account: Account;
    accountBeforeTransaction: Account;
    transaction: T;
    status: TransactionStatusCommon;
    optimisticOperation: Operation;
    operation: Operation;
};
export declare type TransactionDestinationTestInput<T> = {
    sendingAccount: Account;
    sendingOperation: Operation;
    destinationBeforeTransaction: Account;
    operation: Operation;
    destination: Account;
    transaction: T;
    status: TransactionStatusCommon;
};
export declare type DeviceActionArg<T extends TransactionCommon, S> = {
    appCandidate: AppCandidate;
    account: Account;
    transaction: T;
    status: TransactionStatusCommon;
    transport: Transport & {
        button: (arg0: string) => void;
    };
    event: DeviceActionEvent;
    state: S;
};
export declare type DeviceAction<T extends TransactionCommon, S> = (arg0: DeviceActionArg<T, S>) => S | null | undefined;
export declare type TransactionArg<T extends TransactionCommon> = {
    appCandidate: AppCandidate;
    account: Account;
    siblings: Account[];
    bridge: AccountBridge<T>;
    maxSpendable: BigNumber;
    preloadedData: any;
};
export declare type TransactionRes<T extends TransactionCommon> = {
    transaction: T;
    updates: Array<Partial<T> | null | undefined>;
    destination?: Account;
};
export declare type MutationSpec<T extends TransactionCommon> = {
    name: string;
    maxRun: number;
    transaction: (arg: TransactionArg<T>) => TransactionRes<T>;
    recoverBadTransactionStatus?: (arg0: {
        transaction: T;
        status: TransactionStatusCommon;
        account: Account;
        bridge: AccountBridge<T>;
    }) => T | null | undefined;
    expectStatusWarnings?: (arg0: {
        transaction: T;
        status: TransactionStatusCommon;
        account: Account;
        bridge: AccountBridge<T>;
    }) => {
        [_: string]: Error;
    } | undefined;
    deviceAction?: DeviceAction<T, any>;
    testTimeout?: number;
    test?: (input: TransactionTestInput<T>) => void;
    testDestination?: (input: TransactionDestinationTestInput<T>) => void;
};
export declare type AppSpec<T extends TransactionCommon> = {
    disabled?: boolean;
    name: string;
    currency: CryptoCurrency;
    testTimeout?: number;
    scanAccountsRetries?: number;
    multipleRuns?: number;
    crossAccountFrequency?: number;
    dependency?: string;
    appQuery: {
        model?: DeviceModelId;
        appName?: string;
        firmware?: string;
        appVersion?: string;
    };
    mutations: MutationSpec<T>[];
    transactionCheck?: (arg: TransactionArg<T>) => void;
    test?: (arg0: TransactionTestInput<T>) => void;
    genericDeviceAction: DeviceAction<T, any>;
    minViableAmount?: BigNumber;
    skipMutationsTimeout?: number;
    allowEmptyAccounts?: boolean;
};
export declare type SpecReport<T extends TransactionCommon> = {
    spec: AppSpec<T>;
    appPath?: string;
    scanDuration?: number;
    preloadDuration?: number;
    accountsBefore?: Account[];
    accountsAfter?: Account[];
    mutations?: MutationReport<T>[];
    fatalError?: Error;
    hintWarnings: string[];
    skipMutationsTimeoutReached: boolean;
};
export declare type MutationReport<T extends TransactionCommon> = {
    resyncAccountsDuration: number;
    spec: AppSpec<T>;
    appCandidate: AppCandidate;
    account?: Account;
    maxSpendable?: BigNumber;
    unavailableMutationReasons?: Array<{
        error: Error;
        mutation: MutationSpec<T>;
    }>;
    mutation?: MutationSpec<T>;
    mutationTime?: number;
    destination?: Account;
    transaction?: T;
    status?: TransactionStatusCommon;
    statusTime?: number;
    recoveredFromTransactionStatus?: {
        transaction: T;
        status: TransactionStatusCommon;
    };
    latestSignOperationEvent?: SignOperationEvent;
    signedOperation?: SignedOperation;
    signedTime?: number;
    optimisticOperation?: Operation;
    broadcastedTime?: number;
    operation?: Operation;
    confirmedTime?: number;
    finalAccount?: Account;
    testDuration?: number;
    destinationConfirmedTime?: number;
    finalDestination?: Account;
    finalDestinationOperation?: Operation;
    testDestinationDuration?: number;
    error?: Error;
    errorTime?: number;
    hintWarnings: string[];
};
export declare type MinimalSerializedMutationReport = {
    appCandidate: AppCandidate;
    mutationName: string | undefined;
    accountId: string | undefined;
    destinationId: string | undefined;
    operationId: string | undefined;
    error: string | undefined;
};
export declare type MinimalSerializedSpecReport = {
    specName: string;
    accounts: AccountRaw[] | undefined;
    fatalError: string | undefined;
    mutations: MinimalSerializedMutationReport[] | undefined;
    existingMutationNames: string[];
    hintWarnings: string[];
};
export declare type MinimalSerializedReport = {
    results: Array<MinimalSerializedSpecReport>;
    environment: string | undefined;
    seedHash: string;
};
//# sourceMappingURL=types.d.ts.map