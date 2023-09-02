/**
 * Rabbit Ear (c) Kraft
 */
import { makeEdgesAssignment } from "../../../graph/make.js";
import { addClass } from "../../../svg/general/dom.js";
import {
	assignmentFlatFoldAngle,
	edgesFoldAngleAreAllFlat,
	edgesAssignmentNames,
	isFoldedForm,
	edgesAssignmentValues,
} from "../../../fold/spec.js";
import { assignmentColor } from "../../../fold/colors.js";
import SVG from "../../../svg/index.js";

const GROUP_FOLDED = {};
const GROUP_FLAT = { stroke: "black" };
const STYLE_FOLDED = {};
// convert { B: "black" }, into the form { B: { stroke: "black" }}
const STYLE_FLAT = {};
Object.keys(assignmentColor).forEach(key => {
	STYLE_FLAT[key] = { stroke: assignmentColor[key] };
});

const setDataValue = (el, key, value) => el.setAttribute(`data-${key}`, value);

/**
 * @returns {object} an object with 5 keys, each value is an array
 * arrays contain the unique indices of each edge from the edges_ arrays sorted by assignment
 * if no edges_assignment, or only some defined, remaining edges become "unassigned"
 */
const edgesAssignmentIndices = (graph) => {
	const assignment_indices = {
		u: [], c: [], j: [], f: [], v: [], m: [], b: [],
	};
	const lowercase_assignment = graph.edges_assignment
		.map(a => a.toLowerCase());
	graph.edges_vertices
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
		const path = SVG.path(data[assignment]);
		addClass(path, edgesAssignmentNames[assignment]);
		// path.setAttributeNS(null, S._class, edgesAssignmentNames[assignment]);
		data[assignment] = path;
	});
	return data;
};

const applyEdgesStyle = (el, attributes = {}) => Object.keys(attributes)
	.forEach(key => el.setAttributeNS(null, key, attributes[key]));

/**
 * @returns an array of SVG Path elements.
 * if edges_assignment exists, there will be as many paths as there are types of edges
 * if no edges_assignment exists, there will be an array of 1 path.
 */
export const edgesPaths = (graph, options = {}) => {
	const attributes = options && options.edges ? options.edges : {};
	const group = SVG.g();
	if (!graph) { return group; }
	const isFolded = isFoldedForm(graph);
	const groupStyle = JSON.parse(JSON.stringify(isFolded
		? GROUP_FOLDED
		: GROUP_FLAT));
	const pathStyle = JSON.parse(JSON.stringify(isFolded
		? STYLE_FOLDED
		: STYLE_FLAT));
	// edge styles are set via edge-assignment keys ("M", "V", etc...)
	// however, we make special case for top-level styles.
	const override = {};
	if (attributes.stroke) { override.stroke = attributes.stroke; }
	Object.assign(groupStyle, override);
	Object.keys(pathStyle).forEach(key => {
		pathStyle[key] = { ...pathStyle[key], ...override };
	});
	const paths = edgesPathsAssign(graph);
	// set style on individual path elements
	Object.keys(paths).forEach(key => {
		addClass(paths[key], edgesAssignmentNames[key]);
		applyEdgesStyle(paths[key], pathStyle[key]);
		applyEdgesStyle(paths[key], attributes[key]);
		applyEdgesStyle(paths[key], attributes[edgesAssignmentNames[key]]);
		group.appendChild(paths[key]);
		Object.defineProperty(group, edgesAssignmentNames[key], { get: () => paths[key] });
	});
	// top level group style
	applyEdgesStyle(group, groupStyle);
	// bonus, setting data values to contain the FOLD file data
	Object.keys(paths)
		.forEach(assign => setDataValue(paths[assign], "assignment", assign));
	Object.keys(paths)
		.forEach(assign => setDataValue(paths[assign], "foldAngle", assignmentFlatFoldAngle[assign]));
	return group;
};

const angleToOpacity = (foldAngle) => (Math.abs(foldAngle) / 180);

export const edgesLines = (graph, options = {}) => {
	const attributes = options && options.edges ? options.edges : {};
	const group = SVG.g();
	if (!graph) { return group; }
	const isFolded = isFoldedForm(graph);
	const groupStyle = JSON.parse(JSON.stringify(isFolded
		? GROUP_FOLDED
		: GROUP_FLAT));
	const lineStyle = JSON.parse(JSON.stringify(isFolded
		? STYLE_FOLDED
		: STYLE_FLAT));
	// edge styles are set via edge-assignment keys ("M", "V", etc...)
	// however, we make special case for top-level styles.
	const override = {};
	if (attributes.stroke) { override.stroke = attributes.stroke; }
	Object.assign(groupStyle, override);
	edgesAssignmentValues.forEach(key => {
		if (lineStyle[key] === undefined) { lineStyle[key] = {}; }
		lineStyle[key] = { ...lineStyle[key], ...override };
	});
	// set line styles according to assignment
	const groups_by_key = {};
	// array in the form ["b", "m", "v", "f", "j", "c", "u"]
	Array.from(new Set(edgesAssignmentValues.map(s => s.toLowerCase())))
		.forEach(k => {
			const child_group = SVG.g();
			group.appendChild(child_group);
			addClass(child_group, edgesAssignmentNames[k]);
			applyEdgesStyle(child_group, lineStyle[k]);
			applyEdgesStyle(child_group, attributes[edgesAssignmentNames[k]]);
			Object.defineProperty(group, edgesAssignmentNames[k], {
				get: () => child_group,
			});
			groups_by_key[k] = child_group;
		});
	const lines = graph.edges_vertices
		.map(ev => ev.map(v => graph.vertices_coords[v]))
		.map(l => SVG.line(l[0][0], l[0][1], l[1][0], l[1][1]));
	if (graph.edges_foldAngle) {
		graph.edges_foldAngle
			.forEach((angle, i) => setDataValue(lines[i], "foldAngle", angle));
	}
	// bonus, setting data values to contain the FOLD file data
	if (graph.edges_assignment) {
		graph.edges_assignment
			.forEach((assign, i) => setDataValue(lines[i], "assignment", assign));
	}
	if (graph.edges_foldAngle) {
		lines.forEach((line, i) => {
			const angle = graph.edges_foldAngle[i];
			if (angle === 0 || angle === 180 || angle === -180) { return; }
			line.setAttributeNS(null, "opacity", angleToOpacity(angle));
		});
	}
	// all edges_assignment are stored under groups using lower case form
	const edges_assignment = (graph.edges_assignment
		? graph.edges_assignment
		: makeEdgesAssignment(graph))
		.map(assign => assign.toLowerCase());
	lines.forEach((line, i) => groups_by_key[edges_assignment[i]]
		.appendChild(line));
	// top level group style
	applyEdgesStyle(group, groupStyle);
	return group;
};

const drawEdges = (graph, options) => (
	edgesFoldAngleAreAllFlat(graph)
		? edgesPaths(graph, options)
		: edgesLines(graph, options)
);

export default drawEdges;
