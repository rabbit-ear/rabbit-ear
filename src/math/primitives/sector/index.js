// /**
//  * Math (c) Kraft
//  */
// import Constructors from "../constructors.js";
// import {
// 	get_vector_of_vectors,
// } from "../../types/get.js";
// import {
// 	counter_clockwise_angle2,
// 	counter_clockwise_bisect2,
// 	subsect,
// } from "../../geometry/radial.js";

// export default {
// 	sector: {
// 		A: function () {
// 			const args = get_vector_of_vectors(...arguments);
// 			this.origin = (args.length >= 3)
// 				? args[2]
// 				: Constructors.vector(0, 0, 0);
// 			this.vectors = [0, 1].map(i => args[i]).map(arg => Constructors.vector(arg));
// 		},

// 		G: {
// 			angle: function () { return counter_clockwise_angle2(...this.vectors); },
// 			point: function () { return this.origin; },
// 		},

// 		M: {
// 			bisect: function () {
// 				return counter_clockwise_bisect2(...this.vectors);
// 			},
// 			subsect: function (divisions) {
// 				return subsect(divisions, ...this.vectors);
// 			},
// 			contains: function (...args) {
// 				// move the point into the sector's space
// 				const point = get_vector(args).map((n, i) => n + center[i]);
// 				const cross0 = (point[1] - vectors[0][1]) * -vectors[0][0]
// 										 - (point[0] - vectors[0][0]) * -vectors[0][1];
// 				const cross1 = point[1] * vectors[1][0] - point[0] * vectors[1][1];
// 				return cross0 < 0 && cross1 < 0;
// 			},
// 		},

// 		S: {
// 			// three points in 3D space
// 			interior: function () {
// 				const args = get_vector_of_vectors(...arguments);
// 				this.vectors = [0, 1].map(i => args[i]).map(arg => Constructors.vector(arg));

// 				// const points = get_vector_of_vectors(arguments);
// 				// return this.constructor({
// 				//   normal: points[0],
// 				//   origin: points[1],
// 				// });
// 			},
// 			fromPoints: function (pointA, pointB, center = [0, 0]) {
// 				const vectors = [pointA, pointB].map(p => p.map((_, i) => p[i] - center[i]));
// 				return Sector(vectors[0], vectors[1], center);
// 			},
// 		}
// 	}
// };
