import type { Operation } from "@ledgerhq/types-live";
import { formatAccountSpecifics } from "../account";
import { CosmosExtraTxInfo } from "../types";
declare function formatOperationSpecifics(op: Operation): string;
export declare function fromOperationExtraRaw(extra: Record<string, any> | null | undefined): CosmosExtraTxInfo | Record<string, any> | null | undefined;
export declare function toOperationExtraRaw(extra: Record<string, any> | null | undefined): CosmosExtraTxInfo | Record<string, any> | null | undefined;
declare const _default: {
    formatOperationSpecifics: typeof formatOperationSpecifics;
    fromOperationExtraRaw: typeof fromOperationExtraRaw;
    toOperationExtraRaw: typeof toOperationExtraRaw;
    formatAccountSpecifics: typeof formatAccountSpecifics;
};
export default _default;
//# sourceMappingURL=account.d.ts.map