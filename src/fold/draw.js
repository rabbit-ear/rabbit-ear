/**
 * .FOLD file into SVG, and back
 */

import * as SVG from "../../include/svg";
import { CREASE_NAMES, get_boundary_vertices, faces_matrix_coloring } from "../fold/graph";

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

	let coloring = graph["re:faces_coloring"];
	if (coloring == null) {
		// coloring = faces_coloring(graph, notMoving);
	}

	if (graph["re:faces_matrix"] != null) {
		coloring = faces_matrix_coloring(graph["re:faces_matrix"]);
	}

	let orderIsCertain = graph["re:faces_layer"] != null;

	let order = graph["re:faces_layer"] != null
		? faces_sorted_by_layer(graph["re:faces_layer"])
		: graph.faces_vertices.map((_,i) => i);
		
	return orderIsCertain
		? order.map(i => SVG.polygon(facesV[i])
			.setClass(coloring[i] ? "front" : "back")
			.setID(""+i))
		: order.map(i =>SVG.polygon(facesV[i]).setID(""+i));
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
