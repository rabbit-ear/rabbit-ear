export function makeFoldedVertexArrays(gl: object, program: object, { vertices_coords, edges_vertices, edges_assignment, faces_vertices, faces_edges, faces_normal, }?: FOLD, options?: {}): {
    location: any;
    buffer: any;
    type: any;
    length: any;
    data: Float32Array;
}[];
export function makeFoldedElementArrays(gl: any, version?: number, graph?: {}): {
    mode: any;
    buffer: any;
    data: Uint16Array | Uint32Array;
}[];
export function makeThickEdgesVertexArrays(gl: any, program: any, graph: any, options?: {}): {
    location: any;
    buffer: any;
    type: any;
    length: any;
    data: Float32Array;
}[];
export function makeThickEdgesElementArrays(gl: any, version?: number, graph?: {}): {
    mode: any;
    buffer: any;
    data: Uint16Array | Uint32Array;
}[];
