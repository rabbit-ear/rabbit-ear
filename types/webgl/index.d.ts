declare const _default: {
    makeUniforms: ({ projectionMatrix, modelViewMatrix, cpColor, strokeWidth, }: {
        projectionMatrix: any;
        modelViewMatrix: any;
        cpColor: any;
        strokeWidth: any;
    }) => {
        [key: string]: WebGLUniform;
    };
    cp_300_frag: "#version 300 es\n#ifdef GL_FRAGMENT_PRECISION_HIGH\n  precision highp float;\n#else\n  precision mediump float;\n#endif\nin vec3 blend_color;\nout vec4 outColor;\nvoid main() {\n\toutColor = vec4(blend_color.rgb, 1);\n}\n";
    cp_100_frag: "#version 100\nprecision mediump float;\nvarying vec3 blend_color;\nvoid main () {\n\tgl_FragColor = vec4(blend_color.rgb, 1);\n}\n";
    thick_edges_300_vert: "#version 300 es\nuniform mat4 u_matrix;\nuniform float u_strokeWidth;\nin vec2 v_position;\nin vec3 v_color;\nin vec2 edge_vector;\nin vec2 vertex_vector;\nout vec3 blend_color;\nvoid main () {\n\tfloat sign = vertex_vector[0];\n\tfloat halfWidth = u_strokeWidth * 0.5;\n\tvec2 side = normalize(vec2(edge_vector.y * sign, -edge_vector.x * sign)) * halfWidth;\n\tgl_Position = u_matrix * vec4(side + v_position, 0, 1);\n\tblend_color = v_color;\n}\n";
    thick_edges_100_vert: "#version 100\nuniform mat4 u_matrix;\nuniform float u_strokeWidth;\nattribute vec2 v_position;\nattribute vec3 v_color;\nattribute vec2 edge_vector;\nattribute vec2 vertex_vector;\nvarying vec3 blend_color;\nvoid main () {\n\tfloat sign = vertex_vector[0];\n\tfloat halfWidth = u_strokeWidth * 0.5;\n\tvec2 side = normalize(vec2(edge_vector.y * sign, -edge_vector.x * sign)) * halfWidth;\n\tgl_Position = u_matrix * vec4(side + v_position, 0, 1);\n\tblend_color = v_color;\n}\n";
    cp_100_vert: "#version 100\nuniform mat4 u_matrix;\nuniform vec3 u_cpColor;\nattribute vec2 v_position;\nvarying vec3 blend_color;\nvoid main () {\n\tgl_Position = u_matrix * vec4(v_position, 0, 1);\n\tblend_color = u_cpColor;\n}\n";
    cp_300_vert: "#version 300 es\nuniform mat4 u_matrix;\nuniform vec3 u_cpColor;\nin vec2 v_position;\nout vec3 blend_color;\nvoid main () {\n\tgl_Position = u_matrix * vec4(v_position, 0, 1);\n\tblend_color = u_cpColor;\n}\n";
    cpFacesV1: (gl: WebGLRenderingContext | WebGL2RenderingContext, graph?: FOLD, options?: any) => WebGLModel;
    cpEdgesV1: (gl: WebGLRenderingContext | WebGL2RenderingContext, graph?: FOLD, options?: any) => WebGLModel;
    cpFacesV2: (gl: WebGLRenderingContext | WebGL2RenderingContext, graph?: FOLD, options?: any) => WebGLModel;
    cpEdgesV2: (gl: WebGLRenderingContext | WebGL2RenderingContext, graph?: FOLD, options?: any) => WebGLModel;
    creasePattern: (gl: WebGLRenderingContext | WebGL2RenderingContext, version?: number, graph?: FOLD, options?: any) => WebGLModel[];
    makeCPEdgesVertexData: (graph: any, options: any) => {
        vertices_coords: any;
        vertices_color: any;
        verticesEdgesVector: any;
        vertices_vector: any;
    };
    makeCPEdgesVertexArrays: (gl: WebGLRenderingContext | WebGL2RenderingContext, program: any, graph: FOLD, options: any) => WebGLVertexArray[];
    makeCPEdgesElementArrays: (gl: WebGLRenderingContext | WebGL2RenderingContext, version?: number, graph?: FOLD) => WebGLElementArray[];
    makeCPFacesVertexArrays: (gl: WebGLRenderingContext | WebGL2RenderingContext, program: any, graph: FOLD) => WebGLVertexArray[];
    makeCPFacesElementArrays: (gl: WebGLRenderingContext | WebGL2RenderingContext, version?: number, graph?: FOLD) => WebGLElementArray[];
    model_300_vert: "#version 300 es\nuniform mat4 u_modelView;\nuniform mat4 u_matrix;\nuniform vec3 u_frontColor;\nuniform vec3 u_backColor;\nin vec3 v_position;\nin vec3 v_normal;\nout vec3 front_color;\nout vec3 back_color;\nvoid main () {\n\tgl_Position = u_matrix * vec4(v_position, 1);\n\tvec3 light = abs(normalize((vec4(v_normal, 1) * u_modelView).xyz));\n\tfloat brightness = 0.5 + light.x * 0.15 + light.z * 0.35;\n\tfront_color = u_frontColor * brightness;\n\tback_color = u_backColor * brightness;\n}\n";
    outlined_model_300_frag: "#version 300 es\n#ifdef GL_FRAGMENT_PRECISION_HIGH\n  precision highp float;\n#else\n  precision mediump float;\n#endif\nuniform float u_opacity;\nin vec3 front_color;\nin vec3 back_color;\nin vec3 outline_color;\nin vec3 barycentric;\nout vec4 outColor;\nfloat edgeFactor(vec3 barycenter) {\n\tvec3 d = fwidth(barycenter);\n\tvec3 a3 = smoothstep(vec3(0.0), d*3.5, barycenter);\n\treturn min(min(a3.x, a3.y), a3.z);\n}\nvoid main () {\n\tgl_FragDepth = gl_FragCoord.z;\n\tvec3 color = gl_FrontFacing ? front_color : back_color;\n\t// vec4 color4 = gl_FrontFacing\n\t// \t? vec4(front_color, u_opacity)\n\t// \t: vec4(back_color, u_opacity);\n\t// vec4 outline4 = vec4(outline_color, 1);\n\t// outColor = vec4(mix(vec3(0.0), color, edgeFactor(barycentric)), u_opacity);\n\toutColor = vec4(mix(outline_color, color, edgeFactor(barycentric)), u_opacity);\n\t// outColor = mix(outline4, color4, edgeFactor(barycentric));\n}\n";
    outlined_model_100_frag: "#version 100\nprecision mediump float;\nuniform float u_opacity;\nvarying vec3 barycentric;\nvarying vec3 front_color;\nvarying vec3 back_color;\nvarying vec3 outline_color;\nvoid main () {\n\tvec3 color = gl_FrontFacing ? front_color : back_color;\n\t// vec3 boundary = vec3(0.0, 0.0, 0.0);\n\tvec3 boundary = outline_color;\n\t// gl_FragDepth = 0.5;\n\tgl_FragColor = any(lessThan(barycentric, vec3(0.02)))\n\t\t? vec4(boundary, u_opacity)\n\t\t: vec4(color, u_opacity);\n}\n";
    model_100_vert: "#version 100\nattribute vec3 v_position;\nattribute vec3 v_normal;\nuniform mat4 u_projection;\nuniform mat4 u_modelView;\nuniform mat4 u_matrix;\nuniform vec3 u_frontColor;\nuniform vec3 u_backColor;\nvarying vec3 normal_color;\nvarying vec3 front_color;\nvarying vec3 back_color;\nvoid main () {\n\tgl_Position = u_matrix * vec4(v_position, 1);\n\tvec3 light = abs(normalize((vec4(v_normal, 1) * u_modelView).xyz));\n\tfloat brightness = 0.5 + light.x * 0.15 + light.z * 0.35;\n\tfront_color = u_frontColor * brightness;\n\tback_color = u_backColor * brightness;\n}\n";
    model_100_frag: "#version 100\nprecision mediump float;\nuniform float u_opacity;\nvarying vec3 front_color;\nvarying vec3 back_color;\nvoid main () {\n\tvec3 color = gl_FrontFacing ? front_color : back_color;\n\tgl_FragColor = vec4(color, u_opacity);\n}\n";
    simple_300_frag: "#version 300 es\n#ifdef GL_FRAGMENT_PRECISION_HIGH\n  precision highp float;\n#else\n  precision mediump float;\n#endif\nin vec3 blend_color;\nout vec4 outColor;\n \nvoid main() {\n\toutColor = vec4(blend_color.rgb, 1);\n}\n";
    outlined_model_100_vert: "#version 100\nattribute vec3 v_position;\nattribute vec3 v_normal;\nattribute vec3 v_barycentric;\nuniform mat4 u_projection;\nuniform mat4 u_modelView;\nuniform mat4 u_matrix;\nuniform vec3 u_frontColor;\nuniform vec3 u_backColor;\nuniform vec3 u_outlineColor;\nvarying vec3 normal_color;\nvarying vec3 barycentric;\nvarying vec3 front_color;\nvarying vec3 back_color;\nvarying vec3 outline_color;\nvoid main () {\n\tgl_Position = u_matrix * vec4(v_position, 1);\n\tbarycentric = v_barycentric;\n\tvec3 light = abs(normalize((vec4(v_normal, 1) * u_modelView).xyz));\n\tfloat brightness = 0.5 + light.x * 0.15 + light.z * 0.35;\n\tfront_color = u_frontColor * brightness;\n\tback_color = u_backColor * brightness;\n\toutline_color = u_outlineColor;\n}\n";
    outlined_model_300_vert: "#version 300 es\nuniform mat4 u_modelView;\nuniform mat4 u_matrix;\nuniform vec3 u_frontColor;\nuniform vec3 u_backColor;\nuniform vec3 u_outlineColor;\nin vec3 v_position;\nin vec3 v_normal;\nin vec3 v_barycentric;\nin float v_rawEdge;\nout vec3 front_color;\nout vec3 back_color;\nout vec3 outline_color;\nout vec3 barycentric;\n// flat out int rawEdge;\nflat out int provokedVertex;\nvoid main () {\n\tgl_Position = u_matrix * vec4(v_position, 1);\n\tprovokedVertex = gl_VertexID;\n\tbarycentric = v_barycentric;\n\t// rawEdge = int(v_rawEdge);\n\tvec3 light = abs(normalize((vec4(v_normal, 1) * u_modelView).xyz));\n\tfloat brightness = 0.5 + light.x * 0.15 + light.z * 0.35;\n\tfront_color = u_frontColor * brightness;\n\tback_color = u_backColor * brightness;\n\toutline_color = u_outlineColor;\n}\n";
    model_300_frag: "#version 300 es\n#ifdef GL_FRAGMENT_PRECISION_HIGH\n  precision highp float;\n#else\n  precision mediump float;\n#endif\nuniform float u_opacity;\nin vec3 front_color;\nin vec3 back_color;\nout vec4 outColor;\nvoid main () {\n\tgl_FragDepth = gl_FragCoord.z;\n\tvec3 color = gl_FrontFacing ? front_color : back_color;\n\toutColor = vec4(color, u_opacity);\n}\n";
    simple_100_frag: "#version 100\nprecision mediump float;\nvarying vec3 blend_color;\nvoid main () {\n\tgl_FragColor = vec4(blend_color.rgb, 1);\n}\n";
    foldedFormFaces: (gl: WebGLRenderingContext | WebGL2RenderingContext, version?: number, graph?: FOLD, options?: {
        earcut?: Function;
        layerNudge?: number;
        showTriangulation?: boolean;
    }) => WebGLModel;
    foldedFormEdges: (gl: WebGLRenderingContext | WebGL2RenderingContext, version?: number, graph?: FOLD, options?: {
        assignment_color?: any;
    }) => WebGLModel;
    foldedFormFacesOutlined: (gl: WebGLRenderingContext | WebGL2RenderingContext, version?: number, graph?: FOLD, options?: {
        earcut?: Function;
        layerNudge?: number;
        showTriangulation?: boolean;
    }) => WebGLModel;
    foldedForm: (gl: WebGLRenderingContext | WebGL2RenderingContext, version?: number, graph?: FOLD, options?: {
        edges?: boolean;
        faces?: boolean;
        outlines?: boolean;
        earcut?: Function;
        layerNudge?: number;
        showTriangulation?: boolean;
        assignment_color?: any;
    }) => WebGLModel[];
    makeFacesVertexData: ({ vertices_coords, edges_assignment, faces_vertices, faces_edges, faces_normal, }: FOLDExtended, options?: {
        showTriangulation?: boolean;
    }) => {
        vertices_coords: [number, number][] | [number, number, number][];
        vertices_normal: number[][];
        vertices_barycentric: [number, number, number][];
    };
    makeThickEdgesVertexData: (graph: FOLD, options: {
        assignment_color?: any;
        dark: boolean;
    }) => {
        vertices_coords: any;
        vertices_color: any;
        verticesEdgesVector: any;
        vertices_vector: any;
    };
    makeFoldedVertexArrays: (gl: WebGLRenderingContext | WebGL2RenderingContext, program: any, { vertices_coords, edges_vertices, edges_assignment, faces_vertices, faces_edges, faces_normal, }?: FOLDExtended, options?: {
        showTriangulation?: boolean;
    }) => WebGLVertexArray[];
    makeFoldedElementArrays: (gl: WebGLRenderingContext | WebGL2RenderingContext, version?: number, graph?: FOLD) => WebGLElementArray[];
    makeThickEdgesVertexArrays: (gl: WebGLRenderingContext | WebGL2RenderingContext, program: any, graph: FOLD, options?: {
        assignment_color?: any;
    }) => WebGLVertexArray[];
    makeThickEdgesElementArrays: (gl: WebGLRenderingContext | WebGL2RenderingContext, version?: number, graph?: FOLD) => WebGLElementArray[];
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