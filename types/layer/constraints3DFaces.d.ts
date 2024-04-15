export function constraints3DFaceClusters({ vertices_coords, edges_vertices, edges_faces, edges_assignment, edges_foldAngle, faces_vertices, faces_edges, faces_faces, }: FOLD, epsilon?: number): {
    planes_transform: number[][];
    faces_plane: number[];
    faces_cluster: number[];
    faces_winding: boolean[];
    faces_polygon: [number, number][][];
    faces_center: [number, number][];
    clusters_faces: number[][];
    clusters_graph: FOLD[];
    clusters_transform: number[][];
    facesFacesOverlap: number[][];
    facePairs: string[];
};
