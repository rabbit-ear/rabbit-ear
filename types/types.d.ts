export type FOLDFrame = {
    frame_author?: string;
    frame_title?: string;
    frame_description?: string;
    frame_classes?: string[];
    frame_attributes?: string[];
    frame_unit?: string;
    vertices_coords?: [number, number][] | [number, number, number][];
    vertices_vertices?: number[][];
    vertices_edges?: number[][];
    vertices_faces?: (number | null | undefined)[][];
    edges_vertices?: [number, number][];
    edges_faces?: (number | null | undefined)[][];
    edges_assignment?: string[];
    edges_foldAngle?: number[];
    edges_length?: number[];
    faces_vertices?: number[][];
    faces_edges?: number[][];
    faces_faces?: (number | null | undefined)[][];
    faceOrders?: [number, number, number][];
    edgeOrders?: [number, number, number][];
};
export type FOLDInternalFrame = FOLDFrame & {
    frame_parent?: number;
    frame_inherit?: boolean;
};
export type FOLDFileMetadata = {
    file_frames?: FOLDInternalFrame[];
    file_spec?: number;
    file_creator?: string;
    file_author?: string;
    file_title?: string;
    file_description?: string;
    file_classes?: string[];
};
export type FOLDOutOfSpec = {
    faces_center?: ([number, number] | [number, number, number])[];
    faces_normal?: ([number, number] | [number, number, number])[];
    edges_vector?: ([number, number] | [number, number, number])[];
    faces_polygon?: ([number, number] | [number, number, number])[][];
    faces_matrix?: number[][];
    faces_layer?: number[];
    vertices_sectors?: number[][];
};
export type FOLD = FOLDFileMetadata & FOLDFrame & FOLDOutOfSpec;
export type VecLine2 = {
    vector: [number, number];
    origin: [number, number];
};
export type VecLine3 = {
    vector: [number, number, number];
    origin: [number, number, number];
};
export type VecLine = {
    vector: [number, number] | [number, number, number];
    origin: [number, number] | [number, number, number];
};
export type UniqueLine = {
    normal: [number, number];
    distance: number;
};
export type Box = {
    min: number[];
    max: number[];
    span?: number[];
};
export type Circle = {
    radius: number;
    origin: [number, number];
};
export type SweepEvent = {
    vertices: number[];
    t: number;
    start: number[];
    end: number[];
};
/**
 * Intersection related events
 */
export type LineLineEvent = {
    a: number;
    b: number;
    point: [number, number];
};
/**
 * Intersection related events
 */
export type FaceVertexEvent = {
    a: number;
    vertex: number;
};
/**
 * Intersection related events
 */
export type FaceEdgeEvent = {
    a: number;
    b: number;
    point: [number, number];
    edge: number;
};
/**
 * Intersection related events
 */
export type FacePointEvent = {
    point: [number, number];
    overlap: boolean;
    t: number[];
};
export type WebGLVertexArray = {
    location: number;
    buffer: WebGLBuffer;
    type: number;
    length: number;
    data: Float32Array;
};
export type WebGLElementArray = {
    mode: number;
    buffer: WebGLBuffer;
    data: Uint16Array | Uint32Array;
};
export type WebGLUniform = {
    func: string;
    value: any;
};
export type WebGLModel = {
    program: WebGLProgram;
    vertexArrays: WebGLVertexArray[];
    elementArrays: WebGLElementArray[];
    flags: number[];
    makeUniforms: (gl: WebGLRenderingContext | WebGL2RenderingContext, options: object) => ({
        [key: string]: WebGLUniform;
    });
};
export type TacoTacoConstraint = [number, number, number, number];
export type TacoTortillaConstraint = [number, number, number];
export type TortillaTortillaConstraint = [number, number, number, number];
export type TransitivityConstraint = [number, number, number];
export type LayerBranch = LayerFork[];
export type LayerOrders = {
    [key: string]: number;
};
export type LayerFork = {
    orders: LayerOrders;
    branches?: LayerFork[][];
};
export type LayerSolverSolution = LayerFork;
export type FaceOrdersBranch = FaceOrdersFork[];
export type FaceOrders = [number, number, number][];
export type FaceOrdersFork = {
    orders: [number, number, number][];
    branches?: FaceOrdersFork[][];
};
export type FaceOrdersSolverSolution = FaceOrdersFork;
