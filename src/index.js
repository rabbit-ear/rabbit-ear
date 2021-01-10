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
import use from "./use/index";
import graph_methods from "./graph/index";
import diagram from "./diagrams/index";
import single from "./single_vertex/index";
// build objects
import Constructors from "./constructors";
// prototypes
import GraphProto from "./prototypes/graph";
// import PlanarGraphProto from "./prototypes/planar_graph";
import CreasePatternProto from "./prototypes/crease_pattern";
import OrigamiProto from "./prototypes/origami";
import { file_spec, file_creator } from "./graph/fold_keys";
import { fold_object_certainty } from "./graph/fold_spec";
// static constructors for prototypes
import create from "./graph/create";
// top level things
import axiom from "./axioms/index";
import text from "./text/index";
// webgl
import * as foldToThree from "./webgl/fold-to-three";

// not sure where it goes yet
import test_axiom from "./axioms/test_axiom";

// extensions
import SVG from "./extensions/svg";
// import FoldToSvg from "./extensions/fold-to-svg";

const ConstructorPrototypes = {
  graph: GraphProto,
  cp: CreasePatternProto,
  origami: OrigamiProto,
};

const default_graph = {
	graph: () => ({}),
	cp: create.square,
	origami: create.square,
};

Object.keys(ConstructorPrototypes).forEach(name => {
  Constructors[name] = function () {
		const argFolds = Array.from(arguments)
      .filter(a => fold_object_certainty(a))
      .map(obj => JSON.parse(JSON.stringify(obj))); // deep copy input graph
    return Object.assign(
			Object.create(ConstructorPrototypes[name]),
			(argFolds.length ? {} : default_graph[name]()),
      ...argFolds,
			{ file_spec, file_creator }
    );
  };
  Constructors[name].prototype = ConstructorPrototypes[name];
  Constructors[name].prototype.constructor = Constructors[name];
  // wrap static constructors with "this" initializer
  Object.keys(create).forEach(funcName => {
    Constructors[name][funcName] = function () {
      return Constructors[name](create[funcName](...arguments));
    };
  });
});

Object.assign(Constructors.graph, graph_methods);

// not sure where it goes yet
axiom.test = test_axiom;

const Ear = Object.assign(root, Constructors, {
  math: math.core,
  axiom,
	diagram,
	single,
  text,
	webgl: foldToThree,
});

Object.defineProperty(Ear, "use", {
  enumerable: false,
  value: use.bind(Ear),
});

Object.keys(math)
  .filter(key => key !== "core")
  .forEach((key) => { Ear[key] = math[key]; });

// const operating_systems = [
//   isBrowser ? "browser" : "",
//   isWebWorker ? "web-worker" : "",
//   isNode ? "node" : "",
// ].filter(a => a !== "").join(" ");
// console.log(`RabbitEar v0.1.91 [${operating_systems}]`);

// extensions
// SVG.use(FoldToSvg);
// FoldToSvg.use(SVG);
SVG.use(Ear);
Ear.use(SVG);
// Ear.use(FoldToSvg);

export default Ear;
