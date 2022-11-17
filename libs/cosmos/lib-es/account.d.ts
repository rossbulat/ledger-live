import { CosmosOperation, CosmosExtraTxInfo, CosmosAccount } from "./types";
import type { Unit } from "@ledgerhq/types-cryptoassets";
declare function formatOperationSpecifics(op: CosmosOperation, unit: Unit | null | undefined): string;
export declare function formatAccountSpecifics(account: CosmosAccount): string;
export declare function fromOperationExtraRaw(extra: Record<string, any> | null | undefined): CosmosExtraTxInfo | Record<string, any> | null | undefined;
export declare function toOperationExtraRaw(extra: Record<string, any> | null | undefined): CosmosExtraTxInfo | Record<string, any> | null | undefined;
declare const _default: {
    formatAccountSpecifics: typeof formatAccountSpecifics;
    formatOperationSpecifics: typeof formatOperationSpecifics;
    fromOperationExtraRaw: typeof fromOperationExtraRaw;
    toOperationExtraRaw: typeof toOperationExtraRaw;
};
export default _default;
//# sourceMappingURL=account.d.ts.map