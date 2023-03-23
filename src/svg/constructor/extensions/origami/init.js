/* svg (c) Kraft, MIT License */
import NS from '../../../spec/namespace.js';
import SVGWindow from '../../../environment/window.js';
import lib from '../../../environment/lib.js';

const init = (graph, ...args) => {
	const g = SVGWindow().document.createElementNS(NS, "g");
	lib.ear.convert.foldToSvg.render(graph, g, ...args);
	return g;
};

export { init as default };
