export function propagate(constraints: {
    taco_taco: TacoTacoConstraint[];
    taco_tortilla: TacoTortillaConstraint[];
    tortilla_tortilla: TortillaTortillaConstraint[];
    transitivity: TransitivityConstraint[];
}, constraintsLookup: {
    taco_taco: number[][];
    taco_tortilla: number[][];
    tortilla_tortilla: number[][];
    transitivity: number[][];
}, initiallyModifiedFacePairs: string[], ...orders: {
    [key: string]: number;
}[]): {
    [key: string]: number;
};
