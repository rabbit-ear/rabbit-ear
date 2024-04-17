export function foldGraphIntoSegments({ vertices_coords, edges_vertices, edges_foldAngle, edges_assignment, faces_vertices, faces_edges, faces_faces, }: FOLD, { vector, origin }: VecLine2, assignment?: string, epsilon?: number): {
    intersections: (FaceEdgeEvent | FaceVertexEvent)[];
    assignment: string;
    points: [number, number][];
}[];
