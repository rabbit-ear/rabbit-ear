/**
 * Rabbit Ear (c) Kraft
 */
import graph from "./graph.js";
import cp from "./cp.js";
import origami from "./origami.js";
import allGraphMethods from "../graph/index.js";
import { file_spec, file_creator } from "../fold/rabbitear.js";
import * as bases from "../fold/bases.js";
import populate from "../graph/populate.js";

const defaultBase = {
	graph: () => {},
	cp: bases.square,
	origami: bases.square,
};

const defaultMetadata = {
	graph: () => ({ file_spec, file_creator }),
	cp: () => ({ file_spec, file_creator, frame_classes: ["creasePattern"] }),
	origami: () => ({ file_spec, file_creator, frame_classes: ["foldedForm"] }),
};

const constructors = Object.create(null);
const prototypes = { graph, cp, origami };
/**
 * Calling the initializer also runs populate(), which does
 * take some computation time but it's very quick.
 */
Object.keys(prototypes).forEach(name => {
	constructors[name] = (...args) => populate(Object.assign(
		Object.create(prototypes[name]),
		{
			...(args.length
				? args.reduce((a, b) => ({ ...a, ...b }), ({}))
				: defaultBase[name]()),
			...defaultMetadata[name](),
		},
	));
	constructors[name].prototype = prototypes[name];
	constructors[name].prototype.constructor = constructors[name];
	// static constructors for all the origami bases
	Object.keys(bases).forEach(fnName => {
		constructors[name][fnName] = (...args) => constructors[name](bases[fnName](...args));
	});
});

Object.assign(constructors.graph, allGraphMethods);

export default constructors;
