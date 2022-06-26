/**
 * Rabbit Ear (c) Kraft
 */
import * as S from "../../general/strings";
import { getBoundary } from "../../graph/boundary";
import { isFoldedForm } from "../../graph/query";
// get the SVG library from its binding to the root of the library
import root from "../../root";

const FOLDED = {
	// stroke: "none",
	fill: S._none,
};
const FLAT = {
	stroke: S._black,
	fill: S._white,
};

const apply_style = (el, attributes = {}) => Object.keys(attributes)
	.forEach(key => el.setAttributeNS(null, key, attributes[key]));

// todo this needs to be able to handle multiple boundaries
export const boundariesPolygon = (graph, attributes = {}) => {
	const g = root.svg.g();
	if (!graph || !graph.vertices_coords || !graph.edges_vertices || !graph.edges_assignment) { return g; }
	const boundary = getBoundary(graph)
		.vertices
		.map(v => [0, 1].map(i => graph.vertices_coords[v][i]));
	if (boundary.length === 0) { return g; }
	// create polygon, append to group
	const poly = root.svg.polygon(boundary);
	poly.setAttributeNS(null, S._class, S._boundary);
	g.appendChild(poly);
	// style attributes on group container
	apply_style(g, isFoldedForm(graph) ? FOLDED : FLAT);
	Object.keys(attributes)
		.forEach(attr => g.setAttributeNS(null, attr, attributes[attr]));
	return g;
};
