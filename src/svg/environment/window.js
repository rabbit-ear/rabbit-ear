/* svg (c) Kraft, MIT License */
import { isBrowser } from './detect.js';
import Messages from './messages.js';

const svgWindowContainer = { window: undefined };
const buildHTMLDocument = (newWindow) => new newWindow.DOMParser()
	.parseFromString("<!DOCTYPE html><title>.</title>", "text/html");
const setSVGWindow = (newWindow) => {
	if (!newWindow.document) { newWindow.document = buildHTMLDocument(newWindow); }
	svgWindowContainer.window = newWindow;
	return svgWindowContainer.window;
};
if (isBrowser) { svgWindowContainer.window = window; }
const SVGWindow = () => {
	if (svgWindowContainer.window === undefined) {
		throw Messages.window;
	}
	return svgWindowContainer.window;
};

export { SVGWindow as default, setSVGWindow };
