export function segmentToArrow(segment: number[][], polygon: number[][], options?: {}): object;
export function diagramReflectPoint({ vector, origin }: {
    vector: any;
    origin: any;
}, point: any): number[];
export function perpendicularBalancedSegment(polygon: number[][], line: VecLine, point: number[] | null): number[][];
export function betweenTwoSegments(foldLine: VecLine, lines: any, segments: any): any;
export function betweenTwoIntersectingSegments(lines: any, intersect: any, foldLine: any, boundary: any): (number | [number, number])[][];
