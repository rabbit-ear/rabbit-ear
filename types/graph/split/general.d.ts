export function makeVerticesFacesFromVerticesVerticesForVertex({ vertices_vertices }: {
    vertices_vertices: any;
}, vertex: any, verticesToFace: any): any;
export function makeVerticesFacesFromVerticesEdgesForVertex({ edges_vertices, vertices_edges }: {
    edges_vertices: any;
    vertices_edges: any;
}, vertex: any, verticesToFace: any): any;
export function makeFacesEdgesFromFacesVerticesForVertex({ faces_vertices }: {
    faces_vertices: any;
}, faces: any, verticesToEdge: any): any;
export function makeEdgesFacesForEdge({ vertices_faces, edges_vertices, edges_faces, faces_vertices, faces_edges }: FOLD, edge: number): number[];
