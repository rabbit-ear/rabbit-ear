/**
 * Math (c) Kraft
 */
import typeOf from "../general/typeOf.js";
import {
	overlapConvexPolygons,
	overlapConvexPolygonPoint,
	overlapCirclePoint,
	overlapLineLine,
	overlapLinePoint,
} from "./overlap.js";
import {
	exclude,
	excludeL,
	excludeR,
	excludeS,
	epsilonEqualVectors,
} from "../general/function.js";

const overlap_func = {
	polygon: {
		polygon: (a, b, fnA, fnB, ep) => overlapConvexPolygons(a, b, ep),
		// circle: (a, b) =>
		// line: (a, b) =>
		// ray: (a, b) =>
		// segment: (a, b) =>
		vector: (a, b, fnA, fnB, ep) => overlapConvexPolygonPoint(a, b, fnA, ep),
	},
	circle: {
		// polygon: (a, b) =>
		// circle: (a, b) =>
		// line: (a, b) =>
		// ray: (a, b) =>
		// segment: (a, b) =>
		vector: (a, b, fnA, fnB, ep) => overlapCirclePoint(a, b, exclude, ep),
	},
	line: {
		// polygon: (a, b) =>
		// circle: (a, b) =>
		line: (a, b, fnA, fnB, ep) => overlapLineLine(a, b, fnA, fnB, ep),
		ray: (a, b, fnA, fnB, ep) => overlapLineLine(a, b, fnA, fnB, ep),
		segment: (a, b, fnA, fnB, ep) => overlapLineLine(a, b, fnA, fnB, ep),
		vector: (a, b, fnA, fnB, ep) => overlapLinePoint(a, b, fnA, ep),
	},
	ray: {
		// polygon: (a, b) =>
		// circle: (a, b) =>
		line: (a, b, fnA, fnB, ep) => overlapLineLine(b, a, fnB, fnA, ep),
		ray: (a, b, fnA, fnB, ep) => overlapLineLine(a, b, fnA, fnB, ep),
		segment: (a, b, fnA, fnB, ep) => overlapLineLine(a, b, fnA, fnB, ep),
		vector: (a, b, fnA, fnB, ep) => overlapLinePoint(a, b, fnA, ep),
	},
	segment: {
		// polygon: (a, b) =>
		// circle: (a, b) =>
		line: (a, b, fnA, fnB, ep) => overlapLineLine(b, a, fnB, fnA, ep),
		ray: (a, b, fnA, fnB, ep) => overlapLineLine(b, a, fnB, fnA, ep),
		segment: (a, b, fnA, fnB, ep) => overlapLineLine(a, b, fnA, fnB, ep),
		vector: (a, b, fnA, fnB, ep) => overlapLinePoint(a, b, fnA, ep),
	},
	vector: {
		polygon: (a, b, fnA, fnB, ep) => overlapConvexPolygonPoint(b, a, fnB, ep),
		circle: (a, b, fnA, fnB, ep) => overlapCirclePoint(b, a, exclude, ep),
		line: (a, b, fnA, fnB, ep) => overlapLinePoint(b, a, fnB, ep),
		ray: (a, b, fnA, fnB, ep) => overlapLinePoint(b, a, fnB, ep),
		segment: (a, b, fnA, fnB, ep) => overlapLinePoint(b, a, fnB, ep),
		vector: (a, b, fnA, fnB, ep) => epsilonEqualVectors(a, b, ep),
	},
};

// convert "rect" to "polygon"
const similar_overlap_types = {
	polygon: "polygon",
	rect: "polygon",
	circle: "circle",
	line: "line",
	ray: "ray",
	segment: "segment",
	vector: "vector",
};

const default_overlap_domain = {
	polygon: exclude,
	rect: exclude,
	circle: exclude, // not used
	line: excludeL,
	ray: excludeR,
	segment: excludeS,
	vector: excludeL, // not used
};
/**
 * @name overlap
 * @description test whether or not two geometry objects overlap each other.
 * @param {any} a any geometry object
 * @param {any} b any geometry object
 * @param {number} [epsilon=1e-6] optional epsilon
 * @returns {boolean} true if the two objects overlap.
 * @linkcode Math ./src/intersect/overlapTypes.js 98
 */
const overlap = function (a, b, epsilon) {
	const type_a = typeOf(a);
	const type_b = typeOf(b);
	const aT = similar_overlap_types[type_a];
	const bT = similar_overlap_types[type_b];
	const domain_a = a.domain || default_overlap_domain[type_a];
	const domain_b = b.domain || default_overlap_domain[type_b];
	return overlap_func[aT][bT](a, b, domain_a, domain_b, epsilon);
};

export default overlap;
