/**
 * Rabbit Ear (c) Kraft
 */
import * as S from "../../general/strings";
import { isFoldedForm } from "../../graph/query";
import { makeEdgesAssignment } from "../../graph/make";
import {
	edgesFoldAngleAreAllFlat,
	edgesAssignmentToLowercase,
	edgesAssignmentNames,
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
 * @typedef EdgesAssignmentIndices
 * @type {object}
 * @property {number[]} b - boundary edge indices
 * @property {number[]} m - mountain edge indices
 * @property {number[]} v - valley edge indices
 * @property {number[]} f - flat edge indices
 * @property {number[]} u - unassigned edge indices
 */

/**
 * @returns {EdgesAssignmentIndices} an object with 5 keys, each value is an array 
 * arrays contain the unique indices of each edge from the edges_ arrays sorted by assignment
 * if no edges_assignment, or only some defined, remaining edges become "unassigned"
 */
const edgesAssignmentIndices = (graph) => {
	const assignment_indices = { u:[], f:[], v:[], m:[], b:[] };
	const lowercase_assignment = graph[S._edges_assignment]
		.map(a => edgesAssignmentToLowercase[a]);
	graph[S._edges_vertices]
		.map((_, i) => lowercase_assignment[i] || "u")
		.forEach((a, i) => assignment_indices[a].push(i));
	return assignment_indices;
};

const edgesCoords = ({ vertices_coords, edges_vertices }) => {
	if (!vertices_coords || !edges_vertices) { return []; }
	return edges_vertices.map(ev => ev.map(v => vertices_coords[v]));
};
/**
 * a segment is a line segment in the form: [[x1, y1], [x2, y2]]
 */
const segmentToPath = s => `M${s[0][0]} ${s[0][1]}L${s[1][0]} ${s[1][1]}`;

const edgesPathData = (graph) => edgesCoords(graph)
	.map(segment => segmentToPath(segment)).join("");

const edgesPathDataAssign = ({ vertices_coords, edges_vertices, edges_assignment }) => {
	if (!vertices_coords || !edges_vertices) { return {}; }
	if (!edges_assignment) {
		return ({ u: edgesPathData({ vertices_coords, edges_vertices }) });
	}
	// const segments = edgesCoords({ vertices_coords, edges_vertices, edges_assignment });
	const data = edgesAssignmentIndices({ vertices_coords, edges_vertices, edges_assignment });
	// replace each value in data from array of indices [1,2,3] to path string "M2,3L2.."
	Object.keys(data).forEach(key => {
		data[key] = edgesPathData({
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
 * replace edgesPathDataAssign values from path strings "M2,3L.." to <path> elements
 */
const edgesPathsAssign = ({ vertices_coords, edges_vertices, edges_assignment }) => {
	const data = edgesPathDataAssign({ vertices_coords, edges_vertices, edges_assignment });
	Object.keys(data).forEach(assignment => {
		const path = root.svg.path(data[assignment]);
		path.setAttributeNS(null, S._class, edgesAssignmentNames[assignment]);
		data[assignment] = path;
	});
	return data;
};

const applyStyle = (el, attributes = {}) => Object.keys(attributes)
	.forEach(key => el.setAttributeNS(null, key, attributes[key]));

/**
 * @returns an array of SVG Path elements.
 * if edges_assignment exists, there will be as many paths as there are types of edges
 * if no edges_assignment exists, there will be an array of 1 path.
 */
export const edgesPaths = (graph, attributes = {}) => {
	const group = root.svg.g();
	if (!graph) { return group; }
	const isFolded = isFoldedForm(graph);
	const paths = edgesPathsAssign(graph);
	Object.keys(paths).forEach(key => {
		paths[key].setAttributeNS(null, S._class, edgesAssignmentNames[key]);
		applyStyle(paths[key], isFolded ? STYLE_FOLDED[key] : STYLE_FLAT[key]);
		applyStyle(paths[key], attributes[key]);
		applyStyle(paths[key], attributes[edgesAssignmentNames[key]]);
		group.appendChild(paths[key]);
		Object.defineProperty(group, edgesAssignmentNames[key], { get: () => paths[key] });
	});
	applyStyle(group, isFolded ? GROUP_FOLDED : GROUP_FLAT);
	// todo: everything else that isn't a class name. filter out classes
	// const no_class_attributes = Object.keys(attributes).filter(
	applyStyle(group, attributes.stroke ? { stroke: attributes.stroke } : {});
	return group;
};

const angleToOpacity = (foldAngle) => (Math.abs(foldAngle) / 180);

export const edgesLines = (graph, attributes = {}) => {
	const group = root.svg.g();
	if (!graph) { return group; }
	const isFolded = isFoldedForm(graph);
	const edges_assignment = (graph.edges_assignment
		? graph.edges_assignment
		: makeEdgesAssignment(graph))
		.map(assign => edgesAssignmentToLowercase[assign]);
	const groups_by_key = {};
	["b", "m", "v", "f", "u"].forEach(k => {
		const child_group = root.svg.g();
		group.appendChild(child_group);
		child_group.setAttributeNS(null, S._class, edgesAssignmentNames[k]);
		applyStyle(child_group, isFolded ? STYLE_FOLDED[k] : STYLE_FLAT[k]);
		applyStyle(child_group, attributes[edgesAssignmentNames[k]]);
		Object.defineProperty(group, edgesAssignmentNames[k], {
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
			line.setAttributeNS(null, "opacity", angleToOpacity(angle));
		})
	}
	lines.forEach((line, i) => groups_by_key[edges_assignment[i]]
		.appendChild(line));

	applyStyle(group, isFolded ? GROUP_FOLDED : GROUP_FLAT);
	applyStyle(group, attributes.stroke ? { stroke: attributes.stroke } : {});

	return group;
};

export const drawEdges = (graph, attributes) => edgesFoldAngleAreAllFlat(graph)
	? edgesPaths(graph, attributes)
	: edgesLines(graph, attributes);

// const make_edgesAssignmentNames = ({ edges_vertices, edges_assignment }) => {
// 	if (!edges_vertices) { return []; }
// 	if (!edges_assignment) { return edges_vertices.map(() => edgesAssignmentNames["u"]); }
// 	return edges_vertices
// 		.map((_, i) => edges_assignment[i])
// 		.map((a) => edgesAssignmentNames[(a ? a : "u")]);
// };

// const edgesLines = ({ vertices_coords, edges_vertices, edges_assignment }) => {
// 	if (!vertices_coords || !edges_vertices) { return []; }
//   const svg_edges = edgesCoords({ vertices_coords, edges_vertices })
//     .map(e => libraries.svg.line(e[0][0], e[0][1], e[1][0], e[1][1]));
//   make_edgesAssignmentNames(graph)
//     .foreach((a, i) => svg_edges[i][k.setAttributeNS](null, k._class, a));
//   return svg_edges;
// };
