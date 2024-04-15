export function makeUniforms(gl: WebGLRenderingContext | WebGL2RenderingContext, { projectionMatrix, modelViewMatrix, frontColor, backColor, outlineColor, strokeWidth, opacity, }: {
    projectionMatrix: any;
    modelViewMatrix: any;
    frontColor: any;
    backColor: any;
    outlineColor: any;
    strokeWidth: any;
    opacity: any;
}): {
    [key: string]: WebGLUniform;
};
