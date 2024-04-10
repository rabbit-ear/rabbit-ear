export default replaceGeometryIndices;
/**
 * @name replace
 * @memberof graph
 * @description Replaces vertices, edges, or faces (or anything really)
 * replace elements from inside arrays, shift up remaining components,
 * and updates all relevant references across other arrays due to shifting.
 * @param {FOLD} graph a FOLD object
 * @param {string} key like "vertices", the prefix of the arrays
 * @param {number[]} replaceIndices an array of vertex indices, like [1,9,25]
 * @returns {number[]} a map of changes to the graph
 * @example replace(foldObject, "vertices", [2,6,11,15]);
 * @example
 * replaceIndices: [4:3, 7:5, 8:3, 12:3, 14:9] where
 * - keys are indices to remove.
 * - values are the new indices that these old ones will become.
 * note: all values are less than their indices.
 *
 * for example: removing index 5 from a 10-long vertices list will shift all
 * indices > 5 up by one, and then will look through all other arrays like
 * edges_vertices, faces_vertices and update any reference to indices 6-9
 * to match their new positions 5-8.
 *
 * this can handle removing multiple indices at once; and is faster than
 * otherwise calling this multiple times with only one or a few removals.
 */
declare function replaceGeometryIndices(graph: FOLD, key: string, replaceIndices: number[]): number[];
