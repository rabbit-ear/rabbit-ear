/* svg (c) Kraft, MIT License */
import { pathCommandNames, parsePathCommands } from '../../general/path.js';
import TransformMethods from './shared/transforms.js';
import methods from './shared/urls.js';
import * as dom from './shared/dom.js';

const getD = (el) => {
	const attr = el.getAttribute("d");
	return (attr == null) ? "" : attr;
};
const clear = element => {
	element.removeAttribute("d");
	return element;
};
const appendPathCommand = (el, command, ...args) => {
	el.setAttribute("d", `${getD(el)}${command}${args.flat().join(" ")}`);
	return el;
};
const getCommands = element => parsePathCommands(getD(element));
const path_methods = {
	addCommand: appendPathCommand,
	appendCommand: appendPathCommand,
	clear,
	getCommands: getCommands,
	get: getCommands,
	getD: el => el.getAttribute("d"),
	...TransformMethods,
	...methods,
	...dom,
};
Object.keys(pathCommandNames).forEach((key) => {
	path_methods[pathCommandNames[key]] = (el, ...args) => appendPathCommand(el, key, ...args);
});
const pathDef = {
	path: {
		methods: path_methods,
	},
};

export { pathDef as default };
