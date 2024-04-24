export function getFacesFacesOverlap({ vertices_coords, faces_vertices, }: FOLD, epsilon?: number): number[][];
export function getEdgesEdgesCollinearOverlap({ vertices_coords, edges_vertices, }: FOLD, epsilon?: number): number[][];
export function getOverlappingComponents({ vertices_coords, edges_vertices, faces_vertices, }: FOLD, epsilon?: number): {
    verticesVertices: boolean[][];
    verticesEdges: boolean[][];
    edgesEdges: boolean[][];
    facesVertices: boolean[][];
};
export function getFacesEdgesOverlap({ vertices_coords, edges_vertices, faces_vertices, faces_edges, }: FOLD, epsilon?: number): number[][];
export function getEdgesFacesOverlap({ vertices_coords, edges_vertices, faces_vertices, faces_edges, }: FOLD, epsilon?: number): number[][];
//# sourceMappingURL=overlap.d.ts.map