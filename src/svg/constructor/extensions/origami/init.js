/* svg (c) Kraft, MIT License */
import NS from '../../../spec/namespace.js';
import RabbitEarWindow from '../../../environment/window.js';
import lib from '../../../environment/lib.js';

/**
 * SVG (c) Kraft
 */

const init = (graph, ...args) => {
	const g = RabbitEarWindow().document.createElementNS(NS, "g");
	lib.ear.convert.foldToSvg.render(graph, g, ...args);
	return g;
};

export { init as default };
