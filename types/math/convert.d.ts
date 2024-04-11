export function vectorToAngle(v: [number, number]): number;
export function angleToVector(a: number): [number, number];
export function pointsToLine(origin: [number, number] | [number, number, number], point2: [number, number] | [number, number, number]): VecLine;
export function pointsToLine2(origin: [number, number], point2: [number, number]): VecLine2;
export function vecLineToUniqueLine({ vector, origin }: VecLine): UniqueLine;
export function uniqueLineToVecLine({ normal, distance }: UniqueLine): VecLine2;
