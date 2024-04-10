export function makeFacesVertexData({ vertices_coords, edges_assignment, faces_vertices, faces_edges, faces_normal, }: {
    vertices_coords: any;
    edges_assignment: any;
    faces_vertices: any;
    faces_edges: any;
    faces_normal: any;
}, options?: {}): {
    vertices_coords: any;
    vertices_normal: number[][];
    vertices_barycentric: any;
};
export function makeThickEdgesVertexData(graph: any, options: any): {
    vertices_coords: any;
    vertices_color: any;
    verticesEdgesVector: any;
    vertices_vector: any;
};
