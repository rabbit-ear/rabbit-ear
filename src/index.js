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
import math from "./math";
import root from "./root";
import use from "./use/index";
import diagram from "./diagrams/index";
import vertex from "./single_vertex/index";
// prototypes
import Constructors from "./origami/index";
// top level things
import axiom from "./axioms/index";
import text from "./text/index";
// webgl
import * as foldToThree from "./webgl/fold-to-three";
// extensions
import SVG from "./extensions/svg";

const ear = Object.assign(root, Constructors, {
	math: math.core,
	axiom,
	diagram,
	vertex,
	text,
	webgl: foldToThree,
});

Object.defineProperty(ear, "use", {
	enumerable: false,
	value: use.bind(ear),
});

Object.keys(math)
	.filter(key => key !== "core")
	.forEach((key) => { ear[key] = math[key]; });

// extensions
SVG.use(ear);
ear.use(SVG);

export default ear;

