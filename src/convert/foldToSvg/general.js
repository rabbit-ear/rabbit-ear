/**
 * Rabbit Ear (c) Kraft
 */
import { boundingBox } from "../../graph/boundary.js";
import { makeEdgesLength } from "../../graph/make.js";
/**
 * @description Convert a bounding box type into a viewbox string
 */
export const boundingBoxToViewBox = (box) => [box.min, box.span]
	.flatMap(p => [p[0], p[1]])
	.join(" ");
/**
 * @description Given a FOLD graph, get the 2D viewbox that
 * encloses all vertices.
 */
export const getViewBox = (graph) => {
	const box = boundingBox(graph);
	return box === undefined ? "" : boundingBoxToViewBox(box);
};
/**
 * @description Get the Nth percentile edge length of edges from a graph.
 * This is useful to get a sense for how thick the strokeWidth should be
 * to make a reasonable rendering.
 */
export const getNthPercentileEdgeLength = (
	{ vertices_coords, edges_vertices, edges_length },
	n = 0.1,
) => {
	if (!vertices_coords || !edges_vertices) {
		return undefined;
	}
	if (!edges_length) {
		edges_length = makeEdgesLength({ vertices_coords, edges_vertices });
	}
	const sortedLengths = edges_length
		.slice()
		.sort((a, b) => a - b);
	const index_tenth_percent = Math.max(
		0,
		Math.min(
			Math.floor(sortedLengths.length * n),
			sortedLengths.length - 1,
		),
	);
	return sortedLengths[index_tenth_percent];
};

const unitBounds = { min: [0, 0], span: [1, 1] };
const DEFAULT_STROKE_WIDTH = 1 / 100;

export const getStrokeWidth = (graph, { vmax } = {}) => {
	if (!vmax) {
		const box = boundingBox(graph) || unitBounds;
		vmax = Math.max(...box.span);
	}
	const edgeTenthPercent = getNthPercentileEdgeLength(graph, 0.1);
	return edgeTenthPercent
		? edgeTenthPercent * DEFAULT_STROKE_WIDTH * 10
		: vmax * DEFAULT_STROKE_WIDTH;
};
