/**
 * Rabbit Ear (c) Kraft
 */
import { setWindow } from "./environment/window.js";
import root from "./root.js";
// import Constructors from "./classes/index.js";
import axiom from "./axioms/index.js";
import convert from "./convert/index.js";
import graph from "./graph/index.js";
import math from "./math/index.js";
import singleVertex from "./singleVertex/index.js";
import svg from "./svg/index.js";
import webgl from "./webgl/index.js";
// import diagram from "./diagrams/index.js";
// import layer from "./layer/index.js";
// import text from "./text/index.js";
// to be incorporated, svg needs a pointer to rabbit-ear
import svgLib from "./svg/environment/lib.js";
/**
 * Rabbit Ear
 */
// const ear = Object.assign(root, Constructors, {
const ear = Object.assign(root, {
	axiom,
	convert,
	graph,
	math,
	singleVertex,
	svg,
	webgl,
	// diagram,
	// layer,
	// text,
});

svgLib.ear = ear;

Object.defineProperty(ear, "window", {
	enumerable: false,
	set: value => { svg.window = setWindow(value); },
});

export default ear;
