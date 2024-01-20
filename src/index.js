/**
 * Rabbit Ear (c) Kraft
 */
import { setWindow } from "./environment/window.js";
import { graph, cp } from "./prototypes/index.js";
import axiom from "./axioms/index.js";
import convert from "./convert/index.js";
import general from "./general/index.js";
import graphMethods from "./graph/index.js";
import math from "./math/index.js";
import singleVertex from "./singleVertex/index.js";
import svg from "./svg/index.js";
import webgl from "./webgl/index.js";
import layer from "./layer/index.js";
// import diagram from "./diagrams/index.js";
// import text from "./text/index.js";
import svgLink from "./svg/environment/lib.js";

// append graph methods as children of the graph constructor
Object.assign(graph, graphMethods);
/**
 * Rabbit Ear
 */
const ear = {
	graph,
	cp,
	// origami,
	axiom,
	convert,
	general,
	math,
	singleVertex,
	svg,
	webgl,
	// diagram,
	layer,
	// text,
};

// svg library needs a pointer to rabbit-ear
svgLink.ear = ear;

// give the user the ability to set the window
// this allows DOM operations (svg) inside node or deno
Object.defineProperty(ear, "window", {
	enumerable: false,
	set: value => { svg.window = setWindow(value); },
});

export default ear;
