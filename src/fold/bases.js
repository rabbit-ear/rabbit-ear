/**
 * Rabbit Ear (c) Kraft
 */
import {
	populate,
} from "../graph/populate.js";

/**
 * @description Create a blintz base FOLD object in crease pattern form.
 * @returns {FOLD} a FOLD object
 */
export const blintz = () => populate({
	vertices_coords: [
		[0, 0], [0.5, 0], [1, 0], [1, 0.5], [1, 1], [0.5, 1], [0, 1], [0, 0.5],
	],
	vertices_vertices: [
		[1, 7], [2, 3, 7, 0], [3, 1], [4, 5, 1, 2], [5, 3], [6, 7, 3, 4], [7, 5], [0, 1, 5, 6],
	],
	edges_vertices: [
		[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6],
		[6, 7], [7, 0], [7, 1], [1, 3], [3, 5], [5, 7],
	],
	edges_assignment: Array.from("BBBBBBBBVVVV"),
	faces_vertices: [
		[7, 1, 3, 5], [1, 7, 0], [3, 1, 2], [5, 3, 4], [7, 5, 6],
	],
});

/**
 * @description Create a waterbomb base FOLD object in crease pattern form.
 * @returns {FOLD} a FOLD object
 */
export const waterbomb = () => populate({
	vertices_coords: [
		[0, 0], [0.5, 0], [1, 0], [1, 0.5], [1, 1], [0.5, 1], [0, 1], [0, 0.5],
		[0.5, 0.5],
	],
	vertices_vertices: [
		[1, 8, 7], [2, 8, 0], [3, 8, 1], [4, 8, 2], [5, 8, 3], [6, 8, 4], [7, 8, 5], [0, 8, 6],
		[0, 1, 2, 3, 4, 5, 6, 7]
	],
	edges_vertices: [
		[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0],
		[0, 8], [1, 8], [2, 8], [3, 8], [4, 8], [5, 8], [6, 8], [7, 8],
	],
	edges_assignment: Array.from("BBBBBBBBVFVMVFVM"),
	faces_vertices: [
		[0, 1, 8], [1, 2, 8], [2, 3, 8], [3, 4, 8],
		[4, 5, 8], [5, 6, 8], [6, 7, 8], [7, 0, 8],
	],
});

/**
 * @description Create a kite base FOLD object in crease pattern form.
 * @returns {FOLD} a FOLD object
 */
export const kite = () => populate({
	vertices_coords: [
		[0, 0], [1, 0], [1, Math.SQRT2 - 1], [1, 1], [Math.SQRT2 - 1, 1], [0, 1],
	],
	edges_vertices: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [0, 2], [0, 4], [0, 3]],
	edges_assignment: Array.from("BBBBBBVVF"),
}, { faces: true });

/**
 * @description Create a fish base FOLD object in crease pattern form.
 * @returns {FOLD} a FOLD object
 */
export const fish = () => populate({
	vertices_coords: [
		[0, 0],
		[Math.SQRT1_2, 0],
		[1, 0],
		[1, 1 - Math.SQRT1_2],
		[1, 1],
		[1 - Math.SQRT1_2, 1],
		[0, 1],
		[0, Math.SQRT1_2],
		[0.5, 0.5],
		[Math.SQRT1_2, 1 - Math.SQRT1_2],
		[1 - Math.SQRT1_2, Math.SQRT1_2],
	],
	edges_vertices: [
		[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0],
		[9, 0], [9, 2], [9, 4], [10, 0], [10, 6], [10, 4],
		[9, 1], [10, 7], [9, 3], [10, 5],
		[8, 0], [8, 9], [8, 4], [8, 10],
	],
	edges_assignment: Array.from("BBBBBBBBVVVVVVMMFFFFFF"),
}, { faces: true });

/**
 * @description Create a bird base FOLD object in crease pattern form.
 * @returns {FOLD} a FOLD object
 */
export const bird = () => populate({
	vertices_coords: [
		[0, 0], [0.5, 0], [1, 0], [1, 0.5], [1, 1], [0.5, 1], [0, 1], [0, 0.5],
		[0.5, 0.5],
		[0.5, (Math.SQRT2 - 1) / 2],
		[(3 - Math.SQRT2) / 2, 0.5],
		[0.5, (3 - Math.SQRT2) / 2],
		[(Math.SQRT2 - 1) / 2, 0.5],
		[Math.SQRT1_2 / 2, Math.SQRT1_2 / 2],
		[1 - (Math.SQRT1_2 / 2), 1 - (Math.SQRT1_2 / 2)],
	],
	edges_vertices: [
		[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0],
		[0, 9], [9, 2], [2, 10], [10, 4], [4, 11], [11, 6], [6, 12], [12, 0],
		[1, 9], [9, 8], [3, 10], [10, 8], [5, 11], [11, 8], [7, 12], [12, 8],
		[2, 8], [6, 8],
		[0, 13], [13, 8], [13, 9], [13, 12],
		[4, 14], [14, 8], [14, 10], [14, 11],
	],
	edges_assignment: Array
		.from("BBBBBBBBVVVVVVVVMVMVMVMVMMFFFFFFFF"),
}, { faces: true });

/**
 * @description Create a frog base FOLD object in crease pattern form.
 * @returns {FOLD} a FOLD object
 */
export const frog = () => populate({
	vertices_coords: [
		[0, 1], [0, Math.SQRT1_2], [0, 0.5], [0, 1 - Math.SQRT1_2], [0, 0],
		[0.5, 0.5], [1, 1], [(1 - Math.SQRT1_2) / 2, Math.SQRT1_2 / 2],
		[Math.SQRT1_2 / 2, (1 - Math.SQRT1_2) / 2], [1 - Math.SQRT1_2, 0],
		[0.5, 0], [Math.SQRT1_2, 0], [1, 0], [0.5, (1 - Math.SQRT1_2) / 2],
		[1 - (Math.SQRT1_2 / 2), (1 - Math.SQRT1_2) / 2],
		[(1 - Math.SQRT1_2) / 2, 1 - (Math.SQRT1_2 / 2)],
		[(1 - Math.SQRT1_2) / 2, 0.5],
		[(1 + Math.SQRT1_2) / 2, 1 - (Math.SQRT1_2 / 2)], [1, Math.SQRT1_2],
		[Math.SQRT1_2, 1], [1 - (Math.SQRT1_2 / 2), (1 + Math.SQRT1_2) / 2],
		[Math.SQRT1_2 / 2, (1 + Math.SQRT1_2) / 2], [0.5, 1], [1, 0.5],
		[(1 + Math.SQRT1_2) / 2, Math.SQRT1_2 / 2],
		[0.5, (1 + Math.SQRT1_2) / 2],
		[(1 + Math.SQRT1_2) / 2, 0.5],
		[1 - Math.SQRT1_2, 1], [1, 1 - Math.SQRT1_2],
	],
	edges_vertices: [
		[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [4, 7], [4, 8], [4, 9],
		[9, 10], [10, 11], [11, 12], [8, 13], [13, 14], [15, 16], [16, 7], [3, 7],
		[7, 5], [5, 17], [17, 18], [19, 20], [20, 5], [5, 8], [8, 9], [2, 15],
		[14, 10], [21, 22], [23, 24], [10, 8], [7, 2], [12, 14], [0, 15], [22, 25],
		[25, 5], [5, 13], [13, 10], [2, 16], [16, 5], [5, 26], [26, 23], [6, 17],
		[6, 20], [11, 14], [14, 5], [5, 21], [21, 27], [28, 24], [24, 5], [5, 15],
		[15, 1], [12, 5], [5, 0], [20, 25], [25, 21], [24, 26], [26, 17], [12, 24],
		[0, 21], [12, 28], [28, 23], [23, 18], [18, 6], [6, 19], [19, 22],
		[22, 27], [27, 0], [22, 20], [17, 23],
	],
	edges_assignment: Array
		.from("BBBBFFVVBBBBMMMMFVVFFVVFVVVVVVVVVMMVVMMVVVFVVFFVVFMMMMMMVVBBBBBBBBVV"),
}, { faces: true });

/**
 * @description Create a windmill base FOLD object in crease pattern form.
 * @returns {FOLD} a FOLD object
 */
export const windmill = () => populate({
	vertices_coords: [
		[0, 0], [0.25, 0], [0.5, 0], [0.75, 0], [1, 0], [0, 1], [0, 0.75],
		[0, 0.5], [0, 0.25], [0.25, 0.25], [0.5, 0.5], [0.75, 0.75], [1, 1],
		[0.25, 1], [0.25, 0.75], [0.25, 0.5], [1, 0.25], [0.75, 0.25], [0.5, 0.25],
		[0.5, 1], [1, 0.5], [0.5, 0.75], [0.75, 0.5], [0.75, 1], [1, 0.75],
	],
	edges_vertices: [
		[0, 1], [1, 2], [2, 3], [3, 4], [5, 6], [6, 7], [7, 8], [8, 0],
		[0, 9], [9, 10], [10, 11], [11, 12], [13, 14], [14, 15], [15, 9],
		[9, 1], [16, 17], [17, 18], [18, 9], [9, 8], [7, 14], [14, 19],
		[20, 17], [17, 2], [2, 9], [9, 7], [19, 21], [21, 10], [10, 18],
		[18, 2], [20, 22], [22, 10], [10, 15], [15, 7], [4, 17], [17, 10],
		[10, 14], [14, 5], [23, 11], [11, 22], [22, 17], [17, 3], [6, 14],
		[14, 21], [21, 11], [11, 24], [12, 23], [23, 19], [19, 13], [13, 5],
		[4, 16], [16, 20], [20, 24], [24, 12], [19, 11], [11, 20],
	],
	edges_assignment: Array
		.from("BBBBBBBBVFFVFVVFFVVFMFMFMFFFFFFFFFVFFVFVVFFVVFBBBBBBBBMF"),
}, { faces: true });

/**
 * @description todo: I don't know what the name of this base is.
 * @returns {FOLD} a FOLD object
 */
export const squareFish = () => populate({
	vertices_coords: [
		[0, 0], [2 - Math.SQRT2, 0], [1, 0], [0, 1], [0, 2 - Math.SQRT2],
		[0.5, 0.5], [Math.SQRT1_2, Math.SQRT1_2], [1, 1],
		[Math.SQRT1_2, 1 - Math.SQRT1_2], [1, Math.SQRT2 - 1],
		[1 - Math.SQRT1_2, Math.SQRT1_2], [Math.SQRT2 - 1, 1],
		[Math.SQRT1_2, 1], [1, Math.SQRT1_2],
	],
	edges_vertices: [
		[0, 1], [1, 2], [3, 4], [4, 0], [0, 5], [5, 6], [6, 7], [0, 8], [8, 9],
		[0, 10], [10, 11], [8, 1], [10, 4], [8, 6], [6, 12], [3, 10], [10, 5],
		[5, 8], [8, 2], [10, 6], [6, 13], [7, 12], [12, 11], [11, 3], [11, 6],
		[6, 9], [2, 9], [9, 13], [13, 7],
	],
	edges_assignment: Array.from("BBBBFFFVFVFMMVVVFFVVVBBBMMBBB"),
}, { faces: true });
