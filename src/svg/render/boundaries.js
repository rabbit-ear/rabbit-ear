/**
 * fold to svg (c) Robby Kraft
 */
import * as K from "../keys";
import { get_boundary } from "../../graph/boundary";

import SVG from "../../extensions/svg";
const Libraries = { SVG };

export const boundaries_polygon = (graph, attributes = {}) => {
	const g = Libraries.SVG.g();
  // todo this needs to be able to handle multiple boundaries
  if (K.vertices_coords in graph === false
    || K.edges_vertices in graph === false
    || K.edges_assignment in graph === false) {
    return g;
  }
  const boundary = get_boundary(graph)
    .vertices
    .map(v => [0, 1].map(i => graph[K.vertices_coords][v][i]));
  if (boundary.length === 0) { return g; }
  const p = Libraries.SVG.polygon(boundary);
  p[K.setAttributeNS](null, K._class, K.boundary);
	g[K.appendChild](p);
	// style attributes on group container
	Object.keys(attributes)
		.forEach(attr => g[K.setAttributeNS](null, attr, attributes[attr]));
  return g;
};

