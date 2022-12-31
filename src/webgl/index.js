/**
 * Rabbit Ear (c) Kraft
 */
import createProgram from "./general/createProgram";
import initialize from "./general/initialize";
import * as view from "./general/view";
import hexToRGB from "./general/hexToRGB";
import * as program from "./program";
//
import foldedForm from "./foldedForm/index";
import creasePattern from "./creasePattern/index";
//
import * as foldedArrays from "./foldedForm/arrays";
import * as foldedData from "./foldedForm/data";
import * as foldedPrograms from "./foldedForm/programs";
//
import * as cpArrays from "./creasePattern/arrays";
import * as cpData from "./creasePattern/data";
import * as cpPrograms from "./creasePattern/programs";
/**
 * @description WebGL methods
 */
export default Object.assign(
	Object.create(null),
	{
		createProgram,
		initialize,
		foldedForm,
		creasePattern,
		hexToRGB,
		// webGLHelpers,
	},
	view,
	program,
	foldedArrays,
	foldedData,
	foldedPrograms,
	cpArrays,
	cpData,
	cpPrograms,
);
