/**
 * fold to svg (c) Robby Kraft
 */
import * as K from "../keys";
// import Libraries from "../../environment/libraries";

import SVG from "../../extensions/svg";
const Libraries = { SVG };

const default_color = {
	m: "red",
	v: "blue",
	f: "lightgray",
	b: "black",
};

const edges_assignment_names = {
  B: K.boundary,
  b: K.boundary,
  M: K.mountain,
  m: K.mountain,
  V: K.valley,
  v: K.valley,
  F: K.mark,
  f: K.mark,
  U: K.unassigned,
  u: K.unassigned
};

// todo: test- is this much faster than running .toLower() on every string?
const edges_assignment_to_lowercase = {
  B: "b",
  b: "b",
  M: "m",
  m: "m",
  V: "v",
  v: "v",
  F: "f",
  f: "f",
  U: "u",
  u: "u",
};

const edges_coords = function (graph) {
  if (graph[K.edges_vertices] == null || graph[K.vertices_coords] == null) {
    return [];
  }
  return graph[K.edges_vertices].map(ev => ev.map(v => graph[K.vertices_coords][v]));
};

/**
 * @returns an object with 5 keys, each value is an array 
 * {b:[], m:[], v:[], f:[], u:[]}
 * arrays contain the unique indices of each edge from the edges_ arrays sorted by assignment
 */
const edges_indices_classes = function (graph) {
  const assignment_indices = { u:[], f:[], v:[], m:[], b:[] };
  graph[K.edges_assignment].map(a => edges_assignment_to_lowercase[a])
    .forEach((a, i) => assignment_indices[a].push(i));
  return assignment_indices;
}

const make_edges_assignment_names = function (graph) {
  return (graph[K.edges_vertices] == null || graph[K.edges_assignment] == null
    || graph[K.edges_vertices].length !== graph[K.edges_assignment].length
    ? []
    : graph[K.edges_assignment].map(a => edges_assignment_names[a]));
};

const edges = function (graph) {
  if (graph[K.edges_vertices] == null || graph[K.vertices_coords] == null) {
    return [];
  }
  const svg_edges = graph[K.edges_vertices]
    .map(ev => ev.map(v => graph[K.vertices_coords][v]))
    .map(e => Libraries.SVG.line(e[0][0], e[0][1], e[1][0], e[1][1]));
  svg_edges.forEach((edge, i) => edge[K.setAttributeNS](null, K.index, `${i}`));
  make_edges_assignment_names(graph)
    .forEach((a, i) => svg_edges[i][K.setAttributeNS](null, K._class, a));
  return svg_edges;
};

/**
 * segment is a line segment in the form: [[x1, y1], [x2, y2]]
 */
const segment_to_path = function (s) {
  return `M${s[0][0]} ${s[0][1]}L${s[1][0]} ${s[1][1]}`;
};

export const edges_path_data = function (graph) {
  const path_data = edges_coords(graph).map(segment => segment_to_path(segment)).join("");
  return path_data === "" ? undefined : path_data;
};

export const edges_by_assignment_paths_data = function (graph) {
  if (graph[K.edges_vertices] == null
    || graph[K.vertices_coords] == null
    || graph[K.edges_assignment] == null) {
    return [];
  }
  const segments = edges_coords(graph);
  const assignment_sorted_edges = edges_indices_classes(graph);
  const paths = Object.keys(assignment_sorted_edges)
    .map(assignment => assignment_sorted_edges[assignment].map(i => segments[i]))
    .map(segments => segments.map(segment => segment_to_path(segment)).join(""));
  const result = {};
  Object.keys(assignment_sorted_edges).map((key, i) => {
    if (paths[i] !== "") {
      result[key] = paths[i];
    }
  });
  return result;
};

/**
 * @returns an array of SVG Path elements.
 * if edges_assignment exists, there will be as many paths as there are types of edges
 * if no edges_assignment exists, there will be an array of 1 path.
 */
export const edges_path = function (graph) {
  // no edges_assignment exists, create one large path
  if (graph[K.edges_assignment] == null) {
    const d = edges_path_data(graph);
    return d === undefined ? [] : [Libraries.SVG.path(d)];
  }
  // split up each path based on 
  const ds = edges_by_assignment_paths_data(graph);
  return Object.keys(ds).map(assignment => {
    const p = Libraries.SVG.path(ds[assignment]);
    p[K.setAttributeNS](null, K._class, edges_assignment_names[assignment]);
    return p;
  });
};

export const edges_group = (graph) => {
	const data = edges_by_assignment_paths_data(graph);
	const paths = Object.keys(data).map(key => {
		const path = Libraries.SVG.path(data[key]);
		path[K.setAttributeNS](null, K._class, edges_assignment_names[key]);
		if (default_color[key]) {
			path[K.setAttributeNS](null, "stroke", default_color[key]);
		}
		return path;
	});
	const group = Libraries.SVG.g();
	paths.forEach(path => group[K.appendChild](path));
	Object.keys(data).forEach((key, i) => {
		Object.defineProperty(group, edges_assignment_names[key], {
			get: () => paths[i],
		});
	});
	group[K.setAttributeNS](null, "stroke", "black")
	return group;
};

export const edges_line = function (graph) {
  const lines = edges_coords(graph).map(e => Libraries.SVG.line(e[0][0], e[0][1], e[1][0], e[1][1]));
  // keep track of each svg's index in the 
  lines.forEach((l, i) => l[K.setAttributeNS](null, K.index, i)) // `${i}`))
  make_edges_assignment_names(graph)
    .forEach((a, i) => lines[i][K.setAttributeNS](null, K._class, a));
  return lines;
};

// can return edges as a flat list of line()s
// can return them in groups by edges_assignment
// can return them in 

// can return 5 paths. each is a 

