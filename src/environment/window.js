// get DOMParser and XMLSerializer from the browser or from Node

import {
  isBrowser,
  isNode,
} from "./detect";

// const htmlString = "<!DOCTYPE html><title> </title>";

const win = (function () {
  let w = {};
  if (isNode) {
    // const { DOMParser, XMLSerializer } = require("xmldom");
    // w.DOMParser = DOMParser;
    // w.XMLSerializer = XMLSerializer;
    // w.document = new DOMParser().parseFromString(htmlString, "text/html");
  } else if (isBrowser) {
    w = window;
  }
  return w;
}());

export default win;
