export default normalize;
/**
 * @description This method will re-index all component arrays so that
 * there are no arrays with holes (if vertices_ contains vertex 4 but not 3).
 * Arrays with holes are a result of some methods, like subgraph() which is
 * designed so that the user can re-merge the graphs. Alternatively, you can
 * run this method to make a subgraph a valid FOLD object with no holes.
 * @param {FOLD} graph a FOLD object
 * @returns {FOLD} a copy of the input FOLD graph, with no array holes.
 */
declare function normalize(graph: FOLD): FOLD;
