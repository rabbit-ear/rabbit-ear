/**
 * Rabbit Ear (c) Kraft
 */
import table from "./table";

export const pairArrayToSortedPairString = pair => (pair[0] < pair[1]
	? `${pair[0]} ${pair[1]}`
	: `${pair[1]} ${pair[0]}`);
/**
 * @description Convert an array of faces which are involved in one
 * taco/tortilla/transitivity condition into an array of arrays where
 * each face is paired with the others in the precise combination that
 * the solver is expecting for this particular condition.
 * @param {number[]} an array of the faces involved in this particular condition.
 */
export const constraintToFacePairs = ({
	// taco_taco (A,C) (B,D) (B,C) (A,D) (A,B) (C,D)
	taco_taco: f => [
		[f[0], f[2]],
		[f[1], f[3]],
		[f[1], f[2]],
		[f[0], f[3]],
		[f[0], f[1]],
		[f[2], f[3]],
	],
	// taco_tortilla (A,C) (A,B) (B,C)
	taco_tortilla: f => [[f[0], f[2]], [f[0], f[1]], [f[1], f[2]]],
	// tortilla_tortilla (A,C) (B,D)
	tortilla_tortilla: f => [[f[0], f[2]], [f[1], f[3]]],
	// transitivity (A,B) (B,C) (C,A)
	transitivity: f => [[f[0], f[1]], [f[1], f[2]], [f[2], f[0]]],
});

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

export const duplicateUnsolvedConstraints = (constraints) => {
	const duplicate = {};
	taco_types.forEach(type => { duplicate[type] = []; });
	// todo, can remove this .indexOf by creating a counter of "remaining unsolved"
	// which decreases inside completeSuggestionsLoop anytime a 0 is flipped to 1 or 2
	taco_types.forEach(type => constraints[type]
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
