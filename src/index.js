/**
 * Rabbit Ear (c) Robby Kraft
 */
import { isBrowser, isWebWorker, isNode } from "./environment/detect";
import math from "./math";
import root from "./root";
import use from "./use";
import graph_methods from "./graph";
// build objects
import Constructors from "./constructors";
// prototypes
import GraphProto from "./prototypes/graph";
import PlanarGraphProto from "./prototypes/planar_graph";
import CreasePatternProto from "./prototypes/crease_pattern";
// import OrigamiProto from "./prototypes/origami";
import { file_spec, file_creator } from "./graph/fold_keys";
import { fold_object_certainty } from "./graph/fold_spec";
// top level things
import axiom from "./axioms";
import text from "./text";
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

const ConstructorPrototypes = {
  graph: GraphProto,
  planargraph: PlanarGraphProto,
  origami: GraphProto,
  cp: CreasePatternProto,
}

Object.keys(ConstructorPrototypes).forEach(name => {
  Constructors[name] = function () {
    // should Graph({vertices_coors:[], ...}) deep copy the argument object?
    return Object.assign(
      Object.create(ConstructorPrototypes[name]),
      ...Array.from(arguments).filter(a => fold_object_certainty(a)),
      { file_spec, file_creator }
    );
  };
  Constructors[name].prototype = ConstructorPrototypes[name];
  Constructors[name].prototype.constructor = Constructors[name];
});

Object.assign(Constructors.graph, graph_methods);

const Ear = Object.assign(root, Constructors, {
  math: math.core,
  axiom,
  text,
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
