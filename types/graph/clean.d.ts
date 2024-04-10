export default clean;
/**
 * @description This method will remove bad graph data. this includes:
 * - duplicate (distance in 2D/3D) and isolated vertices
 * - circular and duplicate edges.
 * @param {FOLD} graph a FOLD object
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {object} summary of changes, a nextmap and the indices removed.
 */
declare function clean(graph: FOLD, epsilon?: number): object;
