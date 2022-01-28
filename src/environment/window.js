/**
 * SVG (c) Robby Kraft
 */
/**
 * provide DOMParser, XMLSerializer, and document for both browser
 * and or nodejs environments.
 * - browser: built-in window object
 * - nodejs: package XMLDOM, https://www.npmjs.com/package/@xmldom/xmldom
 */
import {
  isBrowser,
  isNode,
} from "./detect";
// the most minimal, valid, HTML5 document: doctype with non-whitespace title
const htmlString = "<!DOCTYPE html><title>.</title>";
/**
 * @description an object named "window" with DOMParser, XMLSerializer,
 * and document.
 * in the case of browser-usage, this object is simply the browser window,
 * in the case of nodejs, the package "xmldom" provides the methods.
 */
const Window = (function () {
  let win = {};
  if (isNode) {
    const { DOMParser, XMLSerializer } = require("@xmldom/xmldom");
    win.DOMParser = DOMParser;
    win.XMLSerializer = XMLSerializer;
    win.document = new DOMParser().parseFromString(htmlString, "text/html");
  } else if (isBrowser) {
    win = window;
  }
  return win;
}());

export default Window;
