export function segmentToArrow(segment: [number, number][], polygon: [number, number][], options?: {}): object;
export function diagramReflectPoint({ vector, origin }: {
    vector: any;
    origin: any;
}, point: any): [number, number];
export function perpendicularBalancedSegment(polygon: [number, number][], line: VecLine2, point?: [number, number]): [number, number][];
export function betweenTwoSegments(foldLine: VecLine2, lines: VecLine2[], segments: [number, number][][]): [number, number][];
export function betweenTwoIntersectingSegments(lines: any, intersect: any, foldLine: any, boundary: any): (number | [number, number])[][];
