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
// the library itself
import root from "./root";
// object-oriented style object constructors
import Constructors from "./classes/index";
// top level things
import math from "./math";
import diagram from "./diagrams/index";
import vertex from "./single_vertex/index";
import svg from "./svg/svg_mini"; // the minified substitute
import axiom from "./axioms/index";
import text from "./text/index";
import use from "./use/index";
// webgl
import * as foldToThree from "./webgl/fold-to-three";
/**
 * extensions
 * all extensions are optional, the library does not depend
 * on their inclusion, and is able to be built without them. they attach
 * themselves with the .use() method at the bottom of this file.
 *
 * if the library is to be built without an extension, comment out this line,
 * and the .use() methods below too.
 */
import SVG from "./extensions/svg"; // replaces minified substitute

const ear = Object.assign(root, Constructors, {
	math: math.core,
	axiom,
	diagram,
	vertex,
	svg,
	text,
	webgl: foldToThree,
});
/**
 * use() must bind this library to "this", as a way of making this library
 * mutable, so that the extension can bind itself throughout this library.
 */
Object.defineProperty(ear, "use", {
	enumerable: false,
	value: use.bind(ear),
});
/**
 * math is uniquely constructed where all the core methods are exposed
 * under ".math", and the top-level class-style objects will be attached
 * to this library's top level.
 */
Object.keys(math)
	.filter(key => key !== "core")
	.forEach((key) => { ear[key] = math[key]; });
/**
 * binding the extensions. for most, its a back-and-forth, each calling use()
 */
SVG.use(ear);
ear.use(SVG);

export default ear;
