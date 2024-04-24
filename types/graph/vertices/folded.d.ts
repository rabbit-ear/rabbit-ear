export function makeVerticesCoords3DFolded({ vertices_coords, vertices_faces, edges_vertices, edges_foldAngle, edges_assignment, faces_vertices, faces_faces, faces_matrix, }: FOLDExtended, rootFaces?: number[]): [number, number, number][];
export function makeVerticesCoordsFlatFolded({ vertices_coords, edges_vertices, edges_foldAngle, edges_assignment, faces_vertices, faces_faces, }: FOLD, rootFaces?: number[]): [number, number][];
export function makeVerticesCoordsFolded(graph: FOLD, rootFaces?: number[]): [number, number][] | [number, number, number][];
export function makeVerticesCoordsFoldedFromMatrix2({ vertices_coords, vertices_faces, faces_vertices, }: FOLD, faces_matrix: number[][]): [number, number][];
//# sourceMappingURL=folded.d.ts.map