export function getOverlapFacesWith3DEdge({ edges_faces }: FOLD, { clusters_graph, faces_plane }: {
    clusters_graph: FOLD[];
    faces_plane: number[];
}, epsilon?: number): {
    edge: number;
    tortilla: number;
    coplanar: number;
    angled: number;
}[];
export function solveOverlapFacesWith3DEdge({ edges_foldAngle }: FOLD, edgeFace3DOverlaps: {
    edge: number;
    tortilla: number;
    coplanar: number;
    angled: number;
}[], faces_winding: boolean[]): {
    [key: string]: number;
};
export function solveFacePair3D({ edges_foldAngle, faces_winding }: {
    edges_foldAngle: number[];
    faces_winding: boolean[];
}, edges: number[], faces: number[]): {
    [key: string]: number;
};
export function getSolvable3DEdgePairs({ edges_faces, faces_plane, edgePairs, facesFacesLookup, }: {
    edges_faces: number[][];
    edgePairs: [number, number][];
    faces_plane: number[];
    facesFacesLookup: boolean[][];
}): {
    tJunctions: number[];
    yJunctions: number[];
    bentFlatTortillas: number[];
    bentTortillas: number[];
    bentTortillasFlatTaco: number[];
};
export function constraints3DEdges({ vertices_coords, edges_vertices, edges_faces, edges_foldAngle, }: FOLD, { faces_plane, faces_winding, facesFacesOverlap, }: {
    faces_plane: number[];
    faces_winding: boolean[];
    facesFacesOverlap: number[][];
}, epsilon?: number): {
    orders: {
        [key: string]: number;
    };
    taco_tortilla: TacoTortillaConstraint[];
    tortilla_tortilla: TortillaTortillaConstraint[];
};
//# sourceMappingURL=constraints3DEdges.d.ts.map