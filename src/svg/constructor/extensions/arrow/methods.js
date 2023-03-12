/* svg (c) Kraft, MIT License */
import { str_arrow, str_head, str_tail, str_boolean, str_object, str_function } from '../../../environment/strings.js';
import { toCamel } from '../../../methods/transformCase.js';
import { svgSemiFlattenArrays } from '../../../arguments/semiFlattenArrays.js';
import makeCoordinates from '../../../arguments/makeCoordinates.js';
import makeArrowPaths from './makeArrowPaths.js';
import TransformMethods from '../shared/transforms.js';

const setArrowheadOptions = (element, options, which) => {
	if (typeof options === str_boolean) {
		element.options[which].visible = options;
	} else if (typeof options === str_object) {
		Object.assign(element.options[which], options);
		if (options.visible == null) {
			element.options[which].visible = true;
		}
	} else if (options == null) {
		element.options[which].visible = true;
	}
};
const setArrowStyle = (element, options = {}, which = str_head) => {
	const path = element.getElementsByClassName(`${str_arrow}-${which}`)[0];
	Object.keys(options)
		.map(key => ({ key, fn: path[toCamel(key)] }))
		.filter(el => typeof el.fn === str_function && el.key !== "class")
		.forEach(el => el.fn(options[el.key]));
	Object.keys(options)
		.filter(key => key === "class")
		.forEach(key => path.classList.add(options[key]));
};
const redraw = (element) => {
	const paths = makeArrowPaths(element.options);
	Object.keys(paths)
		.map(path => ({
			path,
			element: element.getElementsByClassName(`${str_arrow}-${path}`)[0],
		}))
		.filter(el => el.element)
		.map(el => { el.element.setAttribute("d", paths[el.path]); return el; })
		.filter(el => element.options[el.path])
		.forEach(el => el.element.setAttribute(
			"visibility",
			element.options[el.path].visible
				? "visible"
				: "hidden",
		));
	return element;
};
const setPoints = (element, ...args) => {
	element.options.points = makeCoordinates(...svgSemiFlattenArrays(...args)).slice(0, 4);
	return redraw(element);
};
const bend = (element, amount) => {
	element.options.bend = amount;
	return redraw(element);
};
const pinch = (element, amount) => {
	element.options.pinch = amount;
	return redraw(element);
};
const padding = (element, amount) => {
	element.options.padding = amount;
	return redraw(element);
};
const head = (element, options) => {
	setArrowheadOptions(element, options, str_head);
	setArrowStyle(element, options, str_head);
	return redraw(element);
};
const tail = (element, options) => {
	setArrowheadOptions(element, options, str_tail);
	setArrowStyle(element, options, str_tail);
	return redraw(element);
};
const getLine = element => element.getElementsByClassName(`${str_arrow}-line`)[0];
const getHead = element => element.getElementsByClassName(`${str_arrow}-${str_head}`)[0];
const getTail = element => element.getElementsByClassName(`${str_arrow}-${str_tail}`)[0];
const ArrowMethods = {
	setPoints,
	points: setPoints,
	bend,
	pinch,
	padding,
	head,
	tail,
	getLine,
	getHead,
	getTail,
	...TransformMethods,
};

export { ArrowMethods as default };
