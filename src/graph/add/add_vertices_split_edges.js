// /**
//  * Rabbit Ear (c) Kraft
//  */

// /**
//  * 
//  * 
//  * this method hasn't really been incorporated into the library and might
//  * not be proving its usefulness. a candidate for being removed
//  * 
//  * 
//  */
// import math from "../../math";
// import count from "../count";
// import addVertices from "./addVertices";
// import { makeEdgesCoords } from "../make";
// import { transposeGraphArrayAtIndex } from "../../fold/spec";
// import clone from "../../general/clone";
// import remove from "../remove";
// /**
//  * todo: update the return object to include more information
//  * @description add a vertex, and if this vertex lies along an edge, split the edge.
//  * @param {object} destination FOLD graph, new vertices will be added to this graph
//  * @param {object} source FOLD graph, vertices from here will be added to the other graph
//  * @returns {array} index of vertex in new vertices_coords array. matches array size of source vertices.
//  */
// const addVertices_splitEdges = (graph, vertices_coords) => {
// 	const new_indices = addVertices(graph, vertices_coords);
// 	// determine if any vertex lies collinear along an edge
// 	// if so, we must split existing edge at the vertex point
// 	const edges_coords = makeEdgesCoords(graph);
// 	const vertices_edge_collinear = vertices_coords
// 		.map(v => edges_coords
// 			.map(edge => math.core.overlap_line_point(
// 				math.core.subtract(edge[1], edge[0]),
// 				edge[0],
// 				v,
// 				math.core.exclude_s))
// 			.map((on_edge, i) => (on_edge ? i : undefined))
// 			.filter(a => a !== undefined)
// 			.shift());

// 	const remove_indices = vertices_edge_collinear
// 		.filter(vert_edge => vert_edge !== undefined);

// 	// create new edges: 2 edges for every 1 split edge
// 	const new_edges = vertices_edge_collinear
// 		.map((e, i) => ({ e, i }))
// 		.filter(el => el.e !== undefined)
// 		.map(el => {
// 			// new edges will retain old edge's properties (foldAngle, assignment...)
// 			const edge = transposeGraphArrayAtIndex(graph, "edges", el.e);
// 			// return new edges (copy of old edge) with updated edges_vertices
// 			return [edge, clone(edge)]
// 				.map((obj, i) => Object.assign(obj, {
// 					edges_vertices: [ graph.edges_vertices[el.e][i], new_indices[el.i] ]
// 				}));
// 		})
// 		.reduce((a,b) => a.concat(b), []);

// 	// add new edges to the graph
// 	const edges_length = count.edges(graph);
// 	const diff = { new: { edges: [] } };
// 	new_edges.forEach((new_edge, i) => Object.keys(new_edge)
// 		.forEach((key) => {
// 			if (graph[key] === undefined) { graph[key] = []; }
// 			graph[key][edges_length + i] = new_edge[key];
// 			diff.new.edges[i] = edges_length + i;
// 		}));
// 	// remove edges that have now been split
// 	remove(graph, "edges", remove_indices);
// 	return new_indices;
// };

// export default addVertices_splitEdges;
