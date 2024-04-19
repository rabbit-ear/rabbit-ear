export function recalculatePointAlongEdge(points: [number, number][], parameter: number): [number, number];
export function reassignCollinearEdges(graph: FOLD, { assignment, foldAngle, oppositeAssignment, oppositeFoldAngle }: object, faces_winding: boolean[], splitGraphResult: {
    vertices?: {
        intersect: number[];
    };
}): number[];
export function makeNewFaceOrders(graph: FOLD, newEdges: number[]): [number, number, number][];
