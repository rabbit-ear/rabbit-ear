/**
 * .FOLD file into SVG, and back
 */

import * as SVG from "../../lib/svg";
import { get_boundary_vertices, faces_coloring } from "../fold/graph";

const CREASE_DIR = {
	"B": "boundary", "b": "boundary",
	"M": "mountain", "m": "mountain",
	"V": "valley",   "v": "valley",
	"F": "mark",     "f": "mark",
	"U": "mark",     "u": "mark"
};

export const boundary = function(graph) {
	let boundary = get_boundary_vertices(graph)
		.map(v => graph.vertices_coords[v])
	return [SVG.polygon(boundary).setClass("boundary")];
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

function faces_sorted_by_layer(faces_layer) {
	return faces_layer.map((layer,i) => ({layer:layer, i:i}))
		.sort((a,b) => a.layer-b.layer)
		.map(el => el.i)
}

export const foldedFaces = function(graph) {
	let facesV = graph.faces_vertices
		.map(fv => fv.map(v => graph.vertices_coords[v]))
		// .map(face => Geom.Polygon(face));
	let notMoving = graph["re:faces_to_move"].indexOf(false);
	if (notMoving === -1) { notMoving = 0; }
	// if (graph["re:faces_coloring"] && graph["re:faces_coloring"].length > 0) {
	let coloring = faces_coloring(graph, notMoving);

	let order = graph["re:faces_layer"] != null
		? faces_sorted_by_layer(graph["re:faces_layer"])
		: graph.faces_vertices.map((_,i) => i);
	return order.map(i =>
		SVG.polygon(facesV[i])
			.setClass(coloring[i] ? "face-front" : "face-back")
			// .setClass(coloring[i] ? "face-front-debug" : "face-back-debug")
			.setID(""+i)
	);
	// if (graph["re:faces_layer"] && graph["re:faces_layer"].length > 0) {
	// 	return graph["re:faces_layer"].map((fi,i) =>
	// 		SVG.polygon(facesV[fi])
	// 			.setClass(i%2==0 ? "face-front" : "face-back")
	// 			.setID(""+i)
	// 	);
	// } else {
	// 	return facesV.map((face, i) =>
	// 		SVG.polygon(face)
	// 			.setClass("folded-face")
	// 			.setID(""+i)
	// 		);
	// }
}
