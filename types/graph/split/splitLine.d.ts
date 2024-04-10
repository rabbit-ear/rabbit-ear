export function splitLineToSegments({ vertices_coords, edges_vertices, faces_vertices, faces_edges }: {
    vertices_coords: any;
    edges_vertices: any;
    faces_vertices: any;
    faces_edges: any;
}, { vector, origin }: {
    vector: any;
    origin: any;
}, lineDomain?: (_: number, __?: number) => boolean, interiorPoints?: any[], epsilon?: number): {
    vertices: number[];
    edges: any[];
    faces: any[];
    segments: {
        vertices: any[];
    };
};
export function splitLineIntoEdges({ vertices_coords, edges_vertices, faces_vertices, faces_edges }: FOLD, line: VecLine, lineDomain?: Function, interiorPoints?: number[][], epsilon?: number): FOLD;
