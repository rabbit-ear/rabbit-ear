/**
 * Rabbit Ear (c) Robby Kraft
 */
import { isBrowser, isWebWorker, isNode } from "./environment/detect";
import math from "./math";
import root from "./root";
import use from "./use";
import graph from "./graph";
// import origami from "./origami";
// import planarGraph from "./planar_graph";
// import cp from "./cp";

// todo: rename and move
import axiom from "./math/axioms";
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

const Ear = Object.assign(root, {
  math: math.core,
  graph,
  axiom,
  // planarGraph,
  // cp,
  // origami,
});

Object.defineProperty(Ear, "use", {
  enumerable: false,
  value: use.bind(Ear),
})

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
