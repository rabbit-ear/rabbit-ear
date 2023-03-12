/**
 * Rabbit Ear (c) Kraft
 */
import GraphProto from "./graph.js";
import CPProto from "./cp.js";
import OrigamiProto from "./origami.js";

import graph_methods from "../graph/index.js";
import { file_spec, file_creator } from "../fold/rabbitear.js";
import { isFoldObject } from "../fold/spec.js";
import create from "../graph/create.js";
import populate from "../graph/populate.js";

// if we ever need to call any of these constructors from somewhere
// else inside the library (creating a circular dependency)
// move this line into a file "Constructors.js", and remove the
// export at the bottom. have all files point to "Constructors.js"
// instead, and all circular dependencies will be avoided.
const ObjectConstructors = Object.create(null);

const ConstructorPrototypes = {
	graph: GraphProto,
	cp: CPProto,
	origami: OrigamiProto,
};

const default_graph = {
	graph: () => {},
	cp: create.square,
	origami: create.square,
};

const CustomProperties = {
	graph: () => ({ file_spec, file_creator }),
	cp: () => ({ file_spec, file_creator, frame_classes: ["creasePattern"] }),
	origami: () => ({ file_spec, file_creator, frame_classes: ["foldedForm"] }),
};
/**
 * Calling the initializer also runs populate(), which does
 * take some computation time but it's very quick.
 */
Object.keys(ConstructorPrototypes).forEach(name => {
	ObjectConstructors[name] = function () {
		const argFolds = Array.from(arguments)
			.filter(a => isFoldObject(a))
			// deep copy input graph
			.map(obj => JSON.parse(JSON.stringify(obj)));
		return populate(Object.assign(
			Object.create(ConstructorPrototypes[name]),
			(argFolds.length ? {} : default_graph[name]()),
			...argFolds,
			CustomProperties[name](),
		));
	};

	// const graph = function () { return create("graph", arguments); };
	// const cp = function () { return create("cp", arguments); };
	// const origami = function () { return create("origami", arguments); };

	// tried to improve it. broke it.
	// ObjectConstructors[name] = function () {
	//   const certain = Array.from(arguments)
	//     .map(arg => ({ arg, certainty: isFoldObject(arg) }))
	//     .sort((a, b) => a.certainty - b.certainty);
	//   const fold = certain.length && certain[0].certainty > 0.1
	//     ? JSON.parse(JSON.stringify(certain.shift().arg))
	//     : default_graph[name]();
	//   console.log("FOLD", fold);
	//   // const otherArguments = certain
	//   //   .map(el => el.arg);
	//   // const argFold = Array.from(arguments)
	//   //   .map(arg => ({ arg, certainty: isFoldObject(arg) }))
	//   //   .sort((a, b) => a.certainty - b.certainty)
	//   //   .shift();
	//   // const start = argFold
	//   //   ? clone(argFold)
	//   //   : default_graph[name]()
	//   //   .map(obj => JSON.parse(JSON.stringify(obj)));
	//   return Object.assign(
	//     Object.create(ConstructorPrototypes[name]),
	//     // (argFolds.length ? {} : default_graph[name]()),
	//     fold,
	//     // ...otherArguments,
	//     { file_spec, file_creator }
	//   );
	// };
	ObjectConstructors[name].prototype = ConstructorPrototypes[name];
	ObjectConstructors[name].prototype.constructor = ObjectConstructors[name];
	// wrap static constructors with "this" initializer
	// all the polygon names
	Object.keys(create).forEach(funcName => {
		ObjectConstructors[name][funcName] = function () {
			return ObjectConstructors[name](create[funcName](...arguments));
		};
	});
});

Object.assign(ObjectConstructors.graph, graph_methods);

export default ObjectConstructors;
