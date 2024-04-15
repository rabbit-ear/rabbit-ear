/**
 * Rabbit Ear (c) Kraft
 */
import * as generalProgram from "./general/program.js";
import * as initialize from "./general/initialize.js";
import * as view from "./general/view.js";
import * as program from "./program.js";
//
import foldedForm from "./foldedForm/index.js";
import creasePattern from "./creasePattern/index.js";
//
import * as foldedArrays from "./foldedForm/arrays.js";
import * as foldedData from "./foldedForm/data.js";
import * as foldedPrograms from "./foldedForm/programs.js";
//
import * as cpArrays from "./creasePattern/arrays.js";
import * as cpData from "./creasePattern/data.js";
import * as cpPrograms from "./creasePattern/programs.js";

/**
 * @description WebGL methods
 */
export default {
	foldedForm,
	creasePattern,
	// webGLHelpers,
	...generalProgram,
	...initialize,
	...view,
	...program,
	...foldedArrays,
	...foldedData,
	...foldedPrograms,
	...cpArrays,
	...cpData,
	...cpPrograms,
};
