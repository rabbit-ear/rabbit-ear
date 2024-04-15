export function drawModel(gl: WebGLRenderingContext | WebGL2RenderingContext, version: number, model: WebGLModel, uniforms?: {
    [key: string]: WebGLUniform;
}): void;
export function deallocModel(gl: WebGLRenderingContext | WebGL2RenderingContext, model: WebGLModel): void;
