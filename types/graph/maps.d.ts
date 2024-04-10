export function invertFlatMap(map: number[]): number[];
export function invertArrayToFlatMap(map: number[][]): number[];
export function invertFlatToArrayMap(map: number[]): number[][];
export function invertArrayMap(map: number[][]): number[][];
export function mergeFlatNextmaps(...maps: number[][]): number[];
export function mergeNextmaps(...maps: number[][][]): number[][];
export function mergeFlatBackmaps(...maps: number[][]): number[];
export function mergeBackmaps(...maps: number[][][]): number[][];
export function remapKey(graph: FOLD, key: string, indexMap: number[]): void;
