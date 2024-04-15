export function makeVerticesFacesFromVerticesVerticesForVertex({ vertices_vertices }: FOLD, vertex: any, verticesToFace: any): any[];
export function makeVerticesFacesFromVerticesEdgesForVertex({ edges_vertices, vertices_edges }: FOLD, vertex: any, verticesToFace: any): any[];
export function makeFacesEdgesFromFacesVerticesForVertex({ faces_vertices }: FOLD, faces: any, verticesToEdge: any): any;
export function makeEdgesFacesForEdge({ vertices_faces, edges_vertices, edges_faces, faces_vertices, faces_edges }: FOLD, edge: number): number[];
