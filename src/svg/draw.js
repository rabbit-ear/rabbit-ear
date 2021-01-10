/**
 * fold to svg (c) Robby Kraft
 */
import * as K from "./keys";
import { vertices_circle } from "./render/vertices";
import { edges_paths } from "./render/edges";
import {
	faces_vertices_polygon,
	faces_edges_polygon,
} from "./render/faces";
import { boundaries_polygon } from "./render/boundaries";
import graph_classes from "./classes";
import recursive_assign from "./assign";

import SVG from "../extensions/svg";
const Libraries = { SVG };

// preference for using faces_vertices over faces_edges, it runs faster
const faces_draw_function = (graph, options) => (graph[K.faces_vertices] != null
  ? faces_vertices_polygon(graph, options)
  : faces_edges_polygon(graph, options));

const draw_func = {
  vertices: vertices_circle,
  edges: edges_paths,
  faces: faces_draw_function,
  boundaries: boundaries_polygon
};

// draw geometry into groups
// append geometry to SVG, if geometry exists (if group has more than 0 children)
const draw_groups = (graph, options = {}) => {
	const parent = options.parent
		? options.parent
		: Libraries.SVG.g();
	// add top level classes, "graph" and anything from the FOLD like "foldedForm"
  const classValue = ["graph"].concat(graph_classes(graph)).join(" ");
  parent[K.setAttributeNS](null, K._class, classValue);
	// draw components
  [K.boundaries, K.faces, K.edges, K.vertices]
  	.map(key => {
			// vertices is the only one that uses "options"
			const attributes = options[key] || {};
  	  const group = draw_func[key](graph, attributes)
  	  group[K.setAttributeNS](null, K._class, key);
			Object.defineProperty(parent, key, { get: () => group }); 
  	  return group;
  	})
  	.filter(group => group.childNodes.length > 0)
		.forEach(group => parent[K.appendChild](group));
	return parent;
};

// static style draw methods for individual components
[K.boundaries, K.faces, K.edges, K.vertices].forEach(key => {
	draw_groups[key] = function () {
		const group = draw_func[key](...arguments);
		group[K.setAttributeNS](null, K._class, key);
		return group;
	};
});

export default draw_groups;

