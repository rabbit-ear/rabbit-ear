/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description Check a FOLD object's frame_classes for the presence of "foldedForm".
 * @param {FOLD} graph a FOLD object
 * @returns {boolean} true if the graph is folded.
 * @linkcode Origami ./src/graph/query.js 8
 */
export const isFoldedForm = (graph) => (
	(graph.frame_classes && graph.frame_classes.includes("foldedForm"))
		|| (graph.file_classes && graph.file_classes.includes("foldedForm"))
);
