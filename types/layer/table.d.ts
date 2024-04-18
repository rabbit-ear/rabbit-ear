/**
 * @name table
 * @memberof layer
 * @constant
 * @type {{
 *   taco_taco: {[key:string]: Readonly<(boolean | [number, number])>},
 *   taco_tortilla: {[key:string]: Readonly<(boolean | [number, number])>},
 *   tortilla_tortilla: {[key:string]: Readonly<(boolean | [number, number])>},
 *   transitivity: {[key:string]: Readonly<(boolean | [number, number])>},
 * }}
 * @description This lookup table encodes all possible taco-taco,
 * taco-tortilla, tortilla-tortilla, and transitivity constraints between
 * groups of faces in a folded graph. Given an encoded state, as a key
 * of this object, the value represents either:
 * - {boolean} true: the layer order is so far valid
 * - {boolean} false: the layer order is invalid
 * - {[number, number]}: the layer order is valid, and, here is another
 * relationship which can be inferred from the current state.
 * This is an implementation of an algorithm designed by [Jason Ku](//jasonku.mit.edu).
 */
export const table: {
    taco_taco: {
        [key: string]: Readonly<(boolean | [number, number])>;
    };
    taco_tortilla: {
        [key: string]: Readonly<(boolean | [number, number])>;
    };
    tortilla_tortilla: {
        [key: string]: Readonly<(boolean | [number, number])>;
    };
    transitivity: {
        [key: string]: Readonly<(boolean | [number, number])>;
    };
};
