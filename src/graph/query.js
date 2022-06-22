/**
 * Rabbit Ear (c) Kraft
 */
export const isFoldedForm = (graph) => {
	return (graph.frame_classes && graph.frame_classes.includes("foldedForm"))
		|| (graph.file_classes && graph.file_classes.includes("foldedForm"));
};

	// const isFoldedForm = typeof graph.frame_classes === K.object
	//   && graph.frame_classes !== null
	//   && !(graph.frame_classes.includes(K.creasePattern));
