import * as REMath from "../../include/geometry";
import { split_convex_polygon } from "../graph/planargraph";
// import * as Makers from "../graph/makers";

export function add_edge_between_points(graph, x0, y0, x1, y1) {
	// this creates 2 new edges vertices indices.
	// or grabs old ones if a vertex already exists
	let edge = [[x0, y0], [x1, y1]];
	let edge_vertices = edge
		.map(ep => graph.vertices_coords
			// for both of the new points, iterate over every vertex,
			// return an index if it matches a new point, undefined if not
			.map(v => Math.sqrt(Math.pow(ep[0]-v[0],2)+Math.pow(ep[1]-v[1],2)))
			.map((d,i) => d < 0.00000001 ? i : undefined)
			.filter(el => el !== undefined)
			.shift()
		).map((v,i) => {
			if (v !== undefined) { return v; }
			// else
			graph.vertices_coords.push(edge[i]);
			return graph.vertices_coords.length - 1;
		});
	graph.edges_vertices.push(edge_vertices);
	graph.edges_assignment.push("F");
	graph.edges_length.push(Math.sqrt(Math.pow(x0-x1,2)+Math.pow(y0-y1,2)));
	return [graph.edges_vertices.length-1];
}


export function crease_line(graph, point, vector) {
	// let boundary = Graph.get_boundary_vertices(graph);
	// let poly = boundary.map(v => graph.vertices_coords[v]);
	// let edge_map = Array.from(Array(graph.edges_vertices.length)).map(_=>0);
	let new_edges = [];
	let arr = Array.from(Array(graph.faces_vertices.length))
		.map((_,i)=>i).reverse();
	arr.forEach(i => {
		let diff = split_convex_polygon(graph, i, point, vector);
		if (diff.edges != null && diff.edges.new != null) {
			// a new crease line was added
			let newEdgeIndex = diff.edges.new[0].index;
			new_edges = new_edges.map(edge => 
				edge += (diff.edges.map[edge] == null
					? 0
					: diff.edges.map[edge])
			);
			new_edges.push(newEdgeIndex);
		}
	});
	return new_edges;
}

export function crease_ray(graph, point, vector) {
	let new_edges = [];
	let arr = Array.from(Array(graph.faces_vertices.length))
		.map((_,i)=>i).reverse();
	arr.forEach(i => {
		let diff = split_convex_polygon(graph, i, point, vector);
		if (diff.edges != null && diff.edges.new != null) {
			// a new crease line was added
			let newEdgeIndex = diff.edges.new[0].index;
			new_edges = new_edges.map(edge =>
				edge += (diff.edges.map[edge] == null ? 0 : diff.edges.map[edge])
			);
			new_edges.push(newEdgeIndex);
		}
	});
	return new_edges;
}

// export function creaseLine(graph, point, vector) {
// 	// todo idk if this is done
// 	let ray = REMath.Line(point, vector);
// 	graph.faces_vertices.forEach(face => {
// 		let points = face.map(v => graph.vertices_coords[v]);
// 		REMath.core.intersection.clip_line_in_convex_poly(points, point, vector);
// 	})
// 	return crease_line(graph, line[0], line[1]);
// }

export function creaseRay(graph, point, vector) {
	// todo idk if this is done
	let ray = REMath.Ray(point, vector);
	graph.faces_vertices.forEach(face => {
		let points = face.map(v => graph.vertices_coords[v]);
		REMath.core.intersection.clip_ray_in_convex_poly(points, point, vector);
	})
	return crease_line(graph, line[0], line[1]);
}

/**
 * this modifies vertices_coords, edges_vertices, with no regard to 
 * the other arrays - re-build all other edges_, faces_, vertices_
 */ 
export const creaseSegment = function(graph, a, b, c, d) {
	// the input parameter
	let edge = REMath.Edge([a, b]);

	let edges = graph.edges_vertices
		.map(ev => ev.map(v => graph.vertices_coords[v]));

	let edge_collinear_a = edges
		.map(e => REMath.core.intersection.point_on_edge(e[0], e[1], edge[0]))
		.map((on_edge, i) => on_edge ? i : undefined)
		.filter(a => a !== undefined)
		.shift();
	let edge_collinear_b = edges
		.map(e => REMath.core.intersection.point_on_edge(e[0], e[1], edge[1]))
		.map((on_edge, i) => on_edge ? i : undefined)
		.filter(a => a !== undefined)
		.shift();
	let vertex_equivalent_a = graph.vertices_coords
		.map(v => Math.sqrt(Math.pow(edge[0][0]-v[0], 2) +
		                    Math.pow(edge[0][1]-v[1], 2)))
		.map((d,i) => d < 1e-8 ? i : undefined)
		.filter(el => el !== undefined)
		.shift();
	let vertex_equivalent_b = graph.vertices_coords
		.map(v => Math.sqrt(Math.pow(edge[1][0]-v[0], 2) +
		                    Math.pow(edge[1][1]-v[1], 2)))
		.map((d,i) => d < 1e-8 ? i : undefined)
		.filter(el => el !== undefined)
		.shift();

	// the new edge
	let edge_vertices = [];
	// don't remove things until very end, make sure indices match
	let edges_to_remove = [];
	// at each new index, which edge did this edge come from
	let edges_index_map = [];


	// if (vertex_equivalent_a !== undefined && vertex_equivalent_b !== undefined) {
	// 	let edge_already_exists = graph.edges_vertices.filter(ev => 
	// 		(ev[0] === vertex_equivalent_a && ev[1] === vertex_equivalent_b) ||
	// 		(ev[0] === vertex_equivalent_b && ev[1] === vertex_equivalent_a)
	// 	);
	// 	if(edge_already_exists.length > 0) { console.log("found already edge"); console.log(edge_already_exists); return; }
	// }

	if (vertex_equivalent_a !== undefined) {
		// easy, assign point
		edge_vertices[0] = vertex_equivalent_a;
	} else {
		// create new vertex
		graph.vertices_coords.push([edge[0][0], edge[0][1]]);
		let vertex_new_index = graph.vertices_coords.length - 1;
		edge_vertices[0] = vertex_new_index;
		if (edge_collinear_a !== undefined) {
			// rebuild old edge with two edges, new vertex inbetween
			edges_to_remove.push(edge_collinear_a);
			let edge_vertices_old = graph.edges_vertices[edge_collinear_a];
			graph.edges_vertices.push([edge_vertices_old[0], vertex_new_index]);
			graph.edges_vertices.push([vertex_new_index, edge_vertices_old[1]]);
			// these new edges came from this old edge
			edges_index_map[graph.edges_vertices.length - 2] = edge_collinear_a;
			edges_index_map[graph.edges_vertices.length - 1] = edge_collinear_a;
		}
	}

	if (vertex_equivalent_b !== undefined) {
		// easy, assign point
		edge_vertices[1] = vertex_equivalent_b;
	} else {
		// create new vertex
		graph.vertices_coords.push([edge[1][0], edge[1][1]]);
		let vertex_new_index = graph.vertices_coords.length - 1;
		edge_vertices[1] = vertex_new_index;
		if (edge_collinear_b !== undefined) {
			// rebuild old edge with two edges, new vertex inbetween
			edges_to_remove.push(edge_collinear_b);
			let edge_vertices_old = graph.edges_vertices[edge_collinear_b];
			graph.edges_vertices.push([edge_vertices_old[0], vertex_new_index]);
			graph.edges_vertices.push([vertex_new_index, edge_vertices_old[1]]);
			// these new edges came from this old edge
			edges_index_map[graph.edges_vertices.length - 2] = edge_collinear_b;
			edges_index_map[graph.edges_vertices.length - 1] = edge_collinear_b;
		}
	}

	// edges_to_remove.sort((a,b) => a-b);
	// for(var i = edges_to_remove.length-1; i >= 0; i--) {
	// 	graph.edges_vertices.splice(i, 1);
	// }

	graph.edges_vertices.push(edge_vertices);
	graph.edges_assignment[graph.edges_vertices.length-1] = "F";

	let diff = {
		edges_new: [graph.edges_vertices.length-1],
		edges_to_remove: edges_to_remove,
		edges_index_map
	}
	return diff;
}

// export function crease_folded(graph, point, vector, face_index) {
// 	// if face isn't set, it will be determined by whichever face
// 	// is directly underneath point. or if none, index 0.
// 	if (face_index == null) {
// 		face_index = Queries.face_containing_point(graph, point);
// 		if(face_index === undefined) { face_index = 0; }
// 	}
// 	let primaryLine = REMath.Line(point, vector);
// 	let coloring = Graph.faces_coloring(graph, face_index);
// 	Makers.make_faces_matrix_inv(graph, face_index)
// 		.map(m => primaryLine.transform(m))
// 		.reverse()
// 		.forEach((line, reverse_i, arr) => {
// 			let i = arr.length - 1 - reverse_i;
// 			let diff = split_convex_polygon(graph, i, line.point, line.vector, coloring[i] ? "M" : "V");
// 		});
// }


