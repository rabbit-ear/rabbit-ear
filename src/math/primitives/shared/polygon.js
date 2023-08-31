/**
 * Math (c) Kraft
 */
import Constructors from "../constructors.js";
import { multiplyMatrix3Vector3 } from "../../algebra/matrix3.js";
import {
	signedArea,
	centroid,
	boundingBox,
} from "../../geometry/polygon.js";
import { splitConvexPolygon } from "../../intersect/split.js";
import straightSkeleton from "../../geometry/straightSkeleton.js";
import {
	getVector,
	getMatrix3x4,
	getLine,
} from "../../general/get.js";
import {
	resize,
} from "../../algebra/vector.js";
import {
	includeL,
} from "../../general/function.js";
import Intersect from "../../intersect/intersectMethod.js";
import Overlap from "../../intersect/overlapMethod.js";
import { clipLineConvexPolygon } from "../../intersect/clip.js";
import {
	nearestPointOnPolygon,
} from "../../geometry/nearest.js";

// a polygon is expecting to have these properties:
// this - an array of vectors in [] form
// this.points - same as above
// this.sides - array edge pairs of points
// this.vectors - non-normalized vectors relating to this.sides.
const PolygonMethods = {
	/**
	 * @description calculate the signed area of this polygon
	 * @returns {number} the signed area
	 */
	area: function () {
		return signedArea(this);
	},
	// midpoint: function () { return average(this); },
	centroid: function () {
		return Constructors.vector(centroid(this));
	},
	boundingBox: function () {
		return boundingBox(this);
	},
	// contains: function () {
	//   return overlap_convex_polygon_point(this, getVector(arguments));
	// },
	straightSkeleton: function () {
		return straightSkeleton(this);
	},
	// scale will return a rect for rectangles, otherwise polygon
	scale: function (magnitude, center = centroid(this)) {
		const newPoints = this
			.map(p => [0, 1].map((_, i) => p[i] - center[i]))
			.map(vec => vec.map((_, i) => center[i] + vec[i] * magnitude));
		return this.constructor.fromPoints(newPoints);
	},
	rotate: function (angle, centerPoint = centroid(this)) {
		const newPoints = this.map((p) => {
			const vec = [p[0] - centerPoint[0], p[1] - centerPoint[1]];
			const mag = Math.sqrt((vec[0] ** 2) + (vec[1] ** 2));
			const a = Math.atan2(vec[1], vec[0]);
			return [
				centerPoint[0] + Math.cos(a + angle) * mag,
				centerPoint[1] + Math.sin(a + angle) * mag,
			];
		});
		return Constructors.polygon(newPoints);
	},
	translate: function () {
		const vec = getVector(...arguments);
		const newPoints = this.map(p => p.map((n, i) => n + vec[i]));
		return this.constructor.fromPoints(newPoints);
	},
	transform: function () {
		const m = getMatrix3x4(...arguments);
		const newPoints = this
			.map(p => multiplyMatrix3Vector3(m, resize(3, p)));
		return Constructors.polygon(newPoints);
	},
	// sectors: function () {
	//   return this.map((p, i, arr) => {
	//     const prev = (i + arr.length - 1) % arr.length;
	//     const next = (i + 1) % arr.length;
	//     const center = p;
	//     const a = arr[prev].map((n, j) => n - center[j]);
	//     const b = arr[next].map((n, j) => n - center[j]);
	//     return Constructors.sector(b, a, center);
	//   });
	// },
	nearest: function () {
		const point = getVector(...arguments);
		const result = nearestPointOnPolygon(this, point);
		return result === undefined
			? undefined
			: Object.assign(result, { edge: this.sides[result.i] });
	},
	split: function () {
		const line = getLine(...arguments);
		// const split_func = this.isConvex ? splitConvexPolygon : split_polygon;
		const split_func = splitConvexPolygon;
		return split_func(this, line)
			.map(poly => Constructors.polygon(poly));
	},
	overlap: function () {
		return Overlap(this, ...arguments);
	},
	intersect: function () {
		return Intersect(this, ...arguments);
	},
	clip: function (line_type, epsilon) {
		const fn_line = line_type.domain ? line_type.domain : includeL;
		const segment = clipLineConvexPolygon(
			this,
			line_type,
			this.domain,
			fn_line,
			epsilon,
		);
		return segment ? Constructors.segment(segment) : undefined;
	},
	svgPath: function () {
		// make every point a Move or Line command, append with a "z" (close path)
		const pre = Array(this.length).fill("L");
		pre[0] = "M";
		return `${this.map((p, i) => `${pre[i]}${p[0]} ${p[1]}`).join("")}z`;
	},
};

export default PolygonMethods;
