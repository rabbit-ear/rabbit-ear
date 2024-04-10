export default makeUniforms;
/**
 * @description Uniforms must exist so there are protections to ensure
 * that at least some value gets passed.
 */
declare function makeUniforms(gl: any, { projectionMatrix, modelViewMatrix, cpColor, strokeWidth, }: {
    projectionMatrix: any;
    modelViewMatrix: any;
    cpColor: any;
    strokeWidth: any;
}): {
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
