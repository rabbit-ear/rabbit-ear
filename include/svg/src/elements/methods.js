/**
 * SVG in Javascript (c) Robby Kraft
 */

import * as DOM from "../DOM";
import * as ViewBox from "../viewBox";

export const attachClassMethods = function (element) {
  const el = element;
  el.removeChildren = () => DOM.removeChildren(element);
  el.addClass = (...args) => DOM.addClass(element, ...args);
  el.removeClass = (...args) => DOM.removeClass(element, ...args);
  el.setClass = (...args) => DOM.setClass(element, ...args);
  el.setID = (...args) => DOM.setID(element, ...args);
};

export const attachViewBoxMethods = function (element) {
  const el = element;
  ["setViewBox",
    "getViewBox",
    "scaleViewBox",
    "translateViewBox",
    "convertToViewBox"
  ].forEach((func) => { el[func] = (...args) => ViewBox[func](el, ...args); });
};

export const attachAppendableMethods = function (element, methods) {
  const el = element;
  Object.keys(methods).forEach((key) => {
    el[key] = function (...args) {
      const g = methods[key](...args);
      element.appendChild(g);
      return g;
    };
  });
};
