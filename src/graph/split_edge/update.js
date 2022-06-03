/**
 * Rabbit Ear (c) Kraft
 */
import math from "../../math";
import { make_vertices_to_edge_bidirectional } from "../make";
/**
 * @description an edge was just split into two by the addition of a vertex.
 * update new vertex's vertices_vertices, as well as the split edge's
 * endpoint's vertices_vertices to include the new vertex in place of the
 * old endpoints, preserving all other vertices_vertices of the endpoints.
 * @param {object} FOLD object, modified in place
 * @param {number} index of new vertex
 * @param {number[]} vertices that make up the split edge. new vertex lies between.
 */
export const update_vertices_vertices = ({ vertices_vertices }, vertex, incident_vertices) => {
	if (!vertices_vertices) { return; }
	// create a new entry for this new vertex
	// only 2 vertices, no need to worry about winding order.
	vertices_vertices[vertex] = [...incident_vertices];
	// for each incident vertex in the vertices_vertices, replace the other incident
	// vertex's entry with this new vertex, the new vertex takes its place.
	incident_vertices.forEach((v, i, arr) => {
		const otherV = arr[(i + 1) % arr.length];
		const otherI = vertices_vertices[v].indexOf(otherV);
		vertices_vertices[v][otherI] = vertex;
	});
};
/**
 * @description run this after vertices_vertices has been built
 */
export const update_vertices_sectors = ({ vertices_coords, vertices_vertices, vertices_sectors }, vertex) => {
	if (!vertices_sectors) { return; }
	vertices_sectors[vertex] = vertices_vertices[vertex].length === 1
		? [math.core.TWO_PI]
		: math.core.counter_clockwise_sectors2(vertices_vertices[vertex]
			.map(v => math.core
				.subtract2(vertices_coords[v], vertices_coords[vertex])));
};
/**
 * @description an edge was just split into two by the addition of a vertex.
 * update vertices_edges for the new vertex, as well as the split edge's
 * endpoint's vertices_edges to include the two new edges in place of the
 * old one while preserving all other vertices_vertices in each endpoint.
 * @param {object} FOLD object, modified in place
 * @param {number[]} vertices the old edge's two vertices, must be aligned with "new_edges"
 * @param {number} old_edge the index of the old edge
 * @param {number} new_vertex the index of the new vertex splitting the edge
 * @param {number[]} new_edges the two new edges, must be aligned with "vertices"
 */
export const update_vertices_edges = ({ vertices_edges }, old_edge, new_vertex, vertices, new_edges) => {
	if (!vertices_edges) { return; }
	// update 1 vertex, our new vertex
	vertices_edges[new_vertex] = [...new_edges];
	// update the two vertices, our new vertex replaces the alternate
	// vertex in each of their arrays.  0-------x-------0
	vertices
		.map(v => vertices_edges[v].indexOf(old_edge))
		.forEach((index, i) => {
			vertices_edges[vertices[i]][index] = new_edges[i];
		});
};
/**
 * @description a new vertex was added between two faces, update the
 * vertices_faces with the already-known faces indices.
 * @param {object} FOLD object, modified in place
 * @param {number} the new vertex
 * @param {number[]} array of 0, 1, or 2 incident faces.
 */
export const update_vertices_faces = ({ vertices_faces }, vertex, faces) => {
	if (!vertices_faces) { return; }
	vertices_faces[vertex] = [...faces];
};
/**
 * @description a new vertex was added between two faces, update the
 * edges_faces with the already-known faces indices.
 * @param {object} FOLD object, modified in place
 * @param {number[]} array of 2 new edges
 * @param {number[]} array of 0, 1, or 2 incident faces.
 */
export const update_edges_faces = ({ edges_faces }, new_edges, faces) => {
	if (!edges_faces) { return; }
	new_edges.forEach(edge => edges_faces[edge] = [...faces]);
};
/**
 * @description a new vertex was added, splitting an edge. rebuild the
 * two incident faces by replacing the old edge with new one.
 * @param {object} FOLD object, modified in place
 * @param {number[]} indices of two faces to be rebuilt
 * @param {number} new vertex index
 * @param {number[]} the two vertices of the old edge
 */
export const update_faces_vertices = ({ faces_vertices }, new_vertex, incident_vertices, faces) => {
	// exit if we don't even have faces_vertices
	if (!faces_vertices) { return; }
	faces
		.map(i => faces_vertices[i])
		.forEach(face => face
			.map((fv, i, arr) => {
				const nextI = (i + 1) % arr.length;
				return (fv === incident_vertices[0]
								&& arr[nextI] === incident_vertices[1])
								|| (fv === incident_vertices[1]
								&& arr[nextI] === incident_vertices[0])
					? nextI : undefined;
			}).filter(el => el !== undefined)
			.sort((a, b) => b - a)
			.forEach(i => face.splice(i, 0, new_vertex)));
};
export const update_faces_edges_with_vertices = ({ edges_vertices, faces_vertices, faces_edges }, faces) => {
	const edge_map = make_vertices_to_edge_bidirectional({ edges_vertices });
	faces
		.map(f => faces_vertices[f]
			.map((vertex, i, arr) => [vertex, arr[(i + 1) % arr.length]])
			.map(pair => edge_map[pair.join(" ")]))
		.forEach((edges, i) => { faces_edges[faces[i]] = edges; });
};

// const edges_shared_vertex = ({ edges_vertices }, e0, e1) => {
//   const verts0 = edges_vertices[e0];
//   const verts1 = edges_vertices[e1];
//   if (verts0[0] === verts1[0]) { return verts0[0]; }
//   if (verts0[0] === verts1[1]) { return verts0[0]; }
//   if (verts0[1] === verts1[0]) { return verts0[1]; }
//   if (verts0[1] === verts1[1]) { return verts0[1]; }
//   console.error("edges_shared_vertex");
// };
// const sort_edges = ({ edges_vertices }, new_edges, three_edges) => {
//   const prev_vertex = edges_shared_vertex({ edges_vertices }, three_edges[0], three_edges[1]);
//   const next_vertex = edges_shared_vertex({ edges_vertices }, three_edges[1], three_edges[2]);
//   console.log("prev_vertex", prev_vertex);
//   console.log("next_vertex", next_vertex);
//   console.log("edges_vertices[new_edges[0]]", edges_vertices[new_edges[0]]);
//   console.log("edges_vertices[new_edges[1]]", edges_vertices[new_edges[1]]);
//   if (edges_vertices[new_edges[0]].includes(prev_vertex)
//     && edges_vertices[new_edges[1]].includes(next_vertex)) {
//     return [new_edges[0], new_edges[1]];
//   }
//   if (edges_vertices[new_edges[1]].includes(prev_vertex)
//     && edges_vertices[new_edges[0]].includes(next_vertex)) {
//     return [new_edges[1], new_edges[0]];
//   }
//   console.error("sort_edges");
// };
// /**
//  * @description a new vertex was added, splitting an edge. rebuild the
//  * two incident faces by replacing the old edge with two new ones.
//  * @param {object} FOLD object, modified in place
//  * @param {number[]} indices of two faces to be rebuilt
//  * @param {number} new vertex index
//  * @param {number[]} indices of the two new edges
//  * @param {number} old edge index
//  */
// export const update_faces_edges = ({ edges_vertices, faces_edges }, old_edge, new_vertex, new_edges, faces) => {
//   // exit if we don't even have faces_edges
//   if (!faces_edges) { return; }
//   const splices = faces
//     .map(f => {
//     // .map(i => faces_edges[i])
//     // .map((face, f) => {
//       // in each face, find the index of the old edge in this faces_edges,
//       // as well as the index of the prev and next edges.
//       const splice_indices = faces_edges[f]
//         .map((fe, i, arr) => fe === old_edge ? i : undefined)
//         .filter(el => el !== undefined)
//         .sort((a, b) => b - a)
//       const splice_prev = splice_indices
//         .map(i => (i + faces_edges[f].length - 1) % faces_edges[f].length);
//       const splice_next = splice_indices
//         .map(i => (i + 1) % faces_edges[f].length);
//       // make these three consecutive splice indices into a tuple:
//       // [prev, curr, next]
//       const three_indices = splice_indices
//         .map((curr, i) => [splice_prev[i], curr, splice_next[i]]);
//       // convert these three indices into the edges they point to.
//       const three_indices_edges = three_indices
//         .map(tuple => tuple.map(i => faces_edges[f][i]));
//       // figure out which order the two new faces need to be inserted.
//       console.log("splice_indices", splice_indices);
//       console.log("splice_prev", splice_prev);
//       console.log("splice_next", splice_next);
//       console.log("three_indices", three_indices);
//       console.log("three_indices_edges", three_indices_edges);
//       console.log("old edge vertices", edges_vertices[old_edge]);
//       const sort_new_edges = three_indices_edges
//         .map(three => sort_edges({ edges_vertices }, new_edges, three));
//       console.log("sort_new_edges", sort_new_edges);
//       return splice_indices.map((splice, i) => ({
//         face_edges: faces_edges[f],
//         splice,
//         insert: sort_new_edges[i],
//       }))
//       // splice_indices
//       //   .forEach((index, i) => face.splice(index, 1, sort_new_edges[i]));
//       // .forEach(i => face.splice(i, 0, new_vertex))
//     })
//     .reduce((a, b) => a.concat(b), [])
//     .sort((a, b) => b.splice - a.splice);

//   console.log("splices", splices);
//   splices
//     .forEach(el => {
//       el.face_edges.splice(el.splice, 1, ...el.insert);
//       console.log("HERE", JSON.parse(JSON.stringify(el.face_edges)));
//     });
// };

// export const update_faces_edges = ({ edges_vertices, faces_edges }, old_edge, new_vertex, new_edges, faces) => {
//   // exit if we don't even have faces_edges
//   if (!faces_edges) { return; }
//   faces
//     .map(i => faces_edges[i])
//     .forEach((face) => {
//       // there should be 2 faces in this array, incident to the removed edge
//       // find the location of the removed edge in this face
//       const edgeIndex = face.indexOf(old_edge);
//       // the previous and next edge in this face, counter-clockwise
//       const prevEdge = face[(edgeIndex + face.length - 1) % face.length];
//       const nextEdge = face[(edgeIndex + 1) % face.length];
//       const vertices = [
//         [prevEdge, old_edge],
//         [old_edge, nextEdge],
//       ].map((pairs) => {
//         const verts = pairs.map(e => edges_vertices[e]);
//         return verts[0][0] === verts[1][0] || verts[0][0] === verts[1][1]
//           ? verts[0][0] : verts[0][1];
//       }).reduce((a, b) => a.concat(b), []);
//       const edges = [
//         [vertices[0], new_vertex],
//         [new_vertex, vertices[1]],
//       ].map((verts) => {
//         const in0 = verts.map(v => edges_vertices[new_edges[0]].indexOf(v) !== -1)
//           .reduce((a, b) => a && b, true);
//         const in1 = verts.map(v => edges_vertices[new_edges[1]].indexOf(v) !== -1)
//           .reduce((a, b) => a && b, true);
//         if (in0) { return new_edges[0]; }
//         if (in1) { return new_edges[1]; }
//         throw new Error("split_edge() bad faces_edges");
//       });
//       if (edgeIndex === face.length - 1) {
//         // replacing the edge at the end of the array, we have to be careful
//         // to put the first at the end, the second at the beginning
//         face.splice(edgeIndex, 1, edges[0]);
//         face.unshift(edges[1]);
//       } else {
//         face.splice(edgeIndex, 1, ...edges);
//       }
//       return edges;
//     });
// };
