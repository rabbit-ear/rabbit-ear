import window from "../environment/window";
import { isBrowser, isNode, isWebWorker } from "../environment/detect";
import convert from "../convert/convert";

const download64 = function (base64, filename) {
  const a = document.createElement("a");
  a.href = base64;
  a.download = filename;
  a.click();
};

const download = function (text, filename, mimeType) {
  const blob = new Blob([text], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  download64(url, filename);
};

const svg_to_png = function (svgElement, callback, options) {
  if (isNode) { return; }
  const canvas = window.document.createElement("canvas");
  canvas.setAttribute("width", "2048");
  canvas.setAttribute("height", "2048");
  const ctx = canvas.getContext("2d");
  const DOMURL = (window.URL || window.webkitURL);
  svgElement.setAttribute("width", "2048");
  svgElement.setAttribute("height", "2048");
  const svgString = (new window.XMLSerializer()).serializeToString(svgElement);
  const svg = new window.Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const img = new window.Image();
  const url = DOMURL.createObjectURL(svg);
  img.onload = function () {
    ctx.drawImage(img, 0, 0);
    canvas.toBlob(blob => {
      if (typeof callback === "function") { callback(blob); }
      DOMURL.revokeObjectURL(url);
    }, "image/png");
  };
  img.src = url;  
};

const export_object = function (graph) {
  const exportObject = function (...args) {
    if (args.length === 0) { return JSON.stringify(graph); }
    switch (args[0]) {
      case "oripa": return convert(graph, "fold").oripa();
      case "svg": return convert(graph, "fold").svg();
      case "png": return (function () {
        let callback = undefined;
        const promise = { then: function (async) {
          if (isNode) {
            async("png rendering requires running in the browser. unsupported in node js");
          }
          callback = async;
        }};
        svg_to_png(convert(graph, "fold").svg({output: "svg"}), function (png) {
          if (png === undefined) { return; }
          promise.data = png;
          // if (isBrowser) { download(blob, "origami" + ".png", "image/png"); }
          if (typeof callback === "function") { callback(png); }
        }, ...args);
        return promise;
      }());
      default: return JSON.stringify(graph);
    }
  };
  exportObject.json = function () { return JSON.stringify(graph); };
  exportObject.fold = function () { return JSON.stringify(graph); };
  exportObject.svg = function () { return convert(graph, "fold").svg(); };
  exportObject.oripa = function () { return convert(graph, "fold").oripa(); };
  exportObject.png = function (...args) {
    return (function() {
        let callback = undefined;
        const promise = { then: function (async) {
          if (isNode) {
            async("png rendering requires running in the browser. unsupported in node js");
          }
          callback = async;
        }};
        svg_to_png(convert(graph, "fold").svg({output: "svg"}), function (png) {
          if (png === undefined) { return; }
          promise.data = png;
          // if (isBrowser) { download(blob, "origami" + ".png", "image/png"); }
          if (typeof callback === "function") { callback(png); }
        }, ...args);
        return promise;
      }());
  }
  return exportObject;
};

export default export_object;
