/**
 * Rabbit Ear (c) Robby Kraft
 */
import * as S from "../../general/strings";
import { is_folded_form } from "../../graph/query";
import {
	edges_foldAngle_all_flat,
	edges_assignment_to_lowercase,
	edges_assignment_names,
} from "../../fold/spec";
// get the SVG library from its binding to the root of the library
import root from "../../root";

const GROUP_FOLDED = {};

const GROUP_FLAT = {
	stroke: S._black,
};

const STYLE_FOLDED = {};

const STYLE_FLAT = {
	M: { stroke: "red" },
	m: { stroke: "red" },
	V: { stroke: "blue" },
	v: { stroke: "blue" },
	F: { stroke: "lightgray" },
	f: { stroke: "lightgray" },
};

/**
 * @returns an object with 5 keys, each value is an array 
 * {b:[], m:[], v:[], f:[], u:[]}
 * arrays contain the unique indices of each edge from the edges_ arrays sorted by assignment
 * if no edges_assignment, or only some defined, remaining edges become "unassigned"
 */
const edges_assignment_indices = (graph) => {
  const assignment_indices = { u:[], f:[], v:[], m:[], b:[] };
  const lowercase_assignment = graph[S._edges_assignment]
		.map(a => edges_assignment_to_lowercase[a]);
  graph[S._edges_vertices]
		.map((_, i) => lowercase_assignment[i] || "u")
		.forEach((a, i) => assignment_indices[a].push(i));
  return assignment_indices;
};

const edges_coords = ({ vertices_coords, edges_vertices }) => {
	if (!vertices_coords || !edges_vertices) { return []; }
	return edges_vertices.map(ev => ev.map(v => vertices_coords[v]));
};
/**
 * segment is a line segment in the form: [[x1, y1], [x2, y2]]
 */
const segment_to_path = s => `M${s[0][0]} ${s[0][1]}L${s[1][0]} ${s[1][1]}`;

const edges_path_data = (graph) => edges_coords(graph)
	.map(segment => segment_to_path(segment)).join("");

const edges_path_data_assign = ({ vertices_coords, edges_vertices, edges_assignment }) => {
	if (!vertices_coords || !edges_vertices) { return {}; }
	if (!edges_assignment) {
		return ({ u: edges_path_data({ vertices_coords, edges_vertices }) });
	}
  // const segments = edges_coords({ vertices_coords, edges_vertices, edges_assignment });
  const data = edges_assignment_indices({ vertices_coords, edges_vertices, edges_assignment });
	// replace each value in data from array of indices [1,2,3] to path string "M2,3L2.."
	Object.keys(data).forEach(key => {
		data[key] = edges_path_data({
			vertices_coords,
			edges_vertices: data[key].map(i => edges_vertices[i]),
		});
	});
	Object.keys(data).forEach(key => {
		if (data[key] === "") { delete data[key]; }
	});
  return data;
};

/**
 * replace edges_path_data_assign values from path strings "M2,3L.." to <path> elements
 */
const edges_paths_assign = ({ vertices_coords, edges_vertices, edges_assignment }) => {
	const data = edges_path_data_assign({ vertices_coords, edges_vertices, edges_assignment });
  Object.keys(data).forEach(assignment => {
    const path = root.svg.path(data[assignment]);
    path.setAttributeNS(null, S._class, edges_assignment_names[assignment]);
    data[assignment] = path;
  });
	return data;
};

const apply_style = (el, attributes = {}) => Object.keys(attributes)
	.forEach(key => el.setAttributeNS(null, key, attributes[key]));

/**
 * @returns an array of SVG Path elements.
 * if edges_assignment exists, there will be as many paths as there are types of edges
 * if no edges_assignment exists, there will be an array of 1 path.
 */
export const edges_paths = (graph, attributes = {}) => {
  const group = root.svg.g();
  if (!graph) { return group; }
	const isFolded = is_folded_form(graph);
	const paths = edges_paths_assign(graph);
	Object.keys(paths).forEach(key => {
		paths[key].setAttributeNS(null, S._class, edges_assignment_names[key]);
		apply_style(paths[key], isFolded ? STYLE_FOLDED[key] : STYLE_FLAT[key]);
		apply_style(paths[key], attributes[key]);
		apply_style(paths[key], attributes[edges_assignment_names[key]]);
		group.appendChild(paths[key]);
		Object.defineProperty(group, edges_assignment_names[key], { get: () => paths[key] });
	});
	apply_style(group, isFolded ? GROUP_FOLDED : GROUP_FLAT);
	// todo: everything else that isn't a class name. filter out classes
	// const no_class_attributes = Object.keys(attributes).filter(
	apply_style(group, attributes.stroke ? { stroke: attributes.stroke } : {});
	return group;
};

const angle_to_opacity = (foldAngle) => (Math.abs(foldAngle) / 180);

export const edges_lines = (graph, attributes = {}) => {
	const group = root.svg.g();
	if (!graph) { return group; }
	const isFolded = is_folded_form(graph);
	const edges_assignment = (graph.edges_assignment
		? graph.edges_assignment
		: make_edges_assignment(graph))
		.map(assign => edges_assignment_to_lowercase[assign]);
	const groups_by_key = {};
	["b", "m", "v", "f", "u"].forEach(k => {
		const child_group = root.svg.g();
		group.appendChild(child_group);
		child_group.setAttributeNS(null, S._class, edges_assignment_names[k]);
		apply_style(child_group, isFolded ? STYLE_FOLDED[k] : STYLE_FLAT[k]);
		apply_style(child_group, attributes[edges_assignment_names[k]]);
		Object.defineProperty(group, edges_assignment_names[k], {
			get: () => child_group
		});
		groups_by_key[k] = child_group;
	});
	const lines = graph.edges_vertices
		.map(ev => ev.map(v => graph.vertices_coords[v]))
		.map(l => root.svg.line(l[0][0], l[0][1], l[1][0], l[1][1]));
	if (graph.edges_foldAngle) {
		lines.forEach((line, i) => {
			const angle = graph.edges_foldAngle[i];
			if (angle === 0 || angle === 180 || angle === -180) { return;}
			line.setAttributeNS(null, "opacity", angle_to_opacity(angle));
		})
	}
	lines.forEach((line, i) => groups_by_key[edges_assignment[i]]
		.appendChild(line));

	apply_style(group, isFolded ? GROUP_FOLDED : GROUP_FLAT);
	apply_style(group, attributes.stroke ? { stroke: attributes.stroke } : {});

	return group;
};

export const draw_edges = (graph, attributes) => edges_foldAngle_all_flat(graph)
	? edges_paths(graph, attributes)
	: edges_lines(graph, attributes);

// const make_edges_assignment_names = ({ edges_vertices, edges_assignment }) => {
// 	if (!edges_vertices) { return []; }
// 	if (!edges_assignment) { return edges_vertices.map(() => edges_assignment_names["u"]); }
// 	return edges_vertices
// 		.map((_, i) => edges_assignment[i])
// 		.map((a) => edges_assignment_names[(a ? a : "u")]);
// };

// const edges_lines = ({ vertices_coords, edges_vertices, edges_assignment }) => {
// 	if (!vertices_coords || !edges_vertices) { return []; }
//   const svg_edges = edges_coords({ vertices_coords, edges_vertices })
//     .map(e => libraries.svg.line(e[0][0], e[0][1], e[1][0], e[1][1]));
//   make_edges_assignment_names(graph)
//     .foreach((a, i) => svg_edges[i][k.setAttributeNS](null, k._class, a));
//   return svg_edges;
// };
