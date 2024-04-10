export default makeUniforms;
/**
 * @description Uniforms must exist so there are protections to ensure
 * that at least some value gets passed.
 */
declare function makeUniforms(gl: any, { projectionMatrix, modelViewMatrix, frontColor, backColor, outlineColor, strokeWidth, opacity, }: {
    projectionMatrix: any;
    modelViewMatrix: any;
    frontColor: any;
    backColor: any;
    outlineColor: any;
    strokeWidth: any;
    opacity: any;
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
