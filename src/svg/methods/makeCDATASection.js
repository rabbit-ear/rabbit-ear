/* svg (c) Kraft, MIT License */
import SVGWindow from '../environment/window.js';

const makeCDATASection = (text) => (new (SVGWindow()).DOMParser())
	.parseFromString("<root></root>", "text/xml")
	.createCDATASection(text);

export { makeCDATASection as default };
