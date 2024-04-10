export function makeCPEdgesVertexArrays(gl: object, program: object, graph: FOLD, options: any): {
    location: any;
    buffer: any;
    type: any;
    length: any;
    data: Float32Array;
}[];
export function makeCPEdgesElementArrays(gl: any, version?: number, graph?: {}): {
    mode: any;
    buffer: any;
    data: Uint16Array | Uint32Array;
}[];
export function makeCPFacesVertexArrays(gl: any, program: any, graph: any): {
    location: any;
    buffer: any;
    type: any;
    length: number;
    data: Float32Array;
}[];
export function makeCPFacesElementArrays(gl: any, version?: number, graph?: {}): {
    mode: any;
    buffer: any;
    data: Uint16Array | Uint32Array;
}[];
