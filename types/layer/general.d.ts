/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @constant
 * @type {string[]}
 */
export const tacoTypeNames: string[];
export function emptyCategoryObject(): {
    taco_taco: any;
    taco_tortilla: any;
    tortilla_tortilla: any;
    transitivity: any;
};
/**
 * @description Convert an array of faces which are involved in one
 * taco/tortilla/transitivity condition into an array of arrays where
 * each face is paired with the others in the precise combination that
 * the solver is expecting for this particular condition.
 * @type {{
 *   taco_taco: (f: TacoTacoConstraint) => [number, number][],
 *   taco_tortilla: (f: TacoTortillaConstraint) => [number, number][],
 *   tortilla_tortilla: (f: TortillaTortillaConstraint) => [number, number][],
 *   transitivity: (f: TransitivityConstraint) => [number, number][],
 * }}
 */
export const constraintToFacePairs: {
    taco_taco: (f: TacoTacoConstraint) => [number, number][];
    taco_tortilla: (f: TacoTortillaConstraint) => [number, number][];
    tortilla_tortilla: (f: TortillaTortillaConstraint) => [number, number][];
    transitivity: (f: TransitivityConstraint) => [number, number][];
};
/**
 * @description Convert an array of faces which are involved in one
 * taco/tortilla/transitivity condition into an array of arrays where
 * each face is paired with the others in the precise combination that
 * the solver is expecting for this particular condition.
 * @type {{
 *   taco_taco: (f: TacoTacoConstraint) => string[],
 *   taco_tortilla: (f: TacoTortillaConstraint) => string[],
 *   tortilla_tortilla: (f: TortillaTortillaConstraint) => string[],
 *   transitivity: (f: TransitivityConstraint) => string[],
 * }}
 */
export const constraintToFacePairsStrings: {
    taco_taco: (f: TacoTacoConstraint) => string[];
    taco_tortilla: (f: TacoTortillaConstraint) => string[];
    tortilla_tortilla: (f: TortillaTortillaConstraint) => string[];
    transitivity: (f: TransitivityConstraint) => string[];
};
export function solverSolutionToFaceOrders(facePairOrders: object, faces_winding: boolean[]): [number, number, number][];
export function mergeWithoutOverwrite(orders: {
    [key: string]: number;
}[]): {
    [key: string]: number;
};
