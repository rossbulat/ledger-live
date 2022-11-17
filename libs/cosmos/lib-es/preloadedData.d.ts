import { Observable } from "rxjs";
import type { CosmosPreloadData, CosmosValidatorItem } from "./types";
export declare function asSafeCosmosPreloadData(data?: {
    validators?: CosmosValidatorItem[];
}): CosmosPreloadData;
export declare function setCosmosPreloadData(data: CosmosPreloadData): void;
export declare function getCurrentCosmosPreloadData(): CosmosPreloadData;
export declare function getCosmosPreloadDataUpdates(): Observable<CosmosPreloadData>;
//# sourceMappingURL=preloadedData.d.ts.map