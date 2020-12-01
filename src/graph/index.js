/**
 * Rabbit Ear (c) Robby Kraft
 */
import transform from "./affine";
import * as make from "./make";
import * as clip from "./clip";
import * as boundary from "./boundary";
import * as walk from "./walk";
import * as nearest from "./nearest";
import * as fold_object from "./fold_spec";
import * as sort from "./sort";
import count from "./count";
import implied from "./count_implied";
import remove from "./remove";
import populate from "./populate";
import assign from "./assign";
import subgraph from "./subgraph";
import explode_faces from "./explode_faces";
import get_duplicate_edges from "./edges_duplicate";
import clusters_vertices from "./vertices_duplicate/clusters_vertices";
import merge_duplicate_vertices from "./vertices_duplicate/merge";
import * as isolated_vertices from "./vertices_isolated";
import fragment from "./fragment";
import clean from "./clean";
import create from "./create";
import add_vertices from "./add/add_vertices";
import add_vertices_split_edges from "./add/add_vertices_split_edges"; // planar graphs
import add_edges from "./add/add_edges";
import split_edge from "./add/split_edge";
import split_face from "./add/split_face";
import flat_fold from "./flat_fold";
import layer_solver from "./single_vertex/layer_solver"
import assignment_solver from "./single_vertex/assignment_solver"
// boundary
import clip_line from "./boundary/clip_line";

// for this function and prototype
// import * as Create from "../core/create";
import prototype from "./prototype";
import { file_spec, file_creator } from "./fold_keys";

const Graph = function () {
  // should Graph({vertices_coors:[], ...}) deep copy the argument object?
  return Object.assign(
    Object.create(prototype),
    ...Array.from(arguments).filter(a => fold_object.fold_object_certainty(a)),
    { file_spec, file_creator }
  );
};

Graph.prototype = prototype;
Graph.prototype.constructor = Graph;

Object.assign(Graph, {
  // modifiers
  assign,
  add_vertices,
  add_vertices_split_edges,
  add_edges,
  split_edge,
  split_face,
  flat_fold,
  fragment,
  clean,
  merge_duplicate_vertices,
  //
  count,
  implied,
  remove,
  populate,
  subgraph,
  explode_faces,
  get_duplicate_edges,
  clusters_vertices,
  //
  layer_solver,
  assignment_solver,
  clip_line,
},
  make,
  create,
  clip, // this is not actually used yet!
  transform,
  boundary,
  walk,
  nearest,
  isolated_vertices,
  fold_object,
  sort,
);

export default Graph;
