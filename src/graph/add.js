import { clone } from "../fold_format/object";
import * as Geometry from "../../include/geometry";
import { remove_edges } from "./remove";

/**
 * these should trigger a re-build on the other arrays
 */ 
const new_vertex = function(graph, x, y) {
	if (graph.vertices_coords === undefined) { return; }
	let vertices_count = graph.vertices_coords.length;
	graph.vertices_coords[vertices_count] = [x, y]
	return vertices_count;
	// // mark unclean data
	// unclean.vertices_vertices[new_index] = true;
	// unclean.vertices_faces[new_index] = true;
}

const new_edge = function(graph, node1, node2) {
	if (_m.edges_vertices === undefined) { return; }
	let edges_count = graph.edges_vertices.length;
	graph.edges_vertices[edges_count] = [node1, node2];
	return edges_count;
	// // mark unclean data
	// unclean.edges_vertices[new_index] = true;
	// unclean.edges_faces[new_index] = true;
	// unclean.edges_assignment[new_index] = true;
	// unclean.edges_foldAngle[new_index] = true;
	// unclean.edges_length[new_index] = true;
}


/**
 * appends a vertex along an edge. causing a rebuild on all arrays
 * including edges and faces.
 * requires edges_vertices to be defined
 */
export const add_vertex_on_edge = function(graph, x, y, old_edge_index) {
	if (graph.edges_vertices.length < old_edge_index) { return; }
	// new vertex entries
	// vertices_coords
	let new_vertex_index = new_vertex(graph, x, y);
	let incident_vertices = graph.edges_vertices[old_edge_index];
	// vertices_vertices, new vertex
	if (graph.vertices_vertices == null) { graph.vertices_vertices = []; }
	graph.vertices_vertices[new_vertex_index] = clone(incident_vertices);
	// vertices_vertices, update incident vertices with new vertex
	incident_vertices.forEach((v,i,arr) => {
		let otherV = arr[(i+1)%arr.length];
		let otherI = graph.vertices_vertices[v].indexOf(otherV);
		graph.vertices_vertices[v][otherI] = new_vertex_index;
	})
	// vertices_faces
	if (graph.edges_faces != null && graph.edges_faces[old_edge_index] != null) {
		graph.vertices_faces[new_vertex_index] =
			clone(graph.edges_faces[old_edge_index]);
	}
	// new edges entries
	// set edges_vertices
	let new_edges = [
		{ edges_vertices: [incident_vertices[0], new_vertex_index] },
		{ edges_vertices: [new_vertex_index, incident_vertices[1]] }
	];
	// set new index in edges_ arrays
	new_edges.forEach((e,i) => e.i = graph.edges_vertices.length+i);
	// copy over relevant data if it exists
	["edges_faces", "edges_assignment", "edges_foldAngle"]
		.filter(key => graph[key] != null && graph[key][old_edge_index] != null)
		.forEach(key => {
			// todo, copy these arrays
			new_edges[0][key] = clone(graph[key][old_edge_index]);
			new_edges[1][key] = clone(graph[key][old_edge_index]);
		});
	// calculate length
	new_edges.forEach((el,i) => {
		let verts = el.edges_vertices.map(v => graph.vertices_coords[v]);
		new_edges[i]["edges_length"] = Geometry.core.distance2(...verts);
	})
	// todo: copy over edgeOrders. don't need to do this with faceOrders
	new_edges.forEach((edge,i) =>
		Object.keys(edge)
			.filter(key => key !== "i")
			.forEach(key => graph[key][edge.i] = edge[key])
	);
	let incident_faces_indices = graph.edges_faces[old_edge_index];
	let incident_faces_vertices = incident_faces_indices
		.map(i => graph.faces_vertices[i]);
	let incident_faces_edges = incident_faces_indices
		.map(i => graph.faces_edges[i]);

	// faces_vertices
	// because Javascript, this is a pointer and modifies the master graph
	incident_faces_vertices.forEach(face => 
		face.map((fv,i,arr) => {
			let nextI = (i+1)%arr.length;
			return (fv === incident_vertices[0]
							&& arr[nextI] === incident_vertices[1]) ||
						 (fv === incident_vertices[1]
							&& arr[nextI] === incident_vertices[0])
				? nextI : undefined;
		}).filter(el => el !== undefined)
		.sort((a,b) => b-a)
		.forEach(i => face.splice(i,0,new_vertex_index))
	);

	// faces_edges
	incident_faces_edges.forEach((face,i,arr) => {
		// there should be 2 faces in this array, incident to the removed edge
		// find the location of the removed edge in this face
		let edgeIndex = face.indexOf(old_edge_index);
		// the previous and next edge in this face, counter-clockwise
		let prevEdge = face[(edgeIndex+face.length-1)%face.length];
		let nextEdge = face[(edgeIndex+1)%face.length];
		let vertices = [
			[prevEdge, old_edge_index],
			[old_edge_index, nextEdge]
		].map(pairs => {
			let verts = pairs.map(e => graph.edges_vertices[e])
			return verts[0][0] === verts[1][0] || verts[0][0] === verts[1][1]
				? verts[0][0] : verts[0][1]; 
		}).reduce((a,b) => a.concat(b),[])
		let edges = [
			[vertices[0], new_vertex_index],
			[new_vertex_index, vertices[1]]
		].map(verts => {
			let in0 = verts.map(v => new_edges[0].edges_vertices.indexOf(v) !== -1)
				.reduce((a,b) => a && b, true);
			let in1 = verts.map(v => new_edges[1].edges_vertices.indexOf(v) !== -1)
				.reduce((a,b) => a && b, true);
			if(in0) { return new_edges[0].i; }
			if(in1) { return new_edges[1].i; }
			throw "something wrong with input graph's faces_edges construction";
		})
		if (edgeIndex === face.length-1) {
			// replacing the edge at the end of the array, we have to be careful
			// to put the first at the end, the second at the beginning
			face.splice(edgeIndex, 1, edges[0]);
			face.unshift(edges[1]);
		} else {
			face.splice(edgeIndex, 1, ...edges);
		}
		return edges;
	});
	// remove old data
	let edge_map = remove_edges(graph, [old_edge_index]);
	return {
		vertices: {
			new: [{index: new_vertex_index}]
		},
		edges: {
			map: edge_map,
			replace: [{
				old: old_edge_index,
				new: new_edges.map(el => el.i)
			}]
		}
	};
}
