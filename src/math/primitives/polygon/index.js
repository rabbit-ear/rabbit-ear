/**
 * Math (c) Kraft
 */
import methods from "../shared/polygon.js";
import { semiFlattenArrays } from "../../general/array.js";
import { include, exclude } from "../../general/function.js";
import { subtract } from "../../algebra/vector.js";
import { convexHull } from "../../geometry/convexHull.js";
import { makePolygonCircumradius } from "../../geometry/polygon.js";

export default {
	polygon: {
		P: Array.prototype,
		A: function () {
			this.push(...semiFlattenArrays(arguments));
			// this.points = semiFlattenArrays(arguments);
			// .map(v => Constructors.vector(v));
			this.sides = this
				.map((p, i, arr) => [p, arr[(i + 1) % arr.length]]);
			// .map(ps => Constructors.segment(ps[0][0], ps[0][1], ps[1][0], ps[1][1]));
			this.vectors = this.sides.map(side => subtract(side[1], side[0]));
			// this.sectors
			Object.defineProperty(this, "domain", { writable: true, value: include });
		},
		G: {
			// todo: convex test
			isConvex: function () {
				return undefined;
			},
			points: function () {
				return this;
			},
			// edges: function () {
			//   return this.sides;
			// },
		},
		M: Object.assign({}, methods, {
			inclusive: function () { this.domain = include; return this; },
			exclusive: function () { this.domain = exclude; return this; },
			segments: function () {
				return this.sides;
			},
		}),
		S: {
			fromPoints: function () {
				return this.constructor(...arguments);
			},
			regularPolygon: function () {
				return this.constructor(makePolygonCircumradius(...arguments));
			},
			convexHull: function () {
				return this.constructor(convexHull(...arguments));
			},
		},
	},
};
