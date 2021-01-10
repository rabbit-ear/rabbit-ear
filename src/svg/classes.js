/**
 * fold to svg (c) Robby Kraft
 */
import * as K from "./keys";

const graph_classes = graph => [
	(graph[K.file_classes] ? graph[K.file_classes] : []),
	(graph[K.frame_classes] ? graph[K.frame_classes] : []),
].reduce((a, b) => a.concat(b));

export default graph_classes;

