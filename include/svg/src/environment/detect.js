
// const isBrowser = function () {
//   return typeof window !== "undefined";
// };

// const isNode = function () {
//   return typeof window === "undefined" && typeof process !== "undefined";
// };

// const isWebWorker = function () {
//   return typeof self !== "undefined" && typeof postMessage === "function";
// };

// export {
//   isBrowser,
//   isNode,
//   isWebWorker,
// };

const isBrowser = typeof window !== "undefined"
  && typeof window.document !== "undefined";

const isWebWorker = typeof self === "object"
  && self.constructor
  && self.constructor.name === "DedicatedWorkerGlobalScope";

const isNode = typeof process !== "undefined"
  && process.versions != null
  && process.versions.node != null;

export {
  isBrowser,
  isWebWorker,
  isNode
};
