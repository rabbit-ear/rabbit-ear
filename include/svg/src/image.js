/**
 * SVG in Javascript (c) Robby Kraft
 *
 * responsive, interactive SVG image with methods and handlers
 * @param: (number, number) width, height
 * @param: a DOM object or string DOM id. a parent to attach to
 * @param: a function that gets called after setup (callback)
 */

import * as DOM from "./DOM";
import * as ViewBox from "./viewBox";
import { svg, setupSVG } from "./elements/main";
import Events from "./events";
import window from "./environment/window";

const getElement = function (...params) {
  const element = params.filter(arg => arg instanceof HTMLElement).shift();
  const idElement = params
    .filter(a => typeof a === "string" || a instanceof String)
    .map(str => window.document.getElementById(str))
    .shift();
  if (element != null) { return element; }
  return (idElement != null
    ? idElement
    : window.document.body);
};

const initSize = function (svgElement, params) {
  const numbers = params.filter(arg => !isNaN(arg));
  if (numbers.length >= 2) {
    svgElement.setAttributeNS(null, "width", numbers[0]);
    svgElement.setAttributeNS(null, "height", numbers[1]);
    ViewBox.setViewBox(svgElement, 0, 0, numbers[0], numbers[1]);
  } else if (svgElement.getAttribute("viewBox") == null) {
    // set a viewBox if viewBox doesn't yet exist
    const rect = svgElement.getBoundingClientRect();
    ViewBox.setViewBox(svgElement, 0, 0, rect.width, rect.height);
  }
};

const attachSVGMethods = function (element) {
  Object.defineProperty(element, "w", {
    get: () => DOM.getWidth(element),
    set: w => element.setAttributeNS(null, "width", w),
  });
  Object.defineProperty(element, "h", {
    get: () => DOM.getHeight(element),
    set: h => element.setAttributeNS(null, "height", h),
  });
  element.getWidth = () => DOM.getWidth(element);
  element.getHeight = () => DOM.getHeight(element);
  element.setWidth = w => element.setAttributeNS(null, "width", w);
  element.setHeight = h => element.setAttributeNS(null, "height", h);
  element.save = function (filename = "image.svg") {
    return DOM.save(element, filename);
  };
  element.load = function (data, callback) {
    DOM.load(data, function (newSVG, error) {
      let parent = element.parentNode;
      if (newSVG != null) {
        newSVG.events = element.events;
        setupSVG(newSVG);
        if (newSVG.events == null) { newSVG.events = Events(newSVG); }
        else { newSVG.events.setup(newSVG); }
        attachSVGMethods(newSVG);
        if (parent != null) { parent.insertBefore(newSVG, element); }
        element.remove();
        element = newSVG;
      }
      // if (parent != null) { parent.appendChild(element); }
      if (callback != null) { callback(element, error); }
    });
  };
};

const svgImage = function (...params) {
  // create a new SVG
  const image = svg();

  // setup that can occur immediately
  initSize(image, params);
  attachSVGMethods(image);
  image.events = Events(image);

  const setup = function () {
    // setup that requires a loaded DOM. append to parent, run callback
    initSize(image, params);
    const parent = getElement(...params);
    if (parent != null) { parent.appendChild(image); }
    params.filter(arg => typeof arg === "function")
      .forEach(func => func());
  };

  if (window.document.readyState === "loading") {
    // wait until after the <body> has rendered
    window.document.addEventListener("DOMContentLoaded", setup);
  } else {
    setup();
  }

  return image;
};

export default svgImage;
