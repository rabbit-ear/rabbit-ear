/*
▁▂▃▄▅▆▇██▇▆▅▄▃▂▁▁▂▃▄▅▆▇██▇▆▅▄▃▂▁▁▂▃▄▅▆▇██▇▆▅▄▃▂▁▁▂▃▄▅▆▇██▇▆▅▄▃▂▁▁▂▃▄▅▆▇██▇▆▅▄▃▂
                          _     _     _ _
                         | |   | |   (_) |
                _ __ __ _| |__ | |__  _| |_    ___  __ _ _ __
               | '__/ _` | '_ \| '_ \| | __|  / _ \/ _` | '__|
               | | | (_| | |_) | |_) | | |_  |  __/ (_| | |
               |_|  \__,_|_.__/|_.__/|_|\__|  \___|\__,_|_|

█▇▆▅▄▃▂▁▁▂▃▄▅▆▇██▇▆▅▄▃▂▁▁▂▃▄▅▆▇██▇▆▅▄▃▂▁▁▂▃▄▅▆▇██▇▆▅▄▃▂▁▁▂▃▄▅▆▇██▇▆▅▄▃▂▁▁▂▃▄▅▆▇
*/

import math from "../include/math";
import * as svg from "../include/svg";
// import * as noise from "../include/perlin";

// top level objects
import CreasePattern from "./cp/CreasePattern";
import Origami from "./View2D";
import Origami3D from "./View3D";
import Graph from "./Graph";
// top level methods
// import { axiom } from "./origami/axioms";
import * as Axioms from "./origami/axioms";

// to be included in "convert"
import { toFOLD, toSVG, toORIPA } from "./convert/filetype";
// todo, remove
import FOLD_SVG from "../include/fold-svg";

// to be included in "core"
import * as create from "./fold_format/create";
import * as frames from "./fold_format/frames";
import * as object from "./fold_format/object";
import * as spec from "./fold_format/spec";
import * as validate from "./fold_format/validate";

import * as add from "./graph/add";
import * as remove from "./graph/remove";
import * as make from "./graph/make";
import * as query from "./graph/query";
import * as planargraph from "./graph/planargraph";

import * as fold from "./origami/fold";
import * as crease from "./origami/crease";
import * as creasethrough from "./origami/creasethrough";
import * as kawasaki from "./origami/kawasaki";
// import { default as valleyfold } from "./fold/valleyfold";

import * as diagram from "./origami/diagram";

// origami bases
import empty from "./bases/empty.fold";
import square from "./bases/square.fold";
import book from "./bases/book.fold";
import blintz from "./bases/blintz.fold";
import kite from "./bases/kite.fold";
import fish from "./bases/fish.fold";
import bird from "./bases/bird.fold";
import frog from "./bases/frog.fold";


const convert = {
  toFOLD,
  toSVG,
  toORIPA,
  FOLD_SVG,
};

const core = Object.create(null);
Object.assign(core,
  frames,
  create,
  object,
  spec,
  validate,
  add,
  remove,
  planargraph,
  make,
  query,
  fold,
  crease,
  creasethrough,
  kawasaki,
  diagram,
  Axioms);

// load bases
const b = {
  empty: JSON.parse(empty),
  square: JSON.parse(square),
  book: JSON.parse(book),
  blintz: JSON.parse(blintz),
  kite: JSON.parse(kite),
  fish: JSON.parse(fish),
  bird: JSON.parse(bird),
  frog: JSON.parse(frog),
};


const bases = Object.create(null);
Object.defineProperty(bases, "empty", { get: () => core.clone(b.empty) });
Object.defineProperty(bases, "square", { get: () => core.clone(b.square) });
Object.defineProperty(bases, "book", { get: () => core.clone(b.book) });
Object.defineProperty(bases, "blintz", { get: () => core.clone(b.blintz) });
Object.defineProperty(bases, "kite", { get: () => core.clone(b.kite) });
Object.defineProperty(bases, "fish", { get: () => core.clone(b.fish) });
Object.defineProperty(bases, "bird", { get: () => core.clone(b.bird) });
Object.defineProperty(bases, "frog", { get: () => core.clone(b.frog) });

// remove these for production
// import test from './bases/test-three-fold.fold';
// import dodecagon from './bases/test-dodecagon.fold';
// import boundary from './bases/test-boundary.fold';
// import concave from './bases/test-concave.fold';
// import blintzAnimated from './bases/blintz-animated.fold';
// import blintzDistorted from './bases/blintz-distort.fold';
// const bases = {
//  empty: file.recursive_freeze(JSON.parse(empty)),
//  square: file.recursive_freeze(JSON.parse(square)),
//  book: file.recursive_freeze(JSON.parse(book)),
//  blintz: file.recursive_freeze(JSON.parse(blintz)),
//  kite: file.recursive_freeze(JSON.parse(kite)),
//  fish: file.recursive_freeze(JSON.parse(fish)),
//  bird: file.recursive_freeze(JSON.parse(bird)),
//  frog: file.recursive_freeze(JSON.parse(frog)),
//  // remove these for production
//  // test: JSON.parse(test),
//  // dodecagon: JSON.parse(dodecagon),
//  // boundary: JSON.parse(boundary),
//  // concave: JSON.parse(concave),
//  // blintzAnimated: JSON.parse(blintzAnimated),
//  // blintzDistorted: JSON.parse(blintzDistorted)
// };

const rabbitEar = {
  CreasePattern,
  Origami,
  Origami3D,
  Graph,
  svg,
  convert,
  core,
  bases,
  math: math.core,
  axiom: Axioms.axiom,
};

Object.keys(math)
  .filter(key => key !== "core")
  .forEach((key) => { rabbitEar[key] = math[key]; });

export default rabbitEar;
