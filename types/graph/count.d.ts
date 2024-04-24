export function count(graph: FOLD, key: string): number;
export function countVertices({ vertices_coords, vertices_vertices, vertices_edges, vertices_faces, }: FOLD): number;
export function countEdges({ edges_vertices, edges_faces }: FOLD): number;
export function countFaces({ faces_vertices, faces_edges, faces_faces }: FOLD): number;
export function countImplied(graph: FOLD, key: string): number;
export function countImpliedVertices(graph: FOLD): number;
export function countImpliedEdges(graph: FOLD): number;
export function countImpliedFaces(graph: FOLD): number;
//# sourceMappingURL=count.d.ts.map