export default removeGeometryIndices;
/**
 * @name remove
 * @memberof graph
 * @description Removes vertices, edges, or faces (or anything really)
 * remove elements from inside arrays, shift up remaining components,
 * and updates all relevant references across other arrays due to shifting.
 * For outer arrays, this will remove the entire element, for inner arrays,
 * this will replace an occurrence with "undefined".
 * @param {FOLD} graph a FOLD object
 * @param {string} key like "vertices", the prefix of the arrays
 * @param {number[]} removeIndices an array of vertex indices, like [1,9,25]
 * @returns {number[]} a map of changes to the graph
 * @example remove(foldObject, "vertices", [2,6,11,15]);
 * @example
 * removing index 5 from a 10-long vertices list will shift all
 * indices > 5 up by one, and then will look through all other arrays like
 * edges_vertices, faces_vertices and update any reference to indices 6-9
 * to match their new positions 5-8.
 *
 * this can handle removing multiple indices at once; and is faster than
 * otherwise calling this multiple times with only one or a few removals.
 * @example
 * given removeIndices: [4, 6, 7]
 * given a geometry array: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
 * map becomes (where _ is undefined): [0, 1, 2, 3, _, 4, _, _, 5, 6]
 */
declare function removeGeometryIndices(graph: FOLD, key: string, removeIndices: number[]): number[];
