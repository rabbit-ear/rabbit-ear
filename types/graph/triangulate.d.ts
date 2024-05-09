export function triangulateConvexFacesVertices({ faces_vertices }: FOLD): number[][];
export function triangulateNonConvexFacesVertices({ vertices_coords, faces_vertices }: FOLD, earcut: any): number[][];
export function triangulate({ vertices_coords, edges_vertices, edges_assignment, edges_foldAngle, faces_vertices, faceOrders, }: FOLD, earcut: any): {
    result: FOLD;
    changes: {
        faces?: {
            map: number[][];
        };
        edges?: {
            new: number[];
        };
    };
};
//# sourceMappingURL=triangulate.d.ts.map