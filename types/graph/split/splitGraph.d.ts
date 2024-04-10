export function splitGraphWithLineAndPoints(graph: FOLD, { vector, origin }: VecLine, lineDomain?: Function, interiorPoints?: number[][], epsilon?: number): object;
export function splitGraphWithLine(graph: FOLD, line: VecLine, epsilon?: number): object;
export function splitGraphWithRay(graph: FOLD, ray: VecLine, epsilon?: number): object;
export function splitGraphWithSegment(graph: FOLD, segment: number[][], epsilon?: number): object;
