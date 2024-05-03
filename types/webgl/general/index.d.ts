declare const _default: {
    initializeWebGL: (canvasElement: HTMLCanvasElement, preferredVersion?: number) => {
        gl: WebGLRenderingContext | WebGL2RenderingContext;
        version: number;
    };
    createProgram: (gl: WebGLRenderingContext | WebGL2RenderingContext, vertexSource: string, fragmentSource: string) => WebGLProgram;
    rebuildViewport: (gl: WebGLRenderingContext | WebGL2RenderingContext, canvas: HTMLCanvasElement) => undefined;
    makeProjectionMatrix: ([width, height]: [number, number], perspective?: string, fov?: number) => number[];
    makeModelMatrix: (graph: FOLD) => number[];
    drawModel: (gl: WebGLRenderingContext | WebGL2RenderingContext, version: number, model: WebGLModel, uniforms?: {
        [key: string]: WebGLUniform;
    }) => void;
    deallocModel: (gl: WebGLRenderingContext | WebGL2RenderingContext, model: WebGLModel) => void;
    makeExplodedGraph: (graph: FOLDExtended, layerNudge?: number) => FOLD;
    dark: {
        B: number[];
        b: number[];
        V: number[];
        v: number[];
        M: number[];
        m: number[];
        F: number[];
        f: number[];
        J: number[];
        j: number[];
        C: number[];
        c: number[];
        U: number[];
        u: number[];
    };
    light: {
        B: number[];
        b: number[];
        V: number[];
        v: number[];
        M: number[];
        m: number[];
        F: number[];
        f: number[];
        J: number[];
        j: number[];
        C: number[];
        c: number[];
        U: number[];
        u: number[];
    };
    parseColorToWebGLColor: (color: string | number[]) => [number, number, number];
};
export default _default;
//# sourceMappingURL=index.d.ts.map