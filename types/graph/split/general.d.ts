export function makeVerticesFacesForVertex({ vertices_vertices, vertices_edges, edges_vertices }: FOLD, vertex: number, verticesToFace: {
    [key: string]: number;
}): number[] | undefined;
export function makeFacesEdgesForVertex({ faces_vertices }: FOLD, faces: number[], verticesToEdge: {
    [key: string]: number;
}): number[][];
export function makeEdgesFacesForEdge({ vertices_faces, edges_vertices, edges_faces, faces_vertices, faces_edges }: FOLD, edge: number): number[];
