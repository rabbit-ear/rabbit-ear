/**
 * Rabbit Ear (c) Robby Kraft
 */
import layer_solver from "../single_vertex/layer_solver/index";
import { make_faces_coloring, make_vertices_sectors } from "./make";
import { invert_map } from "./maps";
import {
  get_longest_array,
  circular_array_valid_ranges
} from "./arrays";

const make_vertex_faces_layer = ({
  vertices_faces, vertices_sectors, vertices_edges, edges_assignment
}, vertex, epsilon) => {
  // vertices_faces will contain "undefined" for sectors outside the boundary
  const faces = vertices_faces[vertex];
  // valid ranges might return multiple occurences, assume the longest
  // is the one we want. get that one.
  const range = get_longest_array(circular_array_valid_ranges(faces));
  if (range === undefined) { return; }
  // convert a range [start, end] into an array of indices, for example:
  // [4,1] into [4,5,6,7,0,1]
  while (range[1] < range[0]) { range[1] += faces.length; }
  const indices = Array
    .from(Array(range[1] - range[0] + 1))
    .map((_, i) => (range[0] + i) % faces.length);
  // use "indices" to get the sectors and assignments for the layer_solver
  const sectors = indices
    .map(i => vertices_sectors[vertex][i]);
  const assignments = indices
    .map(i => vertices_edges[vertex][i])
    .map(edge => edges_assignment[edge]);
  const sectors_layer = ear.vertex
    .layer_solver(sectors, assignments, epsilon);
  // sectors_layer gives us solutions relating the sectors to indices 0...n
  // relate these to the original faces, in 2 steps:
  // 1. map back to vertices_faces, due to valid_array (avoiding undefineds)
  // 2. map back to the faces in vertices_faces, instead of [0...n], a vertex's
  // faces will be anywhere in the graph. like [25, 56, 43, 19...]
  const faces_layer = sectors_layer
    .map(invert_map)
    .map(arr => arr
      .map(face => typeof face !== "object"
        ? faces[indices[face]]
        : face.map(f => faces[indices[f]])))
    .map(invert_map);
  // send along the starting, this face is positioned with its normal upwards.
  faces_layer.face = faces[indices[0]];
  return faces_layer;
};

export default make_vertex_faces_layer;
