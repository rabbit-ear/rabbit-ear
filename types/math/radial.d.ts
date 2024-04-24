export function isCounterClockwiseBetween(angle: number, floor: number, ceiling: number): boolean;
export function clockwiseAngleRadians(a: number, b: number): number;
export function counterClockwiseAngleRadians(a: number, b: number): number;
export function clockwiseAngle2(a: [number, number], b: [number, number]): number;
export function counterClockwiseAngle2(a: [number, number], b: [number, number]): number;
export function clockwiseBisect2(a: [number, number], b: [number, number]): [number, number];
export function counterClockwiseBisect2(a: [number, number], b: [number, number]): [number, number];
export function clockwiseSubsectRadians(angleA: number, angleB: number, divisions: number): number[];
export function counterClockwiseSubsectRadians(angleA: number, angleB: number, divisions: number): number[];
export function clockwiseSubsect2(vectorA: [number, number], vectorB: [number, number], divisions: number): [number, number][];
export function counterClockwiseSubsect2(vectorA: [number, number], vectorB: [number, number], divisions: number): [number, number][];
export function counterClockwiseOrderRadians(radians: number[]): number[];
export function counterClockwiseOrder2(vectors: [number, number][]): number[];
export function counterClockwiseSectorsRadians(radians: number[]): number[];
export function counterClockwiseSectors2(vectors: [number, number][]): number[];
export function threePointTurnDirection(p0: [number, number], p1: [number, number], p2: [number, number], epsilon?: number): number | undefined;
//# sourceMappingURL=radial.d.ts.map