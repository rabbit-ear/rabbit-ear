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

import { isBrowser, isWebWorker, isNode } from "./environment/detect";

import math from "../include/math";
import graph from "./graph";
import svg from "../include/svg";
// import noise from "../include/simplex";

// top level methods
import apply_axiom from "./axioms/axiom_frame";
import * as Axioms from "./axioms";

// to be included in "core"
import * as affine from "./FOLD/affine";
import * as frames from "./FOLD/file_frames";
import * as object from "./FOLD/object";
import * as keys from "./FOLD/keys";
import * as collinear from "./FOLD/collinear";
import * as validate from "./FOLD/validate";
import fragment from "./FOLD/fragment";
import clean from "./FOLD/clean";
import Validate from "./FOLD/validate";
import convert from "./convert/convert";

import * as remove from "./FOLD/remove";
import * as make from "./FOLD/make";
import * as query from "./FOLD/query";
import * as rebuild from "./FOLD/rebuild";
import * as marks from "./FOLD/marks";

import fold from "./fold-through-all";
import * as kawasaki from "./kawasaki";

import build_diagram_frame from "./diagram/diagram_frame";

import add_edge from "./FOLD/add_edge";
import split_edge_run from "./FOLD/split_edge_run";
import { merge_run_diffs, apply_run_diff } from "./fold-through-all/run_frame";

// origami bases
import empty from "./bases/empty.fold";
import square from "./bases/square.fold";
import book from "./bases/book.fold";
import blintz from "./bases/blintz.fold";
import kite from "./bases/kite.fold";
import fish from "./bases/fish.fold";
import bird from "./bases/bird.fold";
import frog from "./bases/frog.fold";

import Origami from "./origami";
import CreasePattern from "./crease-pattern";

// experimental stuff
import * as delaunay from "./delaunay";
import { Voronoi, Delaunay } from "../include/delaunay";

// console.log(`RabbitEar v0.1.91 [ ${isBrowser ? "browser " : ""}${isWebWorker ? "webWorker " : ""}${isNode ? "node " : ""}]`);

// const draw = Object.create(null);
// draw.svg = svg;
// draw.gl = {};

const core = Object.create(null);
Object.assign(core,
  frames,
  object,
  collinear,
  keys,
  affine,
  validate,
  remove,
  rebuild,
  make,
  delaunay,
  marks,
  query,
  kawasaki,
  Axioms);
// these are defaults. they aren't objects like above.
// they need to be added this way.
core.build_diagram_frame = build_diagram_frame;
core.add_edge = add_edge;
core.split_edge_run = split_edge_run;
core.apply_run = apply_run_diff;
core.merge_run = merge_run_diffs;
core.apply_axiom = apply_axiom;
core.fragment = fragment;
core.clean = clean;
core.validate = Validate;

// core.prototype = prototype;

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
  CreasePattern, // experimental feature
  Origami,
  graph,
  Voronoi,
  Delaunay,
  // draw,
  svg,
  fold,
  convert,
  core,
  bases,
  math: math.core,
  axiom: Axioms.axiom,
  equivalent: math.core.equivalent
};

Object.keys(math)
  .filter(key => key !== "core")
  .forEach((key) => { rabbitEar[key] = math[key]; });

export default rabbitEar;
