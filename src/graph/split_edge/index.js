/**
 * Rabbit Ear (c) Robby Kraft
 */
import math from "../../math";
import remove from "../remove";
import clone from "../clone";
import { find_adjacent_faces_to_edge } from "../find";
import add_vertices from "../add/add_vertices";
import { EDGES } from "../fold_keys";
import split_edge_into_two from "./split_edge_into_two";
/**
 * @description an edge was just split into two by the addition of a vertex.
 * update new vertex's vertices_vertices, as well as the split edge's
 * endpoint's vertices_vertices to include the new vertex in place of the
 * old endpoints, preserving all other vertices_vertices of the endpoints.
 * @param {object} FOLD object, modified in place
 * @param {number} index of new vertex
 * @param {number[]} vertices that make up the split edge. new vertex lies between.
 */
const update_vertices_vertices = ({ vertices_vertices }, vertex, incident_vertices) => {
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
const update_vertices_edges = ({ vertices_edges }, vertices, old_edge, new_vertex, new_edges) => {
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
const update_vertices_faces = ({ vertices_faces }, vertex, faces) => {
  if (!vertices_faces) { return; }
  vertices_faces[vertex] = [...faces];
};
/**
 * @description a new vertex was added, splitting an edge. rebuild the
 * two incident faces by replacing the old edge with new one.
 * @param {object} FOLD object, modified in place
 * @param {number[]} indices of two faces to be rebuilt
 * @param {number} new vertex index
 * @param {number[]} the two vertices of the old edge
 */
const update_faces_vertices = ({ faces_vertices }, faces, new_vertex, incident_vertices) => {
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
/**
 * @description a new vertex was added, splitting an edge. rebuild the
 * two incident faces by replacing the old edge with new one.
 * @param {object} FOLD object, modified in place
 * @param {number[]} indices of two faces to be rebuilt
 * @param {number} new vertex index
 * @param {number[]} indices of the two new edges
 * @param {number} old edge index
 */
const update_faces_edges = ({ edges_vertices, faces_edges }, faces, new_vertex, new_edges, old_edge) => {
  if (!faces_edges) { return; }
  faces
    .map(i => faces_edges[i])
    .forEach((face) => {
      // there should be 2 faces in this array, incident to the removed edge
      // find the location of the removed edge in this face
      const edgeIndex = face.indexOf(old_edge);
      // the previous and next edge in this face, counter-clockwise
      const prevEdge = face[(edgeIndex + face.length - 1) % face.length];
      const nextEdge = face[(edgeIndex + 1) % face.length];
      const vertices = [
        [prevEdge, old_edge],
        [old_edge, nextEdge],
      ].map((pairs) => {
        const verts = pairs.map(e => edges_vertices[e]);
        return verts[0][0] === verts[1][0] || verts[0][0] === verts[1][1]
          ? verts[0][0] : verts[0][1];
      }).reduce((a, b) => a.concat(b), []);
      const edges = [
        [vertices[0], new_vertex],
        [new_vertex, vertices[1]],
      ].map((verts) => {
        const in0 = verts.map(v => edges_vertices[new_edges[0]].indexOf(v) !== -1)
          .reduce((a, b) => a && b, true);
        const in1 = verts.map(v => edges_vertices[new_edges[1]].indexOf(v) !== -1)
          .reduce((a, b) => a && b, true);
        if (in0) { return new_edges[0]; }
        if (in1) { return new_edges[1]; }
        throw new Error("split_edge() bad faces_edges");
      });
      if (edgeIndex === face.length - 1) {
        // replacing the edge at the end of the array, we have to be careful
        // to put the first at the end, the second at the beginning
        face.splice(edgeIndex, 1, edges[0]);
        face.unshift(edges[1]);
      } else {
        face.splice(edgeIndex, 1, ...edges);
      }
      return edges;
    });  
};
/**
 * @description split an edge with a new vertex, replacing the old
 * edge with two new edges sharing the common vertex. rebuilding:
 * - vertices_coords, vertices_vertices, vertices_edges, vertices_faces,
 * - edges_vertices, edges_faces, edges_assignment,
 * - edges_foldAngle, edges_vector
 * - faces_vertices, faces_edges,
 * without rebuilding:
 * - faces_faces
 * @usage requires edges_vertices to be defined
 * @param {object} FOLD object, modified in place
 * @param {number} index of old edge to be split
 * @param {number[]} coordinates of the new vertex to be added. optional.
 * if omitted, a vertex will be generated at the edge's midpoint.
 * @returns {object} a summary of the changes to the graph
 */
const split_edge = (graph, old_edge, coords) => {
	// old_edge is not a valid index
  if (graph.edges_vertices.length < old_edge) { return {}; }
  const incident_vertices = graph.edges_vertices[old_edge];
  if (!coords) {
    coords = math.core.midpoint(...incident_vertices);
  }
	// only add 1 vertex. shift the index out of the array
 	// const vertex = add_vertices(graph, [coords]).shift();
  // we don't want to use "add_vertices" because we don't want to check against
	// every point, potentially merging an entirely different part of the graph
	// because if we did we would be rebuilding all these faces and incident
	// vertices incorrectly.
  // only test similarity to the incident vertices, if similar return early
  const similar = incident_vertices.map(v => graph.vertices_coords[v])
	  .map(vert => math.core.distance(vert, coords) < math.core.EPSILON);
	if (similar[0]) { return { vertex: incident_vertices[0], edges: {} }; }
	if (similar[1]) { return { vertex: incident_vertices[1], edges: {} }; }
	const vertex = graph.vertices_coords.length;
	graph.vertices_coords[vertex] = coords;
	// indices of new edges
	const new_edges = [0, 1].map(i => i + graph.edges_vertices.length);
  // create 2 new edges, add them to the graph
  split_edge_into_two(graph, old_edge, vertex)
    .forEach((edge, i) => Object.keys(edge)
      .forEach((key) => { graph[key][new_edges[i]] = edge[key]; }));
  // update graph components
  update_vertices_vertices(graph, vertex, incident_vertices);
  update_vertices_edges(graph, incident_vertices, old_edge, vertex, new_edges);
  const incident_faces = find_adjacent_faces_to_edge(graph, old_edge);
  if (incident_faces) {
    // wow, just found a bug. todo: needs testing
    // was calling this method with vertices instead of faces.
    // check split_face, commented code might be working now.
    // update_vertices_faces(graph, vertex, incident_vertices);
    update_vertices_faces(graph, vertex, incident_faces);
    update_faces_vertices(graph, incident_faces, vertex, incident_vertices);
    update_faces_edges(graph, incident_faces, vertex, new_edges, old_edge);
  }
  // todo: copy over edgeOrders. don't need to do this with faceOrders
  // remove old data
	// todo: make the map include the new data
	// shift the map over to the new format
  const edge_map = remove(graph, EDGES, [ old_edge ]);
  // we had to run "remove" with the new edges added. to return the change info,
	// we need to adjust the map to exclude these edges.
	// we can count on new_edges being sorted
  new_edges.forEach((_, i) => { new_edges[i] = edge_map[new_edges[i]]; });
	edge_map.splice(-2);
	edge_map[old_edge] = new_edges;
	return {
    vertex,
    edges: {
      map: edge_map,
      // new: new_edges,
      remove: old_edge,
    },
  };
};

export default split_edge;
