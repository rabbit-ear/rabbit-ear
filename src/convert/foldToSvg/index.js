/**
 * Rabbit Ear (c) Kraft
 */
import window from "../../environment/window.js";
import SVG from "../../svg/index.js";
import {
	getViewBox,
	getStrokeWidth,
	boundingBoxToViewBox,
} from "./general.js";
import draw from "./draw/index.js";
import render from "./render.js";
/**
 * @description renders a FOLD object as an SVG, ensuring visibility by
 * setting the viewBox and the stroke-width attributes on the SVG.
 * @param {FOLD | string} file a FOLD object or a FOLD file as a string
 * @param {object?} options optional options object to style components
 * @param {boolean} tell the draw method to resize the viewbox/stroke
 * @returns {SVGElement} SVG element, containing the rendering of the origami.
 * @linkcode Origami ./src/svg/index.js 185
 */
const foldToSvg = (file, options = {}) => {
	const element = render(
		typeof file === "string" ? JSON.parse(file) : file,
		SVG.svg(),
		{
			viewBox: true,
			strokeWidth: true,
			...options,
		},
	);
	// if options: { string: true } return the result as a string.
	return options && options.string
		? (new (window().XMLSerializer)()).serializeToString(element)
		: element;
};
/**
 * @description subroutines
 */
Object.assign(foldToSvg, {
	...draw,
	render,
	getViewBox,
	getStrokeWidth,
	boundingBoxToViewBox,
});

export default foldToSvg;
