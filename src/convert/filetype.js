// import * as FOLD_SVG from "../../include/fold-svg";
import { default as ORIPA } from "../../include/fold/oripa";

let FOLD_SVG = {
  toFOLD: function(){},
  toSVG: function(){}
};

export const toFOLD = function(input, callback) {
  return load_file(input, function(fold) {
    if (callback != null) { callback(fold); }
  });
}

export const toSVG = function(input, callback) {
  let syncFold, svg, async = false;
  // attempt to load synchronously, the callback will be called regardless,
  // we need a flag to flip when the call is done, then check if the async
  // call is in progress
  syncFold = load_file(input, function(fold) {
    if (async) {
      FOLD_SVG.toSVG(input, function(svg) {
        if (callback != null) { callback(svg); }
      });
    }
  });
  async = true;
  // if the load was synchronous, syncFold will contain data. if not,
  // let the callback above finish off the conversion.
  if (syncFold !== undefined) {
    FOLD_SVG.toSVG(syncFold, function(svg) {
      if (callback != null) { callback(svg); }
    });
    // return svg;
    return;
  }
}

export const toORIPA = function(input, callback) {
  // coded for FOLD input only!!
  let fold = JSON.parse(JSON.stringify(input));
  return ORIPA.fromFold(fold);
}
