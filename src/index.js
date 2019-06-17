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
import CreasePattern from "./objects/CreasePattern";
import Origami from "./objects/View2D";
import Origami3D from "./objects/View3D";
import Graph from "./objects/graph";
// top level methods
import { apply_axiom } from "./frames/axiom_frame";
import * as Axioms from "./origami/axioms";

// to be included in "convert"
import { toFOLD, toSVG, toORIPA } from "./files/filetype";
// todo, remove
import FOLD_SVG from "../include/fold-svg";

// to be included in "core"
import * as create from "./fold/create";
import * as frames from "./fold/file_frames";
import * as object from "./fold/object";
import * as spec from "./fold/spec";
import * as validate from "./fold/validate";

import * as add from "./graph/add";
import * as remove from "./graph/remove";
import * as make from "./graph/make";
import * as query from "./graph/query";
import * as rebuild from "./graph/rebuild";

// import * as crease from "./origami/crease";
import fold from "./origami/fold";
import * as kawasaki from "./origami/kawasaki";
// import { default as valleyfold } from "./fold/valleyfold";

import build_diagram_frame from "./frames/diagram_frame";

import add_edge from "./graph/add_edge";
import split_edge_run from "./graph/split_edge_run";
import { merge_run_diffs, apply_run_diff } from "./frames/run_frame";

// origami bases
import empty from "./data/bases/empty.fold";
import square from "./data/bases/square.fold";
import book from "./data/bases/book.fold";
import blintz from "./data/bases/blintz.fold";
import kite from "./data/bases/kite.fold";
import fish from "./data/bases/fish.fold";
import bird from "./data/bases/bird.fold";
import frog from "./data/bases/frog.fold";

import foldPrototype from "./fold/prototype";

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
  rebuild,
  make,
  query,
  // crease,
  fold,
  kawasaki,
  Axioms);

core.build_diagram_frame = build_diagram_frame;
core.add_edge = add_edge;
core.split_edge_run = split_edge_run;
core.apply_run = apply_run_diff;
core.merge_run = merge_run_diffs;
core.apply_axiom = apply_axiom;

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
  foldPrototype // todo get rid
};

Object.keys(math)
  .filter(key => key !== "core")
  .forEach((key) => { rabbitEar[key] = math[key]; });

export default rabbitEar;
