/**
 * Math (c) Kraft
 */
import Constructors from "../constructors.js";
import {
	add,
	subtract,
	average,
	magnitude,
	resize,
	resizeUp,
} from "../../algebra/vector.js";
import { multiplyMatrix3Vector3 } from "../../algebra/matrix3.js";
import {
	includeS,
	excludeS,
	clampSegment,
} from "../../general/function.js";
import {
	getMatrix3x4,
	getSegment,
	getVector,
} from "../../general/get.js";
import methods from "./methods.js";

export default {
	segment: {
		P: Array.prototype,

		A: function () {
			const a = getSegment(...arguments);
			this.push(...[a[0], a[1]].map(v => Constructors.vector(v)));
			this.vector = Constructors.vector(subtract(this[1], this[0]));
			// the fast way, but i think we need the ability to call seg[0].x
			// this.push(a[0], a[1]);
			// this.vector = subtract(this[1], this[0]);
			this.origin = this[0];
			Object.defineProperty(this, "domain", { writable: true, value: includeS });
		},

		G: {
			points: function () { return this; },
			magnitude: function () { return magnitude(this.vector); },
			dimension: function () {
				return [this.vector, this.origin]
					.map(p => p.length)
					.reduce((a, b) => Math.max(a, b), 0);
			},
		},

		M: Object.assign({}, methods, {
			inclusive: function () { this.domain = includeS; return this; },
			exclusive: function () { this.domain = excludeS; return this; },
			clip_function: clampSegment,
			transform: function (...innerArgs) {
				const dim = this.points[0].length;
				const mat = getMatrix3x4(innerArgs);
				const transformed_points = this.points
					.map(point => resize(3, point))
					.map(point => multiplyMatrix3Vector3(mat, point))
					.map(point => resize(dim, point));
				return Constructors.segment(transformed_points);
			},
			translate: function () {
				const translate = getVector(arguments);
				const transformed_points = this.points
					.map(point => add(...resizeUp(point, translate)));
				return Constructors.segment(transformed_points);
			},
			midpoint: function () {
				return Constructors.vector(average(this.points[0], this.points[1]));
			},
			svgPath: function () {
				const pointStrings = this.points.map(p => `${p[0]} ${p[1]}`);
				return ["M", "L"].map((cmd, i) => `${cmd}${pointStrings[i]}`)
					.join("");
			},
		}),

		S: {
			fromPoints: function () {
				return this.constructor(...arguments);
			},
		},

	},
};
