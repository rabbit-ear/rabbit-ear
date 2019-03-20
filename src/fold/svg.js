/**
 * .FOLD file into SVG, and back
 */

import * as SVG from "../../lib/svg";
import { get_boundary_vertices } from "./graph";

const CREASE_DIR = {
	"B": "boundary", "b": "boundary",
	"M": "mountain", "m": "mountain",
	"V": "valley",   "v": "valley",
	"F": "mark",     "f": "mark",
	"U": "mark",     "u": "mark"
};

export const vertices = function(graph, options) {
	let radius = options && options.radius ? options.radius : 0.01;
	return graph.vertices_coords.map((v,i) =>
		SVG.circle(v[0], v[1], radius)
			.setClass("vertex")
			.setID(""+i)
	);
};

export const creases = function(graph) {
	let edges = graph.edges_vertices
		.map(ev => ev.map(v => graph.vertices_coords[v]));
	let eAssignments = graph.edges_assignment.map(a => CREASE_DIR[a]);
	return edges.map((e,i) =>
		SVG.line(e[0][0], e[0][1], e[1][0], e[1][1])
			.setClass(eAssignments[i])
			.setID(""+i)
	);
};

export const facesVertices = function(graph) {
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

export const facesEdges = function(graph) {
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

export const boundary = function(graph) {
	let boundary = get_boundary_vertices(graph)
		.map(v => graph.vertices_coords[v])
	return [SVG.polygon(boundary).setClass("boundary")];
};

export const foldedFaces = function(graph) {
	let facesV = graph.faces_vertices
		.map(fv => fv.map(v => graph.vertices_coords[v]))
		// .map(face => Geom.Polygon(face));
	if (graph["re:faces_layer"] && graph["re:faces_layer"].length > 0) {
		return graph["re:faces_layer"].map((fi,i) =>
			SVG.polygon(facesV[fi])
				.setClass(i%2==0 ? "face-front" : "face-back")
				.setID(""+i)
		);
	// } else if (graph.facesOrder && graph.facesOrder.length > 0) {
	} else {
		return facesV.forEach((face, i) =>
			groups.faces.polygon(face)
				.setClass("folded-face")
				.setID("face")
			);
	}
}
