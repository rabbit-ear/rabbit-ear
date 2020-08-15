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
import math from "../include/math";
import root from "./root";
import use from "./use";
// import origami from "./origami";
// import graph from "./graph";
// import cp from "./cp";

const Ear = Object.assign(root, {
  // origami,
  // graph,
  // cp,
  math: math.core,
});

Object.keys(math)
  .filter(key => key !== "core")
  .forEach((key) => { Ear[key] = math[key]; });

Ear.use = use.bind(Ear);

// const operating_systems = [
//   isBrowser ? "browser" : "",
//   isWebWorker ? "web-worker" : "",
//   isNode ? "node" : "",
// ].filter(a => a !== "").join(" ");
// console.log(`RabbitEar v0.1.91 [${operating_systems}]`);

export default Ear;
