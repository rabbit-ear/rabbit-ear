/* svg (c) Kraft, MIT License */
import makeViewBox from '../arguments/makeViewBox.js';
import { str_string, str_viewBox } from '../environment/strings.js';

const setViewBox = (element, ...args) => {
	const viewBox = args.length === 1 && typeof args[0] === str_string
		? args[0]
		: makeViewBox(...args);
	if (viewBox) {
		element.setAttribute(str_viewBox, viewBox);
	}
	return element;
};
const getViewBox = function (element) {
	const vb = element.getAttribute(str_viewBox);
	return (vb == null
		? undefined
		: vb.split(" ").map(n => parseFloat(n)));
};
const convertToViewBox = function (svg, x, y) {
	const pt = svg.createSVGPoint();
	pt.x = x;
	pt.y = y;
	const svgPoint = pt.matrixTransform(svg.getScreenCTM().inverse());
	return [svgPoint.x, svgPoint.y];
};

export { convertToViewBox, getViewBox, setViewBox };
