export function intersectLineVertices({ vertices_coords }: FOLD, { vector, origin }: VecLine2, lineDomain?: Function, epsilon?: number): (number | undefined)[];
export function intersectLineVerticesEdges({ vertices_coords, edges_vertices }: FOLD, { vector, origin }: VecLine2, lineDomain?: Function, epsilon?: number): {
    vertices: number[];
    edges: LineLineEvent[];
};
export function intersectLine({ vertices_coords, edges_vertices, faces_vertices, faces_edges }: FOLD, { vector, origin }: VecLine2, lineDomain?: Function, epsilon?: number): {
    vertices: number[];
    edges: LineLineEvent[];
    faces: (FaceEdgeEvent | FaceVertexEvent)[][];
};
export function intersectLineAndPoints({ vertices_coords, edges_vertices, faces_vertices, faces_edges }: FOLD, { vector, origin }: VecLine2, lineDomain?: Function, interiorPoints?: [number, number][], epsilon?: number): {
    vertices: number[];
    edges: LineLineEvent[];
    faces: {
        vertices: FaceVertexEvent[];
        edges: FaceEdgeEvent[];
        points: FacePointEvent[];
    }[];
};
export function filterCollinearFacesData({ edges_vertices }: FOLD, { vertices, faces }: {
    vertices: number[];
    edges: LineLineEvent[];
    faces: {
        vertices: FaceVertexEvent[];
        edges: FaceEdgeEvent[];
        points: FacePointEvent[];
    }[];
}): void;
//# sourceMappingURL=intersect.d.ts.map