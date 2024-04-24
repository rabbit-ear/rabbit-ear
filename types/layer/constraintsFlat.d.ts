export function makeConstraintsLookup(constraints: {
    taco_taco: TacoTacoConstraint[];
    taco_tortilla: TacoTortillaConstraint[];
    tortilla_tortilla: TortillaTortillaConstraint[];
    transitivity: TransitivityConstraint[];
}): {
    taco_taco: number[][];
    taco_tortilla: number[][];
    tortilla_tortilla: number[][];
    transitivity: number[][];
};
export function makeSolverConstraintsFlat({ vertices_coords, edges_vertices, edges_faces, edges_assignment, faces_vertices, faces_edges, faces_center, }: FOLDExtended, epsilon?: number): {
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
//# sourceMappingURL=constraintsFlat.d.ts.map