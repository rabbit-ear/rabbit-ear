export function clampLine(dist: number): number;
export function clampRay(dist: number): number;
export function clampSegment(dist: number): number;
export function collinearPoints(p0: number[], p1: number[], p2: number[], epsilon?: number): boolean;
export function collinearBetween(p0: number[], p1: number[], p2: number[], inclusive?: boolean, epsilon?: number): boolean;
export function collinearLines2(a: VecLine2, b: VecLine2, epsilon?: number): boolean;
export function collinearLines3(a: VecLine3, b: VecLine3, epsilon?: number): boolean;
export function pleat(a: VecLine2, b: VecLine2, count: number, epsilon?: number): [VecLine2[], VecLine2[]];
export function bisectLines2(a: VecLine2, b: VecLine2, epsilon?: number): [VecLine2?, VecLine2?];
//# sourceMappingURL=line.d.ts.map