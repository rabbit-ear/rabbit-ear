export function getFacesPlane({ vertices_coords, faces_vertices }: FOLD, epsilon?: number): {
    planes: {
        normal: number[];
        origin: number[];
    }[];
    planes_faces: number[][];
    planes_transform: number[][];
    faces_plane: number[];
    faces_winding: boolean[];
};
export function getCoplanarAdjacentOverlappingFaces({ vertices_coords, faces_vertices, faces_faces }: FOLD, epsilon?: number): {
    planes: {
        normal: number[];
        origin: number[];
    }[];
    planes_faces: number[][];
    planes_transform: number[][];
    planes_clusters: number[][];
    faces_winding: boolean[];
    faces_plane: number[];
    faces_cluster: number[];
    clusters_plane: number[];
    clusters_faces: number[][];
};
//# sourceMappingURL=planes.d.ts.map