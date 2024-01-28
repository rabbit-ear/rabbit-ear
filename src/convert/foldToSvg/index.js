/**
 * Rabbit Ear (c) Kraft
 */
import window from "../../environment/window.js";
import SVG from "../../svg/index.js";
import draw from "./draw/index.js";
import render from "./render.js";
import {
	getViewBox,
	getStrokeWidth,
	boundingBoxToViewBox,
} from "./general.js";

/**
 * @description renders a FOLD object as an SVG. This is able to render
 * in a couple styles (creasePattern, foldedForm), and will do some work
 * to ensure a nice rendering by finding a decent stroke-width and viewBox.
 * @param {FOLD | string} file a FOLD object or a FOLD file as a string
 * @param {object?} options optional options object to style components
 * - "string" {boolean} if true, the return value will be a string
 *   otherwise it will be a Javascript DOM element object type.
 * - todo: more
 * @param {boolean} tell the draw method to resize the viewbox/stroke
 * @returns {SVGElement} SVG element, containing the rendering of the origami.
 * @linkcode Origami ./src/svg/index.js 185
 */
const foldToSvg = (file, options = {}) => {
	// render the file into a DOM element type.
	const element = render(
		typeof file === "string" ? JSON.parse(file) : file,
		SVG.svg(),
		{
			viewBox: true,
			strokeWidth: true,
			...options,
		},
	);

	// if the user requests it, convert the DOM element into a string
	return options && options.string
		? (new (window().XMLSerializer)()).serializeToString(element)
		: element;
};

/**
 * @description Include subroutines in the default export
 */
Object.assign(foldToSvg, {
	...draw,
	render,
	getViewBox,
	getStrokeWidth,
	boundingBoxToViewBox,
});

export default foldToSvg;
