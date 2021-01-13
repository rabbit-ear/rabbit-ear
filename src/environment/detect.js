/**
 * Rabbit Ear (c) Robby Kraft
 */
const isBrowser = typeof window !== "undefined"
  && typeof window.document !== "undefined";

const isNode = typeof process !== "undefined"
  && process.versions != null
  && process.versions.node != null;

const isWebWorker = typeof self === "object"
  && self.constructor
  && self.constructor.name === "DedicatedWorkerGlobalScope";

export {
  isBrowser,
  isNode,
  isWebWorker
};

// // for debugging, uncomment to log system on boot
// const operating_systems = [
//   isBrowser ? "browser" : "",
//   isWebWorker ? "web-worker" : "",
//   isNode ? "node" : "",
// ].filter(a => a !== "").join(" ");
// console.log(`RabbitEar [${operating_systems}]`);

