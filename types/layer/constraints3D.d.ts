export function makeSolverConstraints3D({ vertices_coords, edges_vertices, edges_faces, edges_assignment, edges_foldAngle, faces_vertices, faces_edges, faces_faces, }: FOLD, epsilon?: number): {
    constraints: {
        taco_taco: TacoTacoConstraint[];
        taco_tortilla: TacoTortillaConstraint[];
        tortilla_tortilla: TortillaTortillaConstraint[];
        transitivity: TransitivityConstraint[];
    };
    lookup: {
        taco_taco: number[][];
        taco_tortilla: number[][];
        tortilla_tortilla: number[][];
        transitivity: number[][];
    };
    facePairs: string[];
    faces_winding: boolean[];
    orders: {
        [key: string]: number;
    };
};
//# sourceMappingURL=constraints3D.d.ts.map