// get DOMParser and XMLSerializer from the browser or from Node

import {
  isBrowser,
  isNode,
} from "./detect";

const htmlString = "<!DOCTYPE html><title>a</title>";
const win = {};

if (isNode) {
  const { DOMParser, XMLSerializer } = require("xmldom");
  win.DOMParser = DOMParser;
  win.XMLSerializer = XMLSerializer;
  win.document = new DOMParser().parseFromString(htmlString, "text/html");
} else if (isBrowser) {
  win.DOMParser = window.DOMParser;
  win.XMLSerializer = window.XMLSerializer;
  win.document = window.document;
}

export default win;
