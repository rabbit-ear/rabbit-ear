/**
 * Rabbit Ear (c) Kraft
 */
import * as objToFold from "./objToFold.js";
import * as opxToFold from "./opxToFold.js";
import * as svgToFold from "./svgToFold.js";
import * as foldToSvg from "./foldToSvg.js";
import * as foldToObj from "./foldToObj.js";
import * as generalDom from "./general/dom.js";
import * as generalOptions from "./general/options.js";
import * as generalPlanarize from "./general/planarize.js";
import * as generalSVG from "./general/svg.js";
import svg from "./svg/index.js";

export default {
	...objToFold,
	...opxToFold,
	...svgToFold,
	...foldToSvg,
	...foldToObj,
	...generalDom,
	...generalOptions,
	...generalPlanarize,
	...generalSVG,
	...svg,
};
