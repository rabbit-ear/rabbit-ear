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
import graph from "./graph";
import planarGraph from "./planar_graph";
import cp from "./cp";
import axiom from "./core/axioms";

// core methods, these need to be added individually
import * as keys from "./core/keys";
import * as make from "./core/make";
import * as clip from "./core/clip";
import count from "./core/count";
import implied from "./core/count_implied";
import remove from "./core/remove";
import populate from "./core/populate";
import get_duplicate_edges from "./core/edges_duplicate";
import clusters_vertices from "./core/vertices_duplicate/clusters_vertices";
import merge_duplicate_vertices from "./core/vertices_duplicate/merge";
import fragment from "./core/fragment";

import add_vertices from "./core/add_vertices/add_vertices";
import add_vertices_unique from "./core/add_vertices/add_vertices_unique";
import add_vertices_unique_split_edges from "./core/add_vertices/add_vertices_unique_split_edges";
import add_edges from "./core/add_edges/add_edges";

const core = Object.assign(Object.create(null), {
  count,
  implied,
  remove,
  populate,
  get_duplicate_edges,
  clusters_vertices,
  merge_duplicate_vertices,
  fragment,
  add_vertices,
  add_vertices_unique,
  add_vertices_unique_split_edges,
  add_edges,
},
  keys,
  make,
  clip,
);

const Ear = Object.assign(root, {
  axiom,
  // origami,
  graph,
  planarGraph,
  cp,
  math: math.core,
  core,
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
