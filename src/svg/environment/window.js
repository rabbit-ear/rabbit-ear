/* svg (c) Kraft, MIT License */
import { isBrowser } from './detect.js';
import Messages from './messages.js';

/**
 * SVG (c) Kraft
 */

const svgWindowContainer = { window: undefined };

const buildHTMLDocument = (newWindow) => new newWindow.DOMParser()
	.parseFromString("<!DOCTYPE html><title>.</title>", "text/html");

const setSVGWindow = (newWindow) => {
	// make sure window has a document. xmldom does not, and requires it be built.
	if (!newWindow.document) { newWindow.document = buildHTMLDocument(newWindow); }
	svgWindowContainer.window = newWindow;
	return svgWindowContainer.window;
};
// if we are in the browser, by default use the browser's "window".
if (isBrowser) { svgWindowContainer.window = window; }
/**
 * @description get the "window" object, which should have
 * DOMParser, XMLSerializer, and document.
 */
const SVGWindow = () => {
	if (svgWindowContainer.window === undefined) {
		throw Messages.window;
	}
	return svgWindowContainer.window;
};

export { SVGWindow as default, setSVGWindow };
