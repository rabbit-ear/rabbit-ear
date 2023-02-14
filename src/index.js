/**
 * Rabbit Ear (c) Kraft
 */
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
// needed to check the environment
import { isWebWorker } from "./environment/detect.js";
import { setWindow } from "./environment/window.js";
// the library itself
import root from "./root.js";
// object-oriented style object constructors
import Constructors from "./classes/index.js";
// top level things
import math from "./math/index.js";
import diagram from "./diagrams/index.js";
import layer from "./layer/index.js";
import singleVertex from "./singleVertex/index.js";
import axiom from "./axioms/index.js";
import text from "./text/index.js";
import convert from "./convert/index.js";
// a minified substitute SVG library
// import svg from "./svg/svg_mini.js";
import use from "./use/index.js";
/**
 * extensions
 * all extensions are optional, the library does not depend on them.
 * each implements a method called .linker() which is called by .use()
 *
 * to build Rabbit Ear without these extensions, comment out these lines
 * as well as the .use() method calls at the bottom of this file.
 */
/** convert a FOLD object into an SVG */
import foldToSVG from "./svg/index.js";
/** SVG drawing library with a lot of functionality */
import SVG from "./extensions/svg.js"; // replaces minified substitute
/** WebGL extension, draw FOLD objects into WebGL canvas. */
// import * as webgl from "./webgl/fold-to-three.js";
import webgl from "./webgl/index.js";

const ear = Object.assign(root, Constructors, {
	math,
	axiom,
	diagram,
	layer,
	singleVertex,
	text,
	convert,
	webgl,
	// svg,
});
/**
 * math is uniquely constructed where all the core methods are exposed
 * under ".math", and the top-level class-style objects will be attached
 * to this library's top level.
 */
// Object.keys(math)
// 	.filter(key => key !== "core")
// 	.forEach((key) => { ear[key] = math[key]; });
/**
 * use() must bind this library to "this", as a way of making this library
 * mutable, so that the extension can bind itself throughout this library.
 */
Object.defineProperty(ear, "use", {
	enumerable: false,
	value: use.bind(ear),
});
/**
 * binding the extensions must happen after the library has been initialized.
 */
if (!isWebWorker) {
	ear.use(foldToSVG); // must happen before SVG
	ear.use(SVG);
}

Object.defineProperty(ear, "window", {
	enumerable: false,
	set: value => {
		setWindow(value);
		// hardcoded. update window in extensions automatically, if we know them.
		SVG.window = value;
	},
});

// Object.defineProperty(ear, "three", {
// 	enumerable: false,
// 	set: value => setTHREE(value),
// });

export default ear;
