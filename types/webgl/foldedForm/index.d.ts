declare const _default: {
    makeUniforms: ({ projectionMatrix, modelViewMatrix, frontColor, backColor, outlineColor, strokeWidth, opacity, }: {
        projectionMatrix: any;
        modelViewMatrix: any;
        frontColor: any;
        backColor: any;
        outlineColor: any;
        strokeWidth: any;
        opacity: any;
    }) => {
        [key: string]: WebGLUniform;
    };
    model_300_vert: "#version 300 es\nuniform mat4 u_modelView;\nuniform mat4 u_matrix;\nuniform vec3 u_frontColor;\nuniform vec3 u_backColor;\nin vec3 v_position;\nin vec3 v_normal;\nout vec3 front_color;\nout vec3 back_color;\nvoid main () {\n\tgl_Position = u_matrix * vec4(v_position, 1);\n\tvec3 light = abs(normalize((vec4(v_normal, 1) * u_modelView).xyz));\n\tfloat brightness = 0.5 + light.x * 0.15 + light.z * 0.35;\n\tfront_color = u_frontColor * brightness;\n\tback_color = u_backColor * brightness;\n}\n";
    thick_edges_300_vert: "#version 300 es\nuniform mat4 u_matrix;\nuniform mat4 u_projection;\nuniform mat4 u_modelView;\nuniform float u_strokeWidth;\nin vec3 v_position;\nin vec3 v_color;\nin vec3 edge_vector;\nin vec2 vertex_vector;\nout vec3 blend_color;\nvoid main () {\n\tvec3 edge_norm = normalize(edge_vector);\n\t// axis most dissimilar to edge_vector\n\tvec3 absNorm = abs(edge_norm);\n\tvec3 xory = absNorm.x < absNorm.y ? vec3(1,0,0) : vec3(0,1,0);\n\tvec3 axis = absNorm.x > absNorm.z && absNorm.y > absNorm.z ? vec3(0,0,1) : xory;\n\t// two perpendiculars. with edge_vector these make basis vectors\n\tvec3 one = cross(axis, edge_norm);\n\tvec3 two = cross(one, edge_norm);\n\tvec3 displaceNormal = normalize(\n\t\tone * vertex_vector.x + two * vertex_vector.y\n\t);\n\tvec3 displace = displaceNormal * (u_strokeWidth * 0.5);\n\tgl_Position = u_matrix * vec4(v_position + displace, 1);\n\tblend_color = v_color;\n}\n";
    outlined_model_300_frag: "#version 300 es\n#ifdef GL_FRAGMENT_PRECISION_HIGH\n  precision highp float;\n#else\n  precision mediump float;\n#endif\nuniform float u_opacity;\nin vec3 front_color;\nin vec3 back_color;\nin vec3 outline_color;\nin vec3 barycentric;\nout vec4 outColor;\nfloat edgeFactor(vec3 barycenter) {\n\tvec3 d = fwidth(barycenter);\n\tvec3 a3 = smoothstep(vec3(0.0), d*3.5, barycenter);\n\treturn min(min(a3.x, a3.y), a3.z);\n}\nvoid main () {\n\tgl_FragDepth = gl_FragCoord.z;\n\tvec3 color = gl_FrontFacing ? front_color : back_color;\n\t// vec4 color4 = gl_FrontFacing\n\t// \t? vec4(front_color, u_opacity)\n\t// \t: vec4(back_color, u_opacity);\n\t// vec4 outline4 = vec4(outline_color, 1);\n\t// outColor = vec4(mix(vec3(0.0), color, edgeFactor(barycentric)), u_opacity);\n\toutColor = vec4(mix(outline_color, color, edgeFactor(barycentric)), u_opacity);\n\t// outColor = mix(outline4, color4, edgeFactor(barycentric));\n}\n";
    outlined_model_100_frag: "#version 100\nprecision mediump float;\nuniform float u_opacity;\nvarying vec3 barycentric;\nvarying vec3 front_color;\nvarying vec3 back_color;\nvarying vec3 outline_color;\nvoid main () {\n\tvec3 color = gl_FrontFacing ? front_color : back_color;\n\t// vec3 boundary = vec3(0.0, 0.0, 0.0);\n\tvec3 boundary = outline_color;\n\t// gl_FragDepth = 0.5;\n\tgl_FragColor = any(lessThan(barycentric, vec3(0.02)))\n\t\t? vec4(boundary, u_opacity)\n\t\t: vec4(color, u_opacity);\n}\n";
    model_100_vert: "#version 100\nattribute vec3 v_position;\nattribute vec3 v_normal;\nuniform mat4 u_projection;\nuniform mat4 u_modelView;\nuniform mat4 u_matrix;\nuniform vec3 u_frontColor;\nuniform vec3 u_backColor;\nvarying vec3 normal_color;\nvarying vec3 front_color;\nvarying vec3 back_color;\nvoid main () {\n\tgl_Position = u_matrix * vec4(v_position, 1);\n\tvec3 light = abs(normalize((vec4(v_normal, 1) * u_modelView).xyz));\n\tfloat brightness = 0.5 + light.x * 0.15 + light.z * 0.35;\n\tfront_color = u_frontColor * brightness;\n\tback_color = u_backColor * brightness;\n}\n";
    thick_edges_100_vert: "#version 100\nattribute vec3 v_position;\nattribute vec3 v_color;\nattribute vec3 edge_vector;\nattribute vec2 vertex_vector;\nuniform mat4 u_matrix;\nuniform mat4 u_projection;\nuniform mat4 u_modelView;\nuniform float u_strokeWidth;\nvarying vec3 blend_color;\nvoid main () {\n\tvec3 edge_norm = normalize(edge_vector);\n\t// axis most dissimilar to edge_vector\n\tvec3 absNorm = abs(edge_norm);\n\tvec3 xory = absNorm.x < absNorm.y ? vec3(1,0,0) : vec3(0,1,0);\n\tvec3 axis = absNorm.x > absNorm.z && absNorm.y > absNorm.z ? vec3(0,0,1) : xory;\n\t// two perpendiculars. with edge_vector these make basis vectors\n\tvec3 one = cross(axis, edge_norm);\n\tvec3 two = cross(one, edge_norm);\n\tvec3 displaceNormal = normalize(\n\t\tone * vertex_vector.x + two * vertex_vector.y\n\t);\n\tvec3 displace = displaceNormal * (u_strokeWidth * 0.5);\n\tgl_Position = u_matrix * vec4(v_position + displace, 1);\n\tblend_color = v_color;\n}\n";
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
};
export default _default;
//# sourceMappingURL=index.d.ts.map