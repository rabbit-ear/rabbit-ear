/**
 * @description flatten only until the point of comma separated entities.
 * This will preserve vectors (number[]) in an array of array of vectors.
 * @param {any[][]} args any array, intended to contain arrays of arrays.
 * @returns {array[]} a flattened copy, flattened up until the point before
 * combining arrays of elements.
 */
export function svgSemiFlattenArrays(...args: any[]): any[][];
export { svgSemiFlattenArrays as default };
//# sourceMappingURL=semiFlattenArrays.d.ts.map