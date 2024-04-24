declare const _default: {
    maekawaSolver: (vertices_edgesAssignments: string[]) => string[][];
    alternatingSum: (numbers: number[]) => number[];
    alternatingSumDifference: (sectors: number[]) => number[];
    kawasakiSolutionsRadians: (radians: number[]) => number[];
    kawasakiSolutionsVectors: (vectors: number[][]) => [number, number][];
    kawasakiSolutions: ({ vertices_coords, vertices_edges, edges_assignment, edges_vertices }: FOLD, vertex: number) => number[][];
    verticesFoldability: ({ vertices_coords, vertices_vertices, vertices_edges, vertices_faces, edges_vertices, edges_foldAngle, edges_vector, faces_vertices, }: FOLDExtended) => number[];
    verticesFoldable: (graph: FOLD, epsilon?: number) => boolean[];
    verticesFlatFoldabilityMaekawa: ({ edges_vertices, vertices_edges, edges_assignment, }: FOLD) => number[];
    verticesFlatFoldabilityKawasaki: ({ vertices_coords, vertices_vertices, vertices_edges, edges_vertices, edges_assignment, }: FOLD) => number[];
    verticesFlatFoldableMaekawa: (graph: FOLD) => boolean[];
    verticesFlatFoldableKawasaki: (graph: FOLD, epsilon?: number) => boolean[];
    verticesFlatFoldability: (graph: FOLD, epsilon?: number) => number[];
    verticesFlatFoldable: (graph: FOLD, epsilon?: number) => boolean[];
    foldDegree4: (sectors: number[], assignments: string[], foldAngle?: number) => number[];
};
export default _default;
//# sourceMappingURL=index.d.ts.map