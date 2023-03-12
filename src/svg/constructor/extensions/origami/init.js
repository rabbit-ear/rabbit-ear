/* svg (c) Kraft, MIT License */
import NS from '../../../spec/namespace.js';
import SVGWindow from '../../../environment/window.js';
import lib from '../../../environment/lib.js';

const init = (...args) => {
	const g = SVGWindow().document.createElementNS(NS, "g");
	lib.ear.convert.foldToSvg.drawInto(g, ...args);
	return g;
};

export { init as default };
