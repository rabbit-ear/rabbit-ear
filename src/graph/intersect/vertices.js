import { EPSILON } from "../../math/general/constant.js";
import {
	magnitude,
	normalize,
	subtract,
	dot,
} from "../../math/algebra/vector.js";
/**
 *
 */
export const getVerticesCollinearToLine = (
	{ vertices_coords },
	{ vector, origin },
	epsilon = EPSILON,
) => {
	const normalizedLineVec = normalize(vector);
	const pointIsCollinear = (point) => {
		const originToPoint = subtract(point, origin);
		const mag = magnitude(originToPoint);
		// point and origin are the same
		if (Math.abs(mag) < epsilon) { return true; }
		// normalize both vectors, compare dot product
		const originToPointUnit = originToPoint.map(n => n / mag);
		const dotprod = Math.abs(dot(originToPointUnit, normalizedLineVec));
		return Math.abs(1.0 - dotprod) < epsilon;
	};
	return vertices_coords
		.map(pointIsCollinear)
		.map((a, i) => ({ a, i }))
		.filter(el => el.a)
		.map(el => el.i);
};
