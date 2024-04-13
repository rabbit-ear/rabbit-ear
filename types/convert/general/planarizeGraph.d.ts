export default planarizeGraph;
/**
 * @description Resolve all crossing edges, build faces,
 * walk and discover the boundary.
 * @param {FOLD} graph a FOLD object
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {FOLD}
 */
declare function planarizeGraph(graph: FOLD, epsilon?: number): FOLD;
