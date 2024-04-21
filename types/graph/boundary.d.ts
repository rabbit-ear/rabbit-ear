export function boundingBox({ vertices_coords }: FOLD, padding?: number): Box | null;
export function boundaryVertices({ edges_vertices, edges_assignment }: FOLD): number[];
export function boundary({ vertices_edges, edges_vertices, edges_assignment }: FOLD): {
    vertices: number[];
    edges: number[];
};
export function boundaries({ vertices_edges, edges_vertices, edges_assignment }: FOLD): {
    vertices: number[];
    edges: number[];
}[];
export function boundaryPolygons({ vertices_coords, vertices_edges, edges_vertices, edges_assignment, }: FOLD): ([number, number] | [number, number, number])[][];
export function boundaryPolygon({ vertices_coords, vertices_edges, edges_vertices, edges_assignment, }: FOLD): ([number, number] | [number, number, number])[];
export function planarBoundary({ vertices_coords, vertices_edges, vertices_vertices, edges_vertices, }: FOLD): {
    vertices: number[];
    edges: number[];
};
export function planarBoundaries({ vertices_coords, vertices_edges, vertices_vertices, edges_vertices, }: FOLD): {
    vertices: number[];
    edges: number[];
}[];
