import { Observable } from "rxjs";
export declare const repairChoices: {
    id: string;
    label: any;
    forceMCU: string;
}[];
declare const repair: (deviceId: string, forceMCU_?: string | null) => Observable<{
    progress: number;
}>;
export default repair;
//# sourceMappingURL=firmwareUpdate-repair.d.ts.map