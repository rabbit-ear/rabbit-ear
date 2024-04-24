export function overlapLinePoint({ vector, origin }: VecLine2, point: [number, number] | [number, number, number], lineDomain?: (_: number, __?: number) => boolean, epsilon?: number): boolean;
export function overlapConvexPolygonPoint(polygon: ([number, number] | [number, number, number])[], point: [number, number] | [number, number, number], polyDomain?: Function, epsilon?: number): {
    overlap: boolean;
    t: number[];
};
export function overlapConvexPolygons(poly1: [number, number][], poly2: [number, number][], epsilon?: number): boolean;
export function overlapBoundingBoxes(box1: Box, box2: Box, epsilon?: number): boolean;
//# sourceMappingURL=overlap.d.ts.map