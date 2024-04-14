export function vectorToAngle(v: [number, number]): number;
export function angleToVector(a: number): [number, number];
export function pointsToLine2(a: [number, number] | [number, number, number], b: [number, number] | [number, number, number]): VecLine2;
export function pointsToLine3(a: [number, number, number], b: [number, number, number]): VecLine3;
export function pointsToLine(a: [number, number] | [number, number, number], b: [number, number] | [number, number, number]): VecLine;
export function vecLineToUniqueLine({ vector, origin }: VecLine): UniqueLine;
export function uniqueLineToVecLine({ normal, distance }: UniqueLine): VecLine2;
