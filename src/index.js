/*
▁▂▃▄▅▆▇██▇▆▅▄▃▂▁▁▂▃▄▅▆▇██▇▆▅▄▃▂▁▁▂▃▄▅▆▇██▇▆▅▄▃▂▁▁▂▃▄▅▆▇██▇▆▅▄▃▂▁
                    _     _     _ _
                   | |   | |   (_) |
          _ __ __ _| |__ | |__  _| |_    ___  __ _ _ __
         | '__/ _` | '_ \| '_ \| | __|  / _ \/ _` | '__|
         | | | (_| | |_) | |_) | | |_  |  __/ (_| | |
         |_|  \__,_|_.__/|_.__/|_|\__|  \___|\__,_|_|

█▇▆▅▄▃▂▁▁▂▃▄▅▆▇██▇▆▅▄▃▂▁▁▂▃▄▅▆▇██▇▆▅▄▃▂▁▁▂▃▄▅▆▇██▇▆▅▄▃▂▁▁▂▃▄▅▆▇█
*/

import { isBrowser, isWebWorker, isNode } from "./environment/detect";
import math from "./math";
import root from "./root";
import use from "./use";
// import origami from "./origami";
import graphObject from "./graph";
import planarGraph from "./planar_graph";
// import cp from "./cp";
import axiom from "./core/axioms";
import transform from "./core/affine";

// core methods, these need to be added individually
import * as keys from "./core/keys";
import * as make from "./core/make";
import * as clip from "./core/clip";
import * as boundary from "./core/boundary";
import * as nearest from "./core/nearest";
import count from "./core/count";
import implied from "./core/count_implied";
import remove from "./core/remove";
import populate from "./core/populate";
import subgraph from "./core/subgraph";
import explode_faces from "./core/explode_faces";
import get_duplicate_edges from "./core/edges_duplicate";
import clusters_vertices from "./core/vertices_duplicate/clusters_vertices";
import merge_duplicate_vertices from "./core/vertices_duplicate/merge";
import * as isolated_vertices from "./core/vertices_isolated";
import fragment from "./core/fragment";
import clean from "./core/clean";
import create from "./core/create";

import add_vertices from "./core/add_vertices/add_vertices";
import add_vertices_unique_split_edges from "./core/add_vertices/add_vertices_unique_split_edges";
import add_vertex_on_edge from "./core/add_vertices/add_vertex_on_edge";
import add_edges from "./core/add_edges/add_edges";
import split_face from "./core/split_face";
import fold_through from "./core/fold_through";

const graph = Object.assign(Object.create(null), {
  count,
  implied,
  remove,
  populate,
  subgraph,
  explode_faces,
  get_duplicate_edges,
  clusters_vertices,
  merge_duplicate_vertices,
  fragment,
  add_vertices,
  add_vertices,
  add_vertices_unique_split_edges,
  add_vertex_on_edge,
  add_edges,
  split_face,
  fold_through,
  clean,
  // clear,
},
  keys,
  make,
  clip,
  boundary,
  transform,
  nearest,
  isolated_vertices,
);

const Ear = Object.assign(root, {
  axiom,
  // origami,
  // graph,
  graphObject,
  planarGraph,
  // cp,
  cp: create,
  math: math.core,
  graph,
});
Ear.use = use.bind(Ear);

Object.keys(math)
  .filter(key => key !== "core")
  .forEach((key) => { Ear[key] = math[key]; });

// const operating_systems = [
//   isBrowser ? "browser" : "",
//   isWebWorker ? "web-worker" : "",
//   isNode ? "node" : "",
// ].filter(a => a !== "").join(" ");
// console.log(`RabbitEar v0.1.91 [${operating_systems}]`);

export default Ear;
