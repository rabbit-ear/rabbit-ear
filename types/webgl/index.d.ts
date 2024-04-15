declare const _default: {
    cpFacesV1: (gl: any, graph?: {}, options?: any) => {
        program: WebGLProgram;
        vertexArrays: {
            location: any;
            buffer: any;
            type: any;
            length: number;
            data: Float32Array;
        }[];
        elementArrays: {
            mode: any;
            buffer: any;
            data: Uint16Array | Uint32Array;
        }[];
        flags: any[];
        makeUniforms: (gl: any, { projectionMatrix, modelViewMatrix, cpColor, strokeWidth, }: {
            projectionMatrix: any;
            modelViewMatrix: any;
            cpColor: any;
            strokeWidth: any;
        }) => {
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
    };
    cpEdgesV1: (gl: any, graph?: {}, options?: any) => {
        program: WebGLProgram;
        vertexArrays: {
            location: any;
            buffer: any;
            type: any;
            length: any;
            data: Float32Array;
        }[];
        elementArrays: {
            mode: any;
            buffer: any;
            data: Uint16Array | Uint32Array;
        }[];
        flags: any[];
        makeUniforms: (gl: any, { projectionMatrix, modelViewMatrix, cpColor, strokeWidth, }: {
            projectionMatrix: any;
            modelViewMatrix: any;
            cpColor: any;
            strokeWidth: any;
        }) => {
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
    };
    cpFacesV2: (gl: any, graph?: {}, options?: any) => {
        program: WebGLProgram;
        vertexArrays: {
            location: any;
            buffer: any;
            type: any;
            length: number;
            data: Float32Array;
        }[];
        elementArrays: {
            mode: any;
            buffer: any;
            data: Uint16Array | Uint32Array;
        }[];
        flags: any[];
        makeUniforms: (gl: any, { projectionMatrix, modelViewMatrix, cpColor, strokeWidth, }: {
            projectionMatrix: any;
            modelViewMatrix: any;
            cpColor: any;
            strokeWidth: any;
        }) => {
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
    };
    cpEdgesV2: (gl: any, graph?: {}, options?: any) => {
        program: WebGLProgram;
        vertexArrays: {
            location: any;
            buffer: any;
            type: any;
            length: any;
            data: Float32Array;
        }[];
        elementArrays: {
            mode: any;
            buffer: any;
            data: Uint16Array | Uint32Array;
        }[];
        flags: any[];
        makeUniforms: (gl: any, { projectionMatrix, modelViewMatrix, cpColor, strokeWidth, }: {
            projectionMatrix: any;
            modelViewMatrix: any;
            cpColor: any;
            strokeWidth: any;
        }) => {
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
    };
    makeCPEdgesVertexData: (graph: any, options: any) => {
        vertices_coords: any;
        vertices_color: any;
        verticesEdgesVector: any;
        vertices_vector: any;
    };
    makeCPEdgesVertexArrays: (gl: any, program: any, graph: FOLD, options: any) => {
        location: any;
        buffer: any;
        type: any;
        length: any;
        data: Float32Array;
    }[];
    makeCPEdgesElementArrays: (gl: any, version?: number, graph?: {}) => {
        mode: any;
        buffer: any;
        data: Uint16Array | Uint32Array;
    }[];
    makeCPFacesVertexArrays: (gl: any, program: any, graph: any) => {
        location: any;
        buffer: any;
        type: any;
        length: number;
        data: Float32Array;
    }[];
    makeCPFacesElementArrays: (gl: any, version?: number, graph?: {}) => {
        mode: any;
        buffer: any;
        data: Uint16Array | Uint32Array;
    }[];
    foldedFormFaces: (gl: any, version?: number, graph?: {}, options?: {}) => {
        program: WebGLProgram;
        vertexArrays: {
            location: any;
            buffer: any;
            type: any;
            length: any;
            data: Float32Array;
        }[];
        elementArrays: {
            mode: any;
            buffer: any;
            data: Uint16Array | Uint32Array;
        }[];
        flags: any[];
        makeUniforms: (gl: any, { projectionMatrix, modelViewMatrix, frontColor, backColor, outlineColor, strokeWidth, opacity, }: {
            projectionMatrix: any;
            modelViewMatrix: any;
            frontColor: any;
            backColor: any;
            outlineColor: any;
            strokeWidth: any;
            opacity: any;
        }) => {
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
    };
    foldedFormEdges: (gl: any, version?: number, graph?: {}, options?: {}) => {
        program: WebGLProgram;
        vertexArrays: {
            location: any;
            buffer: any;
            type: any;
            length: any;
            data: Float32Array;
        }[];
        elementArrays: {
            mode: any;
            buffer: any;
            data: Uint16Array | Uint32Array;
        }[];
        flags: any[];
        makeUniforms: (gl: any, { projectionMatrix, modelViewMatrix, frontColor, backColor, outlineColor, strokeWidth, opacity, }: {
            projectionMatrix: any;
            modelViewMatrix: any;
            frontColor: any;
            backColor: any;
            outlineColor: any;
            strokeWidth: any;
            opacity: any;
        }) => {
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
    };
    foldedFormFacesOutlined: (gl: any, version?: number, graph?: {}, options?: {}) => {
        program: WebGLProgram;
        vertexArrays: {
            location: any;
            buffer: any;
            type: any;
            length: any;
            data: Float32Array;
        }[];
        elementArrays: {
            mode: any;
            buffer: any;
            data: Uint16Array | Uint32Array;
        }[];
        flags: any[];
        makeUniforms: (gl: any, { projectionMatrix, modelViewMatrix, frontColor, backColor, outlineColor, strokeWidth, opacity, }: {
            projectionMatrix: any;
            modelViewMatrix: any;
            frontColor: any;
            backColor: any;
            outlineColor: any;
            strokeWidth: any;
            opacity: any;
        }) => {
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
    };
    makeFacesVertexData: ({ vertices_coords, edges_assignment, faces_vertices, faces_edges, faces_normal, }: {
        vertices_coords: any;
        edges_assignment: any;
        faces_vertices: any;
        faces_edges: any;
        faces_normal: any;
    }, options?: {}) => {
        vertices_coords: any;
        vertices_normal: number[][];
        vertices_barycentric: any;
    };
    makeThickEdgesVertexData: (graph: any, options: any) => {
        vertices_coords: any;
        vertices_color: any;
        verticesEdgesVector: any;
        vertices_vector: any;
    };
    makeFoldedVertexArrays: (gl: any, program: any, { vertices_coords, edges_vertices, edges_assignment, faces_vertices, faces_edges, faces_normal, }?: FOLD, options?: {}) => {
        location: any;
        buffer: any;
        type: any;
        length: any;
        data: Float32Array;
    }[];
    makeFoldedElementArrays: (gl: any, version?: number, graph?: {}) => {
        mode: any;
        buffer: any;
        data: Uint16Array | Uint32Array;
    }[];
    makeThickEdgesVertexArrays: (gl: any, program: any, graph: any, options?: {}) => {
        location: any;
        buffer: any;
        type: any;
        length: any;
        data: Float32Array;
    }[];
    makeThickEdgesElementArrays: (gl: any, version?: number, graph?: {}) => {
        mode: any;
        buffer: any;
        data: Uint16Array | Uint32Array;
    }[];
    drawProgram: (gl: any, version: number, bundle: any, uniforms?: any) => void;
    deallocProgram: (gl: any, bundle: any) => void;
    rebuildViewport: (gl: any, canvas: HTMLCanvasElement) => void;
    makeProjectionMatrix: (canvas: any, perspective?: string, fov?: number) => readonly number[];
    makeModelMatrix: (graph: FOLD) => readonly number[];
    initializeWebGL: (canvasElement: any, preferredVersion: any) => {
        gl: any;
        version: any;
    };
    createProgram: (gl: WebGLRenderingContext, vertexSource: string, fragmentSource: string) => WebGLProgram;
    foldedForm: (gl: any, version?: number, graph?: {}, options?: {}) => {
        program: WebGLProgram;
        vertexArrays: {
            location: any;
            buffer: any;
            type: any;
            length: any;
            data: Float32Array;
        }[];
        elementArrays: {
            mode: any;
            buffer: any;
            data: Uint16Array | Uint32Array;
        }[];
        flags: any[];
        makeUniforms: (gl: any, { projectionMatrix, modelViewMatrix, frontColor, backColor, outlineColor, strokeWidth, opacity, }: {
            projectionMatrix: any;
            modelViewMatrix: any;
            frontColor: any;
            backColor: any;
            outlineColor: any;
            strokeWidth: any;
            opacity: any;
        }) => {
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
    }[];
    creasePattern: (gl: any, version?: number, graph?: {}, options?: any) => {
        program: WebGLProgram;
        vertexArrays: {
            location: any;
            buffer: any;
            type: any;
            length: any;
            data: Float32Array;
        }[];
        elementArrays: {
            mode: any;
            buffer: any;
            data: Uint16Array | Uint32Array;
        }[];
        flags: any[];
        makeUniforms: (gl: any, { projectionMatrix, modelViewMatrix, cpColor, strokeWidth, }: {
            projectionMatrix: any;
            modelViewMatrix: any;
            cpColor: any;
            strokeWidth: any;
        }) => {
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
    }[];
};
export default _default;
