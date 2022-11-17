import { BigNumber } from "bignumber.js";
export declare type SwapOperation = {
    provider: string;
    swapId: string;
    status: string;
    receiverAccountId: string;
    tokenId?: string;
    operationId: string;
    fromAmount: BigNumber;
    toAmount: BigNumber;
};
export declare type SwapOperationRaw = {
    provider: string;
    swapId: string;
    status: string;
    receiverAccountId: string;
    tokenId?: string;
    operationId: string;
    fromAmount: string;
    toAmount: string;
};
//# sourceMappingURL=types.d.ts.map