export function initializeWebGL(canvasElement: HTMLCanvasElement, preferredVersion?: number): {
    gl: WebGLRenderingContext | WebGL2RenderingContext;
    version: number;
};
export function createProgram(gl: WebGLRenderingContext | WebGL2RenderingContext, vertexSource: string, fragmentSource: string): WebGLProgram;
