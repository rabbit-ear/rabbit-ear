/**
 * Rabbit Ear (c) Kraft
 */
const isBrowser = typeof window === "object" && typeof window.document === "object";

const isNodeOrBun =
	typeof process === "object" &&
	typeof process.versions === "object" &&
	(process.versions.node != null || process.versions.bun != null);

// Deno 2 removed the global "window" and is now found on globalThis
const isDeno =
	typeof globalThis === "object" &&
	"Deno" in globalThis &&
	typeof globalThis["Deno"] === "object";

const isBackend = isNodeOrBun || isDeno;

const isWebWorker =
	typeof self === "object" &&
	self.constructor &&
	self.constructor.name === "DedicatedWorkerGlobalScope";

export { isBrowser, isBackend, isWebWorker };
