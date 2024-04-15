export default WebGLFoldedForm;
declare function WebGLFoldedForm(gl: any, version?: number, graph?: {}, options?: {}): {
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
    makeUniforms: (gl: any, { projectionMatrix, modelViewMatrix, frontColor, backColor, outlineColor, strokeWidth, opacity, }: {
        projectionMatrix: any;
        modelViewMatrix: any;
        frontColor: any;
        backColor: any;
        outlineColor: any;
        strokeWidth: any;
        opacity: any;
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
        u_frontColor: {
            func: string;
            value: any[];
        };
        u_backColor: {
            func: string;
            value: any[];
        };
        u_outlineColor: {
            func: string;
            value: any[];
        };
        u_strokeWidth: {
            func: string;
            value: any;
        };
        u_opacity: {
            func: string;
            value: any;
        };
    };
}[];
