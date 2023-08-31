/**
 * Math (c) Kraft
 */
import { semiFlattenArrays } from "../../general/array.js";

export default {
	polyline: {
		P: Array.prototype,
		A: function () {
			this.push(...semiFlattenArrays(arguments));
			// .map(v => Constructors.vector(v));
			// this.sides = this
			//   .map((p, i, arr) => [p, arr[(i + 1) % arr.length]]);
			// this.sides.pop(); // polylines are not closed. remove the last segment
			// .map(ps => Constructors.segment(ps[0][0], ps[0][1], ps[1][0], ps[1][1]));
			// this.vectors = this.sides.map(side => subtract(side[1], side[0]));
			// this.sectors
		},
		G: {
			points: function () {
				return this;
			},
			// edges: function () {
			//   return this.sides;
			// },
		},
		M: {
			// segments: function () {
			//   return this.sides;
			// },
			svgPath: function () {
				// make every point a Move or Line command, no closed path at the end
				const pre = Array(this.length).fill("L");
				pre[0] = "M";
				return `${this.map((p, i) => `${pre[i]}${p[0]} ${p[1]}`).join("")}`;
			},

		},
		S: {
			fromPoints: function () {
				return this.constructor(...arguments);
			},
		},
	},
};
