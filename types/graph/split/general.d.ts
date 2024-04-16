export function makeVerticesFacesFromVerticesVerticesForVertex({ vertices_vertices }: FOLD, vertex: number, verticesToFace: {
    [key: string]: number;
}): number[];
export function makeVerticesFacesFromVerticesEdgesForVertex({ edges_vertices, vertices_edges }: FOLD, vertex: number, verticesToFace: {
    [key: string]: number;
}): number[];
export function makeFacesEdgesFromFacesVerticesForVertex({ faces_vertices }: FOLD, faces: number[], verticesToEdge: {
    [key: string]: number;
}): number[][];
export function makeEdgesFacesForEdge({ vertices_faces, edges_vertices, edges_faces, faces_vertices, faces_edges }: FOLD, edge: number): number[];
