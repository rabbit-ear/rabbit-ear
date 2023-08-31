/**
 * Math (c) Kraft
 */
// this is used by Line and Ray
import {
	average,
	subtract,
	rotate90,
} from "../../algebra/vector.js";

import {
	getArrayOfVectors,
} from "../../general/get.js";

export default {
	fromPoints: function () {
		const points = getArrayOfVectors(arguments);
		return this.constructor({
			vector: subtract(points[1], points[0]),
			origin: points[0],
		});
	},
	fromAngle: function () {
		const angle = arguments[0] || 0;
		return this.constructor({
			vector: [Math.cos(angle), Math.sin(angle)],
			origin: [0, 0],
		});
	},
	perpendicularBisector: function () {
		const points = getArrayOfVectors(arguments);
		return this.constructor({
			vector: rotate90(subtract(points[1], points[0])),
			origin: average(points[0], points[1]),
		});
	},
};
