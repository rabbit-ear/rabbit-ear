export default WebGLCreasePattern;
declare function WebGLCreasePattern(gl: any, version?: number, graph?: {}, options?: any): {
    program: WebGLProgram;
    vertexArrays: {
        location: any;
        buffer: any;
        type: any;
        length: any;
        data: Float32Array;
    }[];
    elementArrays: {
        mode: any;
        buffer: any;
        data: Uint16Array | Uint32Array;
    }[];
    flags: any[];
    makeUniforms: (gl: any, { projectionMatrix, modelViewMatrix, cpColor, strokeWidth, }: {
        projectionMatrix: any;
        modelViewMatrix: any;
        cpColor: any;
        strokeWidth: any;
    }) => {
        u_matrix: {
            func: string;
            value: number[];
        };
        u_projection: {
            func: string;
            value: any;
        };
        u_modelView: {
            func: string;
            value: any;
        };
        u_cpColor: {
            func: string;
            value: any[];
        };
        u_strokeWidth: {
            func: string;
            value: any;
        };
    };
}[];
