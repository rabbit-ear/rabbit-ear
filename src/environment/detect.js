/**
 * Rabbit Ear (c) Robby Kraft
 */
import * as S from "../general/strings";

// compare to "undefined", the string
const isBrowser = typeof window !== S._undefined
  && typeof window.document !== S._undefined;

const isNode = typeof process !== S._undefined
  && process.versions != null
  && process.versions.node != null;

const isWebWorker = typeof self === S._object
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

