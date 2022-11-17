import BigNumber from "bignumber.js";
import { CryptoCurrency } from "@ledgerhq/types-cryptoassets";
import { Operation } from "@ledgerhq/types-live";
export declare class CosmosAPI {
    protected _defaultEndpoint: string;
    protected _namespace: string;
    getAccountInfo: (address: string, currency: CryptoCurrency) => Promise<any>;
    getAccount: (address: string) => Promise<{
        address: string;
        accountNumber: number;
        sequence: number;
    }>;
    getChainId: () => Promise<string>;
    getHeight: () => Promise<number>;
    getAllBalances: (address: string, currency: CryptoCurrency) => Promise<BigNumber>;
    getDelegations: (address: string, currency: CryptoCurrency) => Promise<any>;
    getRedelegations: (address: string) => Promise<any>;
    getUnbondings: (address: string) => Promise<any>;
    getWithdrawAddress: (address: string) => Promise<string>;
    getTransactions: (address: string) => Promise<any>;
    isValidRecipent: (address: string) => Promise<boolean>;
    simulate: (tx_bytes: Array<any>) => Promise<BigNumber>;
    broadcast: ({ signedOperation: { operation, signature }, }: {
        signedOperation: {
            operation: any;
            signature: any;
        };
    }) => Promise<Operation>;
}
export declare const defaultCosmosAPI: CosmosAPI;
//# sourceMappingURL=Cosmos.d.ts.map