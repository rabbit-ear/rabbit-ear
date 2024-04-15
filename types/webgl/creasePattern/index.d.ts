declare const _default: {
    makeUniforms: (gl: WebGLRenderingContext | WebGL2RenderingContext, { projectionMatrix, modelViewMatrix, cpColor, strokeWidth, }: {
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
};
export default _default;
