export function getBranches(remainingKeys: string[], constraints: {
    taco_taco: TacoTacoConstraint[];
    taco_tortilla: TacoTortillaConstraint[];
    tortilla_tortilla: TortillaTortillaConstraint[];
    transitivity: TransitivityConstraint[];
}, lookup: {
    taco_taco: number[][];
    taco_tortilla: number[][];
    tortilla_tortilla: number[][];
    transitivity: number[][];
}): string[][];
//# sourceMappingURL=getBranches.d.ts.map