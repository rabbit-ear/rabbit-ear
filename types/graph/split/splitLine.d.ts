export function splitLineToSegments({ vertices_coords, edges_vertices, faces_vertices, faces_edges }: FOLD, { vector, origin }: VecLine2, lineDomain?: Function, interiorPoints?: [number, number][], epsilon?: number): {
    vertices: number[];
    edges: LineLineEvent[];
    faces: {
        vertices: FaceVertexEvent[];
        edges: FaceEdgeEvent[];
        points: FacePointEvent[];
    }[];
    segments: {
        vertices: any[];
    };
};
export function splitLineIntoEdges({ vertices_coords, edges_vertices, faces_vertices, faces_edges }: FOLD, line: VecLine2, lineDomain?: Function, interiorPoints?: [number, number][], epsilon?: number): {
    vertices?: number[];
    edges_vertices?: number[][];
    edges_collinear?: boolean[];
    edges_face?: number[][];
};
