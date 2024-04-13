export function splitGraphWithLineAndPoints(graph: FOLD, { vector, origin }: VecLine2, lineDomain?: Function, interiorPoints?: [number, number][], epsilon?: number): object;
export function splitGraphWithLine(graph: FOLD, line: VecLine2, epsilon?: number): object;
export function splitGraphWithRay(graph: FOLD, ray: VecLine2, epsilon?: number): object;
export function splitGraphWithSegment(graph: FOLD, segment: [number, number][], epsilon?: number): object;
