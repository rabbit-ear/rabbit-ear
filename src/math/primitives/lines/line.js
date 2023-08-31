/**
 * Math (c) Kraft
 */
import Constructors from "../constructors.js";
import { getLine } from "../../general/get.js";
import {
	vecLineToUniqueLine,
	uniqueLineToVecLine,
} from "../../general/convert.js";
import {
	includeL,
	excludeL,
} from "../../general/function.js";
import {
	add,
	scale,
	resize,
} from "../../algebra/vector.js";
import Static from "./static.js";
import methods from "./methods.js";

export default {
	line: {
		P: Object.prototype,

		A: function () {
			const l = getLine(...arguments);
			this.vector = Constructors.vector(l.vector);
			this.origin = Constructors.vector(resize(this.vector.length, l.origin));
			const alt = vecLineToUniqueLine({ vector: this.vector, origin: this.origin });
			this.normal = alt.normal;
			this.distance = alt.distance;
			Object.defineProperty(this, "domain", { writable: true, value: includeL });
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
			inclusive: function () { this.domain = includeL; return this; },
			exclusive: function () { this.domain = excludeL; return this; },
			clip_function: dist => dist,
			svgPath: function (length = 20000) {
				const start = add(this.origin, scale(this.vector, -length / 2));
				const end = scale(this.vector, length);
				return `M${start[0]} ${start[1]}l${end[0]} ${end[1]}`;
			},
		}),

		S: Object.assign({
			fromNormalDistance: function () {
				return this.constructor(uniqueLineToVecLine(arguments[0]));
			},
		}, Static),

	},
};
