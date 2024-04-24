export function edgeIsolatedVertices({ vertices_coords, edges_vertices }: FOLD): number[];
export function faceIsolatedVertices({ vertices_coords, faces_vertices }: FOLD): number[];
export function isolatedVertices({ vertices_coords, edges_vertices, faces_vertices }: FOLD): number[];
export function removeIsolatedVertices(graph: FOLD, remove_indices?: number[]): object;
//# sourceMappingURL=isolated.d.ts.map