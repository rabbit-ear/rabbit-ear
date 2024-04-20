export function recalculatePointAlongEdge(points: [number, number][], parameter: number): [number, number];
export function reassignCollinearEdges({ edges_vertices, edges_faces, edges_assignment, edges_foldAngle }: FOLD, { assignment, foldAngle, oppositeAssignment, oppositeFoldAngle }: object, faces_winding: boolean[], splitGraphResult: {
    vertices?: {
        intersect: number[];
    };
}): number[];
export function makeNewFlatFoldFaceOrders({ edges_faces, edges_assignment, edges_foldAngle, }: FOLD, newEdges: number[]): [number, number, number][];
export function getInvalidFaceOrders({ vertices_coords, faces_vertices, faceOrders }: FOLD, line: VecLine2, newFaces: number[]): number[];
export function updateFlatFoldedInvalidFaceOrders({ faceOrders }: FOLD, invalidFaceOrders: number[], assignment: string, faces_winding: boolean[]): undefined;
