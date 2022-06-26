/**
 * Rabbit Ear (c) Kraft
 */
/**
 * maintain one "window" object for both browser and nodejs. if a browser window
 * object exists, it will set to this, including inside a node/react website for example
 * in backend-specific nodejs you will need to assign this window object yourself to a
 * XML DOM library, (listed below), by running: ear.window = xmldom (the default export)
 * - @xmldom/xmldom: https://www.npmjs.com/package/@xmldom/xmldom
 * note: xmldom supports DOMParser, XMLSerializer, and document, but not
 * cancelAnimationFrame, requestAnimationFrame, fetch, which are used by this library.
 */
import { isBrowser } from "./detect";
import errors from "./errors";

const windowContainer = { window: undefined };

const buildDocument = (newWindow) => new newWindow.DOMParser()
  .parseFromString("<!DOCTYPE html><title>.</title>", "text/html");

export const setWindow = (newWindow) => {
  // make sure window has a document. xmldom does not, and requires it be built.
  if (!newWindow.document) { newWindow.document = buildDocument(newWindow); }
  windowContainer.window = newWindow
  return windowContainer.window;
};
// if we are in the browser, by default use the browser's "window".
if (isBrowser) { windowContainer.window = window; }
/**
 * @description get the "window" object, which should have
 * DOMParser, XMLSerializer, and document.
 */
const RabbitEarWindow = () => {
  if (windowContainer.window === undefined) {
    throw errors[10];
  }
  return windowContainer.window;
};

export default RabbitEarWindow;
