export function rebuildViewport(gl: WebGLRenderingContext | WebGL2RenderingContext, canvas: HTMLCanvasElement): void;
export function makeProjectionMatrix(canvas: HTMLCanvasElement, perspective?: string, fov?: number): readonly number[];
export function makeModelMatrix(graph: FOLD): number[];
