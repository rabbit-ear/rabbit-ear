export function solver({ constraints, lookup, facePairs, orders }: {
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
    orders: {
        [key: string]: number;
    };
}): LayerSolverSolution;
//# sourceMappingURL=solver.d.ts.map