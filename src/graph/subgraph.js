/**
 * Rabbit Ear (c) Kraft
 */
// maybe we can do this without copying the entire graph first. use the component arrays to bring over only what is necessary

// todo: this is still an early sketch. needs to be completed

// import * as S from "../general/strings";
// import remove from "./remove";
// import count from "./count";
// import { uniqueSortedIntegers } from "../general/arrays";

// const subgraph = (graph, components) => {
// 	const remove_indices = {};
// 	const sorted_components = {};
// 	[S._faces, S._edges, S._vertices].forEach(key => {
// 		remove_indices[key] = Array.from(Array(count[key](graph))).map((_, i) => i);
// 		sorted_components[key] = uniqueSortedIntegers(components[key] || []).reverse();
// 	});
// 	Object.keys(sorted_components)
// 		.forEach(key => sorted_components[key]
// 			.forEach(i => remove_indices[key].splice(i, 1)));
// 	// const subgraph = clone(graph);
// 	Object.keys(remove_indices)
// 		.forEach(key => remove(graph, key, remove_indices[key]));
// 	return graph;
// };

// export default subgraph;
