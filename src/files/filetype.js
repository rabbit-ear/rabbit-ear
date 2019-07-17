import drawFOLD from "../../include/fold-draw";
import ORIPA from "../../include/fold/oripa";
import loader from "./load_async";

export const convert = async function (file) {
  loader(file, (fold) => {
    return { };
  });
};

export const toFOLD = function (input, callback) {
  return loader(input, (fold) => {
    if (callback != null) { callback(fold); }
  });
};

export const toSVG = function (input, callback) {
  let async = false;
  // attempt to load synchronously, the callback will be called regardless,
  // we need a flag to flip when the call is done, then check if the async
  // call is in progress
  const syncFold = loader(input, () => {
    if (async) {
      drawFOLD.svg(input, (loadedSVG) => {
        if (callback != null) { callback(loadedSVG); }
      });
    }
  });
  async = true;
  // if the load was synchronous, syncFold will contain data. if not,
  // let the callback above finish off the conversion.
  if (syncFold !== undefined) {
    drawFOLD.svg(syncFold, (loadedSVG) => {
      if (callback != null) { callback(loadedSVG); }
    });
    // return svg;
  }
};

export const toORIPA = function (input, callback) {
  // coded for FOLD input only!!
  const fold = JSON.parse(JSON.stringify(input));
  return ORIPA.fromFold(fold);
};
