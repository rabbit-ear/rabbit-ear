/**
 * Math (c) Kraft
 */
import Constructors from "../constructors.js";
import { getLine } from "../../general/get.js";
import {
	includeR,
	excludeR,
	clampRay,
} from "../../general/function.js";
import {
	flip,
	resize,
} from "../../algebra/vector.js";
import Static from "./static.js";
import methods from "./methods.js";

// LineProto.prototype.constructor = LineProto;

export default {
	ray: {
		P: Object.prototype,

		A: function () {
			const ray = getLine(...arguments);
			this.vector = Constructors.vector(ray.vector);
			this.origin = Constructors.vector(resize(this.vector.length, ray.origin));
			Object.defineProperty(this, "domain", { writable: true, value: includeR });
		},

		G: {
			// length: () => Infinity,
			dimension: function () {
				return [this.vector, this.origin]
					.map(p => p.length)
					.reduce((a, b) => Math.max(a, b), 0);
			},
		},

		M: Object.assign({}, methods, {
			inclusive: function () { this.domain = includeR; return this; },
			exclusive: function () { this.domain = excludeR; return this; },
			flip: function () {
				return Constructors.ray(flip(this.vector), this.origin);
			},
			scale: function (scale) {
				return Constructors.ray(this.vector.scale(scale), this.origin);
			},
			normalize: function () {
				return Constructors.ray(this.vector.normalize(), this.origin);
			},
			// distance is between 0 and 1, representing the vector between start and end. cap accordingly
			clip_function: clampRay,
			svgPath: function (length = 10000) {
				const end = this.vector.scale(length);
				return `M${this.origin[0]} ${this.origin[1]}l${end[0]} ${end[1]}`;
			},

		}),

		S: Static,

	},
};
