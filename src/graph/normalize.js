/**
 * @description Normalize will "repair" arrays that contain holes if they
 * exist in the component arrays. Arrays with holes will be generated
 * (purposefully) by some methods, such as subgraph, with the intention that
 * re-merging the subgraphs is a simple operation. Alternatively, in
 * these cases, these graphs can be normalized, the result being a graph
 * with wider compatibility across all software.
 * @param {FOLD} graph a FOLD graph
 * @returns {FOLD} a copy of the input FOLD graph, with no array holes.
 */
const normalize = (graph) => {

};

export default normalize;
