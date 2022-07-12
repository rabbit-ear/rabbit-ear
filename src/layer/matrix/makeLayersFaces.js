/**
 * Rabbit Ear (c) Kraft
 */
import make_edges_tacos from "../tacos/make_edges_tacos";
import { invertMap } from "../../graph/maps";
import validateTacoTacoFacePairs from "../tacos/validateTacoTacoFacePairs";
// import common_relationships from "./common_relationships";
import matrixToLayers from "./matrixToLayers";

const taco_test = (layers_face, tacos_faces_pairs) => {
	for (let p = 0; p < tacos_faces_pairs.length; p += 1) {
		const tacos_face = tacos_faces_pairs[p];
		const layers_pair = layers_face.map(face => tacos_face[face])
			.filter(a => a !== undefined);
		if (!validateTacoTacoFacePairs(layers_pair)) { return false; }
	}
	return true;
};

const makeLayersFaces = (graph, matrix) => {
	const tacos = make_edges_tacos(graph, 0.001);
	const tacos_faces = tacos.map(stack => ({
		left: stack.left.map(edge => graph.edges_faces[edge]),
		right: stack.right.map(edge => graph.edges_faces[edge]),
		both: stack.both.map(edge => graph.edges_faces[edge]),
	}));
	// const tacos_faces_pairs = tacos_faces.map(stack => {
	//   const faces = [];
	//   stack.left.forEach((pairs, i) => pairs.forEach(f => { faces[f] = i; }));
	//   stack.right.forEach((pairs, i) => pairs.forEach(f => { faces[f] = i; }));
	//   stack.both.forEach((pairs, i) => pairs.forEach(f => { faces[f] = i; }));
	//   return faces;
	// });
	const tacos_faces_pairs = tacos_faces.map(stack => Object.assign(
		[],
		invertMap(stack.left),
		invertMap(stack.right),
		invertMap(stack.both),
	));

	const test_function = (layer) => taco_test(layer, tacos_faces_pairs);
	const faces = Object.keys(matrix).map(n => parseInt(n, 10));
	return matrixToLayers(matrix, faces, [], test_function);

	// const tacos_faces_flat = tacos_faces.map(stack => Object.assign([],
	//   stack.left.reduce((a, b) => a.concat(b), []),
	//   stack.right.reduce((a, b) => a.concat(b), []),
	//   stack.both.reduce((a, b) => a.concat(b), [])
	// ));

	// const solutions = tacos_faces_pairs.map((pairs, i) => {
	//   const test_function = (layer) => taco_test(layer, [pairs]);
	//   const res = matrixToLayers(matrix, tacos_faces_flat[i], [], test_function);
	//   return res;
	// });
	// const orders = solutions
	//   .map(layers_faces => layers_faces.map(invertMap))
	//   .map(faces_layers => common_relationships(faces_layers));
	// orders.forEach(relationships => relationships
	//   .forEach(rule => { matrix[rule[0]][rule[1]] = rule[2]; }));

	// console.log("tacos", tacos);
	// console.log("tacos_faces", tacos_faces);
	// console.log("tacos_faces_pairs", tacos_faces_pairs);
	// console.log("tacos_faces_flat", tacos_faces_flat);
	// console.log("solutions", solutions);
	// console.log("orders", orders);
};

export default makeLayersFaces;
