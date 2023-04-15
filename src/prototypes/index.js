/**
 * Rabbit Ear (c) Kraft
 */
import graphProto from "./graph.js";
import cpProto from "./cp.js";
import origamiProto from "./origami.js";
import { file_spec, file_creator } from "../fold/rabbitear.js";
import * as bases from "../fold/bases.js";
import populate from "../graph/populate.js";

const graph = (...args) => populate(
	Object.assign(Object.create(graphProto), {
		...args.reduce((a, b) => ({ ...a, ...b }), ({})),
		file_spec,
		file_creator,
	}),
);

const cp = (...args) => populate(
	Object.assign(Object.create(cpProto), {
		...(args.length
			? args.reduce((a, b) => ({ ...a, ...b }), ({}))
			: bases.square()),
		file_spec,
		file_creator,
		frame_classes: ["creasePattern"],
	}),
);

const origami = (...args) => populate(
	Object.assign(Object.create(origamiProto), {
		...(args.length
			? args.reduce((a, b) => ({ ...a, ...b }), ({}))
			: bases.square()),
		file_spec,
		file_creator,
		frame_classes: ["foldedForm"],
	}),
);

graph.prototype = graphProto;
graph.prototype.constructor = graph;

cp.prototype = cpProto;
cp.prototype.constructor = cp;

origami.prototype = origamiProto;
origami.prototype.constructor = origami;

// static constructors for all the origami bases
Object.keys(bases).forEach(fnName => {
	graph[fnName] = (...args) => graph(bases[fnName](...args));
	cp[fnName] = (...args) => cp(bases[fnName](...args));
	origami[fnName] = (...args) => origami(bases[fnName](...args));
});

export {
	graph,
	cp,
	origami,
};
