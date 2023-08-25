/* svg (c) Kraft, MIT License */
import NS from '../../spec/namespace.js';
import SVGWindow from '../../environment/window.js';
import makeCDATASection from '../../general/makeCDATASection.js';

/**
 * SVG (c) Kraft
 */

const styleDef = {
	style: {
		init: (text) => {
			const el = SVGWindow().document.createElementNS(NS, "style");
			el.setAttribute("type", "text/css");
			el.textContent = "";
			el.appendChild(makeCDATASection(text));
			return el;
		},
		methods: {
			setTextContent: (el, text) => {
				el.textContent = "";
				el.appendChild(makeCDATASection(text));
				return el;
			},
		},
	},
};

export { styleDef as default };
