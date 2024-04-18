export function triangulateConvexFacesVertices({ faces_vertices }: FOLD): number[][];
export function triangulateNonConvexFacesVertices({ vertices_coords, faces_vertices }: FOLD, earcut: any): number[][];
export function triangulate(graph: FOLD, earcut: any): {
    faces?: {
        map: number[][];
    };
    edges?: {
        new: number[];
    };
};
