export function validateVerticesWinding({ vertices_vertices, vertices_edges, vertices_faces, edges_vertices, faces_vertices, faces_edges, }: FOLD): string[];
export function validateFacesWinding({ edges_vertices, edges_faces, faces_vertices, faces_edges, faces_faces, }: FOLD): string[];
export function validateWinding(graph: FOLD): string[];
