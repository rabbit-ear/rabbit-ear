/**
 * fold to svg (c) Robby Kraft
 */
import * as K from "../keys";
import { get_boundary } from "../../graph/boundary";
import { is_folded_form } from "../../graph/query";

import SVG from "../../extensions/svg";
const Libraries = { SVG };

const FOLDED = {
	// stroke: "none",
	fill: "none",
};
const FLAT = {
	stroke: "black",
	fill: "white",
};

const apply_style = (el, attributes = {}) => Object.keys(attributes)
	.forEach(key => el[K.setAttributeNS](null, key, attributes[key]));

// todo this needs to be able to handle multiple boundaries
export const boundaries_polygon = (graph, attributes = {}) => {
	const g = Libraries.SVG.g();
	if (!graph || !graph.vertices_coords || !graph.edges_vertices || !graph.edges_assignment) { return g; }
  const boundary = get_boundary(graph)
		.vertices
    .map(v => [0, 1].map(i => graph.vertices_coords[v][i]));
  if (boundary.length === 0) { return g; }
	// create polygon, append to group
  const poly = Libraries.SVG.polygon(boundary);
  poly[K.setAttributeNS](null, K._class, K.boundary);
	g[K.appendChild](poly);
	// style attributes on group container
	apply_style(g, is_folded_form(graph) ? FOLDED : FLAT);
	Object.keys(attributes)
		.forEach(attr => g[K.setAttributeNS](null, attr, attributes[attr]));
  return g;
};
