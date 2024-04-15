export function opxEdgeGraph(file: string): FOLD;
export function opxToFold(file: string, options: number | {
    epsilon?: number;
    invertVertical?: boolean;
}): FOLD | undefined;
import { invertVertical } from "./general/options.js";
