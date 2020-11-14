/**
 * Rabbit Ear (c) Robby Kraft
 */
import math from "../../math";
import remove from "../remove";
import { clone } from "../javascript";
import { find_adjacent_faces_to_edge } from "../find";
import add_vertices from "./add_vertices";
import {
  EDGES,
  EDGES_ASSIGNMENT,
  EDGES_FOLDANGLE,
  EDGES_FACES,
} from "../keys";

/**
 * this will add a single vertex to a
 * @param {object} FOLD object
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
 * update one entry in vertices_faces: two faces for our new vertex
 * either using edges_faces (fastest), or vertices_faces
 */
const update_vertices_faces = ({ vertices_faces }, vertex, faces) => {
  if (!vertices_faces) { return; }
  vertices_faces[vertex] = [...faces];
};

// because Javascript, this is a pointer and modifies the master graph
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
        throw new Error("something wrong with input graph's faces_edges construction");
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
 * this does not modify the graph. it builds 2 objects with keys
 * { edges_vertices, edges_assignment, edges_foldAngle, edges_faces, edges_length }
 * @param {object} FOLD object
 * @param {number} the index of the edge that will be split by the new vertex
 * @param {number} the index of the new vertex
 * @returns {object[]} array of two edge objects, containing edge data as FOLD keys
 */
const split_edge_into_two = (graph, edge_index, new_vertex) => {
  const edge_vertices = graph.edges_vertices[edge_index];
  const new_edges = [
    { edges_vertices: [edge_vertices[0], new_vertex] },
    { edges_vertices: [new_vertex, edge_vertices[1]] },
  ];
  // copy over relevant data if it exists
  new_edges.forEach((edge, i) => {
    [EDGES_ASSIGNMENT, EDGES_FOLDANGLE]
      .filter(key => graph[key] !== undefined && graph[key][edge_index] !== undefined)
      .forEach(key => edge[key] = graph[key][edge_index]);
    if (graph.edges_faces && graph.edges_faces[edge_index] !== undefined) {
      edge.edges_faces = [...graph.edges_faces[edge_index]];
    }
    if (graph.edges_vector) {
      const verts = edge.edges_vertices.map(v => graph.vertices_coords[v]);
      edge.edges_vector = math.core.subtract(verts[1], verts[0]);
    }
    if (graph.edges_length) {
      const verts = edge.edges_vertices.map(v => graph.vertices_coords[v]);
      edge.edges_length = math.core.distance2(...verts)
    }
    // todo: this does not rebuild edges_edges
    // not sure if there is a way to do this.
  });
  return new_edges;
};

/**
 * appends a vertex along an edge. causing a rebuild on arrays:
 * - vertices_coords, vertices_vertices, vertices_edges, vertices_faces,
 * - edges_vertices, edges_faces, edges_assignment,
 * - edges_foldAngle, edges_vector
 * - faces_vertices, faces_edges,
 * and doesn't need to update:
 * - faces_faces
 * requires edges_vertices to be defined
 */
// const split_edge = function (graph, x, y, old_edge) {
// const split_edge = function (graph, coords, old_edge) {
const split_edge = function (graph, old_edge, coords) {
  if (graph.edges_vertices.length < old_edge) { return undefined; }
  const incident_vertices = graph.edges_vertices[old_edge];
  if (!coords) {
    coords = math.core.midpoint(...incident_vertices);
  }
  // only add 1 vertex. shift the index out of the array
  const vertex = add_vertices(graph, { vertices_coords: [coords] })
    .shift();
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
    update_vertices_faces(graph, vertex, incident_vertices);
    update_faces_vertices(graph, incident_faces, vertex, incident_vertices);
    update_faces_edges(graph, incident_faces, vertex, new_edges, old_edge);
  }
  // todo: copy over edgeOrders. don't need to do this with faceOrders
  // remove old data
  const edge_map = remove(graph, EDGES, [ old_edge ]);
  return {
    vertex,
    edges: {
      map: edge_map,
      replace: {
        old: old_edge,
        new: new_edges,
      },
    },
  };
};

export default split_edge;
