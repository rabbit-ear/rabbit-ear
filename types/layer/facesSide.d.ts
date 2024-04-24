export function makeEdgesFacesSide({ vertices_coords, edges_vertices, edges_faces, faces_center, }: FOLDExtended): number[][];
export function makeEdgePairsFacesSide({ vertices_coords, edges_vertices, edges_faces, faces_center }: FOLDExtended, edgePairs: [number, number][]): [[number, number], [number, number]][];
export function makeEdgesFacesSide2D({ vertices_coords, edges_faces, faces_vertices, faces_center }: FOLDExtended, { lines, edges_line }: {
    lines: VecLine[];
    edges_line: number[];
    faces_plane: number[];
    planes_transform: number[][];
}): number[][];
export function makeEdgesFacesSide3D({ vertices_coords, edges_faces, faces_vertices, faces_center }: FOLDExtended, { lines, edges_line, planes_transform, faces_plane }: {
    lines: VecLine[];
    edges_line: number[];
    faces_plane: number[];
    planes_transform: number[][];
}): number[][];
//# sourceMappingURL=facesSide.d.ts.map