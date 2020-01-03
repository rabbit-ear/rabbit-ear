/**
 * rebuild a graph back up by only using vertices_coords and edges_vertices
 */

import math from "../../include/math";
import FOLDConvert from "../../include/fold/convert";
import remove from "./remove";
import {
  get_duplicate_edges_old
} from "./query";
import fragment from "./fragment";
import Validate from "./validate";
import {
  make_vertices_faces,
  make_edges_faces,
  make_edges_length,
} from "./make";

/**
 * this is the big rebuild-all-arrays function.
 * vertices_coords and edges_vertices are the seeds everything else is rebuilt.
 * todo: specify "keys" parameter to update certain keys only
 */
const rebuild = function (graph, epsilon = math.core.EPSILON) {
  // it's not exactly clear what "clean" should do
  // it definitely validates the graph and adds geometry arrays if needed
  // it probably also adds file_spec: 1.1, and frame_attributes and _classes

  // these are the geometry arrays which will be rebuilt
  ["vertices_vertices", "vertices_edges", "vertices_faces",
    "edges_faces", "edges_edges",
    "faces_vertices", "faces_edges", "faces_faces"].filter(a => a in graph)
    .forEach(key => delete graph[key]);

  Object.keys(graph)
    .filter(s => s.includes("re:"))
    .forEach(key => delete graph[key]);

  // this needs to chop edges that have line endpoints collear to them
  const rebuilt = fragment(graph, epsilon);
  // remove(rebuilt, "edges", Object.keys(get_duplicate_edges(rebuilt)));
  remove(rebuilt, "edges", get_duplicate_edges_old(rebuilt));
  FOLDConvert.edges_vertices_to_vertices_vertices_sorted(rebuilt);
  FOLDConvert.vertices_vertices_to_faces_vertices(rebuilt);
  FOLDConvert.faces_vertices_to_faces_edges(rebuilt);

  rebuilt.edges_faces = make_edges_faces(rebuilt);
  rebuilt.vertices_faces = make_vertices_faces(rebuilt);

  rebuilt.edges_length = make_edges_length(rebuilt);

  Object.assign(graph, rebuilt);

  if (!Validate.edges_assignment(graph)) {
    graph.edges_assignment = Array(graph.edges_vertices.length).fill("F");
  }

  if ("file_spec" in graph === false) { graph.file_spec = 1.1; }
  if ("frame_attributes" in graph === false) {
    graph.frame_attributes = ["2D"];
  }
  if ("frame_classes" in graph === false) {
    graph.frame_classes = ["creasePattern"];
  }
};

// export const clean = function (graph, keys) {
//   if ("vertices_coords" in graph === false
//     || "edges_vertices" in graph === false) {
//     console.warn("clean requires vertices_coords and edges_vertices");
//     return;
//   }
//   if (keys == null) {
//     convert.edges_vertices_to_faces_vertices_edges(graph);
//     // todo, these are not arranged counter-clockwise
//     const edges_faces = make_edges_faces(graph);
//     graph.edges_faces = edges_faces;
//   } else {
//     console.warn("clean() certain keys only not yet implemented");
//   }
// };

// export function clip_line(fold, linePoint, lineVector) {
//  function len(a,b){
//    return Math.sqrt(Math.pow(a[0]-b[0],2) + Math.pow(a[1]-b[1],2));
//  }

//  let edges = fold.edges_vertices
//    .map(ev => ev.map(e => fold.vertices_coords[e]));

//  return [lineVector, [-lineVector[0], -lineVector[1]]]
//    .map(lv => edges
//      .map(e => math.core.intersection.ray_edge(linePoint, lv, e[0], e[1]))
//      .filter(i => i != null)
//      .map(i => ({intersection:i, length:len(i, linePoint)}))
//      .sort((a, b) => a.length - b.length)
//      .map(el => el.intersection)
//      .shift()
//    ).filter(p => p != null);
// }

export default rebuild;
