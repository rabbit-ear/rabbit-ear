/**
 * Rabbit Ear (c) Kraft
 */
import { setWindow } from "./environment/window.js";
import { graph } from "./prototypes/index.js";
import axiom from "./axioms/index.js";
import convert from "./convert/index.js";
import general from "./general/index.js";
import graphMethods from "./graph/index.js";
import math from "./math/index.js";
import singleVertex from "./singleVertex/index.js";
import svg from "./svg/index.js";
import webgl from "./webgl/index.js";
import layerMethods from "./layer/index.js";
import { layer } from "./layer/layer.js";
import diagram from "./diagrams/index.js";
import svgLink from "./svg/environment/lib.js";

/**
 * Rabbit Ear, the default exported object
 */
const ear = {
	axiom,
	convert,
	diagram,
	general,
	graph: Object.assign(graph, graphMethods),
	layer: Object.assign(layer, layerMethods),
	math,
	singleVertex,
	svg,
	webgl,
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
