/* SVG (c) Kraft */
import NS from '../../../spec/namespace.js';
import RabbitEarWindow from '../../../environment/window.js';
import makeViewBox from '../../../arguments/makeViewBox.js';
import makeCoordinates from '../../../arguments/makeCoordinates.js';
import methods from './methods.js';
import TouchEvents from './touch.js';
import Animation from './animation.js';
// import applyControlsToSVG from './controls.js';

/**
 * Rabbit Ear (c) Kraft
 */

const svgDef = {
	svg: {
		args: (...args) => [makeViewBox(makeCoordinates(...args))].filter(a => a != null),
		methods,
		init: (...args) => {
			const element = RabbitEarWindow().document.createElementNS(NS, "svg");
			element.setAttribute("version", "1.1");
			element.setAttribute("xmlns", NS);
			// args.filter(a => typeof a === str_string)
			// 	.forEach(string => loadSVG(element, string));
			args.filter(a => a != null)
				.filter(el => el.appendChild)
				.forEach(parent => parent.appendChild(element));
			TouchEvents(element);
			Animation(element);
			// applyControlsToSVG(element);
			return element;
		},
	},
};

export { svgDef as default };
