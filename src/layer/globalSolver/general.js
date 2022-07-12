/**
 * Rabbit Ear (c) Kraft
 */
import table from "./table";

const to_signed_layer_convert = { 0: 0, 1: 1, 2: -1 };
const to_unsigned_layer_convert = { 0: 0, 1: 1, "-1": 2 };
/**
 * @description convert a layer-encoding 1,2 into 1,-1. modified in place!
 * @param {object} conditions object with values are either 0, 1, 2.
 * @returns {object} values are either 0, 1, -1.
 */
export const unsignedToSignedConditions = (conditions) => {
	Object.keys(conditions).forEach(key => {
		conditions[key] = to_signed_layer_convert[conditions[key]];
	});
	return conditions;
};
/**
 * @description convert a layer-encoding 1,-1 into 1,2. modified in place!
 * @param {object} conditions object with values are either 0, 1, -1.
 * @returns {object} values are either 0, 1, 2.
 */
export const signedToUnsignedConditions = (conditions) => {
	Object.keys(conditions).forEach(key => {
		conditions[key] = to_unsigned_layer_convert[conditions[key]];
	});
	return conditions;
};

export const joinConditions = (...args) => Object
	.assign(JSON.parse(JSON.stringify(args[0])), ...args.slice(1));

const taco_types = Object.freeze(Object.keys(table));

export const duplicateUnsolvedLayers = (layers) => {
	const duplicate = {};
	taco_types.forEach(type => { duplicate[type] = []; });
	taco_types.forEach(type => layers[type]
		.forEach((layer, i) => {
			if (layer.indexOf(0) !== -1) {
				duplicate[type][i] = [...layer];
			}
		}));
	return duplicate;
};
/**
 * @description Convert a set of face-pair layer conditions (+1,-1,0)
 * into a face-face relationship matrix.
 * @param {object} conditions one set of face-pair layer conditions (+1,-1,0)
 * @returns {number[][]} NxN matrix, number of faces, containing +1,-1,0
 * as values showing the relationship between i to j in face[i][j].
 */
export const conditionsToMatrix = (conditions) => {
	const condition_keys = Object.keys(conditions);
	const face_pairs = condition_keys
		.map(key => key.split(" ").map(n => parseInt(n, 10)));
	const faces = [];
	face_pairs
		.reduce((a, b) => a.concat(b), [])
		.forEach(f => { faces[f] = undefined; });
	const matrix = faces.map(() => []);
	face_pairs
		// .filter((_, i) => conditions[condition_keys[i]] !== 0)
		.forEach(([a, b]) => {
			matrix[a][b] = conditions[`${a} ${b}`];
			matrix[b][a] = -conditions[`${a} ${b}`];
		});
	return matrix;
};
