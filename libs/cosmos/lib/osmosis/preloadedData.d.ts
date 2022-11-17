import { Observable } from "rxjs";
import type { CosmosPreloadData, CosmosValidatorItem } from "../types";
export declare function setOsmosisPreloadData(data: CosmosPreloadData): void;
export declare function getCurrentOsmosisPreloadData(): CosmosPreloadData;
export declare function getOsmosisPreloadDataUpdates(): Observable<CosmosPreloadData>;
export declare function asSafeOsmosisPreloadData(data?: {
    validators?: CosmosValidatorItem[];
}): CosmosPreloadData;
//# sourceMappingURL=preloadedData.d.ts.map