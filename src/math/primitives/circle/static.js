/**
 * Math (c) Kraft
 */
import { circumcircle } from "../../geometry/polygon.js";

const CircleStatic = {
	fromPoints: function () {
		if (arguments.length === 3) {
			const result = circumcircle(...arguments);
			return this.constructor(result.radius, result.origin);
		}
		return this.constructor(...arguments);
	},
	fromThreePoints: function () {
		const result = circumcircle(...arguments);
		return this.constructor(result.radius, result.origin);
	},
};

export default CircleStatic;
