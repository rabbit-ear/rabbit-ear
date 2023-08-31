/**
 * Math (c) Kraft
 */
import Constructors from "../constructors.js";
// import {
// 	alternatingSum,
// } from "../../geometry/radial.js";
import {
	counterClockwiseAngleRadians,
	counterClockwiseOrderRadians,
} from "../../geometry/radial.js";
import {
	getVector,
	getArrayOfVectors,
} from "../../general/get.js";

const invertOrderArray = (arr) => {
	const new_arr = [];
	arr.forEach((n, i) => { new_arr[n] = i; });
	return new_arr;
};

export default {
	junction: {
		A: function () {
			const vectors = getArrayOfVectors(arguments)
				.map(v => Constructors.vector(v));
			const radians = vectors.map(v => Math.atan2(v[1], v[0]));
			const order = counterClockwiseOrderRadians(radians);
			this.vectors = order.map(i => vectors[i]);
			this.radians = order.map(i => radians[i]);
			this.order = invertOrderArray(order);
		},
		G: {
			sectors: function () {
				return this.radians
					.map((n, i, arr) => [n, arr[(i + 1) % arr.length]])
					.map(pair => counterClockwiseAngleRadians(pair[0], pair[1]));
					// .map(pair => Sector.fromVectors(pair[0], pair[1]));
			},
		},
		M: {
			// alternatingAngleSum: function () {
			// 	return alternatingSum(this.sectors);
			// },
		},
		S: {
			fromRadians: function () {
				// todo, this duplicates work converting back to vector form
				const radians = getVector(arguments);
				return this.constructor(radians.map(r => [Math.cos(r), Math.sin(r)]));
			},
			// fromVectors: function () {
			//   return this.constructor(arguments);
			// },
			// fromPoints: function (center, edge_adjacent_points) {
			//   return this.constructor(edge_adjacent_points.map(p => subtract(p, center)));
			// },
			// // this probably won't exist. the first sector will be assumed to
			// // begin at vector [1, 0]. i think it assumes too much
			// fromSectorAngles: function (...angles) {
			// },
		},
	},
};
