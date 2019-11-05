
/**
 * this clone function is decent, except for:
 * - it doesn't detect recursive cycles
 * - weird behavior around Proxys
 */
export const clone = function (o) {
  // from https://jsperf.com/deep-copy-vs-json-stringify-json-parse/5
  let newO;
  let i;
  if (typeof o !== "object") {
    return o;
  }
  if (!o) {
    return o;
  }
  if (Object.prototype.toString.apply(o) === "[object Array]") {
    newO = [];
    for (i = 0; i < o.length; i += 1) {
      newO[i] = clone(o[i]);
    }
    return newO;
  }
  newO = {};
  for (i in o) {
    if (o.hasOwnProperty(i)) {
      // this is where a self-similar reference causes an infinite loop
      newO[i] = clone(o[i]);
    }
  }
  return newO;
};

export const recursive_freeze = function (input) {
  Object.freeze(input);
  if (input === undefined) {
    return input;
  }
  Object.getOwnPropertyNames(input).filter(prop => input[prop] !== null
    && (typeof input[prop] === "object" || typeof input[prop] === "function")
    && !Object.isFrozen(input[prop]))
    .forEach(prop => recursive_freeze(input[prop]));
  return input;
};
