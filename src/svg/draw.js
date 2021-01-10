/**
 * fold to svg (c) Robby Kraft
 */
import * as K from "./keys";
import { vertices_circle } from "./render/vertices";
import { edges_group } from "./render/edges";
import {
	faces_vertices_polygon,
	faces_edges_polygon,
} from "./render/faces";
import { boundaries_polygon } from "./render/boundaries";
import graph_classes from "./classes";
import recursive_assign from "./assign";

import SVG from "../extensions/svg";
const Libraries = { SVG };

const OPTIONS = {
	vertices: {
	},
	edges: {
	},
	faces: {
		fill: "none",
		stroke: "black",
	},
	boundaries: {
		fill: "none",
		stroke: "black",
	},
};

// preference for using faces_vertices over faces_edges, it runs faster
const faces_draw_function = (graph, o) => (graph[K.faces_vertices] != null
  ? faces_vertices_polygon(graph, o)
  : faces_edges_polygon(graph, o));

const draw_func = {
  vertices: vertices_circle,
  edges: edges_group,
  faces: faces_draw_function,
  boundaries: boundaries_polygon
};

// draw geometry into groups
// append geometry to SVG, if geometry exists (if group has more than 0 children)
const draw_groups = (graph, _options = {}) => {
	const options = recursive_assign(JSON.parse(JSON.stringify(OPTIONS)), _options);
	options.parent = _options.parent;
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
			const theseOptions = options[key] || {};
  	  const group = draw_func[key](graph, theseOptions)
  	  group[K.setAttributeNS](null, K._class, key);
			Object.defineProperty(parent, key, { get: () => group }); 
  	  return group;
  	})
  	.filter(group => group.childNodes.length > 0)
		.forEach(group => parent[K.appendChild](group));
	return parent;
};

[K.boundaries, K.faces, K.edges, K.vertices].forEach(key => {
	draw_groups[key] = (graph) => {
		const group = draw_func[key](graph);
		group[K.setAttributeNS](null, K._class, key);
		return group;
	};
});

export default draw_groups;

