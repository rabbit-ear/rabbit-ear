/**
 * .FOLD file into SVG, and back
 */

import * as SVG from "../../include/svg";
import {
	CREASE_NAMES,
	get_boundary_vertices,
	faces_matrix_coloring,
	faces_coloring
} from "../fold/graph";


export const defaultStyle = "svg * {\n stroke-width: var(--crease-width);\n stroke-linecap: round;\n stroke: black;\n}\npolygon {\n fill: none;\n stroke: none;\n stroke-linejoin: bevel;\n}\n.boundary {\n fill: white;\n stroke: black;\n}\n.mountain{\n stroke: #e14929;\n}\n.valley{\n stroke: #314f69;\nstroke-dasharray: calc( var(--crease-width) * 2) calc( var(--crease-width) * 2);\n}\n.mark {\n stroke: #888;\n}\n.foldedForm #faces polygon {\n /*stroke: black;*/\n}\n.foldedForm #faces .front {\n fill: steelblue;\n}\n.foldedForm #faces .back {\n fill: peru;\n}\n.foldedForm #creases line {\n stroke: none;\n}";

/**
 * if you already have groups initialized, to save on re-initializing, pass the groups
 * in as values under these keys, and they will get drawn into.
 */
export const intoGroups = function(graph, {boundaries, faces, creases, vertices}) {
	if (boundaries){ drawBoundary(graph).forEach(b => boundaries.appendChild(b)); }
	if (faces){ drawFaces(graph).forEach(f => faces.appendChild(f)); }
	if (creases){ drawCreases(graph).forEach(c => creases.appendChild(c)); }
	if (vertices){ drawVertices(graph).forEach(v => vertices.appendChild(v)); }
}

const drawBoundary = function(graph) {
	let boundary = get_boundary_vertices(graph)
		.map(v => graph.vertices_coords[v])
	return [SVG.polygon(boundary).setClass("boundary")];
};

const drawVertices = function(graph, options) {
	let radius = options && options.radius ? options.radius : 0.01;
	return graph.vertices_coords.map((v,i) =>
		SVG.circle(v[0], v[1], radius)
			.setClass("vertex")
			.setID(""+i)
	);
};

const drawCreases = function(graph) {
	let edges = graph.edges_vertices
		.map(ev => ev.map(v => graph.vertices_coords[v]));
	let eAssignments = graph.edges_assignment.map(a => CREASE_NAMES[a]);
	return edges.map((e,i) =>
		SVG.line(e[0][0], e[0][1], e[1][0], e[1][1])
			.setClass(eAssignments[i])
			.setID(""+i)
	);
};

const drawFacesVertices = function(graph) {
	let fAssignments = graph.faces_vertices.map(fv => "face");
	let facesV = !(graph.faces_vertices) ? [] : graph.faces_vertices
		.map(fv => fv.map(v => graph.vertices_coords[v]))
		// .map(face => Geom.Polygon(face));
	// facesV = facesV.map(face => face.scale(0.6666));
	return facesV.filter(f => f != null).map((face, i) =>
		SVG.polygon(face)
			.setClass(fAssignments[i])
			.setID(""+i)
	);
};

const drawFacesEdges = function(graph) {
	let fAssignments = graph.faces_vertices.map(fv => "face");
	let facesE = !(graph.faces_edges) ? [] : graph.faces_edges
		.map(face_edges => face_edges
			.map(edge => graph.edges_vertices[edge])
			.map((vi,i,arr) => {
				let next = arr[(i+1)%arr.length];
				return (vi[1] === next[0] || vi[1] === next[1]
					? vi[0] : vi[1]);
			}).map(v => graph.vertices_coords[v])
		)
		// .map(face => Geom.Polygon(face));
	// facesE = facesE.map(face => face.scale(0.8333));
	return facesE.filter(f => f != null).map((face, i) =>
		SVG.polygon(face)
			.setClass(fAssignments[i])
			.setID(""+i)
	);
};

function faces_sorted_by_layer(faces_layer) {
	return faces_layer.map((layer,i) => ({layer:layer, i:i}))
		.sort((a,b) => a.layer-b.layer)
		.map(el => el.i)
}

const drawFaces = function(graph) {
	let facesV = graph.faces_vertices
		.map(fv => fv.map(v => graph.vertices_coords[v]))
		// .map(face => Geom.Polygon(face));

	// determine coloring of each face
	let coloring = graph["re:faces_coloring"];
	if (coloring == null) {
		if (graph["re:faces_matrix"] != null) {
			coloring = faces_matrix_coloring(graph["re:faces_matrix"]);
		} else {
			// last resort. assuming a lot with the 0 face.
			coloring = faces_coloring(graph, 0);
		}
	}

	// determine layer order
	let orderIsCertain = graph["re:faces_layer"] != null;

	let order = graph["re:faces_layer"] != null
		? faces_sorted_by_layer(graph["re:faces_layer"])
		: graph.faces_vertices.map((_,i) => i);

	return orderIsCertain
		? order.map(i => SVG.polygon(facesV[i])
			.setClass(coloring[i] ? "front" : "back")
			.setID(""+i))
		: order.map(i =>SVG.polygon(facesV[i]).setID(""+i));
};


export const updateFaces = function(graph, group) {
	let facesV = graph.faces_vertices
		.map(fv => fv.map(v => graph.vertices_coords[v]));
	let strings = facesV
		.map(face => face.reduce((a, b) => a + b[0] + "," + b[1] + " ", ""));
	Array.from(group.children)
		.sort((a,b) => parseInt(a.id) - parseInt(b.id))
		.forEach((face, i) => face.setAttribute("points", strings[i]));
};

export const updateCreases = function(graph, group) {
	let edges = graph.edges_vertices
		.map(ev => ev.map(v => graph.vertices_coords[v]));

	Array.from(group.children)
		// .sort((a,b) => parseInt(a.id) - parseInt(b.id))
		.forEach((line,i) => {
			line.setAttribute("x1", edges[i][0][0]);
			line.setAttribute("y1", edges[i][0][1]);
			line.setAttribute("x2", edges[i][1][0]);
			line.setAttribute("y2", edges[i][1][1]);
		});
};
