/**
 * Rabbit Ear (c) Kraft
 */
import graphPrototype from "./graph.js";
// import cpPrototype from "./cp.js";
// import origamiPrototype from "./origami.js";
import { file_spec, file_creator } from "../fold/rabbitear.js";
import * as bases from "../fold/bases.js";
import populate from "../graph/populate.js";

/**
 * @description Create a FOLD object that inherits from the Graph prototype
 * with basic FOLD metadata, file spec and creator.
 * @returns {FOLD} a FOLD object
 */
const makeGraphInstance = (...args) => Object
	.assign(Object.create(graphPrototype), {
		...args.reduce((a, b) => ({ ...a, ...b }), ({})),
		file_spec,
		file_creator,
	});

/**
 * @description Create a FOLD object that inherits from the CP prototype.
 * By default, the crease pattern will initialize to a flat square graph with
 * FOLD metadata including the file spec, creator, and "creasePattern" class.
 * @returns {FOLD} a FOLD object
 */
// const makeCPInstance = (...args) => Object
// 	.assign(Object.create(cpPrototype), {
// 		...(args.length
// 			? args.reduce((a, b) => ({ ...a, ...b }), ({}))
// 			: bases.square()),
// 		file_spec,
// 		file_creator,
// 		frame_classes: ["creasePattern"],
// 	});

/**
 * @description Create a FOLD object that inherits from the Origami prototype.
 * By default, the FOLD object will initialize to a flat square graph with
 * FOLD metadata including the file spec, creator, and "foldedForm" class.
 * @returns {FOLD} a FOLD object
 */
// const makeOrigamiInstance = (...args) => Object
// 	.assign(Object.create(origamiPrototype), {
// 		...(args.length
// 			? args.reduce((a, b) => ({ ...a, ...b }), ({}))
// 			: bases.square()),
// 		file_spec,
// 		file_creator,
// 		frame_classes: ["foldedForm"],
// 	});

/**
 * @description Create a FOLD object that inherits from the Graph
 * prototype which includes a bunch of helper methods bound to it.
 * By default the graph will be empty, an optional FOLD object can be
 * passed in and the graph will populate it and initilize itself to it.
 * @returns {FOLD} a FOLD object
 */
const graph = (...args) => populate(makeGraphInstance(...args));
graph.prototype = graphPrototype;
graph.prototype.constructor = graph;

/**
 * @description Create a populated FOLD object that inherits from the
 * CreasePattern object prototype. By default, the crease pattern
 * object will initialize to a flat square graph. Any user arguments
 * will be passed into the CreasePattern prototype constructor.
 * The most basic FOLD metadata will be added, including the
 * file spec and creator, and a frame class of "creasePattern".
 * @returns {FOLD} a FOLD object
 */
// const cp = (...args) => populate(makeCPInstance(...args));
// cp.prototype = cpPrototype;
// cp.prototype.constructor = cp;

// const origami = (...args) => populate(makeOrigamiInstance(...args));
// origami.prototype = origamiPrototype;
// origami.prototype.constructor = origami;

// static constructors for all the origami bases
Object.keys(bases).forEach(baseName => {
	graph[baseName] = (...args) => makeGraphInstance(bases[baseName](...args));
	// cp[baseName] = (...args) => makeCPInstance(bases[baseName](...args));
	// origami[baseName] = (...args) => origami(bases[baseName](...args));
});

export {
	graph,
	// cp,
	// origami,
};
