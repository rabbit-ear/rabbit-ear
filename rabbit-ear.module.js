/* Rabbit Ear 0.9.33 alpha 2023-02-21 (c) Kraft, MIT License */

const _undefined = "undefined";
const _number = "number";
const _object = "object";
const _index = "index";
const _vertices = "vertices";
const _edges = "edges";
const _faces = "faces";
const _boundaries = "boundaries";
const _vertices_coords = "vertices_coords";
const _edges_vertices = "edges_vertices";
const _faces_vertices = "faces_vertices";
const _faces_edges = "faces_edges";
const _edges_assignment = "edges_assignment";
const _edges_foldAngle = "edges_foldAngle";
const _frame_parent = "frame_parent";
const _frame_inherit = "frame_inherit";
const _faces_layer = "faces_layer";
const _boundary = "boundary";
const _front = "front";
const _back = "back";
const _black = "black";
const _white = "white";
const _none = "none";const isBrowser$1 = typeof window !== _undefined
	&& typeof window.document !== _undefined;
typeof process !== _undefined
	&& process.versions != null
	&& process.versions.node != null;const Messages$1 = {
	fragment: "graph could not planarize",
	manifold: "manifold required",
	graphCycle: "cycle not allowed",
	planarBoundary: "planar boundary detection error, bad graph",
	circularEdge: "circular edges not allowed",
	replaceModifyParam: "replace() index < value. indices parameter modified",
	replaceUndefined: "replace() generated undefined",
	flatFoldAngles: "foldAngles cannot be determined from flat-folded faces without an assignment",
	noWebGL: "WebGl not Supported",
	convexFace: "only convex faces are supported",
	window: "window not set; if using node/deno include package @xmldom/xmldom and set ear.window = xmldom",
	nonConvexTriangulation: "non-convex triangulation requires vertices_coords",
};const windowContainer = { window: undefined };
const buildDocument = (newWindow) => new newWindow.DOMParser()
	.parseFromString("<!DOCTYPE html><title>.</title>", "text/html");
const setWindow = (newWindow) => {
	if (!newWindow.document) { newWindow.document = buildDocument(newWindow); }
	windowContainer.window = newWindow;
	return windowContainer.window;
};
if (isBrowser$1) { windowContainer.window = window; }
const RabbitEarWindow = () => {
	if (windowContainer.window === undefined) {
		throw new Error(Messages$1.window);
	}
	return windowContainer.window;
};const root = Object.create(null);const EPSILON = 1e-6;
const R2D = 180 / Math.PI;
const D2R = Math.PI / 180;
const TWO_PI = Math.PI * 2;const constant=/*#__PURE__*/Object.freeze({__proto__:null,D2R,EPSILON,R2D,TWO_PI});const safeAdd = (a, b) => a + (b || 0);
const magnitude = v => Math.sqrt(v
	.map(n => n * n)
	.reduce(safeAdd, 0));
const magnitude2 = v => Math.sqrt(v[0] * v[0] + v[1] * v[1]);
const magnitude3 = v => Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
const magSquared = v => v
	.map(n => n * n)
	.reduce(safeAdd, 0);
const normalize = (v) => {
	const m = magnitude(v);
	return m === 0 ? v : v.map(c => c / m);
};
const normalize2 = (v) => {
	const m = magnitude2(v);
	return m === 0 ? v : [v[0] / m, v[1] / m];
};
const normalize3 = (v) => {
	const m = magnitude3(v);
	return m === 0 ? v : [v[0] / m, v[1] / m, v[2] / m];
};
const scale = (v, s) => v.map(n => n * s);
const scale2 = (v, s) => [v[0] * s, v[1] * s];
const scale3 = (v, s) => [v[0] * s, v[1] * s, v[2] * s];
const add = (v, u) => v.map((n, i) => n + (u[i] || 0));
const add2 = (v, u) => [v[0] + u[0], v[1] + u[1]];
const add3 = (v, u) => [v[0] + u[0], v[1] + u[1], v[2] + u[2]];
const subtract = (v, u) => v.map((n, i) => n - (u[i] || 0));
const subtract2 = (v, u) => [v[0] - u[0], v[1] - u[1]];
const subtract3 = (v, u) => [v[0] - u[0], v[1] - u[1], v[2] - u[2]];
const dot = (v, u) => v
	.map((_, i) => v[i] * u[i])
	.reduce(safeAdd, 0);
const dot2 = (v, u) => v[0] * u[0] + v[1] * u[1];
const dot3 = (v, u) => v[0] * u[0] + v[1] * u[1] + v[2] * u[2];
const midpoint = (v, u) => v.map((n, i) => (n + u[i]) / 2);
const midpoint2 = (v, u) => scale2(add2(v, u), 0.5);
const midpoint3 = (v, u) => scale3(add3(v, u), 0.5);
const average = function () {
	if (arguments.length === 0) { return []; }
	const dimension = (arguments[0].length > 0) ? arguments[0].length : 0;
	const sum = Array(dimension).fill(0);
	Array.from(arguments)
		.forEach(vec => sum
			.forEach((_, i) => { sum[i] += vec[i] || 0; }));
	return sum.map(n => n / arguments.length);
};
const lerp = (v, u, t) => {
	const inv = 1.0 - t;
	return v.map((n, i) => n * inv + (u[i] || 0) * t);
};
const cross2 = (v, u) => v[0] * u[1] - v[1] * u[0];
const cross3 = (v, u) => [
	v[1] * u[2] - v[2] * u[1],
	v[2] * u[0] - v[0] * u[2],
	v[0] * u[1] - v[1] * u[0],
];
const distance = (v, u) => Math.sqrt(v
	.map((_, i) => (v[i] - u[i]) ** 2)
	.reduce(safeAdd, 0));
const distance2 = (v, u) => {
	const p = v[0] - u[0];
	const q = v[1] - u[1];
	return Math.sqrt((p * p) + (q * q));
};
const distance3 = (v, u) => {
	const a = v[0] - u[0];
	const b = v[1] - u[1];
	const c = v[2] - u[2];
	return Math.sqrt((a * a) + (b * b) + (c * c));
};
const flip = v => v.map(n => -n);
const rotate90 = v => [-v[1], v[0]];
const rotate270 = v => [v[1], -v[0]];
const degenerate = (v, epsilon = EPSILON) => v
	.map(n => Math.abs(n))
	.reduce(safeAdd, 0) < epsilon;
const parallelNormalized = (v, u, epsilon = EPSILON) => 1 - Math
	.abs(dot(v, u)) < epsilon;
const parallel = (v, u, epsilon = EPSILON) => parallelNormalized(
	normalize(v),
	normalize(u),
	epsilon,
);
const parallel2 = (v, u, epsilon = EPSILON) => Math
	.abs(cross2(v, u)) < epsilon;
const resize = (dimension, vector) => (vector.length === dimension
	? vector
	: Array(dimension).fill(0).map((z, i) => (vector[i] ? vector[i] : z)));
const resizeUp = (a, b) => [a, b]
	.map(v => resize(Math.max(a.length, b.length), v));const vector=/*#__PURE__*/Object.freeze({__proto__:null,add,add2,add3,average,cross2,cross3,degenerate,distance,distance2,distance3,dot,dot2,dot3,flip,lerp,magSquared,magnitude,magnitude2,magnitude3,midpoint,midpoint2,midpoint3,normalize,normalize2,normalize3,parallel,parallel2,parallelNormalized,resize,resizeUp,rotate270,rotate90,scale,scale2,scale3,subtract,subtract2,subtract3});const epsilonEqual = (a, b, epsilon = EPSILON) => Math.abs(a - b) < epsilon;
const epsilonCompare = (a, b, epsilon = EPSILON) => (
	epsilonEqual(a, b, epsilon) ? 0 : Math.sign(b - a)
);
const epsilonEqualVectors = (a, b, epsilon = EPSILON) => {
	for (let i = 0; i < Math.max(a.length, b.length); i += 1) {
		if (!epsilonEqual(a[i] || 0, b[i] || 0, epsilon)) { return false; }
	}
	return true;
};
const include = (n, epsilon = EPSILON) => n > -epsilon;
const exclude = (n, epsilon = EPSILON) => n > epsilon;
const includeL = () => true;
const excludeL = () => true;
const includeR = include;
const excludeR = exclude;
const includeS = (n, e = EPSILON) => n > -e && n < 1 + e;
const excludeS = (n, e = EPSILON) => n > e && n < 1 - e;
const clampLine = dist => dist;
const clampRay = dist => (dist < -EPSILON ? 0 : dist);
const clampSegment = (dist) => {
	if (dist < -EPSILON) { return 0; }
	if (dist > 1 + EPSILON) { return 1; }
	return dist;
};const _function=/*#__PURE__*/Object.freeze({__proto__:null,clampLine,clampRay,clampSegment,epsilonCompare,epsilonEqual,epsilonEqualVectors,exclude,excludeL,excludeR,excludeS,include,includeL,includeR,includeS});const isIterable = (obj) => obj != null
	&& typeof obj[Symbol.iterator] === "function";
const semiFlattenArrays = function () {
	switch (arguments.length) {
	case 0: return Array.from(arguments);
	case 1: return isIterable(arguments[0]) && typeof arguments[0] !== "string"
		? semiFlattenArrays(...arguments[0])
		: [arguments[0]];
	default:
		return Array.from(arguments).map(a => (isIterable(a)
			? [...semiFlattenArrays(a)]
			: a));
	}
};
const flattenArrays = function () {
	switch (arguments.length) {
	case 0: return Array.from(arguments);
	case 1: return isIterable(arguments[0]) && typeof arguments[0] !== "string"
		? flattenArrays(...arguments[0])
		: [arguments[0]];
	default:
		return Array.from(arguments).map(a => (isIterable(a)
			? [...flattenArrays(a)]
			: a)).flat();
	}
};const array=/*#__PURE__*/Object.freeze({__proto__:null,flattenArrays,semiFlattenArrays});const getVector = function () {
	let list = flattenArrays(arguments);
	const a = list[0];
	if (typeof a === "object" && a !== null && !Number.isNaN(a.x)) {
		list = ["x", "y", "z"].map(c => a[c]).filter(b => b !== undefined);
	}
	return list.filter(n => typeof n === "number");
};
const getArrayOfVectors = function () {
	return semiFlattenArrays(arguments).map(el => getVector(el));
};
const getSegment = function () {
	const args = semiFlattenArrays(arguments);
	return args.length === 4
		? [[0, 1], [2, 3]].map(s => s.map(i => args[i]))
		: args.map(el => getVector(el));
};
const vectorOriginForm = (vector, origin = []) => ({ vector, origin });
const getLine$1 = function () {
	const args = semiFlattenArrays(arguments);
	if (args.length === 0 || args[0] == null) { return vectorOriginForm([], []); }
	if (args[0].constructor === Object && args[0].vector !== undefined) {
		return vectorOriginForm(args[0].vector, args[0].origin || []);
	}
	return typeof args[0] === "number"
		? vectorOriginForm(getVector(args))
		: vectorOriginForm(...args.map(a => getVector(a)));
};const get=/*#__PURE__*/Object.freeze({__proto__:null,getArrayOfVectors,getLine:getLine$1,getSegment,getVector});const vectorToAngle = v => Math.atan2(v[1], v[0]);
const angleToVector = a => [Math.cos(a), Math.sin(a)];
const pointsToLine = (...args) => {
	const points = getArrayOfVectors(...args);
	return {
		vector: subtract(points[1], points[0]),
		origin: points[0],
	};
};
const vecLineToUniqueLine = ({ vector, origin }) => {
	const mag = magnitude(vector);
	const normal = rotate90(vector);
	const distance = dot(origin, normal) / mag;
	return { normal: scale(normal, 1 / mag), distance };
};
const uniqueLineToVecLine = ({ normal, distance }) => ({
	vector: rotate270(normal),
	origin: scale(normal, distance),
});const convert$1=/*#__PURE__*/Object.freeze({__proto__:null,angleToVector,pointsToLine,uniqueLineToVecLine,vecLineToUniqueLine,vectorToAngle});const isCounterClockwiseBetween = (angle, floor, ceiling) => {
	while (ceiling < floor) { ceiling += TWO_PI; }
	while (angle > floor) { angle -= TWO_PI; }
	while (angle < floor) { angle += TWO_PI; }
	return angle < ceiling;
};
const clockwiseAngleRadians = (a, b) => {
	while (a < 0) { a += TWO_PI; }
	while (b < 0) { b += TWO_PI; }
	while (a > TWO_PI) { a -= TWO_PI; }
	while (b > TWO_PI) { b -= TWO_PI; }
	const a_b = a - b;
	return (a_b >= 0)
		? a_b
		: TWO_PI - (b - a);
};
const counterClockwiseAngleRadians = (a, b) => {
	while (a < 0) { a += TWO_PI; }
	while (b < 0) { b += TWO_PI; }
	while (a > TWO_PI) { a -= TWO_PI; }
	while (b > TWO_PI) { b -= TWO_PI; }
	const b_a = b - a;
	return (b_a >= 0)
		? b_a
		: TWO_PI - (a - b);
};
const clockwiseAngle2 = (a, b) => {
	const dotProduct = b[0] * a[0] + b[1] * a[1];
	const determinant = b[0] * a[1] - b[1] * a[0];
	let angle = Math.atan2(determinant, dotProduct);
	if (angle < 0) { angle += TWO_PI; }
	return angle;
};
const counterClockwiseAngle2 = (a, b) => {
	const dotProduct = a[0] * b[0] + a[1] * b[1];
	const determinant = a[0] * b[1] - a[1] * b[0];
	let angle = Math.atan2(determinant, dotProduct);
	if (angle < 0) { angle += TWO_PI; }
	return angle;
};
const clockwiseBisect2 = (a, b) => (
	angleToVector(vectorToAngle(a) - clockwiseAngle2(a, b) / 2)
);
const counterClockwiseBisect2 = (a, b) => (
	angleToVector(vectorToAngle(a) + counterClockwiseAngle2(a, b) / 2)
);
const clockwiseSubsectRadians = (angleA, angleB, divisions) => {
	const angle = clockwiseAngleRadians(angleA, angleB) / divisions;
	return Array.from(Array(divisions - 1))
		.map((_, i) => angleA + angle * (i + 1));
};
const counterClockwiseSubsectRadians = (angleA, angleB, divisions) => {
	const angle = counterClockwiseAngleRadians(angleA, angleB) / divisions;
	return Array.from(Array(divisions - 1))
		.map((_, i) => angleA + angle * (i + 1));
};
const clockwiseSubsect2 = (vectorA, vectorB, divisions) => {
	const angleA = Math.atan2(vectorA[1], vectorA[0]);
	const angleB = Math.atan2(vectorB[1], vectorB[0]);
	return clockwiseSubsectRadians(angleA, angleB, divisions)
		.map(angleToVector);
};
const counterClockwiseSubsect2 = (vectorA, vectorB, divisions) => {
	const angleA = Math.atan2(vectorA[1], vectorA[0]);
	const angleB = Math.atan2(vectorB[1], vectorB[0]);
	return counterClockwiseSubsectRadians(angleA, angleB, divisions)
		.map(angleToVector);
};
const counterClockwiseOrderRadians = (...args) => {
	const radians = args.flat();
	const counter_clockwise = radians
		.map((_, i) => i)
		.sort((a, b) => radians[a] - radians[b]);
	return counter_clockwise
		.slice(counter_clockwise.indexOf(0), counter_clockwise.length)
		.concat(counter_clockwise.slice(0, counter_clockwise.indexOf(0)));
};
const counterClockwiseOrder2 = function () {
	return counterClockwiseOrderRadians(
		semiFlattenArrays(arguments).map(vectorToAngle),
	);
};
const counterClockwiseSectorsRadians = function () {
	const radians = Array.from(arguments).flat();
	const ordered = counterClockwiseOrderRadians(radians)
		.map(i => radians[i]);
	return ordered.map((rad, i, arr) => [rad, arr[(i + 1) % arr.length]])
		.map(pair => counterClockwiseAngleRadians(pair[0], pair[1]));
};
const counterClockwiseSectors2 = function () {
	return counterClockwiseSectorsRadians(
		semiFlattenArrays(arguments).map(vectorToAngle),
	);
};
const threePointTurnDirection = (p0, p1, p2, epsilon = EPSILON) => {
	const v = normalize2(subtract2(p1, p0));
	const u = normalize2(subtract2(p2, p0));
	const cross = cross2(v, u);
	if (!epsilonEqual(cross, 0, epsilon)) {
		return Math.sign(cross);
	}
	return epsilonEqual(distance2(p0, p1) + distance2(p1, p2), distance2(p0, p2))
		? 0
		: undefined;
};const radial=/*#__PURE__*/Object.freeze({__proto__:null,clockwiseAngle2,clockwiseAngleRadians,clockwiseBisect2,clockwiseSubsect2,clockwiseSubsectRadians,counterClockwiseAngle2,counterClockwiseAngleRadians,counterClockwiseBisect2,counterClockwiseOrder2,counterClockwiseOrderRadians,counterClockwiseSectors2,counterClockwiseSectorsRadians,counterClockwiseSubsect2,counterClockwiseSubsectRadians,isCounterClockwiseBetween,threePointTurnDirection});const collinearBetween = (p0, p1, p2, inclusive = false, epsilon = EPSILON) => {
	const similar = [p0, p2]
		.map(p => epsilonEqualVectors(p1, p))
		.reduce((a, b) => a || b, false);
	if (similar) { return inclusive; }
	const vectors = [[p0, p1], [p1, p2]]
		.map(segment => subtract(segment[1], segment[0]))
		.map(vector => normalize(vector));
	return epsilonEqual(1.0, dot(...vectors), epsilon);
};
const lerpLines = (a, b, t) => {
	const vector = lerp(a.vector, b.vector, t);
	const origin = lerp(a.origin, b.origin, t);
	return { vector, origin };
};
const pleat = (a, b, count, epsilon = EPSILON) => {
	const dotProd = dot(a.vector, b.vector);
	const determinant = cross2(a.vector, b.vector);
	const numerator = cross2(subtract2(b.origin, a.origin), b.vector);
	const t = numerator / determinant;
	const normalized = [a.vector, b.vector].map(vec => normalize(vec));
	const sides = determinant > -epsilon
		? [[a.vector, b.vector], [flip(b.vector), a.vector]]
		: [[b.vector, a.vector], [flip(a.vector), b.vector]];
	const pleatVectors = sides
		.map(pair => counterClockwiseSubsect2(pair[0], pair[1], count));
	const isParallel = Math.abs(cross2(...normalized)) < epsilon;
	const intersection = isParallel
		? undefined
		: add2(a.origin, scale2(a.vector, t));
	const iter = Array.from(Array(count - 1));
	const origins = isParallel
		? iter.map((_, i) => lerp(a.origin, b.origin, (i + 1) / count))
		: iter.map(() => intersection);
	const solution = pleatVectors
		.map(side => side.map((vector, i) => ({
			vector,
			origin: [...origins[i]],
		})));
	if (isParallel) { solution[(dotProd > -epsilon ? 1 : 0)] = []; }
	return solution;
};
const bisectLines2 = (a, b, epsilon = EPSILON) => {
	const solution = pleat(a, b, 2, epsilon).map(arr => arr[0]);
	solution.forEach((val, i) => {
		if (val === undefined) { delete solution[i]; }
	});
	return solution;
};const line=/*#__PURE__*/Object.freeze({__proto__:null,bisectLines2,collinearBetween,lerpLines,pleat});const overlapLinePoint = (
	{ vector, origin },
	point,
	lineDomain = excludeL,
	epsilon = EPSILON,
) => {
	const p2p = subtract2(point, origin);
	const lineMagSq = magSquared(vector);
	const lineMag = Math.sqrt(lineMagSq);
	if (lineMag < epsilon) { return false; }
	const cross = cross2(p2p, vector.map(n => n / lineMag));
	const proj = dot2(p2p, vector) / lineMagSq;
	return Math.abs(cross) < epsilon && lineDomain(proj, epsilon / lineMag);
};
const overlapLineLine = (
	a,
	b,
	aDomain = excludeL,
	bDomain = excludeL,
	epsilon = EPSILON,
) => {
	const denominator0 = cross2(a.vector, b.vector);
	const denominator1 = -denominator0;
	const a2b = subtract2(b.origin, a.origin);
	const b2a = [-a2b[0], -a2b[1]];
	if (Math.abs(denominator0) < epsilon) {
		if (Math.abs(cross2(a2b, a.vector)) > epsilon) { return false; }
		const aPt1 = b2a;
		const aPt2 = add2(aPt1, a.vector);
		const bPt1 = a2b;
		const bPt2 = add2(bPt1, b.vector);
		const aProjLen = dot2(a.vector, a.vector);
		const bProjLen = dot2(a.vector, a.vector);
		const aProj1 = dot2(aPt1, b.vector) / bProjLen;
		const aProj2 = dot2(aPt2, b.vector) / bProjLen;
		const bProj1 = dot2(bPt1, a.vector) / aProjLen;
		const bProj2 = dot2(bPt2, a.vector) / aProjLen;
		return aDomain(bProj1, epsilon) || aDomain(bProj2, epsilon)
			|| bDomain(aProj1, epsilon) || bDomain(aProj2, epsilon);
	}
	const t0 = cross2(a2b, b.vector) / denominator0;
	const t1 = cross2(b2a, a.vector) / denominator1;
	return aDomain(t0, epsilon / magnitude2(a.vector))
		&& bDomain(t1, epsilon / magnitude2(b.vector));
};
const overlapCirclePoint = (
	{ radius, origin },
	point,
	circleDomain = exclude,
	epsilon = EPSILON,
) => (
	circleDomain(radius - distance2(origin, point), epsilon)
);
const overlapConvexPolygonPoint = (
	polygon,
	point,
	polyDomain = exclude,
	epsilon = EPSILON,
) => polygon
	.map((p, i, arr) => [p, arr[(i + 1) % arr.length]])
	.map(s => cross2(normalize2(subtract2(s[1], s[0])), subtract2(point, s[0])))
	.map(side => polyDomain(side, epsilon))
	.map((s, _, arr) => s === arr[0])
	.reduce((prev, curr) => prev && curr, true);
const overlapConvexPolygons = (poly1, poly2, epsilon = EPSILON) => {
	for (let p = 0; p < 2; p += 1) {
		const polyA = p === 0 ? poly1 : poly2;
		const polyB = p === 0 ? poly2 : poly1;
		for (let i = 0; i < polyA.length; i += 1) {
			const origin = polyA[i];
			const vector = rotate90(subtract2(polyA[(i + 1) % polyA.length], polyA[i]));
			const projected = polyB
				.map(point => subtract2(point, origin))
				.map(v => dot2(vector, v));
			const other_test_point = polyA[(i + 2) % polyA.length];
			const side_a = dot2(vector, subtract2(other_test_point, origin));
			const side = side_a > 0;
			const one_sided = projected
				.map(dotProd => (side ? dotProd < epsilon : dotProd > -epsilon))
				.reduce((a, b) => a && b, true);
			if (one_sided) { return false; }
		}
	}
	return true;
};
const overlapBoundingBoxes = (box1, box2, epsilon = EPSILON) => {
	const dimensions = Math.min(box1.min.length, box2.min.length);
	for (let d = 0; d < dimensions; d += 1) {
		if (box1.min[d] > box2.max[d] + epsilon
			|| box1.max[d] < box2.min[d] - epsilon) {
			return false;
		}
	}
	return true;
};const overlap=/*#__PURE__*/Object.freeze({__proto__:null,overlapBoundingBoxes,overlapCirclePoint,overlapConvexPolygonPoint,overlapConvexPolygons,overlapLineLine,overlapLinePoint});const intersectLineLine = (
	a,
	b,
	aDomain = includeL,
	bDomain = includeL,
	epsilon = EPSILON,
) => {
	const det_norm = cross2(normalize2(a.vector), normalize2(b.vector));
	if (Math.abs(det_norm) < epsilon) { return undefined; }
	const determinant0 = cross2(a.vector, b.vector);
	const determinant1 = -determinant0;
	const a2b = [b.origin[0] - a.origin[0], b.origin[1] - a.origin[1]];
	const b2a = [-a2b[0], -a2b[1]];
	const t0 = cross2(a2b, b.vector) / determinant0;
	const t1 = cross2(b2a, a.vector) / determinant1;
	if (aDomain(t0, epsilon / magnitude2(a.vector))
		&& bDomain(t1, epsilon / magnitude2(b.vector))) {
		return add2(a.origin, scale2(a.vector, t0));
	}
	return undefined;
};
const intersectCircleLine = (
	circle,
	line,
	circleDomain = include,
	lineDomain = includeL,
	epsilon = EPSILON,
) => {
	const magSq = line.vector[0] ** 2 + line.vector[1] ** 2;
	const mag = Math.sqrt(magSq);
	const norm = mag === 0 ? line.vector : line.vector.map(c => c / mag);
	const rot90 = rotate90(norm);
	const bvec = subtract2(line.origin, circle.origin);
	const det = cross2(bvec, norm);
	if (Math.abs(det) > circle.radius + epsilon) { return undefined; }
	const side = Math.sqrt((circle.radius ** 2) - (det ** 2));
	const f = (s, i) => circle.origin[i] - rot90[i] * det + norm[i] * s;
	const results = Math.abs(circle.radius - Math.abs(det)) < epsilon
		? [side].map((s) => [s, s].map(f))
		: [-side, side].map((s) => [s, s].map(f));
	const ts = results.map(res => res.map((n, i) => n - line.origin[i]))
		.map(v => v[0] * line.vector[0] + line.vector[1] * v[1])
		.map(d => d / magSq);
	return results.filter((_, i) => lineDomain(ts[i], epsilon));
};
const acosSafe = (x) => {
	if (x >= 1.0) return 0;
	if (x <= -1.0) return Math.PI;
	return Math.acos(x);
};
const rotateVector2 = (center, pt, a) => {
	const x = pt[0] - center[0];
	const y = pt[1] - center[1];
	const xRot = x * Math.cos(a) + y * Math.sin(a);
	const yRot = y * Math.cos(a) - x * Math.sin(a);
	return [center[0] + xRot, center[1] + yRot];
};
const intersectCircleCircle = (
	c1,
	c2,
	c1Domain = include,
	c2Domain = include,
	epsilon = EPSILON,
) => {
	const r = (c1.radius < c2.radius) ? c1.radius : c2.radius;
	const R = (c1.radius < c2.radius) ? c2.radius : c1.radius;
	const smCenter = (c1.radius < c2.radius) ? c1.origin : c2.origin;
	const bgCenter = (c1.radius < c2.radius) ? c2.origin : c1.origin;
	const vec = [smCenter[0] - bgCenter[0], smCenter[1] - bgCenter[1]];
	const d = Math.sqrt((vec[0] ** 2) + (vec[1] ** 2));
	if (d < epsilon) { return undefined; }
	const point = vec.map((v, i) => (v / d) * R + bgCenter[i]);
	if (Math.abs((R + r) - d) < epsilon
		|| Math.abs(R - (r + d)) < epsilon) { return [point]; }
	if ((d + r) < R || (R + r < d)) { return undefined; }
	const angle = acosSafe((r * r - d * d - R * R) / (-2.0 * d * R));
	const pt1 = rotateVector2(bgCenter, point, +angle);
	const pt2 = rotateVector2(bgCenter, point, -angle);
	return [pt1, pt2];
};
const getUniquePair = (intersections) => {
	for (let i = 1; i < intersections.length; i += 1) {
		if (!epsilonEqualVectors(intersections[0], intersections[i])) {
			return [intersections[0], intersections[i]];
		}
	}
	return undefined;
};
const intersectConvexPolygonLineInclusive = (
	poly,
	{ vector, origin },
	fn_poly = includeS,
	fn_line = includeL,
	epsilon = EPSILON,
) => {
	const intersections = poly
		.map((p, i, arr) => [p, arr[(i + 1) % arr.length]])
		.map(side => intersectLineLine(
			{ vector: subtract2(side[1], side[0]), origin: side[0] },
			{ vector, origin },
			fn_poly,
			fn_line,
			epsilon,
		))
		.filter(a => a !== undefined);
	switch (intersections.length) {
	case 0: return undefined;
	case 1: return [intersections];
	default:
		return getUniquePair(intersections) || [intersections[0]];
	}
};
const intersectConvexPolygonLine = (
	poly,
	{ vector, origin },
	fn_poly = includeS,
	fn_line = excludeL,
	epsilon = EPSILON,
) => {
	const sects = intersectConvexPolygonLineInclusive(
		poly,
		{ vector, origin },
		fn_poly,
		fn_line,
		epsilon,
	);
	let altFunc;
	switch (fn_line) {
	case excludeR: altFunc = includeR; break;
	case excludeS: altFunc = includeS; break;
	default: return sects;
	}
	const includes = intersectConvexPolygonLineInclusive(
		poly,
		{ vector, origin },
		includeS,
		altFunc,
		epsilon,
	);
	if (includes === undefined) { return undefined; }
	const uniqueIncludes = getUniquePair(includes);
	if (uniqueIncludes === undefined) {
		switch (fn_line) {
		case excludeR:
			return overlapConvexPolygonPoint(poly, origin, exclude, epsilon)
				? includes
				: undefined;
		case excludeS:
			return overlapConvexPolygonPoint(poly, add2(origin, vector), exclude, epsilon)
				|| overlapConvexPolygonPoint(poly, origin, exclude, epsilon)
				? includes
				: undefined;
		case excludeL: return undefined;
		default: return undefined;
		}
	}
	return overlapConvexPolygonPoint(poly, midpoint2(...uniqueIncludes), exclude, epsilon)
		? uniqueIncludes
		: sects;
};const intersect$1=/*#__PURE__*/Object.freeze({__proto__:null,intersectCircleCircle,intersectCircleLine,intersectConvexPolygonLine,intersectLineLine});const intersectionUD = (line1, line2) => {
	const det = cross2(line1.normal, line2.normal);
	if (Math.abs(det) < EPSILON) { return undefined; }
	const x = line1.distance * line2.normal[1] - line2.distance * line1.normal[1];
	const y = line2.distance * line1.normal[0] - line1.distance * line2.normal[0];
	return [x / det, y / det];
};
const normalAxiom1 = (point1, point2) => {
	const normal = normalize2(rotate90(subtract2(point2, point1)));
	return [{
		normal,
		distance: dot2(add2(point1, point2), normal) / 2.0,
	}];
};
const normalAxiom2 = (point1, point2) => {
	const normal = normalize2(subtract2(point2, point1));
	return [{
		normal,
		distance: dot2(add2(point1, point2), normal) / 2.0,
	}];
};
const normalAxiom3 = (line1, line2) => {
	const intersect = intersectionUD(line1, line2);
	return intersect === undefined
		? [{
			normal: line1.normal,
			distance: (line1.distance + line2.distance * dot2(line1.normal, line2.normal)) / 2,
		}]
		: [add2, subtract2]
			.map(f => normalize2(f(line1.normal, line2.normal)))
			.map(normal => ({ normal, distance: dot2(intersect, normal) }));
};
const normalAxiom4 = (line, point) => {
	const normal = rotate90(line.normal);
	const distance = dot2(point, normal);
	return [{ normal, distance }];
};
const normalAxiom5 = (line, point1, point2) => {
	const p1base = dot2(point1, line.normal);
	const a = line.distance - p1base;
	const c = distance2(point1, point2);
	if (a > c) { return []; }
	const b = Math.sqrt(c * c - a * a);
	const a_vec = scale2(line.normal, a);
	const base_center = add2(point1, a_vec);
	const base_vector = scale2(rotate90(line.normal), b);
	const mirrors = b < EPSILON
		? [base_center]
		: [add2(base_center, base_vector), subtract2(base_center, base_vector)];
	return mirrors
		.map(pt => normalize2(subtract2(point2, pt)))
		.map(normal => ({ normal, distance: dot2(point1, normal) }));
};
const cubrt = n => (n < 0
	? -Math.pow(-n, 1 / 3)
	: Math.pow(n, 1 / 3));
const polynomial = (degree, a, b, c, d) => {
	switch (degree) {
	case 1: return [-d / c];
	case 2: {
		const discriminant = Math.pow(c, 2.0) - (4.0 * b * d);
		if (discriminant < -EPSILON) { return []; }
		const q1 = -c / (2.0 * b);
		if (discriminant < EPSILON) { return [q1]; }
		const q2 = Math.sqrt(discriminant) / (2.0 * b);
		return [q1 + q2, q1 - q2];
	}
	case 3: {
		const a2 = b / a;
		const a1 = c / a;
		const a0 = d / a;
		const q = (3.0 * a1 - Math.pow(a2, 2.0)) / 9.0;
		const r = (9.0 * a2 * a1 - 27.0 * a0 - 2.0 * Math.pow(a2, 3.0)) / 54.0;
		const d0 = Math.pow(q, 3.0) + Math.pow(r, 2.0);
		const u = -a2 / 3.0;
		if (d0 > 0.0) {
			const sqrt_d0 = Math.sqrt(d0);
			const s = cubrt(r + sqrt_d0);
			const t = cubrt(r - sqrt_d0);
			return [u + s + t];
		}
		if (Math.abs(d0) < EPSILON) {
			const s = Math.pow(r, 1.0 / 3.0);
			if (r < 0.0) { return []; }
			return [u + 2.0 * s, u - s];
		}
		const sqrt_d0 = Math.sqrt(-d0);
		const phi = Math.atan2(sqrt_d0, r) / 3.0;
		const r_s = Math.pow((Math.pow(r, 2.0) - d0), 1.0 / 6.0);
		const s_r = r_s * Math.cos(phi);
		const s_i = r_s * Math.sin(phi);
		return [
			u + 2.0 * s_r,
			u - s_r - Math.sqrt(3.0) * s_i,
			u - s_r + Math.sqrt(3.0) * s_i,
		];
	}
	default: return [];
	}
};
const normalAxiom6 = (line1, line2, point1, point2) => {
	if (Math.abs(1.0 - (dot2(line1.normal, point1) / line1.distance)) < 0.02) { return []; }
	const line_vec = rotate90(line1.normal);
	const vec1 = subtract2(
		add2(point1, scale2(line1.normal, line1.distance)),
		scale2(point2, 2.0),
	);
	const vec2 = subtract2(scale2(line1.normal, line1.distance), point1);
	const c1 = dot2(point2, line2.normal) - line2.distance;
	const c2 = 2.0 * dot2(vec2, line_vec);
	const c3 = dot2(vec2, vec2);
	const c4 = dot2(add2(vec1, vec2), line_vec);
	const c5 = dot2(vec1, vec2);
	const c6 = dot2(line_vec, line2.normal);
	const c7 = dot2(vec2, line2.normal);
	const a = c6;
	const b = c1 + c4 * c6 + c7;
	const c = c1 * c2 + c5 * c6 + c4 * c7;
	const d = c1 * c3 + c5 * c7;
	let polynomial_degree = 0;
	if (Math.abs(c) > EPSILON) { polynomial_degree = 1; }
	if (Math.abs(b) > EPSILON) { polynomial_degree = 2; }
	if (Math.abs(a) > EPSILON) { polynomial_degree = 3; }
	return polynomial(polynomial_degree, a, b, c, d)
		.map(n => add2(
			scale2(line1.normal, line1.distance),
			scale2(line_vec, n),
		))
		.map(p => ({ p, normal: normalize2(subtract2(p, point1)) }))
		.map(el => ({
			normal: el.normal,
			distance: dot2(el.normal, midpoint2(el.p, point1)),
		}));
};
const normalAxiom7 = (line1, line2, point) => {
	const normal = rotate90(line1.normal);
	const norm_norm = dot2(normal, line2.normal);
	if (Math.abs(norm_norm) < EPSILON) { return undefined; }
	const a = dot2(point, normal);
	const b = dot2(point, line2.normal);
	const distance = (line2.distance + 2.0 * a * norm_norm - b) / (2.0 * norm_norm);
	return [{ normal, distance }];
};
const normalAxiom = (number, ...args) => [
	null,
	normalAxiom1,
	normalAxiom2,
	normalAxiom3,
	normalAxiom4,
	normalAxiom5,
	normalAxiom6,
	normalAxiom7,
][number](...args);const AxiomsUniqueLine=/*#__PURE__*/Object.freeze({__proto__:null,normalAxiom,normalAxiom1,normalAxiom2,normalAxiom3,normalAxiom4,normalAxiom5,normalAxiom6,normalAxiom7});const axiom1 = (point1, point2) => [{
	vector: normalize2(subtract2(...resizeUp(point2, point1))),
	origin: point1,
}];
const axiom2 = (point1, point2) => [{
	vector: normalize2(rotate90(subtract2(
		...resizeUp(point2, point1),
	))),
	origin: midpoint2(point1, point2),
}];
const axiom3 = (line1, line2) => bisectLines2(line1, line2);
const axiom4 = (line, point) => [{
	vector: rotate90(normalize2(line.vector)),
	origin: point,
}];
const axiom5 = (line, point1, point2) => (
	intersectCircleLine(
		{ radius: distance2(point1, point2), origin: point1 },
		line,
	) || []).map(sect => ({
	vector: normalize2(rotate90(subtract2(
		...resizeUp(sect, point2),
	))),
	origin: midpoint2(point2, sect),
}));
const axiom6 = (line1, line2, point1, point2) => normalAxiom6(
	vecLineToUniqueLine(line1),
	vecLineToUniqueLine(line2),
	point1,
	point2,
).map(uniqueLineToVecLine);
const axiom7 = (line1, line2, point) => {
	const intersect = intersectLineLine(
		line1,
		{ vector: line2.vector, origin: point },
		includeL,
		includeL,
	);
	return intersect === undefined
		? []
		: [{
			vector: normalize2(rotate90(subtract2(
				...resizeUp(intersect, point),
			))),
			origin: midpoint2(point, intersect),
		}];
};
const axiom$1 = (number, ...args) => [
	null, axiom1, axiom2, axiom3, axiom4, axiom5, axiom6, axiom7,
][number](...args);const AxiomsVecLine=/*#__PURE__*/Object.freeze({__proto__:null,axiom:axiom$1,axiom1,axiom2,axiom3,axiom4,axiom5,axiom6,axiom7});const identity2x2 = [1, 0, 0, 1];
const identity2x3 = identity2x2.concat(0, 0);
const multiplyMatrix2Vector2 = (matrix, vector) => [
	matrix[0] * vector[0] + matrix[2] * vector[1] + matrix[4],
	matrix[1] * vector[0] + matrix[3] * vector[1] + matrix[5],
];
const multiplyMatrix2Line2 = (matrix, vector, origin) => ({
	vector: [
		matrix[0] * vector[0] + matrix[2] * vector[1],
		matrix[1] * vector[0] + matrix[3] * vector[1],
	],
	origin: [
		matrix[0] * origin[0] + matrix[2] * origin[1] + matrix[4],
		matrix[1] * origin[0] + matrix[3] * origin[1] + matrix[5],
	],
});
const multiplyMatrices2 = (m1, m2) => [
	m1[0] * m2[0] + m1[2] * m2[1],
	m1[1] * m2[0] + m1[3] * m2[1],
	m1[0] * m2[2] + m1[2] * m2[3],
	m1[1] * m2[2] + m1[3] * m2[3],
	m1[0] * m2[4] + m1[2] * m2[5] + m1[4],
	m1[1] * m2[4] + m1[3] * m2[5] + m1[5],
];
const determinant2 = m => m[0] * m[3] - m[1] * m[2];
const invertMatrix2 = (m) => {
	const det = determinant2(m);
	if (Math.abs(det) < 1e-6
		|| Number.isNaN(det)
		|| !Number.isFinite(m[4])
		|| !Number.isFinite(m[5])) {
		return undefined;
	}
	return [
		m[3] / det,
		-m[1] / det,
		-m[2] / det,
		m[0] / det,
		(m[2] * m[5] - m[3] * m[4]) / det,
		(m[1] * m[4] - m[0] * m[5]) / det,
	];
};
const makeMatrix2Translate = (x = 0, y = 0) => identity2x2.concat(x, y);
const makeMatrix2Scale = (scale = [1, 1], origin = [0, 0]) => [
	scale[0],
	0,
	0,
	scale[1],
	scale[0] * -origin[0] + origin[0],
	scale[1] * -origin[1] + origin[1],
];
const makeMatrix2UniformScale = (scale = 1, origin = [0, 0]) => (
	makeMatrix2Scale([scale, scale], origin)
);
const makeMatrix2Rotate = (angle, origin = [0, 0]) => {
	const cos = Math.cos(angle);
	const sin = Math.sin(angle);
	return [
		cos,
		sin,
		-sin,
		cos,
		origin[0],
		origin[1],
	];
};
const makeMatrix2Reflect = (vector, origin = [0, 0]) => {
	const angle = Math.atan2(vector[1], vector[0]);
	const cosAngle = Math.cos(angle);
	const sinAngle = Math.sin(angle);
	const cos_Angle = Math.cos(-angle);
	const sin_Angle = Math.sin(-angle);
	const a = cosAngle * cos_Angle + sinAngle * sin_Angle;
	const b = cosAngle * -sin_Angle + sinAngle * cos_Angle;
	const c = sinAngle * cos_Angle + -cosAngle * sin_Angle;
	const d = sinAngle * -sin_Angle + -cosAngle * cos_Angle;
	const tx = origin[0] + a * -origin[0] + -origin[1] * c;
	const ty = origin[1] + b * -origin[0] + -origin[1] * d;
	return [a, b, c, d, tx, ty];
};const matrix2=/*#__PURE__*/Object.freeze({__proto__:null,determinant2,identity2x2,identity2x3,invertMatrix2,makeMatrix2Reflect,makeMatrix2Rotate,makeMatrix2Scale,makeMatrix2Translate,makeMatrix2UniformScale,multiplyMatrices2,multiplyMatrix2Line2,multiplyMatrix2Vector2});const lineLineParameter = (
	lineVector,
	lineOrigin,
	polyVector,
	polyOrigin,
	polyLineFunc = includeS,
	epsilon = EPSILON,
) => {
	const det_norm = cross2(normalize2(lineVector), normalize2(polyVector));
	if (Math.abs(det_norm) < epsilon) { return undefined; }
	const determinant0 = cross2(lineVector, polyVector);
	const determinant1 = -determinant0;
	const a2b = subtract2(polyOrigin, lineOrigin);
	const b2a = flip(a2b);
	const t0 = cross2(a2b, polyVector) / determinant0;
	const t1 = cross2(b2a, lineVector) / determinant1;
	if (polyLineFunc(t1, epsilon / magnitude2(polyVector))) {
		return t0;
	}
	return undefined;
};
const linePointFromParameter = (vector, origin, t) => (
	add2(origin, scale2(vector, t))
);
const getIntersectParameters = (poly, vector, origin, polyLineFunc, epsilon) => poly
	.map((p, i, arr) => [subtract2(arr[(i + 1) % arr.length], p), p])
	.map(side => lineLineParameter(
		vector,
		origin,
		side[0],
		side[1],
		polyLineFunc,
		epsilon,
	))
	.filter(a => a !== undefined)
	.sort((a, b) => a - b);
const getMinMax = (numbers, func, scaled_epsilon) => {
	let a = 0;
	let b = numbers.length - 1;
	while (a < b) {
		if (func(numbers[a + 1] - numbers[a], scaled_epsilon)) { break; }
		a += 1;
	}
	while (b > a) {
		if (func(numbers[b] - numbers[b - 1], scaled_epsilon)) { break; }
		b -= 1;
	}
	if (a >= b) { return undefined; }
	return [numbers[a], numbers[b]];
};
const clipLineConvexPolygon = (
	poly,
	{ vector, origin },
	fnPoly = include,
	fnLine = includeL,
	epsilon = EPSILON,
) => {
	const numbers = getIntersectParameters(poly, vector, origin, includeS, epsilon);
	if (numbers.length < 2) { return undefined; }
	const scaled_epsilon = (epsilon * 2) / magnitude2(vector);
	const ends = getMinMax(numbers, fnPoly, scaled_epsilon);
	if (ends === undefined) { return undefined; }
	const clip_fn = (t) => {
		if (fnLine(t)) { return t; }
		return t < 0.5 ? 0 : 1;
	};
	const ends_clip = ends.map(clip_fn);
	if (Math.abs(ends_clip[0] - ends_clip[1]) < (epsilon * 2) / magnitude2(vector)) {
		return undefined;
	}
	const mid = linePointFromParameter(vector, origin, (ends_clip[0] + ends_clip[1]) / 2);
	return overlapConvexPolygonPoint(poly, mid, fnPoly, epsilon)
		? ends_clip.map(t => linePointFromParameter(vector, origin, t))
		: undefined;
};
const clipPolygonPolygon = (polygon1, polygon2, epsilon = EPSILON) => {
	const inside = (p, cp1, cp2) => (
		(cp2[0] - cp1[0]) * (p[1] - cp1[1])) > ((cp2[1] - cp1[1]) * (p[0] - cp1[0]) + epsilon
	);
	const intersection = (cp1, cp2, e, s) => {
		const dc = subtract2(cp1, cp2);
		const dp = subtract2(s, e);
		const n1 = cross2(cp1, cp2);
		const n2 = cross2(s, e);
		const n3 = 1.0 / cross2(dc, dp);
		return scale2(subtract2(scale2(dp, n1), scale2(dc, n2)), n3);
	};
	let outputList = polygon1;
	let cp1 = polygon2[polygon2.length - 1];
	for (let j = 0; j < polygon2.length; j += 1) {
		const cp2 = polygon2[j];
		const inputList = outputList;
		outputList = [];
		let s = inputList[inputList.length - 1];
		for (let i = 0; i < inputList.length; i += 1) {
			const e = inputList[i];
			if (inside(e, cp1, cp2)) {
				if (!inside(s, cp1, cp2)) {
					outputList.push(intersection(cp1, cp2, e, s));
				}
				outputList.push(e);
			} else if (inside(s, cp1, cp2)) {
				outputList.push(intersection(cp1, cp2, e, s));
			}
			s = e;
		}
		cp1 = cp2;
	}
	return outputList.length === 0 ? undefined : outputList;
};const clip$1=/*#__PURE__*/Object.freeze({__proto__:null,clipLineConvexPolygon,clipPolygonPolygon});const reflectPoint = (foldLine, point) => {
	const matrix = makeMatrix2Reflect(foldLine.vector, foldLine.origin);
	return multiplyMatrix2Vector2(matrix, point);
};
const validateAxiom1 = (boundary, solutions, point1, point2) => [point1, point2]
	.map(p => overlapConvexPolygonPoint(boundary, p, include))
	.reduce((a, b) => a && b, true);
const validateAxiom2 = validateAxiom1;
const validateAxiom3 = (boundary, solutions, line1, line2) => {
	const segments = [line1, line2]
		.map(line => clipLineConvexPolygon(
			boundary,
			line,
			include,
			includeL,
		));
	if (segments[0] === undefined || segments[1] === undefined) {
		return [false, false];
	}
	const results_clip = solutions.map(line => (line === undefined
		? undefined
		: clipLineConvexPolygon(
			boundary,
			line,
			include,
			includeL,
		)));
	const results_inside = [0, 1].map((i) => results_clip[i] !== undefined);
	const seg0Reflect = solutions.map(foldLine => (foldLine === undefined
		? undefined
		: [
			reflectPoint(foldLine, segments[0][0]),
			reflectPoint(foldLine, segments[0][1]),
		]));
	const reflectMatch = seg0Reflect.map(seg => (seg === undefined
		? false
		: (overlapLinePoint(
			{ vector: subtract(segments[1][1], segments[1][0]), origin: segments[1][0] },
			seg[0],
			includeS,
		)
		|| overlapLinePoint(
			{ vector: subtract(segments[1][1], segments[1][0]), origin: segments[1][0] },
			seg[1],
			includeS,
		)
		|| overlapLinePoint(
			{ vector: subtract(seg[1], seg[0]), origin: seg[0] },
			segments[1][0],
			includeS,
		)
		|| overlapLinePoint(
			{ vector: subtract(seg[1], seg[0]), origin: seg[0] },
			segments[1][1],
			includeS,
		))));
	return [0, 1].map(i => reflectMatch[i] === true && results_inside[i] === true);
};
const validateAxiom4 = (boundary, solutions, line, point) => {
	const intersect = intersectLineLine(
		line,
		{ vector: rotate90(line.vector), origin: point },
		includeL,
		includeL,
	);
	return [point, intersect]
		.filter(a => a !== undefined)
		.map(p => overlapConvexPolygonPoint(boundary, p, include))
		.reduce((a, b) => a && b, true);
};
const validateAxiom5 = (boundary, solutions, line, point1, point2) => {
	if (solutions.length === 0) { return []; }
	const testParamPoints = [point1, point2]
		.map(point => overlapConvexPolygonPoint(boundary, point, include))
		.reduce((a, b) => a && b, true);
	const testReflections = solutions
		.map(foldLine => reflectPoint(foldLine, point2))
		.map(point => overlapConvexPolygonPoint(boundary, point, include));
	return testReflections.map(ref => ref && testParamPoints);
};
const validateAxiom6 = function (boundary, solutions, line1, line2, point1, point2) {
	if (solutions.length === 0) { return []; }
	const testParamPoints = [point1, point2]
		.map(point => overlapConvexPolygonPoint(boundary, point, include))
		.reduce((a, b) => a && b, true);
	if (!testParamPoints) { return solutions.map(() => false); }
	const testReflect0 = solutions
		.map(foldLine => reflectPoint(foldLine, point1))
		.map(point => overlapConvexPolygonPoint(boundary, point, include));
	const testReflect1 = solutions
		.map(foldLine => reflectPoint(foldLine, point2))
		.map(point => overlapConvexPolygonPoint(boundary, point, include));
	return solutions.map((_, i) => testReflect0[i] && testReflect1[i]);
};
const validateAxiom7 = (boundary, solutions, line1, line2, point) => {
	const paramPointTest = overlapConvexPolygonPoint(
		boundary,
		point,
		include,
	);
	if (!solutions.length) { return [false]; }
	const reflected = reflectPoint(solutions[0], point);
	const reflectTest = overlapConvexPolygonPoint(boundary, reflected, include);
	const paramLineTest = (intersectConvexPolygonLine(
		boundary,
		line2,
		includeS,
		includeL,
	) !== undefined);
	const intersect = intersectLineLine(
		line2,
		solutions[0],
		includeL,
		includeL,
	);
	const intersectInsideTest = intersect
		? overlapConvexPolygonPoint(boundary, intersect, include)
		: false;
	return paramPointTest && reflectTest && paramLineTest && intersectInsideTest;
};
const validateAxiom = (number, boundary, solutions, ...args) => [null,
	validateAxiom1,
	validateAxiom2,
	validateAxiom3,
	validateAxiom4,
	validateAxiom5,
	validateAxiom6,
	validateAxiom7,
][number](boundary, solutions, ...args);const ValidateAxioms=/*#__PURE__*/Object.freeze({__proto__:null,validateAxiom,validateAxiom1,validateAxiom2,validateAxiom3,validateAxiom4,validateAxiom5,validateAxiom6,validateAxiom7});const paramsToUniqueLine = (args) => args
	.map(arg => (typeof arg === "object" && arg.vector
		? uniqueLineToVecLine(arg)
		: arg));
const axiomWithBoundary = (number, boundary, ...args) => {
	const solutions = axiom$1(number, ...args);
	validateAxiom(number, boundary, solutions, ...args)
		.forEach((valid, i) => (valid ? i : undefined))
		.filter(a => a !== undefined)
		.forEach(i => delete solutions[i]);
	return solutions;
};
const normalAxiomWithBoundary = (number, boundary, ...args) => {
	const solutions = normalAxiom(number, ...args).map(uniqueLineToVecLine);
	validateAxiom(number, boundary, solutions, ...paramsToUniqueLine(args))
		.forEach((valid, i) => (valid ? i : undefined))
		.filter(a => a !== undefined)
		.forEach(i => delete solutions[i]);
	return solutions;
};const AxiomsBoundary=/*#__PURE__*/Object.freeze({__proto__:null,axiomWithBoundary,normalAxiomWithBoundary});const axiom = {
	...AxiomsVecLine,
	...AxiomsUniqueLine,
	...AxiomsBoundary,
	...ValidateAxioms,
};const angleArray = count => Array
	.from(Array(Math.floor(count)))
	.map((_, i) => TWO_PI * (i / count));
const anglesToVecs = (angles, radius) => angles
	.map(a => [radius * Math.cos(a), radius * Math.sin(a)]);
const makePolygonCircumradius = (sides = 3, circumradius = 1) => (
	anglesToVecs(angleArray(sides), circumradius)
);
const makePolygonCircumradiusSide = (sides = 3, circumradius = 1) => {
	const halfwedge = Math.PI / sides;
	const angles = angleArray(sides).map(a => a + halfwedge);
	return anglesToVecs(angles, circumradius);
};
const makePolygonInradius = (sides = 3, inradius = 1) => (
	makePolygonCircumradius(sides, inradius / Math.cos(Math.PI / sides)));
const makePolygonInradiusSide = (sides = 3, inradius = 1) => (
	makePolygonCircumradiusSide(sides, inradius / Math.cos(Math.PI / sides)));
const makePolygonSideLength = (sides = 3, length = 1) => (
	makePolygonCircumradius(sides, (length / 2) / Math.sin(Math.PI / sides)));
const makePolygonSideLengthSide = (sides = 3, length = 1) => (
	makePolygonCircumradiusSide(sides, (length / 2) / Math.sin(Math.PI / sides)));
const makePolygonNonCollinear = (polygon, epsilon = EPSILON) => {
	const edges_vector = polygon
		.map((v, i, arr) => [v, arr[(i + 1) % arr.length]])
		.map(pair => subtract(pair[1], pair[0]));
	const vertex_collinear = edges_vector
		.map((vector, i, arr) => [vector, arr[(i + arr.length - 1) % arr.length]])
		.map(pair => !parallel(pair[1], pair[0], epsilon));
	return polygon
		.filter((vertex, v) => vertex_collinear[v]);
};
const circumcircle = (a, b, c) => {
	const A = b[0] - a[0];
	const B = b[1] - a[1];
	const C = c[0] - a[0];
	const D = c[1] - a[1];
	const E = A * (a[0] + b[0]) + B * (a[1] + b[1]);
	const F = C * (a[0] + c[0]) + D * (a[1] + c[1]);
	const G = 2 * (A * (c[1] - b[1]) - B * (c[0] - b[0]));
	if (Math.abs(G) < EPSILON) {
		const minx = Math.min(a[0], b[0], c[0]);
		const miny = Math.min(a[1], b[1], c[1]);
		const dx = (Math.max(a[0], b[0], c[0]) - minx) * 0.5;
		const dy = (Math.max(a[1], b[1], c[1]) - miny) * 0.5;
		return {
			origin: [minx + dx, miny + dy],
			radius: Math.sqrt(dx * dx + dy * dy),
		};
	}
	const origin = [(D * E - B * F) / G, (A * F - C * E) / G];
	const dx = origin[0] - a[0];
	const dy = origin[1] - a[1];
	return {
		origin,
		radius: Math.sqrt(dx * dx + dy * dy),
	};
};
const signedArea = points => 0.5 * points
	.map((el, i, arr) => [el, arr[(i + 1) % arr.length]])
	.map(pair => cross2(...pair))
	.reduce((a, b) => a + b, 0);
const centroid = (points) => {
	const sixthArea = 1 / (6 * signedArea(points));
	return points
		.map((el, i, arr) => [el, arr[(i + 1) % arr.length]])
		.map(pair => scale2(add2(...pair), cross2(...pair)))
		.reduce((a, b) => add2(a, b), [0, 0])
		.map(c => c * sixthArea);
};
const boundingBox$1 = (points, padding = 0) => {
	if (!points || !points.length) { return undefined; }
	const min = Array(points[0].length).fill(Infinity);
	const max = Array(points[0].length).fill(-Infinity);
	points.forEach(point => point
		.forEach((c, i) => {
			if (c < min[i]) { min[i] = c - padding; }
			if (c > max[i]) { max[i] = c + padding; }
		}));
	const span = max.map((m, i) => m - min[i]);
	return { min, max, span };
};const polygon$1=/*#__PURE__*/Object.freeze({__proto__:null,boundingBox:boundingBox$1,centroid,circumcircle,makePolygonCircumradius,makePolygonCircumradiusSide,makePolygonInradius,makePolygonInradiusSide,makePolygonNonCollinear,makePolygonSideLength,makePolygonSideLengthSide,signedArea});const foldKeys = {
	file: [
		"file_spec",
		"file_creator",
		"file_author",
		"file_title",
		"file_description",
		"file_classes",
		"file_frames",
	],
	frame: [
		"frame_author",
		"frame_title",
		"frame_description",
		"frame_attributes",
		"frame_classes",
		"frame_unit",
		"frame_parent",
		"frame_inherit",
	],
	graph: [
		"vertices_coords",
		"vertices_vertices",
		"vertices_faces",
		"edges_vertices",
		"edges_faces",
		"edges_assignment",
		"edges_foldAngle",
		"edges_length",
		"faces_vertices",
		"faces_edges",
		"vertices_edges",
		"edges_edges",
		"faces_faces",
	],
	orders: [
		"edgeOrders",
		"faceOrders",
	],
};
const foldFileClasses = [
	"singleModel",
	"multiModel",
	"animation",
	"diagrams",
];
const foldFrameClasses = [
	"creasePattern",
	"foldedForm",
	"graph",
	"linkage",
];
const foldFrameAttributes = [
	"2D",
	"3D",
	"abstract",
	"manifold",
	"nonManifold",
	"orientable",
	"nonOrientable",
	"selfTouching",
	"nonSelfTouching",
	"selfIntersecting",
	"nonSelfIntersecting",
];const foldKeyMethods=/*#__PURE__*/Object.freeze({__proto__:null,foldFileClasses,foldFrameAttributes,foldFrameClasses,foldKeys});const singularize = {
	vertices: "vertex",
	edges: "edge",
	faces: "face",
};
const pluralize = {
	vertex: "vertices",
	edge: "edges",
	face: "faces",
};
const edgesAssignmentValues = Array.from("BbMmVvFfJjCcUu");
const edgesAssignmentNames = {
	b: "boundary",
	m: "mountain",
	v: "valley",
	f: "flat",
	j: "join",
	c: "cut",
	u: "unassigned",
};
Object.keys(edgesAssignmentNames).forEach(key => {
	edgesAssignmentNames[key.toUpperCase()] = edgesAssignmentNames[key];
});
const assignmentFlatDegrees = {
	B: 0,
	b: 0,
	M: -180,
	m: -180,
	V: 180,
	v: 180,
	F: 0,
	f: 0,
	J: 0,
	j: 0,
	C: 0,
	c: 0,
	U: 0,
	u: 0,
};
const assignmentCanBeFolded = {
	B: false,
	b: false,
	M: true,
	m: true,
	V: true,
	v: true,
	F: false,
	f: false,
	J: false,
	j: false,
	C: false,
	c: false,
	U: true,
	u: true,
};
const edgeAssignmentToFoldAngle = assignment => (
	assignmentFlatDegrees[assignment] || 0
);
const edgeFoldAngleToAssignment = (angle) => {
	if (angle > EPSILON) { return "V"; }
	if (angle < -EPSILON) { return "M"; }
	return "U";
};
const edgeFoldAngleIsFlat = angle => epsilonEqual(0, angle)
 || epsilonEqual(-180, angle)
 || epsilonEqual(180, angle);
const edgesFoldAngleAreAllFlat = ({ edges_foldAngle }) => {
	if (!edges_foldAngle) { return true; }
	for (let i = 0; i < edges_foldAngle.length; i += 1) {
		if (!edgeFoldAngleIsFlat(edges_foldAngle[i])) { return false; }
	}
	return true;
};
const filterKeys = (obj, matchFunction) => Object
	.keys(obj)
	.filter(key => matchFunction(key));
const filterKeysWithPrefix = (obj, prefix) => filterKeys(
	obj,
	s => s.substring(0, prefix.length + 1) === `${prefix}_`,
);
const filterKeysWithSuffix = (obj, suffix) => filterKeys(
	obj,
	s => s.substring(s.length - suffix.length - 1, s.length) === `_${suffix}`,
);
const transposeGraphArrays = (graph, geometry_key) => {
	const matching_keys = filterKeysWithPrefix(graph, geometry_key);
	if (matching_keys.length === 0) { return []; }
	const len = Math.max(...matching_keys.map(arr => graph[arr].length));
	const geometry = Array.from(Array(len))
		.map(() => ({}));
	matching_keys
		.forEach(key => geometry
			.forEach((o, i) => { geometry[i][key] = graph[key][i]; }));
	return geometry;
};
const transposeGraphArrayAtIndex = (
	graph,
	geometry_key,
	index,
) => {
	const matching_keys = filterKeysWithPrefix(graph, geometry_key);
	if (matching_keys.length === 0) { return undefined; }
	const geometry = {};
	matching_keys.forEach((key) => { geometry[key] = graph[key][index]; });
	return geometry;
};
const flatFoldKeys = Object.freeze([]
	.concat(foldKeys.file)
	.concat(foldKeys.frame)
	.concat(foldKeys.graph)
	.concat(foldKeys.orders));
const isFoldObject = (object = {}) => (
	Object.keys(object).length === 0
		? 0
		: flatFoldKeys
			.filter(key => object[key]).length / Object.keys(object).length);
const isFoldedForm = ({ frame_classes, file_classes }) => (
	(frame_classes && frame_classes.includes("foldedForm"))
		|| (file_classes && file_classes.includes("foldedForm"))
);
const makeEdgesIsFolded = ({ edges_vertices, edges_foldAngle, edges_assignment }) => {
	if (edges_assignment === undefined) {
		return edges_foldAngle === undefined
			? edges_vertices.map(() => true)
			: edges_foldAngle.map(angle => angle < -EPSILON || angle > EPSILON);
	}
	return edges_assignment.map(a => assignmentCanBeFolded[a]);
};
const invertAssignments = (graph) => {
	const flipAssignment = { M: "V", m: "v", V: "M", v: "m" };
	if (graph.edges_assignment) {
		graph.edges_assignment = graph.edges_assignment
			.map(a => (flipAssignment[a] ? flipAssignment[a] : a));
	}
	if (graph.edges_foldAngle) {
		graph.edges_foldAngle = graph.edges_foldAngle.map(n => -n);
	}
	return graph;
};const foldSpecMethods=/*#__PURE__*/Object.freeze({__proto__:null,edgeAssignmentToFoldAngle,edgeFoldAngleIsFlat,edgeFoldAngleToAssignment,edgesAssignmentNames,edgesAssignmentValues,edgesFoldAngleAreAllFlat,filterKeysWithPrefix,filterKeysWithSuffix,invertAssignments,isFoldObject,isFoldedForm,makeEdgesIsFolded,pluralize,singularize,transposeGraphArrayAtIndex,transposeGraphArrays});const array_in_array_max_number = (arrays) => {
	let max = -1;
	arrays
		.filter(a => a !== undefined)
		.forEach(arr => arr
			.forEach(el => el
				.forEach((e) => {
					if (e > max) { max = e; }
				})));
	return max;
};
const max_num_in_orders = (array) => {
	let max = -1;
	array.forEach(el => {
		if (el[0] > max) { max = el[0]; }
		if (el[1] > max) { max = el[1]; }
	});
	return max;
};
const ordersArrayNames = {
	edges: "edgeOrders",
	faces: "faceOrders",
};
const countImplied = (graph, key) => Math.max(
	array_in_array_max_number(
		filterKeysWithSuffix(graph, key).map(str => graph[str]),
	),
	graph[ordersArrayNames[key]]
		? max_num_in_orders(graph[ordersArrayNames[key]])
		: -1,
) + 1;
countImplied.vertices = graph => countImplied(graph, _vertices);
countImplied.edges = graph => countImplied(graph, _edges);
countImplied.faces = graph => countImplied(graph, _faces);const counterClockwiseWalk = ({
	vertices_vertices, vertices_sectors,
}, v0, v1, walked_edges = {}) => {
	const this_walked_edges = {};
	const face = { vertices: [v0], edges: [], angles: [] };
	let prev_vertex = v0;
	let this_vertex = v1;
	while (true) {
		const v_v = vertices_vertices[this_vertex];
		const from_neighbor_i = v_v.indexOf(prev_vertex);
		const next_neighbor_i = (from_neighbor_i + v_v.length - 1) % v_v.length;
		const next_vertex = v_v[next_neighbor_i];
		const next_edge_vertices = `${this_vertex} ${next_vertex}`;
		if (this_walked_edges[next_edge_vertices]) {
			Object.assign(walked_edges, this_walked_edges);
			face.vertices.pop();
			return face;
		}
		this_walked_edges[next_edge_vertices] = true;
		if (walked_edges[next_edge_vertices]) {
			return undefined;
		}
		face.vertices.push(this_vertex);
		face.edges.push(next_edge_vertices);
		if (vertices_sectors) {
			face.angles.push(vertices_sectors[this_vertex][next_neighbor_i]);
		}
		prev_vertex = this_vertex;
		this_vertex = next_vertex;
	}
};
const planarVertexWalk = ({ vertices_vertices, vertices_sectors }) => {
	const graph = { vertices_vertices, vertices_sectors };
	const walked_edges = {};
	return vertices_vertices
		.map((adj_verts, v) => adj_verts
			.map(adj_vert => counterClockwiseWalk(graph, v, adj_vert, walked_edges))
			.filter(a => a !== undefined))
		.flat();
};
const filterWalkedBoundaryFace = walked_faces => walked_faces
	.filter(face => face.angles
		.map(a => Math.PI - a)
		.reduce((a, b) => a + b, 0) > 0);const walk=/*#__PURE__*/Object.freeze({__proto__:null,counterClockwiseWalk,filterWalkedBoundaryFace,planarVertexWalk});const smallestComparisonSearch = (array, obj, compare_func) => {
	const objs = array.map((o, i) => ({ i, d: compare_func(obj, o) }));
	let index;
	let smallest_value = Infinity;
	for (let i = 0; i < objs.length; i += 1) {
		if (objs[i].d < smallest_value) {
			index = i;
			smallest_value = objs[i].d;
		}
	}
	return index;
};
const smallestVectorSearch = (vectors, axis, compFn, epsilon) => {
	let smallSet = [0];
	for (let i = 1; i < vectors.length; i += 1) {
		switch (compFn(vectors[i][axis], vectors[smallSet[0]][axis], epsilon)) {
		case 0: smallSet.push(i); break;
		case 1: smallSet = [i]; break;
		}
	}
	return smallSet;
};
const minimum2DPointIndex = (points, epsilon = EPSILON) => {
	if (!points || !points.length) { return undefined; }
	const smallSet = smallestVectorSearch(points, 0, epsilonCompare, epsilon);
	let sm = 0;
	for (let i = 1; i < smallSet.length; i += 1) {
		if (points[smallSet[i]][1] < points[smallSet[sm]][1]) { sm = i; }
	}
	return smallSet[sm];
};const search=/*#__PURE__*/Object.freeze({__proto__:null,minimum2DPointIndex,smallestComparisonSearch});const sortAgainstItem = (array, item, compareFn) => array
	.map((el, i) => ({ i, n: compareFn(el, item) }))
	.sort((a, b) => a.n - b.n)
	.map(a => a.i);
const sortPointsAlongVector = (points, vector) => (
	sortAgainstItem(points, vector, dot)
);
const clusterIndicesOfSortedNumbers = (numbers, epsilon = EPSILON) => {
	const clusters = [[0]];
	let clusterIndex = 0;
	for (let i = 1; i < numbers.length; i += 1) {
		if (epsilonEqual(numbers[i], numbers[i - 1], epsilon)) {
			clusters[clusterIndex].push(i);
		} else {
			clusterIndex = clusters.length;
			clusters.push([i]);
		}
	}
	return clusters;
};
const radialSortPointIndices2 = (points, epsilon = EPSILON) => {
	const first = minimum2DPointIndex(points, epsilon);
	if (first === undefined) { return []; }
	const angles = points
		.map(p => subtract2(p, points[first]))
		.map(v => normalize2(v))
		.map(vec => dot2([0, 1], vec));
	const rawOrder = angles
		.map((a, i) => ({ a, i }))
		.sort((a, b) => a.a - b.a)
		.map(el => el.i)
		.filter(i => i !== first);
	return [[first]]
		.concat(clusterIndicesOfSortedNumbers(rawOrder.map(i => angles[i]), epsilon)
			.map(arr => arr.map(i => rawOrder[i]))
			.map(cluster => (cluster.length === 1 ? cluster : cluster
				.map(i => ({ i, len: distance2(points[i], points[first]) }))
				.sort((a, b) => a.len - b.len)
				.map(el => el.i))));
};const sort=/*#__PURE__*/Object.freeze({__proto__:null,clusterIndicesOfSortedNumbers,radialSortPointIndices2,sortAgainstItem,sortPointsAlongVector});const sortVerticesCounterClockwise = ({ vertices_coords }, vertices, vertex) => (
	vertices
		.map(v => vertices_coords[v])
		.map(coord => subtract(coord, vertices_coords[vertex]))
		.map(vec => Math.atan2(vec[1], vec[0]))
		.map(angle => (angle > -EPSILON ? angle : angle + Math.PI * 2))
		.map((a, i) => ({ a, i }))
		.sort((a, b) => a.a - b.a)
		.map(el => el.i)
		.map(i => vertices[i])
);
const sortVerticesAlongVector = ({ vertices_coords }, vertices, vector) => (
	sortPointsAlongVector(
		vertices.map(v => vertices_coords[v]),
		vector,
	).map(i => vertices[i])
);const sortMethods=/*#__PURE__*/Object.freeze({__proto__:null,sortVerticesAlongVector,sortVerticesCounterClockwise});const makeFacesNormal = ({ vertices_coords, faces_vertices }) => faces_vertices
	.map(vertices => vertices
		.map(vertex => vertices_coords[vertex]))
	.map(polygon => {
		const a = resize(3, subtract(polygon[1], polygon[0]));
		const b = resize(3, subtract(polygon[2], polygon[0]));
		return normalize3(cross3(a, b));
	});
const makeVerticesNormal = ({ vertices_coords, faces_vertices, faces_normal }) => {
	const add3 = (a, b) => { a[0] += b[0]; a[1] += b[1]; a[2] += b[2]; };
	if (!faces_normal) {
		faces_normal = makeFacesNormal({ vertices_coords, faces_vertices });
	}
	const vertices_normals = vertices_coords.map(() => [0, 0, 0]);
	faces_vertices
		.forEach((vertices, f) => vertices
			.forEach(v => add3(vertices_normals[v], faces_normal[f])));
	return vertices_normals.map(v => normalize3(v));
};const normals=/*#__PURE__*/Object.freeze({__proto__:null,makeFacesNormal,makeVerticesNormal});const makeVerticesEdgesUnsorted = ({ edges_vertices }) => {
	const vertices_edges = [];
	edges_vertices.forEach((ev, i) => ev
		.forEach((v) => {
			if (vertices_edges[v] === undefined) {
				vertices_edges[v] = [];
			}
			vertices_edges[v].push(i);
		}));
	return vertices_edges;
};
const makeVerticesEdges = ({ edges_vertices, vertices_vertices }) => {
	const edge_map = makeVerticesToEdgeBidirectional({ edges_vertices });
	return vertices_vertices
		.map((verts, i) => verts
			.map(v => edge_map[`${i} ${v}`]));
};
const makeVerticesVertices2D = ({ vertices_coords, vertices_edges, edges_vertices }) => {
	if (!vertices_edges) {
		vertices_edges = makeVerticesEdgesUnsorted({ edges_vertices });
	}
	const vertices_vertices = vertices_edges
		.map((edges, v) => edges
			.map(edge => edges_vertices[edge]
				.filter(i => i !== v))
			.reduce((a, b) => a.concat(b), []));
	return vertices_coords === undefined
		? vertices_vertices
		: vertices_vertices
			.map((verts, i) => sortVerticesCounterClockwise({ vertices_coords }, verts, i));
};
const makeVerticesVerticesFromFaces = ({
	vertices_coords, vertices_faces, faces_vertices,
}) => {
	if (!vertices_faces) {
		vertices_faces = makeVerticesFacesUnsorted({ vertices_coords, faces_vertices });
	}
	const vertices_faces_vertices = vertices_faces
		.map(faces => faces.map(f => faces_vertices[f]));
	const vertices_faces_indexOf = vertices_faces_vertices
		.map((faces, vertex) => faces.map(verts => verts.indexOf(vertex)));
	const vertices_faces_threeIndices = vertices_faces_vertices
		.map((faces, vertex) => faces.map((verts, j) => [
			(vertices_faces_indexOf[vertex][j] + verts.length - 1) % verts.length,
			vertices_faces_indexOf[vertex][j],
			(vertices_faces_indexOf[vertex][j] + 1) % verts.length,
		]));
	const vertices_faces_threeVerts = vertices_faces_threeIndices
		.map((faces, vertex) => faces
			.map((indices, j) => indices
				.map(index => vertices_faces_vertices[vertex][j][index])));
	const vertices_verticesLookup = vertices_faces_threeVerts.map(faces => {
		const facesVerts = faces
			.map(verts => [[0, 1], [1, 2]]
				.map(p => p.map(x => verts[x]).join(" ")));
		const from = {};
		const to = {};
		facesVerts.forEach((keys, i) => {
			from[keys[0]] = i;
			to[keys[1]] = i;
		});
		return { facesVerts, to, from };
	});
	return vertices_verticesLookup.map(lookup => {
		const toKeys = Object.keys(lookup.to);
		const toKeysInverse = toKeys
			.map(key => key.split(" ").reverse().join(" "));
		const holeKeys = toKeys
			.filter((_, i) => !(toKeysInverse[i] in lookup.from));
		if (holeKeys.length > 2) {
			console.warn("vertices_vertices found an unsolvable vertex");
			return [];
		}
		const startKeys = holeKeys.length
			? holeKeys
			: [toKeys[0]];
		const vertex_vertices = [];
		const visited = {};
		for (let s = 0; s < startKeys.length; s += 1) {
			const startKey = startKeys[s];
			const walk = [startKey];
			visited[startKey] = true;
			let isDone = false;
			do {
				const prev = walk[walk.length - 1];
				const faceIndex = lookup.to[prev];
				if (!(faceIndex in lookup.facesVerts)) { break; }
				let nextKey;
				if (lookup.facesVerts[faceIndex][0] === prev) {
					nextKey = lookup.facesVerts[faceIndex][1];
				}
				if (lookup.facesVerts[faceIndex][1] === prev) {
					nextKey = lookup.facesVerts[faceIndex][0];
				}
				if (nextKey === undefined) { return "not found"; }
				const nextKeyFlipped = nextKey.split(" ").reverse().join(" ");
				walk.push(nextKey);
				isDone = (nextKeyFlipped in visited);
				if (!isDone) { walk.push(nextKeyFlipped); }
				visited[nextKey] = true;
				visited[nextKeyFlipped] = true;
			} while (!isDone);
			const vertexKeys = walk
				.filter((_, i) => i % 2 === 0)
				.map(key => key.split(" ")[1])
				.map(str => parseInt(str, 10));
			vertex_vertices.push(...vertexKeys);
		}
		return vertex_vertices;
	});
};
const makeVerticesVertices = (graph) => {
	if (!graph.vertices_coords || !graph.vertices_coords.length) { return []; }
	switch (graph.vertices_coords[0].length) {
	case 3:
		return makeVerticesVerticesFromFaces(graph);
	default:
		return makeVerticesVertices2D(graph);
	}
};
const makeVerticesVerticesUnsorted = ({ vertices_edges, edges_vertices }) => {
	if (!vertices_edges) {
		vertices_edges = makeVerticesEdgesUnsorted({ edges_vertices });
	}
	return vertices_edges
		.map((edges, v) => edges
			.flatMap(edge => edges_vertices[edge].filter(i => i !== v)));
};
const makeVerticesFacesUnsorted = ({ vertices_coords, faces_vertices }) => {
	if (!faces_vertices) { return vertices_coords.map(() => []); }
	const vertices_faces = vertices_coords !== undefined
		? vertices_coords.map(() => [])
		: Array.from(Array(countImplied.vertices({ faces_vertices }))).map(() => []);
	faces_vertices.forEach((face, f) => {
		const hash = [];
		face.forEach((vertex) => { hash[vertex] = f; });
		hash.forEach((fa, v) => vertices_faces[v].push(fa));
	});
	return vertices_faces;
};
const makeVerticesFaces = ({ vertices_coords, vertices_vertices, faces_vertices }) => {
	if (!faces_vertices) { return vertices_coords.map(() => []); }
	if (!vertices_vertices) {
		return makeVerticesFacesUnsorted({ vertices_coords, faces_vertices });
	}
	const face_map = makeVerticesToFace({ faces_vertices });
	return vertices_vertices
		.map((verts, v) => verts
			.map((vert, i, arr) => [arr[(i + 1) % arr.length], v, vert]
				.join(" ")))
		.map(keys => keys
			.map(key => face_map[key]));
};
const makeVerticesToEdgeBidirectional = ({ edges_vertices }) => {
	const map = {};
	edges_vertices
		.map(ev => ev.join(" "))
		.forEach((key, i) => { map[key] = i; });
	edges_vertices
		.map(ev => `${ev[1]} ${ev[0]}`)
		.forEach((key, i) => { map[key] = i; });
	return map;
};
const makeVerticesToEdge = ({ edges_vertices }) => {
	const map = {};
	edges_vertices
		.map(ev => ev.join(" "))
		.forEach((key, i) => { map[key] = i; });
	return map;
};
const makeVerticesToFace = ({ faces_vertices }) => {
	const map = {};
	faces_vertices
		.forEach((face, f) => face
			.map((_, i) => [0, 1, 2]
				.map(j => (i + j) % face.length)
				.map(n => face[n])
				.join(" "))
			.forEach(key => { map[key] = f; }));
	return map;
};
const makeVerticesVerticesVector = ({
	vertices_coords, vertices_vertices, edges_vertices, edges_vector,
}) => {
	if (!edges_vector) {
		edges_vector = makeEdgesVector({ vertices_coords, edges_vertices });
	}
	const edge_map = makeVerticesToEdge({ edges_vertices });
	return vertices_vertices
		.map((_, a) => vertices_vertices[a]
			.map((b) => {
				const edge_a = edge_map[`${a} ${b}`];
				const edge_b = edge_map[`${b} ${a}`];
				if (edge_a !== undefined) { return edges_vector[edge_a]; }
				if (edge_b !== undefined) { return flip(edges_vector[edge_b]); }
			}));
};
const makeVerticesSectors = ({
	vertices_coords, vertices_vertices, edges_vertices, edges_vector,
}) => makeVerticesVerticesVector({
	vertices_coords, vertices_vertices, edges_vertices, edges_vector,
})
	.map(vectors => (vectors.length === 1
		? [TWO_PI]
		: counterClockwiseSectors2(vectors)));
const makeEdgesEdges = ({ edges_vertices, vertices_edges }) =>
	edges_vertices.map((verts, i) => {
		const side0 = vertices_edges[verts[0]].filter(e => e !== i);
		const side1 = vertices_edges[verts[1]].filter(e => e !== i);
		return side0.concat(side1);
	});
const makeEdgesFacesUnsorted = ({ edges_vertices, faces_edges }) => {
	const edges_faces = edges_vertices !== undefined
		? edges_vertices.map(() => [])
		: Array.from(Array(countImplied.edges({ faces_edges }))).map(() => []);
	faces_edges.forEach((face, f) => {
		const hash = [];
		face.forEach((edge) => { hash[edge] = f; });
		hash.forEach((fa, e) => edges_faces[e].push(fa));
	});
	return edges_faces;
};
const makeEdgesFaces = ({
	vertices_coords, edges_vertices, edges_vector, faces_vertices, faces_edges, faces_center,
}) => {
	if (!edges_vertices || (!faces_vertices && !faces_edges)) {
		return makeEdgesFacesUnsorted({ faces_edges });
	}
	if (!faces_vertices) {
		faces_vertices = makeFacesVerticesFromEdges({ edges_vertices, faces_edges });
	}
	if (!faces_edges) {
		faces_edges = makeFacesEdgesFromVertices({ edges_vertices, faces_vertices });
	}
	if (!edges_vector) {
		edges_vector = makeEdgesVector({ vertices_coords, edges_vertices });
	}
	const edges_origin = edges_vertices.map(pair => vertices_coords[pair[0]]);
	if (!faces_center) {
		faces_center = makeFacesConvexCenter({ vertices_coords, faces_vertices });
	}
	const edges_faces = edges_vertices.map(() => []);
	faces_edges.forEach((face, f) => {
		const hash = [];
		face.forEach((edge) => { hash[edge] = f; });
		hash.forEach((fa, e) => edges_faces[e].push(fa));
	});
	edges_faces.forEach((faces, e) => {
		const faces_cross = faces
			.map(f => faces_center[f])
			.map(center => subtract2(center, edges_origin[e]))
			.map(vector => cross2(vector, edges_vector[e]));
		faces.sort((a, b) => faces_cross[a] - faces_cross[b]);
	});
	return edges_faces;
};
const assignment_angles = {
	M: -180, m: -180, V: 180, v: 180,
};
const makeEdgesAssignmentSimple = ({ edges_foldAngle }) => edges_foldAngle
	.map(a => {
		if (a === 0) { return "F"; }
		return a < 0 ? "M" : "V";
	});
const makeEdgesAssignment = ({
	edges_vertices, edges_foldAngle, edges_faces, faces_vertices, faces_edges,
}) => {
	if (!edges_faces) {
		if (!faces_edges) {
			faces_edges = makeFacesEdgesFromVertices({ edges_vertices, faces_vertices });
		}
		edges_faces = makeEdgesFacesUnsorted({ edges_vertices, faces_edges });
	}
	return edges_foldAngle.map((a, i) => {
		if (edges_faces[i].length < 2) { return "B"; }
		if (a === 0) { return "F"; }
		return a < 0 ? "M" : "V";
	});
};
const makeEdgesFoldAngle = ({ edges_assignment }) => edges_assignment
	.map(a => assignment_angles[a] || 0);
const makeEdgesFoldAngleFromFaces = ({
	vertices_coords,
	edges_vertices,
	edges_faces,
	edges_assignment,
	faces_vertices,
	faces_edges,
	faces_normal,
	faces_center,
}) => {
	if (!edges_faces) {
		if (!faces_edges) {
			faces_edges = makeFacesEdgesFromVertices({ edges_vertices, faces_vertices });
		}
		edges_faces = makeEdgesFacesUnsorted({ edges_vertices, faces_edges });
	}
	if (!faces_normal) {
		faces_normal = makeFacesNormal({ vertices_coords, faces_vertices });
	}
	if (!faces_center) {
		faces_center = makeFacesConvexCenter({ vertices_coords, faces_vertices });
	}
	return edges_faces.map((faces, e) => {
		if (faces.length > 2) { throw new Error(Messages$1.manifold); }
		if (faces.length < 2) { return 0; }
		const a = faces_normal[faces[0]];
		const b = faces_normal[faces[1]];
		const a2b = normalize(subtract(
			faces_center[faces[1]],
			faces_center[faces[0]],
		));
		let sign = Math.sign(dot(a, a2b));
		if (sign === 0) {
			if (edges_assignment && edges_assignment[e]) {
				if (edges_assignment[e] === "F" || edges_assignment[e] === "F") { sign = 0; }
				if (edges_assignment[e] === "M" || edges_assignment[e] === "m") { sign = -1; }
				if (edges_assignment[e] === "V" || edges_assignment[e] === "v") { sign = 1; }
			} else {
				throw new Error(Messages$1.flatFoldAngles);
			}
		}
		return (Math.acos(dot(a, b)) * (180 / Math.PI)) * sign;
	});
};
const makeEdgesCoords = ({ vertices_coords, edges_vertices }) => edges_vertices
	.map(ev => ev.map(v => vertices_coords[v]));
const makeEdgesVector = ({ vertices_coords, edges_vertices }) => makeEdgesCoords({
	vertices_coords, edges_vertices,
}).map(verts => subtract(verts[1], verts[0]));
const makeEdgesLength = ({ vertices_coords, edges_vertices }) => makeEdgesVector({
	vertices_coords, edges_vertices,
}).map(vec => magnitude(vec));
const makeEdgesBoundingBox = ({
	vertices_coords, edges_vertices, edges_coords,
}, epsilon = 0) => {
	if (!edges_coords) {
		edges_coords = makeEdgesCoords({ vertices_coords, edges_vertices });
	}
	return edges_coords.map(coords => boundingBox$1(coords, epsilon));
};
const makePlanarFaces = ({
	vertices_coords, vertices_vertices, vertices_edges,
	vertices_sectors, edges_vertices, edges_vector,
}) => {
	if (!vertices_vertices) {
		vertices_vertices = makeVerticesVertices({ vertices_coords, edges_vertices, vertices_edges });
	}
	if (!vertices_sectors) {
		vertices_sectors = makeVerticesSectors({
			vertices_coords, vertices_vertices, edges_vertices, edges_vector,
		});
	}
	const vertices_edges_map = makeVerticesToEdgeBidirectional({ edges_vertices });
	return filterWalkedBoundaryFace(planarVertexWalk({
		vertices_vertices, vertices_sectors,
	})).map(f => ({ ...f, edges: f.edges.map(e => vertices_edges_map[e]) }));
};
const makeFacesVerticesFromEdges = ({ edges_vertices, faces_edges }) => faces_edges
	.map(edges => edges
		.map(edge => edges_vertices[edge])
		.map((pairs, i, arr) => {
			const next = arr[(i + 1) % arr.length];
			return (pairs[0] === next[0] || pairs[0] === next[1])
				? pairs[1]
				: pairs[0];
		}));
const makeFacesEdgesFromVertices = ({ edges_vertices, faces_vertices }) => {
	const map = makeVerticesToEdgeBidirectional({ edges_vertices });
	return faces_vertices
		.map(face => face
			.map((v, i, arr) => [v, arr[(i + 1) % arr.length]].join(" ")))
		.map(face => face.map(pair => map[pair]));
};
const makeFacesFaces = ({ faces_vertices }) => {
	const faces_faces = faces_vertices.map(() => []);
	const edgeMap = {};
	faces_vertices
		.forEach((face, f) => face
			.forEach((v0, i, arr) => {
				let v1 = arr[(i + 1) % face.length];
				if (v1 < v0) { [v0, v1] = [v1, v0]; }
				const key = `${v0} ${v1}`;
				if (edgeMap[key] === undefined) { edgeMap[key] = {}; }
				edgeMap[key][f] = true;
			}));
	Object.values(edgeMap)
		.map(obj => Object.keys(obj))
		.filter(arr => arr.length > 1)
		.forEach(pair => {
			faces_faces[pair[0]].push(parseInt(pair[1], 10));
			faces_faces[pair[1]].push(parseInt(pair[0], 10));
		});
	return faces_faces;
};
const makeFacesPolygon = ({ vertices_coords, faces_vertices }, epsilon) => faces_vertices
	.map(verts => verts.map(v => vertices_coords[v]))
	.map(polygon => makePolygonNonCollinear(polygon, epsilon));
const makeFacesPolygonQuick = ({ vertices_coords, faces_vertices }) => faces_vertices
	.map(verts => verts.map(v => vertices_coords[v]));
const makeFacesCenter2D = ({ vertices_coords, faces_vertices }) => faces_vertices
	.map(fv => fv.map(v => vertices_coords[v]))
	.map(coords => centroid(coords));
const makeFacesConvexCenter = ({ vertices_coords, faces_vertices }) => faces_vertices
	.map(vertices => vertices
		.map(v => vertices_coords[v])
		.reduce((a, b) => add(a, b), Array(vertices_coords[0].length).fill(0))
		.map(el => el / vertices.length));const make=/*#__PURE__*/Object.freeze({__proto__:null,makeEdgesAssignment,makeEdgesAssignmentSimple,makeEdgesBoundingBox,makeEdgesCoords,makeEdgesEdges,makeEdgesFaces,makeEdgesFacesUnsorted,makeEdgesFoldAngle,makeEdgesFoldAngleFromFaces,makeEdgesLength,makeEdgesVector,makeFacesCenter2D,makeFacesConvexCenter,makeFacesEdgesFromVertices,makeFacesFaces,makeFacesPolygon,makeFacesPolygonQuick,makeFacesVerticesFromEdges,makePlanarFaces,makeVerticesEdges,makeVerticesEdgesUnsorted,makeVerticesFaces,makeVerticesFacesUnsorted,makeVerticesSectors,makeVerticesToEdge,makeVerticesToEdgeBidirectional,makeVerticesToFace,makeVerticesVertices,makeVerticesVertices2D,makeVerticesVerticesFromFaces,makeVerticesVerticesUnsorted,makeVerticesVerticesVector});const file_spec = 1.1;
const file_creator = "Rabbit Ear";const newFoldFile = () => {
	const graph = {};
	graph.file_spec = file_spec;
	graph.file_creator = file_creator;
	graph.file_classes = ["singleModel"];
	graph.frame_classes = [];
	graph.frame_attributes = [];
	graph.vertices_coords = [];
	graph.faces_vertices = [];
	return graph;
};
const updateMetadata = (graph) => {
	if (!graph.edges_foldAngle || !graph.edges_foldAngle.length) { return; }
	let is2D = true;
	for (let i = 0; i < graph.edges_foldAngle.length; i += 1) {
		if (graph.edges_foldAngle[i] !== 0
			&& graph.edges_foldAngle[i] !== -180
			&& graph.edges_foldAngle[i] !== 180) {
			is2D = false;
			break;
		}
	}
	graph.frame_classes.push(is2D ? "creasePattern" : "foldedForm");
	graph.frame_attributes.push(is2D ? "2D" : "3D");
};
const pairify = (list) => list.map((val, i, arr) => [val, arr[(i + 1) % arr.length]]);
const makeEdgesVertices = ({ faces_vertices }) => {
	const edgeExists = {};
	const edges_vertices = [];
	faces_vertices
		.flatMap(pairify)
		.forEach(edge => {
			const keys = [edge.join(" "), `${edge[1]} ${edge[0]}`];
			if (keys[0] in edgeExists || keys[1] in edgeExists) { return; }
			edges_vertices.push(edge);
			edgeExists[keys[0]] = true;
		});
	return edges_vertices;
};
const parseFace = (face) => face
	.slice(1)
	.map(str => parseInt(str, 10) - 1);
const parseVertex = (vertex) => vertex
	.slice(1)
	.map(str => parseFloat(str));
const objToFold = (file) => {
	const lines = file.split("\n").map(line => line.trim().split(/\s+/));
	const graph = newFoldFile();
	for (let i = 0; i < lines.length; i += 1) {
		switch (lines[i][0].toLowerCase()) {
		case "f": graph.faces_vertices.push(parseFace(lines[i])); break;
		case "v": graph.vertices_coords.push(parseVertex(lines[i])); break;
		}
	}
	graph.faces_normal = makeFacesNormal(graph);
	graph.faces_center = makeFacesConvexCenter(graph);
	graph.edges_vertices = makeEdgesVertices(graph);
	graph.faces_edges = makeFacesEdgesFromVertices(graph);
	graph.edges_faces = makeEdgesFacesUnsorted(graph);
	graph.edges_foldAngle = makeEdgesFoldAngleFromFaces(graph);
	graph.edges_assignment = makeEdgesAssignment(graph);
	graph.vertices_vertices = makeVerticesVerticesFromFaces(graph);
	delete graph.faces_normal;
	delete graph.faces_center;
	delete graph.edges_faces;
	updateMetadata(graph);
	return graph;
};const verticesClusters = ({ vertices_coords }, epsilon = EPSILON) => {
	if (!vertices_coords) { return []; }
	const clusters = [];
	const finished = [];
	const vertices = vertices_coords
		.map((point, i) => ({ i, d: point[0] }))
		.sort((a, b) => a.d - b.d)
		.map(a => a.i);
	let rangeStart = 0;
	let yRange = [0, 0];
	let xRange = [0, 0];
	const isInsideCluster = (index) => (
		vertices_coords[index][0] > xRange[0]
		&& vertices_coords[index][0] < xRange[1]
		&& vertices_coords[index][1] > yRange[0]
		&& vertices_coords[index][1] < yRange[1]
	);
	const updateRange = (cluster) => {
		const newVertex = cluster[cluster.length - 1];
		while (vertices_coords[newVertex] - vertices_coords[cluster[rangeStart]] > epsilon) {
			rangeStart += 1;
		}
		const points = cluster.slice(rangeStart, cluster.length)
			.map(v => vertices_coords[v]);
		const ys = points.map(p => p[1]);
		yRange = [Math.min(...ys) - epsilon, Math.max(...ys) + epsilon];
		xRange = [points[0][0] - epsilon, points[points.length - 1][0] + epsilon];
	};
	while (finished.length !== vertices_coords.length) {
		const cluster = [];
		const startVertex = vertices.shift();
		cluster.push(startVertex);
		finished.push(startVertex);
		rangeStart = 0;
		updateRange(cluster);
		let walk = 0;
		while (walk < vertices.length && vertices_coords[vertices[walk]][0] < xRange[1]) {
			if (isInsideCluster(vertices[walk])) {
				const newVertex = vertices.splice(walk, 1).shift();
				cluster.push(newVertex);
				finished.push(newVertex);
				updateRange(cluster);
			} else {
				walk += 1;
			}
		}
		clusters.push(cluster);
	}
	return clusters;
};const verticesClusters$1=/*#__PURE__*/Object.freeze({__proto__:null,verticesClusters});const max_arrays_length = (...arrays) => Math.max(0, ...(arrays
	.filter(el => el !== undefined)
	.map(el => el.length)));
const count = (graph, key) => (
	max_arrays_length(...filterKeysWithPrefix(graph, key).map(k => graph[k])));
count.vertices = ({ vertices_coords, vertices_faces, vertices_vertices }) => (
	max_arrays_length(vertices_coords, vertices_faces, vertices_vertices));
count.edges = ({ edges_vertices, edges_edges, edges_faces }) => (
	max_arrays_length(edges_vertices, edges_edges, edges_faces));
count.faces = ({ faces_vertices, faces_edges, faces_faces }) => (
	max_arrays_length(faces_vertices, faces_edges, faces_faces));const uniqueElements = (array) => Array.from(new Set(array));
const nonUniqueElements = (array) => {
	const count = {};
	array.forEach(n => {
		if (count[n] === undefined) { count[n] = 0; }
		count[n] += 1;
	});
	return array.filter(n => count[n] > 1);
};
const uniqueSortedNumbers = (array) => uniqueElements(array)
	.sort((a, b) => a - b);
const splitCircularArray = (array, indices) => {
	indices.sort((a, b) => a - b);
	return [
		array.slice(indices[1]).concat(array.slice(0, indices[0] + 1)),
		array.slice(indices[0], indices[1] + 1),
	];
};
const booleanMatrixToIndexedArray = matrix => matrix
	.map(row => row
		.map((value, i) => (value === true ? i : undefined))
		.filter(a => a !== undefined));
const booleanMatrixToUniqueIndexPairs = matrix => {
	const pairs = [];
	for (let i = 0; i < matrix.length - 1; i += 1) {
		for (let j = i + 1; j < matrix.length; j += 1) {
			if (matrix[i][j]) {
				pairs.push([i, j]);
			}
		}
	}
	return pairs;
};
const selfRelationalUniqueIndexPairs = (array_array) => {
	const circular = [];
	const pairs = [];
	array_array.forEach((arr, i) => arr.forEach(j => {
		if (i < j) { pairs.push([i, j]); }
		if (i === j && !circular[i]) {
			circular[i] = true;
			pairs.push([i, j]);
		}
	}));
	return pairs;
};
const clusterScalars = (floats, epsilon = EPSILON) => {
	const indices = floats
		.map((v, i) => ({ v, i }))
		.sort((a, b) => a.v - b.v)
		.map(el => el.i);
	const groups = [[indices[0]]];
	for (let i = 1; i < indices.length; i += 1) {
		const index = indices[i];
		const g = groups.length - 1;
		const prev = groups[g][groups[g].length - 1];
		if (Math.abs(floats[prev] - floats[index]) < epsilon) {
			groups[g].push(index);
		} else {
			groups.push([index]);
		}
	}
	return groups;
};
const chooseTwoPairs = (array) => {
	const pairs = Array((array.length * (array.length - 1)) / 2);
	let index = 0;
	for (let i = 0; i < array.length - 1; i += 1) {
		for (let j = i + 1; j < array.length; j += 1, index += 1) {
			pairs[index] = [array[i], array[j]];
		}
	}
	return pairs;
};const arrays=/*#__PURE__*/Object.freeze({__proto__:null,booleanMatrixToIndexedArray,booleanMatrixToUniqueIndexPairs,chooseTwoPairs,clusterScalars,nonUniqueElements,selfRelationalUniqueIndexPairs,splitCircularArray,uniqueElements,uniqueSortedNumbers});const replaceGeometryIndices = (graph, key, replaceIndices) => {
	const geometry_array_size = count(graph, key);
	let didModify = false;
	Object.entries(replaceIndices)
		.filter(([index, value]) => index < value)
		.forEach(([index, value]) => {
			didModify = true;
			delete replaceIndices[index];
			replaceIndices[value] = index;
		});
	if (didModify) {
		console.warn(Messages$1.replaceModifyParam);
	}
	const removes = Object.keys(replaceIndices).map(n => parseInt(n, 10));
	const replaces = uniqueSortedNumbers(removes);
	const index_map = [];
	for (let i = 0, j = 0, walk = 0; i < geometry_array_size; i += 1, j += 1) {
		while (i === replaces[walk]) {
			index_map[i] = index_map[replaceIndices[replaces[walk]]];
			if (index_map[i] === undefined) {
				throw new Error(Messages$1.replaceUndefined);
			}
			i += 1;
			walk += 1;
		}
		if (i < geometry_array_size) { index_map[i] = j; }
	}
	filterKeysWithSuffix(graph, key)
		.forEach(sKey => graph[sKey]
			.forEach((_, ii) => graph[sKey][ii]
				.forEach((v, jj) => { graph[sKey][ii][jj] = index_map[v]; })));
	replaces.reverse();
	filterKeysWithPrefix(graph, key)
		.forEach((prefix_key) => replaces
			.forEach(index => graph[prefix_key]
				.splice(index, 1)));
	return index_map;
};const duplicateVertices = (graph, epsilon) => (
	verticesClusters(graph, epsilon)
		.filter(arr => arr.length > 1)
);
const removeDuplicateVertices = (graph, epsilon = EPSILON) => {
	const replace_indices = [];
	const remove_indices = [];
	const clusters = verticesClusters(graph, epsilon)
		.filter(arr => arr.length > 1);
	clusters.forEach(cluster => {
		if (Math.min(...cluster) !== cluster[0]) {
			cluster.sort((a, b) => a - b);
		}
		for (let i = 1; i < cluster.length; i += 1) {
			replace_indices[cluster[i]] = cluster[0];
			remove_indices.push(cluster[i]);
		}
	});
	clusters
		.map(arr => arr.map(i => graph.vertices_coords[i]))
		.map(arr => average(...arr))
		.forEach((point, i) => { graph.vertices_coords[clusters[i][0]] = point; });
	return {
		map: replaceGeometryIndices(graph, S._vertices, replace_indices),
		remove: remove_indices,
	};
};const verticesDuplicate=/*#__PURE__*/Object.freeze({__proto__:null,duplicateVertices,removeDuplicateVertices});const getContainingValue = (oripa, value) => Array
	.from(oripa.children)
	.filter(el => el.attributes.length && Array.from(el.attributes)
		.filter(attr => attr.nodeValue === value)
		.shift() !== undefined)
	.shift();
const getMetadataValue = (oripa, value) => {
	const parentNode = getContainingValue(oripa, value);
	const node = parentNode
		? Array.from(parentNode.children).shift()
		: null;
	return node
		? node.textContent
		: undefined;
};
const getLines = (oripa) => {
	const linesParent = getContainingValue(oripa, "lines");
	const linesNode = linesParent
		? Array.from(linesParent.children)
			.filter(el => el.className === "oripa.OriLineProxy")
			.shift()
		: undefined;
	return linesNode ? Array.from(linesNode.children) : [];
};
const nullXMLValue = { children: [{ textContent: "0" }] };
const parseLines = (lines) => lines.map(line => {
	const attributes = Array.from(line.children[0].children);
	return ["type", "x0", "x1", "y0", "y1"]
		.map(key => parseFloat((attributes
			.filter(el => el.attributes[0].nodeValue === key)
			.shift() || nullXMLValue)
			.children[0]
			.textContent));
});
const opxAssignment = ["F", "B", "M", "V", "U"];
const makeFOLD = (lines, epsilon) => {
	const fold = {};
	fold.vertices_coords = lines
		.flatMap(line => [[line[1], line[3]], [line[2], line[4]]]);
	fold.edges_vertices = lines.map((_, i) => [i * 2, i * 2 + 1]);
	fold.edges_assignment = lines.map(line => opxAssignment[line[0]]);
	fold.edges_foldAngle = makeEdgesFoldAngle(fold);
	if (epsilon === undefined) {
		const { span } = boundingBox$1(fold.vertices_coords);
		epsilon = Math.min(...span) * 1e-6;
	}
	removeDuplicateVertices(fold, epsilon);
	fold.vertices_vertices = makeVerticesVertices(fold);
	const faces = makePlanarFaces(fold);
	fold.faces_vertices = faces.map(el => el.vertices);
	fold.faces_edges = faces.map(el => el.edges);
	return fold;
};
const setMetadata = (oripa, fold) => {
	const metadata = {
		file_description: "memo",
		file_author: "originalAuthorName",
		file_title: "title",
	};
	Object.keys(metadata).forEach(key => {
		metadata[key] = getMetadataValue(oripa, metadata[key]);
	});
	Object.keys(metadata)
		.filter(key => metadata[key])
		.forEach(key => { fold[key] = metadata[key]; });
	fold.file_classes = ["singleModel"];
	fold.frame_classes = ["creasePattern"];
};
const opxToFold = (file, epsilon) => {
	try {
		const parsed = (new (RabbitEarWindow().DOMParser)()).parseFromString(file, "text/xml");
		const oripa = Array.from(parsed.documentElement.children)
			.filter(el => Array.from(el.classList).includes("oripa.DataSet"))
			.shift();
		const fold = makeFOLD(parseLines(getLines(oripa)), epsilon);
		setMetadata(oripa, fold);
		return fold;
	} catch (error) {
		console.error(error);
	}
	return undefined;
};const xmlStringToDOM = (input, mimeType = "text/xml") => (
	new (RabbitEarWindow().DOMParser)()
).parseFromString(input, mimeType).documentElement;
const flattenDomTree = (el) => (el.children == null || !el.children.length
	? [el]
	: Array.from(el.children)
		.flatMap(child => flattenDomTree(child)));
const getRootParent = (el) => {
	let parent = el;
	while (parent.parentNode != null) {
		parent = parent.parentNode;
	}
	return parent;
};const getStylesheetStyle = (key, nodeName, attributes, sheets = []) => {
	const classes = attributes.class
		? attributes.class
			.split(/\s/)
			.filter(Boolean)
			.map(i => i.trim())
			.map(str => `.${str}`)
		: [];
	const id = attributes.id
		? `#${attributes.id}`
		: null;
	if (id) {
		for (let s = 0; s < sheets.length; s += 1) {
			if (sheets[s][id] && sheets[s][id][key]) {
				return sheets[s][id][key];
			}
		}
	}
	for (let s = 0; s < sheets.length; s += 1) {
		for (let c = 0; c < classes.length; c += 1) {
			if (sheets[s][classes[c]] && sheets[s][classes[c]][key]) {
				return sheets[s][classes[c]][key];
			}
		}
		if (sheets[s][nodeName] && sheets[s][nodeName][key]) {
			return sheets[s][nodeName][key];
		}
	}
	return undefined;
};
const getAttributeValue = (key, nodeName, attributes, sheets = []) => {
	const inlineStyle = attributes.style
		? attributes.style.match(new RegExp(`${key}[\\s]*:[^;]*;`))
		: null;
	if (inlineStyle) {
		return inlineStyle[0].split(":")[1].replace(";", "");
	}
	const sheetResult = getStylesheetStyle(key, nodeName, attributes, sheets);
	if (sheetResult !== undefined) { return sheetResult; }
	if (attributes[key]) { return attributes[key]; }
	return null;
};const geometryAttributes = {
	attrs: {
		line: { x1: 1, y1: 1, x2: 1, y2: 1 },
		rect: { x: 1, y: 1, width: 1, height: 1 },
		circle: { cx: 1, cy: 1, r: 1 },
		ellipse: { cx: 1, cy: 1, rx: 1, ry: 1 },
		polygon: { points: 1 },
		polyline: { points: 1 },
		path: { d: 1 },
	},
};const pointsStringToArray = str => {
	const list = str
		.split(/[\s,]+/)
		.map(n => parseFloat(n));
	return Array
		.from(Array(Math.floor(list.length / 2)))
		.map((_, i) => [list[i * 2 + 0], list[i * 2 + 1]]);
};
const getAttributesFloatValue = (element, attributes) => attributes
	.map(attr => element.getAttribute(attr))
	.map(str => (str == null ? "0" : str))
	.map(parseFloat);const LineToSegments = (line) => [
	getAttributesFloatValue(line, ["x1", "y1", "x2", "y2"]),
];const RectToSegments = function (rect) {
	const [x, y, w, h] = getAttributesFloatValue(
		rect,
		["x", "y", "width", "height"],
	);
	return [
		[x, y, x + w, y],
		[x + w, y, x + w, y + h],
		[x + w, y + h, x, y + h],
		[x, y + h, x, y],
	];
};const PolygonToSegments = (poly) => (
	pointsStringToArray(poly.getAttribute("points") || "")
		.map((_, i, arr) => [
			arr[i][0],
			arr[i][1],
			arr[(i + 1) % arr.length][0],
			arr[(i + 1) % arr.length][1],
		])
);const PolylineToSegments = function (polyline) {
	const circularPath = PolygonToSegments(polyline);
	circularPath.pop();
	return circularPath;
};const straightPathLines = {
	L: true, V: true, H: true, Z: true,
};
const PathToSegments = (path) => root.svg.core
	.parsePathCommandsEndpoints(path.getAttribute("d") || "")
	.filter(command => straightPathLines[command.command.toUpperCase()])
	.map(el => [el.start, el.end])
	.filter(seg => !epsilonEqualVectors(...seg))
	.map(seg => seg.flat());const parsers = {
	line: LineToSegments,
	rect: RectToSegments,
	polygon: PolygonToSegments,
	polyline: PolylineToSegments,
	path: PathToSegments,
};const cssColors = {
	black: "#000000",
	silver: "#c0c0c0",
	gray: "#808080",
	white: "#ffffff",
	maroon: "#800000",
	red: "#ff0000",
	purple: "#800080",
	fuchsia: "#ff00ff",
	green: "#008000",
	lime: "#00ff00",
	olive: "#808000",
	yellow: "#ffff00",
	navy: "#000080",
	blue: "#0000ff",
	teal: "#008080",
	aqua: "#00ffff",
	orange: "#ffa500",
	aliceblue: "#f0f8ff",
	antiquewhite: "#faebd7",
	aquamarine: "#7fffd4",
	azure: "#f0ffff",
	beige: "#f5f5dc",
	bisque: "#ffe4c4",
	blanchedalmond: "#ffebcd",
	blueviolet: "#8a2be2",
	brown: "#a52a2a",
	burlywood: "#deb887",
	cadetblue: "#5f9ea0",
	chartreuse: "#7fff00",
	chocolate: "#d2691e",
	coral: "#ff7f50",
	cornflowerblue: "#6495ed",
	cornsilk: "#fff8dc",
	crimson: "#dc143c",
	cyan: "#00ffff",
	darkblue: "#00008b",
	darkcyan: "#008b8b",
	darkgoldenrod: "#b8860b",
	darkgray: "#a9a9a9",
	darkgreen: "#006400",
	darkgrey: "#a9a9a9",
	darkkhaki: "#bdb76b",
	darkmagenta: "#8b008b",
	darkolivegreen: "#556b2f",
	darkorange: "#ff8c00",
	darkorchid: "#9932cc",
	darkred: "#8b0000",
	darksalmon: "#e9967a",
	darkseagreen: "#8fbc8f",
	darkslateblue: "#483d8b",
	darkslategray: "#2f4f4f",
	darkslategrey: "#2f4f4f",
	darkturquoise: "#00ced1",
	darkviolet: "#9400d3",
	deeppink: "#ff1493",
	deepskyblue: "#00bfff",
	dimgray: "#696969",
	dimgrey: "#696969",
	dodgerblue: "#1e90ff",
	firebrick: "#b22222",
	floralwhite: "#fffaf0",
	forestgreen: "#228b22",
	gainsboro: "#dcdcdc",
	ghostwhite: "#f8f8ff",
	gold: "#ffd700",
	goldenrod: "#daa520",
	greenyellow: "#adff2f",
	grey: "#808080",
	honeydew: "#f0fff0",
	hotpink: "#ff69b4",
	indianred: "#cd5c5c",
	indigo: "#4b0082",
	ivory: "#fffff0",
	khaki: "#f0e68c",
	lavender: "#e6e6fa",
	lavenderblush: "#fff0f5",
	lawngreen: "#7cfc00",
	lemonchiffon: "#fffacd",
	lightblue: "#add8e6",
	lightcoral: "#f08080",
	lightcyan: "#e0ffff",
	lightgoldenrodyellow: "#fafad2",
	lightgray: "#d3d3d3",
	lightgreen: "#90ee90",
	lightgrey: "#d3d3d3",
	lightpink: "#ffb6c1",
	lightsalmon: "#ffa07a",
	lightseagreen: "#20b2aa",
	lightskyblue: "#87cefa",
	lightslategray: "#778899",
	lightslategrey: "#778899",
	lightsteelblue: "#b0c4de",
	lightyellow: "#ffffe0",
	limegreen: "#32cd32",
	linen: "#faf0e6",
	magenta: "#ff00ff",
	mediumaquamarine: "#66cdaa",
	mediumblue: "#0000cd",
	mediumorchid: "#ba55d3",
	mediumpurple: "#9370db",
	mediumseagreen: "#3cb371",
	mediumslateblue: "#7b68ee",
	mediumspringgreen: "#00fa9a",
	mediumturquoise: "#48d1cc",
	mediumvioletred: "#c71585",
	midnightblue: "#191970",
	mintcream: "#f5fffa",
	mistyrose: "#ffe4e1",
	moccasin: "#ffe4b5",
	navajowhite: "#ffdead",
	oldlace: "#fdf5e6",
	olivedrab: "#6b8e23",
	orangered: "#ff4500",
	orchid: "#da70d6",
	palegoldenrod: "#eee8aa",
	palegreen: "#98fb98",
	paleturquoise: "#afeeee",
	palevioletred: "#db7093",
	papayawhip: "#ffefd5",
	peachpuff: "#ffdab9",
	peru: "#cd853f",
	pink: "#ffc0cb",
	plum: "#dda0dd",
	powderblue: "#b0e0e6",
	rosybrown: "#bc8f8f",
	royalblue: "#4169e1",
	saddlebrown: "#8b4513",
	salmon: "#fa8072",
	sandybrown: "#f4a460",
	seagreen: "#2e8b57",
	seashell: "#fff5ee",
	sienna: "#a0522d",
	skyblue: "#87ceeb",
	slateblue: "#6a5acd",
	slategray: "#708090",
	slategrey: "#708090",
	snow: "#fffafa",
	springgreen: "#00ff7f",
	steelblue: "#4682b4",
	tan: "#d2b48c",
	thistle: "#d8bfd8",
	tomato: "#ff6347",
	turquoise: "#40e0d0",
	violet: "#ee82ee",
	wheat: "#f5deb3",
	whitesmoke: "#f5f5f5",
	yellowgreen: "#9acd32",
};const hexToRGB = (string) => {
	const numbersOnly = string.replace(/#(?=\S)/g, "");
	const chars = Array.from(Array(6))
		.map((_, i) => numbersOnly[i] || "0");
	const hexString = numbersOnly.length <= 4
		? [0, 0, 1, 1, 2, 2].map(i => chars[i]).join("")
		: chars.join("");
	const c = parseInt(hexString, 16);
	return [(c >> 16) & 255, (c >> 8) & 255, c & 255]
		.map(n => n / 255);
};const getParenNumbers = str => {
	const match = str.match(/\(([^\)]+)\)/g);
	if (match == null || !match.length) { return undefined; }
	return match[0]
		.substring(1, match[0].length - 1)
		.split(/[\s,]+/)
		.map(parseFloat);
};
const parseCSSColor = (string) => {
	if (cssColors[string]) { return hexToRGB(cssColors[string]); }
	if (string[0] === "#") { return hexToRGB(string); }
	if (string.substring(0, 4) === "rgba"
		|| string.substring(0, 3) === "rgb") {
		const colors = getParenNumbers(string);
		[0, 1, 2].forEach((_, i) => { colors[i] /= 255; });
		return colors;
	}
	return [0, 0, 0];
};const assignmentColors = {
	M: [1, 0, 0],
	V: [0, 0, 1],
	J: [1, 1, 0],
	U: [1, 0, 1],
	C: [0, 1, 0],
};
const colorToAssignment = (string) => {
	if (string == null || typeof string !== "string") {
		return "U";
	}
	const color = parseCSSColor(string);
	const color3 = color.slice(0, 3);
	const grayscale = color3.reduce((a, b) => a + b, 0) / 3;
	const grayDistance = {
		key: "F",
		distance: distance3(color3, [grayscale, grayscale, grayscale]),
	};
	const colorDistance = Object.keys(assignmentColors)
		.map(key => ({
			key,
			distance: distance3(color3, assignmentColors[key]),
		}))
		.sort((a, b) => a.distance - b.distance)
		.shift();
	return grayDistance.distance < colorDistance.distance
		? grayDistance.key
		: colorDistance.key;
};const parseCSSStyleSheet = (sheet) => {
	if (!sheet.cssRules) { return {}; }
	const stylesheets = {};
	for (let i = 0; i < sheet.cssRules.length; i += 1) {
		const cssRules = sheet.cssRules[i];
		if (cssRules.type !== 1) { continue; }
		const selectorList = cssRules.selectorText
			.split(/,/gm)
			.filter(Boolean)
			.map(str => str.trim());
		const style = {};
		Object.values(cssRules.style)
			.forEach(key => { style[key] = cssRules.style[key]; });
		selectorList.forEach(selector => {
			stylesheets[selector] = style;
		});
	}
	return stylesheets;
};
const parseStyleElement = (style) => {
	if (style.sheet) { return parseCSSStyleSheet(style.sheet); }
	const rootParent = getRootParent(style);
	const isHTMLBound = rootParent.constructor === RabbitEarWindow().HTMLDocument;
	if (!isHTMLBound) {
		const prevParent = style.parentNode;
		if (prevParent != null) {
			prevParent.removeChild(style);
		}
		const body = RabbitEarWindow().document.body != null
			? RabbitEarWindow().document.body
			: RabbitEarWindow().document.createElement("body");
		body.appendChild(style);
		const parsedStyle = parseCSSStyleSheet(style.sheet);
		body.removeChild(style);
		if (prevParent != null) {
			prevParent.appendChild(style);
		}
		return parsedStyle;
	}
	return {};
};const duplicateEdges = ({ edges_vertices }) => {
	if (!edges_vertices) { return []; }
	const duplicates = [];
	const map = {};
	for (let i = 0; i < edges_vertices.length; i += 1) {
		const a = `${edges_vertices[i][0]} ${edges_vertices[i][1]}`;
		const b = `${edges_vertices[i][1]} ${edges_vertices[i][0]}`;
		if (map[a] !== undefined) {
			duplicates[i] = map[a];
		} else {
			map[a] = i;
			map[b] = i;
		}
	}
	return duplicates;
};
const removeDuplicateEdges = (graph, replace_indices) => {
	if (!replace_indices) {
		replace_indices = duplicateEdges(graph);
	}
	const removeObject = Object.keys(replace_indices).map(n => parseInt(n, 10));
	const map = replaceGeometryIndices(graph, _edges, replace_indices);
	if (removeObject.length) {
		if (graph.vertices_edges || graph.vertices_vertices || graph.vertices_faces) {
			graph.vertices_edges = makeVerticesEdgesUnsorted(graph);
			graph.vertices_vertices = makeVerticesVertices(graph);
			graph.vertices_edges = makeVerticesEdges(graph);
			graph.vertices_faces = makeVerticesFaces(graph);
		}
	}
	return { map, remove: removeObject };
};const edgesDuplicate=/*#__PURE__*/Object.freeze({__proto__:null,duplicateEdges,removeDuplicateEdges});const removeGeometryIndices = (graph, key, removeIndices) => {
	const geometry_array_size = count(graph, key);
	const removes = uniqueSortedNumbers(removeIndices);
	const index_map = [];
	for (let i = 0, j = 0, walk = 0; i < geometry_array_size; i += 1, j += 1) {
		while (i === removes[walk]) {
			index_map[i] = undefined;
			i += 1;
			walk += 1;
		}
		if (i < geometry_array_size) { index_map[i] = j; }
	}
	filterKeysWithSuffix(graph, key)
		.forEach(sKey => graph[sKey]
			.forEach((_, ii) => graph[sKey][ii]
				.forEach((v, jj) => { graph[sKey][ii][jj] = index_map[v]; })));
	removes.reverse();
	filterKeysWithPrefix(graph, key)
		.forEach((prefix_key) => removes
			.forEach(index => graph[prefix_key]
				.splice(index, 1)));
	return index_map;
};const circularEdges = ({ edges_vertices }) => {
	if (!edges_vertices) { return []; }
	const circular = [];
	for (let i = 0; i < edges_vertices.length; i += 1) {
		if (edges_vertices[i][0] === edges_vertices[i][1]) {
			circular.push(i);
		}
	}
	return circular;
};
const spliceRemoveValuesFromSuffixes = (graph, suffix, remove_indices) => {
	const remove_map = {};
	remove_indices.forEach(n => { remove_map[n] = true; });
	filterKeysWithSuffix(graph, suffix)
		.forEach(sKey => graph[sKey]
			.forEach((elem, i) => {
				for (let j = elem.length - 1; j >= 0; j -= 1) {
					if (remove_map[elem[j]] === true) {
						graph[sKey][i].splice(j, 1);
					}
				}
			}));
};
const removeCircularEdges = (graph, remove_indices) => {
	if (!remove_indices) {
		remove_indices = circularEdges(graph);
	}
	if (remove_indices.length) {
		spliceRemoveValuesFromSuffixes(graph, _edges, remove_indices);
	}
	return {
		map: removeGeometryIndices(graph, _edges, remove_indices),
		remove: remove_indices,
	};
};const edgesCircular=/*#__PURE__*/Object.freeze({__proto__:null,circularEdges,removeCircularEdges});const getEdgesVerticesOverlappingSpan = (graph, epsilon = EPSILON) => (
	makeEdgesBoundingBox(graph, epsilon)
		.map(min_max => graph.vertices_coords
			.map(vert => (
				vert[0] > min_max.min[0]
				&& vert[1] > min_max.min[1]
				&& vert[0] < min_max.max[0]
				&& vert[1] < min_max.max[1])))
);
const getEdgesEdgesOverlapingSpans = ({
	vertices_coords, edges_vertices, edges_coords,
}, epsilon = EPSILON) => {
	const min_max = makeEdgesBoundingBox({ vertices_coords, edges_vertices, edges_coords }, epsilon);
	const span_overlaps = edges_vertices.map(() => []);
	for (let e0 = 0; e0 < edges_vertices.length - 1; e0 += 1) {
		for (let e1 = e0 + 1; e1 < edges_vertices.length; e1 += 1) {
			const outside_of = (
				(min_max[e0].max[0] < min_max[e1].min[0] || min_max[e1].max[0] < min_max[e0].min[0])
				&& (min_max[e0].max[1] < min_max[e1].min[1] || min_max[e1].max[1] < min_max[e0].min[1]));
			span_overlaps[e0][e1] = !outside_of;
			span_overlaps[e1][e0] = !outside_of;
		}
	}
	for (let i = 0; i < edges_vertices.length; i += 1) {
		span_overlaps[i][i] = true;
	}
	return span_overlaps;
};const span=/*#__PURE__*/Object.freeze({__proto__:null,getEdgesEdgesOverlapingSpans,getEdgesVerticesOverlappingSpan});const getOtherVerticesInEdges = ({ edges_vertices }, vertex, edges) => edges
	.map(edge => (edges_vertices[edge][0] === vertex
		? edges_vertices[edge][1]
		: edges_vertices[edge][0]));
const findAdjacentFacesToEdge = ({
	vertices_faces, edges_vertices, edges_faces, faces_edges, faces_vertices,
}, edge) => {
	if (edges_faces && edges_faces[edge]) {
		return edges_faces[edge];
	}
	const vertices = edges_vertices[edge];
	if (vertices_faces !== undefined) {
		const faces = [];
		for (let i = 0; i < vertices_faces[vertices[0]].length; i += 1) {
			for (let j = 0; j < vertices_faces[vertices[1]].length; j += 1) {
				if (vertices_faces[vertices[0]][i] === vertices_faces[vertices[1]][j]) {
					if (vertices_faces[vertices[0]][i] === undefined) { continue; }
					faces.push(vertices_faces[vertices[0]][i]);
				}
			}
		}
		return faces;
	}
	if (faces_edges) {
		const faces = [];
		for (let i = 0; i < faces_edges.length; i += 1) {
			for (let e = 0; e < faces_edges[i].length; e += 1) {
				if (faces_edges[i][e] === edge) { faces.push(i); }
			}
		}
		return faces;
	}
	if (faces_vertices) {
		console.warn("todo: findAdjacentFacesToEdge");
	}
};const isVertexCollinear = ({
	vertices_coords, vertices_edges, edges_vertices,
}, vertex, epsilon = EPSILON) => {
	if (!vertices_coords || !edges_vertices) { return false; }
	if (!vertices_edges) {
		vertices_edges = makeVerticesEdgesUnsorted({ edges_vertices });
	}
	const edges = vertices_edges[vertex];
	if (edges === undefined || edges.length !== 2) { return false; }
	const vertices = getOtherVerticesInEdges({ edges_vertices }, vertex, edges);
	const points = [vertices[0], vertex, vertices[1]]
		.map(v => vertices_coords[v]);
	return collinearBetween(...points, false, epsilon);
};
const getVerticesEdgesOverlap = ({
	vertices_coords, edges_vertices, edges_coords,
}, epsilon = EPSILON) => {
	if (!edges_coords) {
		edges_coords = edges_vertices.map(ev => ev.map(v => vertices_coords[v]));
	}
	const edges_span_vertices = getEdgesVerticesOverlappingSpan({
		vertices_coords, edges_vertices, edges_coords,
	}, epsilon);
	for (let e = 0; e < edges_coords.length; e += 1) {
		for (let v = 0; v < vertices_coords.length; v += 1) {
			if (!edges_span_vertices[e][v]) { continue; }
			edges_span_vertices[e][v] = overlapLinePoint(
				{
					vector: subtract(edges_coords[e][1], edges_coords[e][0]),
					origin: edges_coords[e][0],
				},
				vertices_coords[v],
				excludeS,
				epsilon,
			);
		}
	}
	return edges_span_vertices
		.map(verts => verts
			.map((vert, i) => (vert ? i : undefined))
			.filter(i => i !== undefined));
};const verticesCollinear=/*#__PURE__*/Object.freeze({__proto__:null,getVerticesEdgesOverlap,isVertexCollinear});const makeEdgesLineParallelOverlap = ({
	vertices_coords, edges_vertices,
}, vector, point, epsilon = EPSILON) => {
	const normalized = normalize2(vector);
	const edges_origin = edges_vertices.map(ev => vertices_coords[ev[0]]);
	const edges_vector = edges_vertices
		.map(ev => ev.map(v => vertices_coords[v]))
		.map(edge => subtract2(edge[1], edge[0]));
	const overlap = edges_vector
		.map(vec => parallel2(vec, vector, epsilon));
	for (let e = 0; e < edges_vertices.length; e += 1) {
		if (!overlap[e]) { continue; }
		if (epsilonEqualVectors(edges_origin[e], point)) {
			overlap[e] = true;
			continue;
		}
		const vec = normalize2(subtract2(edges_origin[e], point));
		const dot = Math.abs(dot2(vec, normalized));
		overlap[e] = Math.abs(1.0 - dot) < epsilon;
	}
	return overlap;
};
const makeEdgesSegmentIntersection = ({
	vertices_coords, edges_vertices, edges_coords,
}, point1, point2, epsilon = EPSILON) => {
	if (!edges_coords) {
		edges_coords = makeEdgesCoords({ vertices_coords, edges_vertices });
	}
	const segment_box = boundingBox$1([point1, point2], epsilon);
	const segment_vector = subtract2(point2, point1);
	return makeEdgesBoundingBox({ vertices_coords, edges_vertices, edges_coords }, epsilon)
		.map(box => overlapBoundingBoxes(segment_box, box))
		.map((overlap, i) => (overlap ? (intersectLineLine(
			{ vector: segment_vector, origin: point1 },
			{
				vector: subtract2(edges_coords[i][1], edges_coords[i][0]),
				origin: edges_coords[i][0],
			},
			includeS,
			includeS,
			epsilon,
		)) : undefined));
};
const makeEdgesEdgesIntersection = function ({
	vertices_coords, edges_vertices, edges_vector, edges_origin,
}, epsilon = EPSILON) {
	if (!edges_vector) {
		edges_vector = makeEdgesVector({ vertices_coords, edges_vertices });
	}
	if (!edges_origin) {
		edges_origin = edges_vertices.map(ev => vertices_coords[ev[0]]);
	}
	const edges_intersections = edges_vector.map(() => []);
	const span = getEdgesEdgesOverlapingSpans({ vertices_coords, edges_vertices }, epsilon);
	for (let i = 0; i < edges_vector.length - 1; i += 1) {
		for (let j = i + 1; j < edges_vector.length; j += 1) {
			if (span[i][j] !== true) { continue; }
			const intersection = intersectLineLine(
				{ vector: edges_vector[i], origin: edges_origin[i] },
				{ vector: edges_vector[j], origin: edges_origin[j] },
				excludeS,
				excludeS,
				epsilon,
			);
			if (intersection !== undefined) {
				edges_intersections[i][j] = intersection;
				edges_intersections[j][i] = intersection;
			}
		}
	}
	return edges_intersections;
};
const intersectConvexFaceLine = ({
	vertices_coords, edges_vertices, faces_vertices, faces_edges,
}, face, { vector, origin }, epsilon = EPSILON) => {
	const face_vertices_indices = faces_vertices[face]
		.map(v => vertices_coords[v])
		.map(coord => overlapLinePoint({ vector, origin }, coord, () => true, epsilon))
		.map((overlap, i) => (overlap ? i : undefined))
		.filter(i => i !== undefined);
	const vertices = face_vertices_indices.map(i => faces_vertices[face][i]);
	const vertices_are_neighbors = face_vertices_indices
		.concat(face_vertices_indices.map(i => i + faces_vertices[face].length))
		.map((n, i, arr) => arr[i + 1] - n === 1)
		.reduce((a, b) => a || b, false);
	if (vertices_are_neighbors) { return undefined; }
	if (vertices.length > 1) { return { vertices, edges: [] }; }
	const edges = faces_edges[face]
		.map(edge => edges_vertices[edge]
			.map(v => vertices_coords[v]))
		.map(seg => intersectLineLine(
			{ vector, origin },
			{ vector: subtract(seg[1], seg[0]), origin: seg[0] },
			includeL,
			excludeS,
			epsilon,
		)).map((coords, face_edge_index) => ({
			coords,
			edge: faces_edges[face][face_edge_index],
		}))
		.filter(el => el.coords !== undefined)
		.filter(el => !(vertices
			.map(v => edges_vertices[el.edge].includes(v))
			.reduce((a, b) => a || b, false)));
	return (edges.length + vertices.length === 2
		? { vertices, edges }
		: undefined);
};const intersectMethods$1=/*#__PURE__*/Object.freeze({__proto__:null,intersectConvexFaceLine,makeEdgesEdgesIntersection,makeEdgesLineParallelOverlap,makeEdgesSegmentIntersection});const mergeSimpleNextmaps = (...maps) => {
	if (maps.length === 0) { return []; }
	const solution = maps[0].map((_, i) => i);
	maps.forEach(map => solution.forEach((s, i) => { solution[i] = map[s]; }));
	return solution;
};
const mergeNextmaps = (...maps) => {
	if (maps.length === 0) { return []; }
	const solution = maps[0].map((_, i) => [i]);
	maps.forEach(map => {
		solution.forEach((s, i) => s.forEach((indx, j) => { solution[i][j] = map[indx]; }));
		solution.forEach((arr, i) => {
			solution[i] = arr
				.reduce((a, b) => a.concat(b), [])
				.filter(a => a !== undefined);
		});
	});
	return solution;
};
const mergeSimpleBackmaps = (...maps) => {
	if (maps.length === 0) { return []; }
	let solution = maps[0].map((_, i) => i);
	maps.forEach(map => {
		const next = map.map(n => solution[n]);
		solution = next;
	});
	return solution;
};
const mergeBackmaps = (...maps) => {
	if (maps.length === 0) { return []; }
	let solution = maps[0].reduce((a, b) => a.concat(b), []).map((_, i) => [i]);
	maps.forEach(map => {
		const next = [];
		map.forEach((el, j) => {
			if (typeof el === _number) {
				next[j] = solution[el];
			} else {
				next[j] = el.map(n => solution[n]).reduce((a, b) => a.concat(b), []);
			}
		});
		solution = next;
	});
	return solution;
};
const invertMap = (map) => {
	const inv = [];
	const setIndexValue = (index, value) => {
		if (inv[index] !== undefined) {
			if (typeof inv[index] === _number) {
				inv[index] = [inv[index], value];
			} else {
				inv[index].push(value);
			}
		} else {
			inv[index] = value;
		}
	};
	map.forEach((n, i) => {
		if (n == null) { return; }
		if (typeof n === _number) { setIndexValue(n, i); }
		if (n.constructor === Array) {
			n.forEach(m => setIndexValue(m, i));
		}
	});
	return inv;
};
const invertSimpleMap = (map) => {
	const inv = [];
	map.forEach((n, i) => { inv[n] = i; });
	return inv;
};const maps=/*#__PURE__*/Object.freeze({__proto__:null,invertMap,invertSimpleMap,mergeBackmaps,mergeNextmaps,mergeSimpleBackmaps,mergeSimpleNextmaps});const fragment_graph = (graph, epsilon = EPSILON) => {
	const edges_coords = graph.edges_vertices
		.map(ev => ev.map(v => graph.vertices_coords[v]));
	const edges_vector = edges_coords.map(e => subtract(e[1], e[0]));
	const edges_origin = edges_coords.map(e => e[0]);
	const edges_intersections = makeEdgesEdgesIntersection({
		vertices_coords: graph.vertices_coords,
		edges_vertices: graph.edges_vertices,
		edges_vector,
		edges_origin,
	}, 1e-6);
	const edges_collinear_vertices = getVerticesEdgesOverlap({
		vertices_coords: graph.vertices_coords,
		edges_vertices: graph.edges_vertices,
		edges_coords,
	}, epsilon);
	if (edges_intersections.flat().filter(a => a !== undefined).length === 0
		&& edges_collinear_vertices.flat().filter(a => a !== undefined).length === 0) {
		return undefined;
	}
	const counts = { vertices: graph.vertices_coords.length };
	edges_intersections
		.forEach(edge => edge
			.filter(a => a !== undefined)
			.filter(a => a.length === 2)
			.forEach((intersect) => {
				const newIndex = graph.vertices_coords.length;
				graph.vertices_coords.push([...intersect]);
				intersect.splice(0, 2);
				intersect.push(newIndex);
			}));
	edges_intersections.forEach((edge, i) => {
		edge.forEach((intersect, j) => {
			if (intersect) {
				edges_intersections[i][j] = intersect[0];
			}
		});
	});
	const edges_intersections_flat = edges_intersections
		.map(arr => arr.filter(a => a !== undefined));
	graph.edges_vertices.forEach((verts, i) => verts
		.push(...edges_intersections_flat[i], ...edges_collinear_vertices[i]));
	graph.edges_vertices.forEach((edge, i) => {
		graph.edges_vertices[i] = sortVerticesAlongVector({
			vertices_coords: graph.vertices_coords,
		}, edge, edges_vector[i]);
	});
	const edge_map = graph.edges_vertices
		.map((edge, i) => Array(edge.length - 1).fill(i))
		.flat();
	graph.edges_vertices = graph.edges_vertices
		.map(edge => Array.from(Array(edge.length - 1))
			.map((_, i, arr) => [edge[i], edge[i + 1]]))
		.flat();
	if (graph.edges_assignment && graph.edges_foldAngle
		&& graph.edges_foldAngle.length > graph.edges_assignment.length) {
		for (let i = graph.edges_assignment.length; i < graph.edges_foldAngle.length; i += 1) {
			graph.edges_assignment[i] = edgeFoldAngleToAssignment(graph.edges_foldAngle[i]);
		}
	}
	if (graph.edges_assignment) {
		graph.edges_assignment = edge_map.map(i => graph.edges_assignment[i] || "U");
	}
	if (graph.edges_foldAngle) {
		graph.edges_foldAngle = edge_map
			.map(i => graph.edges_foldAngle[i])
			.map((a, i) => (a === undefined
				? edgeAssignmentToFoldAngle(graph.edges_assignment[i])
				: a));
	}
	return {
		vertices: {
			new: Array.from(Array(graph.vertices_coords.length - counts.vertices))
				.map((_, i) => counts.vertices + i),
		},
		edges: {
			backmap: edge_map,
		},
	};
};
const fragment_keep_keys = [
	_vertices_coords,
	_edges_vertices,
	_edges_assignment,
	_edges_foldAngle,
];
const fragment = (graph, epsilon = EPSILON) => {
	graph.vertices_coords = graph.vertices_coords.map(coord => coord.slice(0, 2));
	[_vertices, _edges, _faces]
		.map(key => filterKeysWithPrefix(graph, key))
		.flat()
		.filter(key => !(fragment_keep_keys.includes(key)))
		.forEach(key => delete graph[key]);
	const change = {
		vertices: {},
		edges: {},
	};
	let i;
	for (i = 0; i < 20; i += 1) {
		const resVert = removeDuplicateVertices(graph, epsilon / 2);
		const resEdgeDup = removeDuplicateEdges(graph);
		const resEdgeCirc = removeCircularEdges(graph);
		const resFrag = fragment_graph(graph, epsilon);
		if (resFrag === undefined) {
			change.vertices.map = (change.vertices.map === undefined
				? resVert.map
				: mergeNextmaps(change.vertices.map, resVert.map));
			change.edges.map = (change.edges.map === undefined
				? mergeNextmaps(resEdgeDup.map, resEdgeCirc.map)
				: mergeNextmaps(change.edges.map, resEdgeDup.map, resEdgeCirc.map));
			break;
		}
		const invert_frag = invertMap(resFrag.edges.backmap);
		const edgemap = mergeNextmaps(resEdgeDup.map, resEdgeCirc.map, invert_frag);
		change.vertices.map = (change.vertices.map === undefined
			? resVert.map
			: mergeNextmaps(change.vertices.map, resVert.map));
		change.edges.map = (change.edges.map === undefined
			? edgemap
			: mergeNextmaps(change.edges.map, edgemap));
	}
	if (i === 20) {
		throw new Error(Messages$1.fragment);
	}
	return change;
};const boundingBox = ({ vertices_coords }, padding) => (
	boundingBox$1(vertices_coords, padding)
);
const boundaryVertices = ({ edges_vertices, edges_assignment }) => (
	uniqueElements(edges_vertices
		.filter((_, i) => edges_assignment[i] === "B" || edges_assignment[i] === "b")
		.flat()));
const emptyBoundaryObject = () => ({ vertices: [], edges: [] });
const boundary = ({ vertices_edges, edges_vertices, edges_assignment }) => {
	if (edges_assignment === undefined) { return emptyBoundaryObject(); }
	if (!vertices_edges) {
		vertices_edges = makeVerticesEdgesUnsorted({ edges_vertices });
	}
	const edges_vertices_b = edges_assignment
		.map(a => a === "B" || a === "b");
	const edge_walk = [];
	const vertex_walk = [];
	let edgeIndex = -1;
	for (let i = 0; i < edges_vertices_b.length; i += 1) {
		if (edges_vertices_b[i]) { edgeIndex = i; break; }
	}
	if (edgeIndex === -1) { return emptyBoundaryObject(); }
	edges_vertices_b[edgeIndex] = false;
	edge_walk.push(edgeIndex);
	vertex_walk.push(edges_vertices[edgeIndex][0]);
	let nextVertex = edges_vertices[edgeIndex][1];
	while (vertex_walk[0] !== nextVertex) {
		vertex_walk.push(nextVertex);
		edgeIndex = vertices_edges[nextVertex]
			.filter(v => edges_vertices_b[v])
			.shift();
		if (edgeIndex === undefined) { return emptyBoundaryObject(); }
		if (edges_vertices[edgeIndex][0] === nextVertex) {
			[, nextVertex] = edges_vertices[edgeIndex];
		} else {
			[nextVertex] = edges_vertices[edgeIndex];
		}
		edges_vertices_b[edgeIndex] = false;
		edge_walk.push(edgeIndex);
	}
	return {
		vertices: vertex_walk,
		edges: edge_walk,
	};
};
const planarBoundary = ({
	vertices_coords, vertices_edges, vertices_vertices, edges_vertices,
}, infiniteLoopProtection = true) => {
	if (!vertices_vertices) {
		vertices_vertices = makeVerticesVertices({ vertices_coords, vertices_edges, edges_vertices });
	}
	const edge_map = makeVerticesToEdgeBidirectional({ edges_vertices });
	const edge_walk = [];
	const vertex_walk = [];
	const walk = {
		vertices: vertex_walk,
		edges: edge_walk,
	};
	let largestX = -Infinity;
	let first_vertex_i = -1;
	vertices_coords.forEach((v, i) => {
		if (v[0] > largestX) {
			largestX = v[0];
			first_vertex_i = i;
		}
	});
	if (first_vertex_i === -1) { return walk; }
	vertex_walk.push(first_vertex_i);
	const first_vc = vertices_coords[first_vertex_i];
	const first_neighbors = vertices_vertices[first_vertex_i];
	const counter_clock_first_i = first_neighbors
		.map(i => vertices_coords[i])
		.map(vc => [vc[0] - first_vc[0], vc[1] - first_vc[1]])
		.map(vec => Math.atan2(vec[1], vec[0]))
		.map(angle => (angle < 0 ? angle + Math.PI * 2 : angle))
		.map((a, i) => ({ a, i }))
		.sort((a, b) => a.a - b.a)
		.shift()
		.i;
	const second_vertex_i = first_neighbors[counter_clock_first_i];
	const first_edge_lookup = first_vertex_i < second_vertex_i
		? `${first_vertex_i} ${second_vertex_i}`
		: `${second_vertex_i} ${first_vertex_i}`;
	const first_edge = edge_map[first_edge_lookup];
	edge_walk.push(first_edge);
	let prev_vertex_i = first_vertex_i;
	let this_vertex_i = second_vertex_i;
	const start = performance.now();
	const MAX_DURATION = 10000;
	let count = 0;
	while (true) {
		const next_neighbors = vertices_vertices[this_vertex_i];
		const from_neighbor_i = next_neighbors.indexOf(prev_vertex_i);
		const next_neighbor_i = (from_neighbor_i + 1) % next_neighbors.length;
		const next_vertex_i = next_neighbors[next_neighbor_i];
		const next_edge_lookup = this_vertex_i < next_vertex_i
			? `${this_vertex_i} ${next_vertex_i}`
			: `${next_vertex_i} ${this_vertex_i}`;
		const next_edge_i = edge_map[next_edge_lookup];
		if (next_edge_i === edge_walk[0]) {
			return walk;
		}
		vertex_walk.push(this_vertex_i);
		edge_walk.push(next_edge_i);
		prev_vertex_i = this_vertex_i;
		this_vertex_i = next_vertex_i;
		count += 1;
		if (infiniteLoopProtection
			&& count % 1000 === 0
			&& performance.now() - start > MAX_DURATION) {
			throw new Error(Messages$1.planarBoundary);
		}
	}
};const boundary$1=/*#__PURE__*/Object.freeze({__proto__:null,boundary,boundaryVertices,boundingBox,planarBoundary});const opacityToFoldAngle = (opacity, assignment) => {
	switch (assignment) {
	case "M": case "m": return -180 * opacity;
	case "V": case "v": return 180 * opacity;
	default: return 0;
	}
};
const attribute_list = (element) => Array
	.from(element.attributes)
	.filter(a => !geometryAttributes.attrs[element.nodeName][a.nodeName]);
const objectifyAttributeList = function (list) {
	const obj = {};
	list.forEach((a) => { obj[a.nodeName] = a.value; });
	return obj;
};
const segmentize = (elements) => elements
	.filter(el => parsers[el.tagName])
	.flatMap(el => parsers[el.tagName](el)
		.map(segment => ({
			nodeName: el.tagName,
			segment,
			attributes: objectifyAttributeList(attribute_list(el)),
		})));
const svgToBasicGraph = (svg) => {
	const typeString = typeof svg === "string";
	const xml = typeString ? xmlStringToDOM(svg, "image/svg+xml") : svg;
	const elements = flattenDomTree(xml);
	const stylesheets = elements
		.filter(el => el.nodeName === "style")
		.map(parseStyleElement);
	const result = segmentize(elements);
	const edges_assignment = result
		.map(el => getAttributeValue(
			"stroke",
			el.nodeName,
			el.attributes,
			stylesheets,
		) || "black")
		.map(color => colorToAssignment(color));
	const edges_foldAngle = result
		.map(el => getAttributeValue(
			"opacity",
			el.nodeName,
			el.attributes,
			stylesheets,
		) || "1")
		.map((opacity, i) => opacityToFoldAngle(opacity, edges_assignment[i]));
	const vertices_coords = result
		.map(el => el.segment)
		.flatMap(s => [[s[0], s[1]], [s[2], s[3]]]);
	const edges_vertices = result
		.map((_, i) => [i * 2, i * 2 + 1]);
	return {
		vertices_coords,
		edges_vertices,
		edges_assignment,
		edges_foldAngle,
	};
};
const planarizeGraph = (graph) => {
	const planar = { ...graph };
	removeDuplicateVertices(planar);
	fragment(planar);
	planar.vertices_vertices = makeVerticesVertices(planar);
	const faces = makePlanarFaces(planar);
	planar.faces_vertices = faces.map(el => el.vertices);
	planar.faces_edges = faces.map(el => el.edges);
	const { edges } = planarBoundary(planar);
	edges.forEach(e => { planar.edges_assignment[e] = "B"; });
	return planar;
};
const svgToFold = (svg) => {
	const graph = svgToBasicGraph(svg);
	const planarGraph = planarizeGraph(graph);
	return {
		file_spec: 1.1,
		file_creator: "Rabbit Ear",
		frame_classes: ["creasePattern"],
		...planarGraph,
	};
};const str_class = "class";
const str_function = "function";
const str_undefined = "undefined";
const str_boolean = "boolean";
const str_number = "number";
const str_string = "string";
const str_object = "object";
const str_svg = "svg";
const str_path = "path";
const str_id = "id";
const str_style = "style";
const str_viewBox = "viewBox";
const str_transform = "transform";
const str_points = "points";
const str_stroke = "stroke";
const str_fill = "fill";
const str_none = "none";
const str_arrow = "arrow";
const str_head = "head";
const str_tail = "tail";const isBrowser = typeof window !== str_undefined
	&& typeof window.document !== str_undefined;
typeof process !== str_undefined
	&& process.versions != null
	&& process.versions.node != null;const Messages = {
	window: "window not set; svg.window = @xmldom/xmldom",
};const svgWindowContainer = { window: undefined };
const buildHTMLDocument = (newWindow) => new newWindow.DOMParser()
	.parseFromString("<!DOCTYPE html><title>.</title>", "text/html");
const setSVGWindow = (newWindow) => {
	if (!newWindow.document) { newWindow.document = buildHTMLDocument(newWindow); }
	svgWindowContainer.window = newWindow;
	return svgWindowContainer.window;
};
if (isBrowser) { svgWindowContainer.window = window; }
const SVGWindow = () => {
	if (svgWindowContainer.window === undefined) {
		throw Messages.window;
	}
	return svgWindowContainer.window;
};const NS = "http://www.w3.org/2000/svg";
const classes_attributes = {
	presentation: [
		"color",
		"color-interpolation",
		"cursor",
		"direction",
		"display",
		"fill",
		"fill-opacity",
		"fill-rule",
		"font-family",
		"font-size",
		"font-size-adjust",
		"font-stretch",
		"font-style",
		"font-variant",
		"font-weight",
		"image-rendering",
		"letter-spacing",
		"opacity",
		"overflow",
		"paint-order",
		"pointer-events",
		"preserveAspectRatio",
		"shape-rendering",
		"stroke",
		"stroke-dasharray",
		"stroke-dashoffset",
		"stroke-linecap",
		"stroke-linejoin",
		"stroke-miterlimit",
		"stroke-opacity",
		"stroke-width",
		"tabindex",
		"transform-origin",
		"user-select",
		"vector-effect",
		"visibility",
	],
	animation: [
		"accumulate",
		"additive",
		"attributeName",
		"begin",
		"by",
		"calcMode",
		"dur",
		"end",
		"from",
		"keyPoints",
		"keySplines",
		"keyTimes",
		"max",
		"min",
		"repeatCount",
		"repeatDur",
		"restart",
		"to",
		"values",
	],
	effects: [
		"azimuth",
		"baseFrequency",
		"bias",
		"color-interpolation-filters",
		"diffuseConstant",
		"divisor",
		"edgeMode",
		"elevation",
		"exponent",
		"filter",
		"filterRes",
		"filterUnits",
		"flood-color",
		"flood-opacity",
		"in",
		"in2",
		"intercept",
		"k1",
		"k2",
		"k3",
		"k4",
		"kernelMatrix",
		"lighting-color",
		"limitingConeAngle",
		"mode",
		"numOctaves",
		"operator",
		"order",
		"pointsAtX",
		"pointsAtY",
		"pointsAtZ",
		"preserveAlpha",
		"primitiveUnits",
		"radius",
		"result",
		"seed",
		"specularConstant",
		"specularExponent",
		"stdDeviation",
		"stitchTiles",
		"surfaceScale",
		"targetX",
		"targetY",
		"type",
		"xChannelSelector",
		"yChannelSelector",
	],
	text: [
		"dx",
		"dy",
		"alignment-baseline",
		"baseline-shift",
		"dominant-baseline",
		"lengthAdjust",
		"method",
		"overline-position",
		"overline-thickness",
		"rotate",
		"spacing",
		"startOffset",
		"strikethrough-position",
		"strikethrough-thickness",
		"text-anchor",
		"text-decoration",
		"text-rendering",
		"textLength",
		"underline-position",
		"underline-thickness",
		"word-spacing",
		"writing-mode",
	],
	gradient: [
		"gradientTransform",
		"gradientUnits",
		"spreadMethod",
	],
};const classes_nodes = {
	svg: [
		"svg",
	],
	defs: [
		"defs",
	],
	header: [
		"desc",
		"filter",
		"metadata",
		"style",
		"script",
		"title",
		"view",
	],
	cdata: [
		"cdata",
	],
	group: [
		"g",
	],
	visible: [
		"circle",
		"ellipse",
		"line",
		"path",
		"polygon",
		"polyline",
		"rect",
		"arc",
		"arrow",
		"curve",
		"parabola",
		"roundRect",
		"wedge",
		"origami",
	],
	text: [
		"text",
	],
	invisible: [
		"marker",
		"symbol",
		"clipPath",
		"mask",
	],
	patterns: [
		"linearGradient",
		"radialGradient",
		"pattern",
	],
	childrenOfText: [
		"textPath",
		"tspan",
	],
	gradients: [
		"stop",
	],
	filter: [
		"feBlend",
		"feColorMatrix",
		"feComponentTransfer",
		"feComposite",
		"feConvolveMatrix",
		"feDiffuseLighting",
		"feDisplacementMap",
		"feDistantLight",
		"feDropShadow",
		"feFlood",
		"feFuncA",
		"feFuncB",
		"feFuncG",
		"feFuncR",
		"feGaussianBlur",
		"feImage",
		"feMerge",
		"feMergeNode",
		"feMorphology",
		"feOffset",
		"fePointLight",
		"feSpecularLighting",
		"feSpotLight",
		"feTile",
		"feTurbulence",
	],
};const nodes_attributes = {
	svg: [str_viewBox],
	line: ["x1", "y1", "x2", "y2"],
	rect: ["x", "y", "width", "height"],
	circle: ["cx", "cy", "r"],
	ellipse: ["cx", "cy", "rx", "ry"],
	polygon: [str_points],
	polyline: [str_points],
	path: ["d"],
	text: ["x", "y"],
	mask: [str_id],
	symbol: [str_id],
	clipPath: [str_id, "clip-rule"],
	marker: [
		str_id,
		"markerHeight",
		"markerUnits",
		"markerWidth",
		"orient",
		"refX",
		"refY",
	],
	linearGradient: ["x1", "x2", "y1", "y2"],
	radialGradient: ["cx", "cy", "r", "fr", "fx", "fy"],
	stop: ["offset", "stop-color", "stop-opacity"],
	pattern: ["patternContentUnits", "patternTransform", "patternUnits"],
};
const additionalNodeAttributes = [{
	nodes: [str_svg, "defs", "g"].concat(classes_nodes.visible, classes_nodes.text),
	attr: classes_attributes.presentation,
}, {
	nodes: ["filter"],
	attr: classes_attributes.effects,
}, {
	nodes: classes_nodes.childrenOfText.concat("text"),
	attr: classes_attributes.text,
}, {
	nodes: classes_nodes.filter,
	attr: classes_attributes.effects,
}, {
	nodes: classes_nodes.gradients,
	attr: classes_attributes.gradient,
}];
additionalNodeAttributes
	.forEach(el => el.nodes
		.forEach(nodeName => {
			if (!nodes_attributes[nodeName]) { nodes_attributes[nodeName] = []; }
			nodes_attributes[nodeName].push(...el.attr);
		}));const headerStuff = [
	classes_nodes.header,
	classes_nodes.invisible,
	classes_nodes.patterns,
].flat();
const drawingShapes = [
	classes_nodes.group,
	classes_nodes.visible,
	classes_nodes.text,
].flat();
const nodes_children = {
	svg: [["svg", "defs"], headerStuff, drawingShapes].flat(),
	defs: headerStuff,
	filter: classes_nodes.filter,
	g: drawingShapes,
	text: classes_nodes.childrenOfText,
	marker: drawingShapes,
	symbol: drawingShapes,
	clipPath: drawingShapes,
	mask: drawingShapes,
	linearGradient: classes_nodes.gradients,
	radialGradient: classes_nodes.gradients,
};const nodeNames = Object.values(classes_nodes).flat();const makeCoordinates = (...args) => args
	.filter(a => typeof a === str_number)
	.concat(args
		.filter(a => typeof a === str_object && a !== null)
		.map((el) => {
			if (typeof el.x === str_number) { return [el.x, el.y]; }
			if (typeof el[0] === str_number) { return [el[0], el[1]]; }
			return undefined;
		}).filter(a => a !== undefined)
		.reduce((a, b) => a.concat(b), []));const viewBoxValuesToString = function (x, y, width, height, padding = 0) {
	const scale = 1.0;
	const d = (width / scale) - width;
	const X = (x - d) - padding;
	const Y = (y - d) - padding;
	const W = (width + d * 2) + padding * 2;
	const H = (height + d * 2) + padding * 2;
	return [X, Y, W, H].join(" ");
};
const makeViewBox = (...args) => {
	const numbers = makeCoordinates(...args.flat());
	if (numbers.length === 2) { numbers.unshift(0, 0); }
	return numbers.length === 4 ? viewBoxValuesToString(...numbers) : undefined;
};const makeCDATASection = (text) => (new (SVGWindow()).DOMParser())
	.parseFromString("<root></root>", "text/xml")
	.createCDATASection(text);const setViewBox = (element, ...args) => {
	const viewBox = args.length === 1 && typeof args[0] === str_string
		? args[0]
		: makeViewBox(...args);
	if (viewBox) {
		element.setAttribute(str_viewBox, viewBox);
	}
	return element;
};
const getViewBox$1 = function (element) {
	const vb = element.getAttribute(str_viewBox);
	return (vb == null
		? undefined
		: vb.split(" ").map(n => parseFloat(n)));
};
const convertToViewBox = function (svg, x, y) {
	const pt = svg.createSVGPoint();
	pt.x = x;
	pt.y = y;
	const svgPoint = pt.matrixTransform(svg.getScreenCTM().inverse());
	return [svgPoint.x, svgPoint.y];
};const getSVGFrame = function (element) {
	const viewBox = getViewBox$1(element);
	if (viewBox !== undefined) {
		return viewBox;
	}
	if (typeof element.getBoundingClientRect === str_function) {
		const rr = element.getBoundingClientRect();
		return [rr.x, rr.y, rr.width, rr.height];
	}
	return [];
};const bgClass = "svg-background-rectangle";
const makeBackground = function (element, color) {
	let backRect = Array.from(element.childNodes)
		.filter(child => child.getAttribute(str_class) === bgClass)
		.shift();
	if (backRect == null) {
		backRect = SVGWindow().document.createElementNS(NS, "rect");
		getSVGFrame(element).forEach((n, i) => backRect.setAttribute(nodes_attributes.rect[i], n));
		backRect.setAttribute(str_class, bgClass);
		backRect.setAttribute(str_stroke, str_none);
		element.insertBefore(backRect, element.firstChild);
	}
	backRect.setAttribute(str_fill, color);
	return element;
};const getAttr = (element) => {
	const t = element.getAttribute(str_transform);
	return (t == null || t === "") ? undefined : t;
};
const TransformMethods = {
	clearTransform: (el) => { el.removeAttribute(str_transform); return el; },
};
["translate", "rotate", "scale", "matrix"].forEach(key => {
	TransformMethods[key] = (element, ...args) => {
		element.setAttribute(
			str_transform,
			[getAttr(element), `${key}(${args.join(" ")})`]
				.filter(a => a !== undefined)
				.join(" "),
		);
		return element;
	};
});const toCamel = (s) => s
	.replace(/([-_][a-z])/ig, $1 => $1
		.toUpperCase()
		.replace("-", "")
		.replace("_", ""));
const toKebab = (s) => s
	.replace(/([a-z0-9])([A-Z])/g, "$1-$2")
	.replace(/([A-Z])([A-Z])(?=[a-z])/g, "$1-$2")
	.toLowerCase();
const capitalized = (s) => s
	.charAt(0).toUpperCase() + s.slice(1);const removeChildren = (element) => {
	while (element.lastChild) {
		element.removeChild(element.lastChild);
	}
	return element;
};
const appendTo = (element, parent) => {
	if (parent && parent.appendChild) {
		parent.appendChild(element);
	}
	return element;
};
const setAttributes = (element, attrs) => {
	Object.keys(attrs)
		.forEach(key => element.setAttribute(toKebab(key), attrs[key]));
	return element;
};const dom=/*#__PURE__*/Object.freeze({__proto__:null,appendTo,removeChildren,setAttributes});const setPadding = function (element, padding) {
	const viewBox = getViewBox$1(element);
	if (viewBox !== undefined) {
		setViewBox(element, ...[-padding, -padding, padding * 2, padding * 2]
			.map((nudge, i) => viewBox[i] + nudge));
	}
	return element;
};
const findOneElement = function (element, nodeName) {
	const styles = element.getElementsByTagName(nodeName);
	return styles.length ? styles[0] : null;
};
const stylesheet = function (element, textContent) {
	let styleSection = findOneElement(element, str_style);
	if (styleSection == null) {
		styleSection = SVGWindow().document.createElementNS(NS, str_style);
		styleSection.setTextContent = (text) => {
			styleSection.textContent = "";
			styleSection.appendChild(makeCDATASection(text));
			return styleSection;
		};
		element.insertBefore(styleSection, element.firstChild);
	}
	styleSection.textContent = "";
	styleSection.appendChild(makeCDATASection(textContent));
	return styleSection;
};
const clearSVG = (element) => {
	Array.from(element.attributes)
		.filter(attr => attr.name !== "xmlns" && attr.name !== "version")
		.forEach(attr => element.removeAttribute(attr.name));
	return removeChildren(element);
};
const methods$2 = {
	clear: clearSVG,
	size: setViewBox,
	setViewBox,
	getViewBox: getViewBox$1,
	padding: setPadding,
	background: makeBackground,
	getWidth: el => getSVGFrame(el)[2],
	getHeight: el => getSVGFrame(el)[3],
	stylesheet: function (el, text) { return stylesheet.call(this, el, text); },
	...TransformMethods,
	...dom,
};const categories = {
	move: ["mousemove", "touchmove"],
	press: ["mousedown", "touchstart"],
	release: ["mouseup", "touchend"],
	leave: ["mouseleave", "touchcancel"],
};
const handlerNames = Object.values(categories)
	.reduce((a, b) => a.concat(b), []);
const off = (element, handlers) => handlerNames.forEach((handlerName) => {
	handlers[handlerName].forEach(func => element.removeEventListener(handlerName, func));
	handlers[handlerName] = [];
});
const defineGetter = (obj, prop, value) => Object.defineProperty(obj, prop, {
	get: () => value,
	enumerable: true,
	configurable: true,
});
const assignPress = (e, startPoint) => {
	["pressX", "pressY"].filter(prop => !Object.prototype.hasOwnProperty.call(e, prop))
		.forEach((prop, i) => defineGetter(e, prop, startPoint[i]));
	if (!Object.prototype.hasOwnProperty.call(e, "press")) {
		defineGetter(e, "press", [...startPoint]);
	}
};
const TouchEvents = function (element) {
	let startPoint = [];
	const handlers = [];
	Object.keys(categories).forEach((key) => {
		categories[key].forEach((handler) => {
			handlers[handler] = [];
		});
	});
	const removeHandler = category => categories[category]
		.forEach(handlerName => handlers[handlerName]
			.forEach(func => element.removeEventListener(handlerName, func)));
	const categoryUpdate = {
		press: (e, viewPoint) => {
			startPoint = viewPoint;
			assignPress(e, startPoint);
		},
		release: () => {},
		leave: () => {},
		move: (e, viewPoint) => {
			if (e.buttons > 0 && startPoint[0] === undefined) {
				startPoint = viewPoint;
			} else if (e.buttons === 0 && startPoint[0] !== undefined) {
				startPoint = [];
			}
			assignPress(e, startPoint);
		},
	};
	Object.keys(categories).forEach((category) => {
		const propName = `on${capitalized(category)}`;
		Object.defineProperty(element, propName, {
			set: (handler) => {
				if (handler == null) {
					removeHandler(category);
					return;
				}
				categories[category].forEach((handlerName) => {
					const handlerFunc = (e) => {
						const pointer = (e.touches != null
							? e.touches[0]
							: e);
						if (pointer !== undefined) {
							const viewPoint = convertToViewBox(element, pointer.clientX, pointer.clientY)
								.map(n => (Number.isNaN(n) ? undefined : n));
							["x", "y"]
								.filter(prop => !Object.prototype.hasOwnProperty.call(e, prop))
								.forEach((prop, i) => defineGetter(e, prop, viewPoint[i]));
							if (!Object.prototype.hasOwnProperty.call(e, "position")) {
								defineGetter(e, "position", [...viewPoint]);
							}
							categoryUpdate[category](e, viewPoint);
						}
						handler(e);
					};
					if (element.addEventListener) {
						handlers[handlerName].push(handlerFunc);
						element.addEventListener(handlerName, handlerFunc);
					}
				});
			},
			enumerable: true,
		});
	});
	Object.defineProperty(element, "off", { value: () => off(element, handlers) });
};const makeUUID = () => Math.random()
	.toString(36)
	.replace(/[^a-z]+/g, "")
	.concat("aaaaa")
	.substr(0, 5);const Animation = function (element) {
	let start;
	const handlers = {};
	let frame = 0;
	let requestId;
	const removeHandlers = () => {
		if (SVGWindow().cancelAnimationFrame) {
			SVGWindow().cancelAnimationFrame(requestId);
		}
		Object.keys(handlers)
			.forEach(uuid => delete handlers[uuid]);
		start = undefined;
		frame = 0;
	};
	Object.defineProperty(element, "play", {
		set: (handler) => {
			removeHandlers();
			if (handler == null) { return; }
			const uuid = makeUUID();
			const handlerFunc = (e) => {
				if (!start) {
					start = e;
					frame = 0;
				}
				const progress = (e - start) * 0.001;
				handler({ time: progress, frame });
				frame += 1;
				if (handlers[uuid]) {
					requestId = SVGWindow().requestAnimationFrame(handlers[uuid]);
				}
			};
			handlers[uuid] = handlerFunc;
			if (SVGWindow().requestAnimationFrame) {
				requestId = SVGWindow().requestAnimationFrame(handlers[uuid]);
			}
		},
		enumerable: true,
	});
	Object.defineProperty(element, "stop", { value: removeHandlers, enumerable: true });
};const svg_add2 = (a, b) => [a[0] + b[0], a[1] + b[1]];
const svg_sub2 = (a, b) => [a[0] - b[0], a[1] - b[1]];
const svg_scale2 = (a, s) => [a[0] * s, a[1] * s];
const svg_magnitudeSq2 = (a) => (a[0] ** 2) + (a[1] ** 2);
const svg_magnitude2 = (a) => Math.sqrt(svg_magnitudeSq2(a));
const svg_distanceSq2 = (a, b) => svg_magnitudeSq2(svg_sub2(a, b));
const svg_distance2 = (a, b) => Math.sqrt(svg_distanceSq2(a, b));
const svg_polar_to_cart = (a, d) => [Math.cos(a) * d, Math.sin(a) * d];const removeFromParent = svg => (svg && svg.parentNode
	? svg.parentNode.removeChild(svg)
	: undefined);
const possiblePositionAttributes = [["cx", "cy"], ["x", "y"]];
const controlPoint = function (parent, options = {}) {
	const position = [0, 0];
	const cp = {
		selected: false,
		svg: undefined,
		updatePosition: input => input,
	};
	const updateSVG = () => {
		if (!cp.svg) { return; }
		if (!cp.svg.parentNode) {
			parent.appendChild(cp.svg);
		}
		possiblePositionAttributes
			.filter(coords => cp.svg[coords[0]] != null)
			.forEach(coords => coords.forEach((attr, i) => {
				cp.svg.setAttribute(attr, position[i]);
			}));
	};
	const proxy = new Proxy(position, {
		set: (target, property, value) => {
			target[property] = value;
			updateSVG();
			return true;
		},
	});
	const setPosition = function (...args) {
		makeCoordinates(...args.flat())
			.forEach((n, i) => { position[i] = n; });
		updateSVG();
		if (typeof position.delegate === str_function) {
			position.delegate.apply(position.pointsContainer, [proxy, position.pointsContainer]);
		}
	};
	position.delegate = undefined;
	position.setPosition = setPosition;
	position.onMouseMove = mouse => (cp.selected
		? setPosition(cp.updatePosition(mouse))
		: undefined);
	position.onMouseUp = () => { cp.selected = false; };
	position.distance = mouse => Math.sqrt(svg_distanceSq2(mouse, position));
	["x", "y"].forEach((prop, i) => Object.defineProperty(position, prop, {
		get: () => position[i],
		set: (v) => { position[i] = v; }
	}));
	[str_svg, "updatePosition", "selected"].forEach(key => Object
		.defineProperty(position, key, {
			get: () => cp[key],
			set: (v) => { cp[key] = v; },
		}));
	Object.defineProperty(position, "remove", {
		value: () => {
			removeFromParent(cp.svg);
			position.delegate = undefined;
		},
	});
	return proxy;
};
const controls = function (svg, number, options) {
	let selected;
	let delegate;
	const points = Array.from(Array(number))
		.map(() => controlPoint(svg, options));
	const protocol = point => (typeof delegate === str_function
		? delegate.call(points, point, selected, points)
		: undefined);
	points.forEach((p) => {
		p.delegate = protocol;
		p.pointsContainer = points;
	});
	const mousePressedHandler = function (mouse) {
		if (!(points.length > 0)) { return; }
		selected = points
			.map((p, i) => ({ i, d: svg_distanceSq2(p, [mouse.x, mouse.y]) }))
			.sort((a, b) => a.d - b.d)
			.shift()
			.i;
		points[selected].selected = true;
	};
	const mouseMovedHandler = function (mouse) {
		points.forEach(p => p.onMouseMove(mouse));
	};
	const mouseReleasedHandler = function () {
		points.forEach(p => p.onMouseUp());
		selected = undefined;
	};
	svg.onPress = mousePressedHandler;
	svg.onMove = mouseMovedHandler;
	svg.onRelease = mouseReleasedHandler;
	Object.defineProperty(points, "selectedIndex", { get: () => selected });
	Object.defineProperty(points, "selected", { get: () => points[selected] });
	Object.defineProperty(points, "add", {
		value: (opt) => {
			points.push(controlPoint(svg, opt));
		},
	});
	points.removeAll = () => {
		while (points.length > 0) {
			points.pop().remove();
		}
	};
	const functionalMethods = {
		onChange: (func, runOnceAtStart) => {
			delegate = func;
			if (runOnceAtStart === true) {
				const index = points.length - 1;
				func.call(points, points[index], index, points);
			}
		},
		position: func => points.forEach((p, i) => p.setPosition(func.call(points, p, i, points))),
		svg: func => points.forEach((p, i) => { p.svg = func.call(points, p, i, points); }),
	};
	Object.keys(functionalMethods).forEach((key) => {
		points[key] = function () {
			if (typeof arguments[0] === str_function) {
				functionalMethods[key](...arguments);
			}
			return points;
		};
	});
	points.parent = function (parent) {
		if (parent != null && parent.appendChild != null) {
			points.forEach((p) => { parent.appendChild(p.svg); });
		}
		return points;
	};
	return points;
};
const applyControlsToSVG = (svg) => {
	svg.controls = (...args) => controls.call(svg, svg, ...args);
};const svgDef = {
	svg: {
		args: (...args) => [makeViewBox(makeCoordinates(...args))].filter(a => a != null),
		methods: methods$2,
		init: (...args) => {
			const element = SVGWindow().document.createElementNS(NS, "svg");
			element.setAttribute("version", "1.1");
			element.setAttribute("xmlns", NS);
			args.filter(a => a != null)
				.filter(el => el.appendChild)
				.forEach(parent => parent.appendChild(element));
			TouchEvents(element);
			Animation(element);
			applyControlsToSVG(element);
			return element;
		},
	},
};const findIdURL = function (arg) {
	if (arg == null) { return ""; }
	if (typeof arg === str_string) {
		return arg.slice(0, 3) === "url"
			? arg
			: `url(#${arg})`;
	}
	if (arg.getAttribute != null) {
		const idString = arg.getAttribute(str_id);
		return `url(#${idString})`;
	}
	return "";
};
const methods$1 = {};
["clip-path",
	"mask",
	"symbol",
	"marker-end",
	"marker-mid",
	"marker-start",
].forEach(attr => {
	methods$1[toCamel(attr)] = (element, parent) => {
		element.setAttribute(attr, findIdURL(parent));
		return element;
	};
});const gDef = {
	g: {
		methods: {
			...TransformMethods,
			...methods$1,
			...dom,
		},
	},
};const setRadius = (el, r) => {
	el.setAttribute(nodes_attributes.circle[2], r);
	return el;
};
const setOrigin$1 = (el, a, b) => {
	[...makeCoordinates(...[a, b].flat()).slice(0, 2)]
		.forEach((value, i) => el.setAttribute(nodes_attributes.circle[i], value));
	return el;
};
const fromPoints = (a, b, c, d) => [a, b, svg_distance2([a, b], [c, d])];
const circleDef = {
	circle: {
		args: (a, b, c, d) => {
			const coords = makeCoordinates(...[a, b, c, d].flat());
			switch (coords.length) {
			case 0: case 1: return [, , ...coords];
			case 2: case 3: return coords;
			default: return fromPoints(...coords);
			}
		},
		methods: {
			radius: setRadius,
			setRadius,
			origin: setOrigin$1,
			setOrigin: setOrigin$1,
			center: setOrigin$1,
			setCenter: setOrigin$1,
			position: setOrigin$1,
			setPosition: setOrigin$1,
			...TransformMethods,
			...methods$1,
			...dom,
		},
	},
};const setRadii = (el, rx, ry) => {
	[, , rx, ry].forEach((value, i) => el.setAttribute(nodes_attributes.ellipse[i], value));
	return el;
};
const setOrigin = (el, a, b) => {
	[...makeCoordinates(...[a, b].flat()).slice(0, 2)]
		.forEach((value, i) => el.setAttribute(nodes_attributes.ellipse[i], value));
	return el;
};
const ellipseDef = {
	ellipse: {
		args: (a, b, c, d) => {
			const coords = makeCoordinates(...[a, b, c, d].flat()).slice(0, 4);
			switch (coords.length) {
			case 0: case 1: case 2: return [, , ...coords];
			default: return coords;
			}
		},
		methods: {
			radius: setRadii,
			setRadius: setRadii,
			origin: setOrigin,
			setOrigin,
			center: setOrigin,
			setCenter: setOrigin,
			position: setOrigin,
			setPosition: setOrigin,
			...TransformMethods,
			...methods$1,
			...dom,
		},
	},
};const svgIsIterable = (obj) => obj != null
	&& typeof obj[Symbol.iterator] === str_function;
const svgSemiFlattenArrays = function () {
	switch (arguments.length) {
	case 0: return Array.from(arguments);
	case 1: return svgIsIterable(arguments[0]) && typeof arguments[0] !== str_string
		? svgSemiFlattenArrays(...arguments[0])
		: [arguments[0]];
	default:
		return Array.from(arguments).map(a => (svgIsIterable(a)
			? [...svgSemiFlattenArrays(a)]
			: a));
	}
};const Args$1 = (...args) => makeCoordinates(...svgSemiFlattenArrays(...args)).slice(0, 4);
const setPoints$3 = (element, ...args) => {
	Args$1(...args).forEach((value, i) => element.setAttribute(nodes_attributes.line[i], value));
	return element;
};
const lineDef = {
	line: {
		args: Args$1,
		methods: {
			setPoints: setPoints$3,
			...TransformMethods,
			...methods$1,
			...dom,
		},
	},
};const markerRegEx = /[MmLlSsQqLlHhVvCcSsQqTtAaZz]/g;
const digitRegEx = /-?[0-9]*\.?\d+/g;
const pathCommandNames = {
	m: "move",
	l: "line",
	v: "vertical",
	h: "horizontal",
	a: "ellipse",
	c: "curve",
	s: "smoothCurve",
	q: "quadCurve",
	t: "smoothQuadCurve",
	z: "close",
};
Object.keys(pathCommandNames).forEach((key) => {
	const s = pathCommandNames[key];
	pathCommandNames[key.toUpperCase()] = s.charAt(0).toUpperCase() + s.slice(1);
});
const parsePathCommands = (d) => {
	const results = [];
	let match;
	while ((match = markerRegEx.exec(d)) !== null) {
		results.push(match);
	}
	return results
		.map((result, i, arr) => [
			result[0],
			result.index,
			i === arr.length - 1
				? d.length - 1
				: arr[(i + 1) % arr.length].index - 1,
		])
		.map(el => {
			const command = el[0];
			const valueString = d.substring(el[1] + 1, el[2] + 1);
			const strings = valueString.match(digitRegEx);
			const values = strings ? strings.map(parseFloat) : [];
			return { command, values };
		});
};const getD = (el) => {
	const attr = el.getAttribute("d");
	return (attr == null) ? "" : attr;
};
const clear = element => {
	element.removeAttribute("d");
	return element;
};
const appendPathCommand = (el, command, ...args) => {
	el.setAttribute("d", `${getD(el)}${command}${args.flat().join(" ")}`);
	return el;
};
const getCommands = element => parsePathCommands(getD(element));
const path_methods = {
	addCommand: appendPathCommand,
	appendCommand: appendPathCommand,
	clear,
	getCommands: getCommands,
	get: getCommands,
	getD: el => el.getAttribute("d"),
	...TransformMethods,
	...methods$1,
	...dom,
};
Object.keys(pathCommandNames).forEach((key) => {
	path_methods[pathCommandNames[key]] = (el, ...args) => appendPathCommand(el, key, ...args);
});
const pathDef = {
	path: {
		methods: path_methods,
	},
};const setRectSize = (el, rx, ry) => {
	[, , rx, ry]
		.forEach((value, i) => el.setAttribute(nodes_attributes.rect[i], value));
	return el;
};
const setRectOrigin = (el, a, b) => {
	[...makeCoordinates(...[a, b].flat()).slice(0, 2)]
		.forEach((value, i) => el.setAttribute(nodes_attributes.rect[i], value));
	return el;
};
const fixNegatives = function (arr) {
	[0, 1].forEach(i => {
		if (arr[2 + i] < 0) {
			if (arr[0 + i] === undefined) { arr[0 + i] = 0; }
			arr[0 + i] += arr[2 + i];
			arr[2 + i] = -arr[2 + i];
		}
	});
	return arr;
};
const rectDef = {
	rect: {
		args: (a, b, c, d) => {
			const coords = makeCoordinates(...[a, b, c, d].flat()).slice(0, 4);
			switch (coords.length) {
			case 0: case 1: case 2: case 3: return fixNegatives([, , ...coords]);
			default: return fixNegatives(coords);
			}
		},
		methods: {
			origin: setRectOrigin,
			setOrigin: setRectOrigin,
			center: setRectOrigin,
			setCenter: setRectOrigin,
			size: setRectSize,
			setSize: setRectSize,
			...TransformMethods,
			...methods$1,
			...dom,
		},
	},
};const styleDef = {
	style: {
		init: (text) => {
			const el = SVGWindow().document.createElementNS(NS, "style");
			el.setAttribute("type", "text/css");
			el.textContent = "";
			el.appendChild(makeCDATASection(text));
			return el;
		},
		methods: {
			setTextContent: (el, text) => {
				el.textContent = "";
				el.appendChild(makeCDATASection(text));
				return el;
			},
		},
	},
};const textDef = {
	text: {
		args: (a, b, c) => makeCoordinates(...[a, b, c].flat()).slice(0, 2),
		init: (a, b, c, d) => {
			const element = SVGWindow().document.createElementNS(NS, "text");
			const text = [a, b, c, d].filter(el => typeof el === str_string).shift();
			element.appendChild(SVGWindow().document.createTextNode(text || ""));
			return element;
		},
		methods: {
			...TransformMethods,
			...methods$1,
			appendTo,
			setAttributes,
		},
	},
};const makeIDString = function () {
	return Array.from(arguments)
		.filter(a => typeof a === str_string || a instanceof String)
		.shift() || makeUUID();
};
const maskArgs = (...args) => [makeIDString(...args)];
const maskTypes = {
	mask: {
		args: maskArgs,
		methods: {
			...TransformMethods,
			...methods$1,
			...dom,
		},
	},
	clipPath: {
		args: maskArgs,
		methods: {
			...TransformMethods,
			...methods$1,
			...dom,
		},
	},
	symbol: {
		args: maskArgs,
		methods: {
			...TransformMethods,
			...methods$1,
			...dom,
		},
	},
	marker: {
		args: maskArgs,
		methods: {
			size: setViewBox,
			setViewBox: setViewBox,
			...TransformMethods,
			...methods$1,
			...dom,
		},
	},
};const getPoints = (el) => {
	const attr = el.getAttribute(str_points);
	return (attr == null) ? "" : attr;
};
const polyString = function () {
	return Array
		.from(Array(Math.floor(arguments.length / 2)))
		.map((_, i) => `${arguments[i * 2 + 0]},${arguments[i * 2 + 1]}`)
		.join(" ");
};
const stringifyArgs = (...args) => [
	polyString(...makeCoordinates(...svgSemiFlattenArrays(...args))),
];
const setPoints$2 = (element, ...args) => {
	element.setAttribute(str_points, stringifyArgs(...args)[0]);
	return element;
};
const addPoint = (element, ...args) => {
	element.setAttribute(str_points, [getPoints(element), stringifyArgs(...args)[0]]
		.filter(a => a !== "")
		.join(" "));
	return element;
};
const Args = function (...args) {
	return args.length === 1 && typeof args[0] === str_string
		? [args[0]]
		: stringifyArgs(...args);
};
const polyDefs = {
	polyline: {
		args: Args,
		methods: {
			setPoints: setPoints$2,
			addPoint,
			...TransformMethods,
			...methods$1,
			...dom,
		},
	},
	polygon: {
		args: Args,
		methods: {
			setPoints: setPoints$2,
			addPoint,
			...TransformMethods,
			...methods$1,
			...dom,
		},
	},
};const arcPath = (x, y, radius, startAngle, endAngle, includeCenter = false) => {
	if (endAngle == null) { return ""; }
	const start = svg_polar_to_cart(startAngle, radius);
	const end = svg_polar_to_cart(endAngle, radius);
	const arcVec = [end[0] - start[0], end[1] - start[1]];
	const py = start[0] * end[1] - start[1] * end[0];
	const px = start[0] * end[0] + start[1] * end[1];
	const arcdir = (Math.atan2(py, px) > 0 ? 0 : 1);
	let d = (includeCenter
		? `M ${x},${y} l ${start[0]},${start[1]} `
		: `M ${x + start[0]},${y + start[1]} `);
	d += ["a ", radius, radius, 0, arcdir, 1, arcVec[0], arcVec[1]].join(" ");
	if (includeCenter) { d += " Z"; }
	return d;
};const arcArguments = (a, b, c, d, e) => [arcPath(a, b, c, d, e, false)];
const arcDef = {
	arc: {
		nodeName: str_path,
		attributes: ["d"],
		args: arcArguments,
		methods: {
			setArc: (el, ...args) => el.setAttribute("d", arcArguments(...args)),
			...TransformMethods,
		},
	},
};const ends = [str_tail, str_head];
const stringifyPoint = p => p.join(",");
const pointsToPath = (points) => "M" + points.map(pt => pt.join(",")).join("L") + "Z";
const makeArrowPaths = function (options) {
	let pts = [[0,1], [2,3]].map(pt => pt.map(i => options.points[i] || 0));
	let vector = svg_sub2(pts[1], pts[0]);
	let midpoint = svg_add2(pts[0], svg_scale2(vector, 0.5));
	const len = svg_magnitude2(vector);
	const minLength = ends
		.map(s => (options[s].visible
			? (1 + options[s].padding) * options[s].height * 2.5
			: 0))
		.reduce((a, b) => a + b, 0);
	if (len < minLength) {
		const minVec = len === 0 ? [minLength, 0] : svg_scale2(vector, minLength / len);
		pts = [svg_sub2, svg_add2].map(f => f(midpoint, svg_scale2(minVec, 0.5)));
		vector = svg_sub2(pts[1], pts[0]);
	}
	let perpendicular = [vector[1], -vector[0]];
	let bezPoint = svg_add2(midpoint, svg_scale2(perpendicular, options.bend));
	const bezs = pts.map(pt => svg_sub2(bezPoint, pt));
	const bezsLen = bezs.map(v => svg_magnitude2(v));
	const bezsNorm = bezs.map((bez, i) => bezsLen[i] === 0
		? bez
		: svg_scale2(bez, 1 / bezsLen[i]));
	const vectors = bezsNorm.map(norm => svg_scale2(norm, -1));
	const normals = vectors.map(vec => [vec[1], -vec[0]]);
	const pad = ends.map((s, i) => options[s].padding
		? options[s].padding
		: (options.padding ? options.padding : 0.0));
	const scales = ends
		.map((s, i) => options[s].height * (options[s].visible ? 1 : 0))
		.map((n, i) => n + pad[i]);
	const arcs = pts.map((pt, i) => svg_add2(pt, svg_scale2(bezsNorm[i], scales[i])));
	vector = svg_sub2(arcs[1], arcs[0]);
	perpendicular = [vector[1], -vector[0]];
	midpoint = svg_add2(arcs[0], svg_scale2(vector, 0.5));
	bezPoint = svg_add2(midpoint, svg_scale2(perpendicular, options.bend));
	const controls = arcs
		.map((arc, i) => svg_add2(arc, svg_scale2(svg_sub2(bezPoint, arc), options.pinch)));
	const polyPoints = ends.map((s, i) => [
		svg_add2(arcs[i], svg_scale2(vectors[i], options[s].height)),
		svg_add2(arcs[i], svg_scale2(normals[i], options[s].width / 2)),
		svg_add2(arcs[i], svg_scale2(normals[i], -options[s].width / 2)),
	]);
	return {
		line: `M${stringifyPoint(arcs[0])}C${stringifyPoint(controls[0])},${stringifyPoint(controls[1])},${stringifyPoint(arcs[1])}`,
		tail: pointsToPath(polyPoints[0]),
		head: pointsToPath(polyPoints[1]),
	};
};const setArrowheadOptions = (element, options, which) => {
	if (typeof options === str_boolean) {
		element.options[which].visible = options;
	} else if (typeof options === str_object) {
		Object.assign(element.options[which], options);
		if (options.visible == null) {
			element.options[which].visible = true;
		}
	} else if (options == null) {
		element.options[which].visible = true;
	}
};
const setArrowStyle = (element, options = {}, which = str_head) => {
	const path = element.getElementsByClassName(`${str_arrow}-${which}`)[0];
	Object.keys(options)
		.map(key => ({ key, fn: path[toCamel(key)] }))
		.filter(el => typeof el.fn === str_function && el.key !== "class")
		.forEach(el => el.fn(options[el.key]));
	Object.keys(options)
		.filter(key => key === "class")
		.forEach(key => path.classList.add(options[key]));
};
const redraw = (element) => {
	const paths = makeArrowPaths(element.options);
	Object.keys(paths)
		.map(path => ({
			path,
			element: element.getElementsByClassName(`${str_arrow}-${path}`)[0],
		}))
		.filter(el => el.element)
		.map(el => { el.element.setAttribute("d", paths[el.path]); return el; })
		.filter(el => element.options[el.path])
		.forEach(el => el.element.setAttribute(
			"visibility",
			element.options[el.path].visible
				? "visible"
				: "hidden",
		));
	return element;
};
const setPoints$1 = (element, ...args) => {
	element.options.points = makeCoordinates(...svgSemiFlattenArrays(...args)).slice(0, 4);
	return redraw(element);
};
const bend$1 = (element, amount) => {
	element.options.bend = amount;
	return redraw(element);
};
const pinch$1 = (element, amount) => {
	element.options.pinch = amount;
	return redraw(element);
};
const padding = (element, amount) => {
	element.options.padding = amount;
	return redraw(element);
};
const head = (element, options) => {
	setArrowheadOptions(element, options, str_head);
	setArrowStyle(element, options, str_head);
	return redraw(element);
};
const tail = (element, options) => {
	setArrowheadOptions(element, options, str_tail);
	setArrowStyle(element, options, str_tail);
	return redraw(element);
};
const getLine = element => element.getElementsByClassName(`${str_arrow}-line`)[0];
const getHead = element => element.getElementsByClassName(`${str_arrow}-${str_head}`)[0];
const getTail = element => element.getElementsByClassName(`${str_arrow}-${str_tail}`)[0];
const ArrowMethods = {
	setPoints: setPoints$1,
	points: setPoints$1,
	bend: bend$1,
	pinch: pinch$1,
	padding,
	head,
	tail,
	getLine,
	getHead,
	getTail,
	...TransformMethods,
};const endOptions = () => ({
	visible: false,
	width: 8,
	height: 10,
	padding: 0.0,
});
const makeArrowOptions = () => ({
	head: endOptions(),
	tail: endOptions(),
	bend: 0.0,
	padding: 0.0,
	pinch: 0.618,
	points: [],
});const arrowKeys = Object.keys(makeArrowOptions());
const matchingOptions = (...args) => {
	for (let a = 0; a < args.length; a += 1) {
		if (typeof args[a] !== str_object) { continue; }
		const keys = Object.keys(args[a]);
		for (let i = 0; i < keys.length; i += 1) {
			if (arrowKeys.includes(keys[i])) {
				return args[a];
			}
		}
	}
	return undefined;
};
const init$1 = function (element, ...args) {
	element.classList.add(str_arrow);
	const paths = ["line", str_tail, str_head].map(key => {
		const path = SVGWindow().document.createElementNS(NS, str_path);
		path.className = `${str_arrow}-${key}`;
		element.appendChild(path);
		return path;
	});
	paths[0].setAttribute(str_style, "fill:none;");
	paths[1].setAttribute(str_stroke, str_none);
	paths[2].setAttribute(str_stroke, str_none);
	element.options = makeArrowOptions();
	ArrowMethods.setPoints(element, ...args);
	const options = matchingOptions(...args);
	if (options) {
		Object.keys(options)
			.filter(key => ArrowMethods[key])
			.forEach(key => ArrowMethods[key](element, options[key]));
	}
	return element;
};const arrowDef = {
	arrow: {
		nodeName: "g",
		attributes: [],
		args: () => [],
		methods: ArrowMethods,
		init: init$1,
	},
};const makeCurvePath = (endpoints = [], bend = 0, pinch = 0.5) => {
	const tailPt = [endpoints[0] || 0, endpoints[1] || 0];
	const headPt = [endpoints[2] || 0, endpoints[3] || 0];
	const vector = svg_sub2(headPt, tailPt);
	const midpoint = svg_add2(tailPt, svg_scale2(vector, 0.5));
	const perpendicular = [vector[1], -vector[0]];
	const bezPoint = svg_add2(midpoint, svg_scale2(perpendicular, bend));
	const tailControl = svg_add2(tailPt, svg_scale2(svg_sub2(bezPoint, tailPt), pinch));
	const headControl = svg_add2(headPt, svg_scale2(svg_sub2(bezPoint, headPt), pinch));
	return `M${tailPt[0]},${tailPt[1]}C${tailControl[0]},${tailControl[1]} ${headControl[0]},${headControl[1]} ${headPt[0]},${headPt[1]}`;
};const curveArguments = (...args) => [
	makeCurvePath(makeCoordinates(...args.flat())),
];const getNumbersFromPathCommand = str => str
	.slice(1)
	.split(/[, ]+/)
	.map(s => parseFloat(s));
const getCurveTos = d => d
	.match(/[Cc][(0-9), .-]+/)
	.map(curve => getNumbersFromPathCommand(curve));
const getMoveTos = d => d
	.match(/[Mm][(0-9), .-]+/)
	.map(curve => getNumbersFromPathCommand(curve));
const getCurveEndpoints = (d) => {
	const move = getMoveTos(d).shift();
	const curve = getCurveTos(d).shift();
	const start = move
		? [move[move.length - 2], move[move.length - 1]]
		: [0, 0];
	const end = curve
		? [curve[curve.length - 2], curve[curve.length - 1]]
		: [0, 0];
	return [...start, ...end];
};const setPoints = (element, ...args) => {
	const coords = makeCoordinates(...args.flat()).slice(0, 4);
	element.setAttribute("d", makeCurvePath(coords, element._bend, element._pinch));
	return element;
};
const bend = (element, amount) => {
	element._bend = amount;
	return setPoints(element, ...getCurveEndpoints(element.getAttribute("d")));
};
const pinch = (element, amount) => {
	element._pinch = amount;
	return setPoints(element, ...getCurveEndpoints(element.getAttribute("d")));
};
const curve_methods = {
	setPoints,
	bend,
	pinch,
	...TransformMethods,
};const curveDef = {
	curve: {
		nodeName: str_path,
		attributes: ["d"],
		args: curveArguments,
		methods: curve_methods,
	},
};const COUNT = 128;
const parabolaArguments = (x = -1, y = 0, width = 2, height = 1) => Array
	.from(Array(COUNT + 1))
	.map((_, i) => ((i - (COUNT)) / COUNT) * 2 + 1)
	.map(i => [
		x + (i + 1) * width * 0.5,
		y + (i ** 2) * height,
	]);
const parabolaPathString = (a, b, c, d) => [
	parabolaArguments(a, b, c, d).map(n => `${n[0]},${n[1]}`).join(" "),
];const parabolaDef = {
	parabola: {
		nodeName: "polyline",
		attributes: [str_points],
		args: parabolaPathString,
		methods: {
			...TransformMethods,
		},
	},
};const roundRectArguments = (x, y, width, height, cornerRadius = 0) => {
	if (cornerRadius > width / 2) { cornerRadius = width / 2; }
	if (cornerRadius > height / 2) { cornerRadius = height / 2; }
	const w = width - cornerRadius * 2;
	const h = height - cornerRadius * 2;
	const s = `A${cornerRadius} ${cornerRadius} 0 0 1`;
	return [[`M${x + (width - w) / 2},${y}`, `h${w}`, s, `${x + width},${y + (height - h) / 2}`, `v${h}`, s, `${x + width - cornerRadius},${y + height}`, `h${-w}`, s, `${x},${y + height - cornerRadius}`, `v${-h}`, s, `${x + cornerRadius},${y}`].join(" ")];
};const roundRectDef = {
	roundRect: {
		nodeName: str_path,
		attributes: ["d"],
		args: roundRectArguments,
		methods: {
			...TransformMethods,
		},
	},
};const wedgeArguments = (a, b, c, d, e) => [arcPath(a, b, c, d, e, true)];
const wedgeDef = {
	wedge: {
		nodeName: str_path,
		args: wedgeArguments,
		attributes: ["d"],
		methods: {
			setArc: (el, ...args) => el.setAttribute("d", wedgeArguments(...args)),
			...TransformMethods,
		},
	},
};const lib = {};const init = (...args) => {
	const g = SVGWindow().document.createElementNS(NS, "g");
	lib.ear.convert.foldToSvg.drawInto(g, ...args);
	return g;
};const methods = {
	...TransformMethods,
	...methods$1,
	...dom,
};const origamiDef = {
	origami: {
		nodeName: "g",
		init,
		methods,
	},
};const extensions = {
	...svgDef,
	...gDef,
	...circleDef,
	...ellipseDef,
	...lineDef,
	...pathDef,
	...rectDef,
	...styleDef,
	...textDef,
	...maskTypes,
	...polyDefs,
	...arcDef,
	...arrowDef,
	...curveDef,
	...parabolaDef,
	...roundRectDef,
	...wedgeDef,
	...origamiDef,
};const passthroughArgs = (...args) => args;
const Constructor = (name, parent, ...initArgs) => {
	const nodeName = extensions[name] && extensions[name].nodeName
		? extensions[name].nodeName
		: name;
	const { init, args, methods } = extensions[name] || {};
	const attributes = nodes_attributes[nodeName] || [];
	const children = nodes_children[nodeName] || [];
	const element = init
		?	init(...initArgs)
		: SVGWindow().document.createElementNS(NS, nodeName);
	if (parent) { parent.appendChild(element); }
	const processArgs = args || passthroughArgs;
	processArgs(...initArgs).forEach((v, i) => {
		element.setAttribute(nodes_attributes[nodeName][i], v);
	});
	if (methods) {
		Object.keys(methods)
			.forEach(methodName => Object.defineProperty(element, methodName, {
				value: function () {
					return methods[methodName](element, ...arguments);
				},
			}));
	}
	attributes.forEach((attribute) => {
		const attrNameCamel = toCamel(attribute);
		if (element[attrNameCamel]) { return; }
		Object.defineProperty(element, attrNameCamel, {
			value: function () {
				element.setAttribute(attribute, ...arguments);
				return element;
			},
		});
	});
	children.forEach((childNode) => {
		if (element[childNode]) { return; }
		const value = function () { return Constructor(childNode, element, ...arguments); };
		Object.defineProperty(element, childNode, { value });
	});
	return element;
};const SVG = (...args) => {
	const svg = Constructor(str_svg, null, ...args);
	const initialize = () => args
		.filter(arg => typeof arg === str_function)
		.forEach(func => func.call(svg, svg));
	if (SVGWindow().document.readyState === "loading") {
		SVGWindow().document.addEventListener("DOMContentLoaded", initialize);
	} else {
		initialize();
	}
	return svg;
};
Object.assign(SVG, {
	NS,
	nodes_attributes,
	nodes_children,
	extensions,
});
nodeNames.forEach(nodeName => {
	SVG[nodeName] = (...args) => Constructor(nodeName, null, ...args);
});
Object.defineProperty(SVG, "window", {
	enumerable: false,
	set: setSVGWindow,
});const verticesCircle = (graph, attributes = {}) => {
	const g = SVG.g();
	if (!graph || !graph.vertices_coords) { return g; }
	graph.vertices_coords
		.map(v => SVG.circle(v[0], v[1], 0.01))
		.forEach(v => g.appendChild(v));
	g.setAttributeNS(null, "fill", _none);
	Object.keys(attributes)
		.forEach(attr => g.setAttributeNS(null, attr, attributes[attr]));
	return g;
};const classListPolyfill = (el, ...classes) => {
	const hash = {};
	const getClass = el.getAttribute("class");
	const classArray = getClass ? getClass.split(" ") : [];
	classArray.push(...classes);
	classArray.forEach(str => { hash[str] = true; });
	const classString = Object.keys(hash).join(" ");
	el.setAttribute("class", classString);
};
const addClass = (el, ...classes) => {
	if (!el) { return undefined; }
	return el.classList
		? el.classList.add(...classes)
		: classListPolyfill(el, ...classes);
};const GROUP_FOLDED = {};
const GROUP_FLAT = {
	stroke: _black,
};
const STYLE_FOLDED = {};
const STYLE_FLAT = {
	M: { stroke: "red" },
	m: { stroke: "red" },
	V: { stroke: "blue" },
	v: { stroke: "blue" },
	F: { stroke: "lightgray" },
	f: { stroke: "lightgray" },
};
const edgesAssignmentIndices = (graph) => {
	const assignment_indices = {
		u: [], f: [], v: [], m: [], b: [],
	};
	const lowercase_assignment = graph[_edges_assignment]
		.map(a => a.toLowerCase());
	graph[_edges_vertices]
		.map((_, i) => lowercase_assignment[i] || "u")
		.forEach((a, i) => assignment_indices[a].push(i));
	return assignment_indices;
};
const edgesCoords = ({ vertices_coords, edges_vertices }) => {
	if (!vertices_coords || !edges_vertices) { return []; }
	return edges_vertices.map(ev => ev.map(v => vertices_coords[v]));
};
const segmentToPath = s => `M${s[0][0]} ${s[0][1]}L${s[1][0]} ${s[1][1]}`;
const edgesPathData = (graph) => edgesCoords(graph)
	.map(segment => segmentToPath(segment)).join("");
const edgesPathDataAssign = ({ vertices_coords, edges_vertices, edges_assignment }) => {
	if (!vertices_coords || !edges_vertices) { return {}; }
	if (!edges_assignment) {
		return ({ u: edgesPathData({ vertices_coords, edges_vertices }) });
	}
	const data = edgesAssignmentIndices({ vertices_coords, edges_vertices, edges_assignment });
	Object.keys(data).forEach(key => {
		data[key] = edgesPathData({
			vertices_coords,
			edges_vertices: data[key].map(i => edges_vertices[i]),
		});
	});
	Object.keys(data).forEach(key => {
		if (data[key] === "") { delete data[key]; }
	});
	return data;
};
const edgesPathsAssign = ({ vertices_coords, edges_vertices, edges_assignment }) => {
	const data = edgesPathDataAssign({ vertices_coords, edges_vertices, edges_assignment });
	Object.keys(data).forEach(assignment => {
		const path = SVG.path(data[assignment]);
		addClass(path, edgesAssignmentNames[assignment]);
		data[assignment] = path;
	});
	return data;
};
const applyEdgesStyle = (el, attributes = {}) => Object.keys(attributes)
	.forEach(key => el.setAttributeNS(null, key, attributes[key]));
const edgesPaths = (graph, attributes = {}) => {
	const group = SVG.g();
	if (!graph) { return group; }
	const isFolded = isFoldedForm(graph);
	const paths = edgesPathsAssign(graph);
	Object.keys(paths).forEach(key => {
		addClass(paths[key], edgesAssignmentNames[key]);
		applyEdgesStyle(paths[key], isFolded ? STYLE_FOLDED[key] : STYLE_FLAT[key]);
		applyEdgesStyle(paths[key], attributes[key]);
		applyEdgesStyle(paths[key], attributes[edgesAssignmentNames[key]]);
		group.appendChild(paths[key]);
		Object.defineProperty(group, edgesAssignmentNames[key], { get: () => paths[key] });
	});
	applyEdgesStyle(group, isFolded ? GROUP_FOLDED : GROUP_FLAT);
	applyEdgesStyle(group, attributes.stroke ? { stroke: attributes.stroke } : {});
	return group;
};
const angleToOpacity = (foldAngle) => (Math.abs(foldAngle) / 180);
const edgesLines = (graph, attributes = {}) => {
	const group = SVG.g();
	if (!graph) { return group; }
	const isFolded = isFoldedForm(graph);
	const edges_assignment = (graph.edges_assignment
		? graph.edges_assignment
		: makeEdgesAssignment(graph))
		.map(assign => assign.toLowerCase());
	const groups_by_key = {};
	["b", "m", "v", "f", "u"].forEach(k => {
		const child_group = SVG.g();
		group.appendChild(child_group);
		addClass(child_group, edgesAssignmentNames[k]);
		applyEdgesStyle(child_group, isFolded ? STYLE_FOLDED[k] : STYLE_FLAT[k]);
		applyEdgesStyle(child_group, attributes[edgesAssignmentNames[k]]);
		Object.defineProperty(group, edgesAssignmentNames[k], {
			get: () => child_group,
		});
		groups_by_key[k] = child_group;
	});
	const lines = graph.edges_vertices
		.map(ev => ev.map(v => graph.vertices_coords[v]))
		.map(l => SVG.line(l[0][0], l[0][1], l[1][0], l[1][1]));
	if (graph.edges_foldAngle) {
		lines.forEach((line, i) => {
			const angle = graph.edges_foldAngle[i];
			if (angle === 0 || angle === 180 || angle === -180) { return; }
			line.setAttributeNS(null, "opacity", angleToOpacity(angle));
		});
	}
	lines.forEach((line, i) => groups_by_key[edges_assignment[i]]
		.appendChild(line));
	applyEdgesStyle(group, isFolded ? GROUP_FOLDED : GROUP_FLAT);
	applyEdgesStyle(group, attributes.stroke ? { stroke: attributes.stroke } : {});
	return group;
};
const drawEdges = (graph, attributes) => (
	edgesFoldAngleAreAllFlat(graph)
		? edgesPaths(graph, attributes)
		: edgesLines(graph, attributes)
);const makeFacesWindingFromMatrix = faces_matrix => faces_matrix
	.map(m => m[0] * m[4] - m[1] * m[3])
	.map(c => c >= 0);
const makeFacesWindingFromMatrix2 = faces_matrix => faces_matrix
	.map(m => m[0] * m[3] - m[1] * m[2])
	.map(c => c >= 0);
const makeFacesWinding$1 = ({ vertices_coords, faces_vertices }) => faces_vertices
	.map(vertices => vertices
		.map(v => vertices_coords[v])
		.map((point, i, arr) => [point, arr[(i + 1) % arr.length]])
		.map(pts => (pts[1][0] - pts[0][0]) * (pts[1][1] + pts[0][1]))
		.reduce((a, b) => a + b, 0))
	.map(face => face < 0);const facesWinding=/*#__PURE__*/Object.freeze({__proto__:null,makeFacesWinding:makeFacesWinding$1,makeFacesWindingFromMatrix,makeFacesWindingFromMatrix2});const FACE_STYLE_FOLDED_ORDERED = {
	back: { fill: _white },
	front: { fill: "#ddd" },
};
const FACE_STYLE_FOLDED_UNORDERED = {
	back: { opacity: 0.1 },
	front: { opacity: 0.1 },
};
const FACE_STYLE_FLAT = {
};
const GROUP_STYLE_FOLDED_ORDERED = {
	stroke: _black,
	"stroke-linejoin": "bevel",
};
const GROUP_STYLE_FOLDED_UNORDERED = {
	stroke: _none,
	fill: _black,
	"stroke-linejoin": "bevel",
};
const GROUP_STYLE_FLAT = {
	fill: _none,
};
const faces_sorted_by_layer = function (faces_layer, graph) {
	const faceCount = graph.faces_vertices.length || graph.faces_edges.length;
	const missingFaces = Array.from(Array(faceCount))
		.map((_, i) => i)
		.filter(i => faces_layer[i] == null);
	return missingFaces.concat(invertMap(faces_layer));
};
const applyFacesStyle = (el, attributes = {}) => Object.keys(attributes)
	.forEach(key => el.setAttributeNS(null, key, attributes[key]));
const finalize_faces = (graph, svg_faces, group, attributes) => {
	const isFolded = isFoldedForm(graph);
	const orderIsCertain = graph[_faces_layer] != null;
	const classNames = [[_front], [_back]];
	const faces_winding = makeFacesWinding$1(graph);
	faces_winding.map(w => (w ? classNames[0] : classNames[1]))
		.forEach((className, i) => {
			addClass(svg_faces[i], className);
			applyFacesStyle(svg_faces[i], (isFolded
				? (orderIsCertain
					? FACE_STYLE_FOLDED_ORDERED[className]
					: FACE_STYLE_FOLDED_UNORDERED[className])
				: FACE_STYLE_FLAT[className]));
			applyFacesStyle(svg_faces[i], attributes[className]);
		});
	const facesInOrder = (orderIsCertain
		? faces_sorted_by_layer(graph[_faces_layer], graph).map(i => svg_faces[i])
		: svg_faces);
	facesInOrder.forEach(face => group.appendChild(face));
	Object.defineProperty(group, _front, {
		get: () => svg_faces.filter((_, i) => faces_winding[i]),
	});
	Object.defineProperty(group, _back, {
		get: () => svg_faces.filter((_, i) => !faces_winding[i]),
	});
	applyFacesStyle(group, (isFolded
		? (orderIsCertain
			? GROUP_STYLE_FOLDED_ORDERED
			: GROUP_STYLE_FOLDED_UNORDERED)
		: GROUP_STYLE_FLAT));
	return group;
};
const facesVerticesPolygon = (graph, attributes = {}) => {
	const g = SVG.g();
	if (!graph || !graph.vertices_coords || !graph.faces_vertices) { return g; }
	const svg_faces = graph.faces_vertices
		.map(fv => fv.map(v => [0, 1].map(i => graph.vertices_coords[v][i])))
		.map(face => SVG.polygon(face));
	svg_faces.forEach((face, i) => face.setAttributeNS(null, _index, i));
	g.setAttributeNS(null, "fill", _white);
	return finalize_faces(graph, svg_faces, g, attributes);
};
const facesEdgesPolygon = function (graph, attributes = {}) {
	const g = SVG.g();
	if (!graph
		|| _faces_edges in graph === false
		|| _edges_vertices in graph === false
		|| _vertices_coords in graph === false) {
		return g;
	}
	const svg_faces = graph[_faces_edges]
		.map(face_edges => face_edges
			.map(edge => graph[_edges_vertices][edge])
			.map((vi, i, arr) => {
				const next = arr[(i + 1) % arr.length];
				return (vi[1] === next[0] || vi[1] === next[1] ? vi[0] : vi[1]);
			}).map(v => [0, 1].map(i => graph[_vertices_coords][v][i])))
		.map(face => SVG.polygon(face));
	svg_faces.forEach((face, i) => face.setAttributeNS(null, _index, i));
	g.setAttributeNS(null, "fill", "white");
	return finalize_faces(graph, svg_faces, g, attributes);
};const FOLDED = {
	fill: _none,
};
const FLAT = {
	stroke: _black,
	fill: _white,
};
const applyBoundariesStyle = (el, attributes = {}) => Object.keys(attributes)
	.forEach(key => el.setAttributeNS(null, key, attributes[key]));
const boundariesPolygon = (graph, attributes = {}) => {
	const g = SVG.g();
	if (!graph
		|| !graph.vertices_coords
		|| !graph.edges_vertices
		|| !graph.edges_assignment) {
		return g;
	}
	const b = boundary(graph)
		.vertices
		.map(v => [0, 1].map(i => graph.vertices_coords[v][i]));
	if (b.length === 0) { return g; }
	const poly = SVG.polygon(b);
	addClass(poly, _boundary);
	g.appendChild(poly);
	applyBoundariesStyle(g, isFoldedForm(graph) ? FOLDED : FLAT);
	Object.keys(attributes)
		.forEach(attr => g.setAttributeNS(null, attr, attributes[attr]));
	return g;
};const facesDrawFunction = (graph, options) => {
	if (graph && graph[_faces_vertices]) {
		return facesVerticesPolygon(graph, options);
	}
	if (graph && graph[_faces_edges]) {
		return facesEdgesPolygon(graph, options);
	}
	return SVG.g();
};
const svg_draw_func = {
	vertices: verticesCircle,
	edges: drawEdges,
	faces: facesDrawFunction,
	boundaries: boundariesPolygon,
};
const drawGroup = (key, graph, options) => {
	const group = options === false ? (SVG.g()) : svg_draw_func[key](graph, options);
	addClass(group, key);
	return group;
};
const DrawGroups = (graph, options = {}) => [
	_boundaries,
	_faces,
	_edges,
	_vertices].map(key => drawGroup(key, graph, options[key]));
[_boundaries,
	_faces,
	_edges,
	_vertices,
].forEach(key => {
	DrawGroups[key] = function (graph, options = {}) {
		return drawGroup(key, graph, options[key]);
	};
});const DEFAULT_STROKE_WIDTH = 1 / 100;
const DEFAULT_CIRCLE_RADIUS = 1 / 50;
const getBoundingRect = ({ vertices_coords }) => {
	if (vertices_coords == null || vertices_coords.length === 0) {
		return undefined;
	}
	const min = Array(2).fill(Infinity);
	const max = Array(2).fill(-Infinity);
	vertices_coords.forEach(v => {
		if (v[0] < min[0]) { min[0] = v[0]; }
		if (v[0] > max[0]) { max[0] = v[0]; }
		if (v[1] < min[1]) { min[1] = v[1]; }
		if (v[1] > max[1]) { max[1] = v[1]; }
	});
	const invalid = Number.isNaN(min[0])
		|| Number.isNaN(min[1])
		|| Number.isNaN(max[0])
		|| Number.isNaN(max[1]);
	return (invalid
		? undefined
		: [min[0], min[1], max[0] - min[0], max[1] - min[1]]);
};
const getViewBox = (graph) => {
	const viewBox = getBoundingRect(graph);
	return viewBox === undefined
		? ""
		: viewBox.join(" ");
};
const setR = (group, radius) => {
	for (let i = 0; i < group.childNodes.length; i += 1) {
		group.childNodes[i].setAttributeNS(null, "r", radius);
	}
};
const getTenthPercentLength = ({ vertices_coords, edges_vertices, edges_length }) => {
	if (!vertices_coords || !edges_vertices) {
		return undefined;
	}
	if (!edges_length) {
		edges_length = makeEdgesLength({ vertices_coords, edges_vertices });
	}
	const sortedLengths = edges_length
		.slice()
		.sort((a, b) => a - b);
	const index_tenth_percent = Math.floor(sortedLengths.length * 0.1);
	return sortedLengths[index_tenth_percent];
};
const findSVGInParents = (element) => {
	if ((element.nodeName || "").toUpperCase() === "SVG") { return element; }
	return element.parentNode ? findSVGInParents(element.parentNode) : undefined;
};
const applyTopLevelOptions = (element, groups, graph, options) => {
	const hasVertices = groups[3] && groups[3].childNodes.length;
	if (!(options.strokeWidth || options.viewBox || hasVertices)) { return; }
	const bounds = getBoundingRect(graph);
	const vmax = bounds ? Math.max(bounds[2], bounds[3]) : 1;
	const svgElement = findSVGInParents(element);
	if (svgElement && options.viewBox) {
		const viewBoxValue = bounds ? bounds.join(" ") : "0 0 1 1";
		svgElement.setAttributeNS(null, "viewBox", viewBoxValue);
	}
	if (svgElement && options.padding) {
		const viewBoxString = svgElement.getAttribute("viewBox");
		if (viewBoxString != null) {
			const pad = options.padding * vmax;
			const viewBox = viewBoxString.split(" ").map(n => parseFloat(n));
			const newViewBox = [-pad, -pad, pad * 2, pad * 2]
				.map((nudge, i) => viewBox[i] + nudge)
				.join(" ");
			svgElement.setAttributeNS(null, "viewBox", newViewBox);
		}
	}
	if (options.strokeWidth || options["stroke-width"]) {
		const strokeWidth = options.strokeWidth
			? options.strokeWidth
			: options["stroke-width"];
		const lengthBased = getTenthPercentLength(graph);
		let strokeWidthValue;
		if (lengthBased) {
			strokeWidthValue = typeof strokeWidth === "number"
				? 10 * lengthBased * strokeWidth
				: 10 * lengthBased * DEFAULT_STROKE_WIDTH;
		} else {
			strokeWidthValue = typeof strokeWidth === "number"
				? vmax * strokeWidth
				: vmax * DEFAULT_STROKE_WIDTH;
		}
		element.setAttributeNS(null, "stroke-width", strokeWidthValue);
	}
	if (hasVertices) {
		const userRadius = options.vertices && options.vertices.radius != null
			? options.vertices.radius
			: options.radius;
		const radius = typeof userRadius === "string" ? parseFloat(userRadius) : userRadius;
		const r = typeof radius === "number" && !Number.isNaN(radius)
			? vmax * radius
			: vmax * DEFAULT_CIRCLE_RADIUS;
		setR(groups[3], r);
	}
};
const applyTopLevelClasses = (element, graph) => {
	const newClasses = [
		graph.file_classes || [],
		graph.frame_classes || [],
	].flat();
	if (newClasses.length) {
		addClass(element, ...newClasses);
	}
};
const drawInto = (element, graph, options = {}) => {
	const groups = DrawGroups(graph, options);
	groups.filter(group => group.childNodes.length > 0)
		.forEach(group => element.appendChild(group));
	applyTopLevelOptions(element, groups, graph, options);
	applyTopLevelClasses(element, graph);
	Object.keys(DrawGroups)
		.map((key, i) => ({ key, i }))
		.filter(el => element[el.key] == null)
		.forEach(el => Object.defineProperty(element, el.key, { get: () => groups[el.i] }));
	return element;
};
const FOLDtoSVG = (graph, options) => drawInto(SVG.svg(), graph, options);
Object.keys(DrawGroups).forEach(key => { FOLDtoSVG[key] = DrawGroups[key]; });
FOLDtoSVG.drawInto = drawInto;
FOLDtoSVG.getViewBox = getViewBox;const clone = function (o) {
	let newO;
	let i;
	if (typeof o !== _object) {
		return o;
	}
	if (!o) {
		return o;
	}
	if (Object.prototype.toString.apply(o) === "[object Array]") {
		newO = [];
		for (i = 0; i < o.length; i += 1) {
			newO[i] = clone(o[i]);
		}
		return newO;
	}
	newO = {};
	for (i in o) {
		if (o.hasOwnProperty(i)) {
			newO[i] = clone(o[i]);
		}
	}
	return newO;
};const flattenFrame = (graph, frame_num = 1) => {
	if (!graph.file_frames || graph.file_frames.length < frame_num) {
		return graph;
	}
	const dontCopy = [_frame_parent, _frame_inherit];
	const memo = { visited_frames: [] };
	const fileMetadata = {};
	filterKeysWithPrefix(graph, "file")
		.filter(key => key !== "file_frames")
		.forEach(key => { fileMetadata[key] = graph[key]; });
	const recurse = (recurse_graph, frame, orderArray) => {
		if (memo.visited_frames.indexOf(frame) !== -1) {
			throw new Error(Messages$1.graphCycle);
		}
		memo.visited_frames.push(frame);
		orderArray = [frame].concat(orderArray);
		if (frame === 0) { return orderArray; }
		if (recurse_graph.file_frames[frame - 1].frame_inherit
			&& recurse_graph.file_frames[frame - 1].frame_parent != null) {
			return recurse(
				recurse_graph,
				recurse_graph.file_frames[frame - 1].frame_parent,
				orderArray,
			);
		}
		return orderArray;
	};
	return recurse(graph, frame_num, []).map((frame) => {
		if (frame === 0) {
			const swap = graph.file_frames;
			graph.file_frames = null;
			const copy = clone(graph);
			graph.file_frames = swap;
			delete copy.file_frames;
			dontCopy.forEach(key => delete copy[key]);
			return copy;
		}
		const outerCopy = clone(graph.file_frames[frame - 1]);
		dontCopy.forEach(key => delete outerCopy[key]);
		return outerCopy;
	}).reduce((a, b) => Object.assign(a, b), fileMetadata);
};
const mergeFrame = function (graph, frame) {
	const dontCopy = [_frame_parent, _frame_inherit];
	const copy = clone(frame);
	dontCopy.forEach(key => delete copy[key]);
	const swap = graph.file_frames;
	graph.file_frames = null;
	const fold = clone(graph);
	graph.file_frames = swap;
	delete fold.file_frames;
	Object.assign(fold, frame);
	return fold;
};const foldFileFrames=/*#__PURE__*/Object.freeze({__proto__:null,flattenFrame,mergeFrame});const getMetadata = (graph) => {
	const metadata = [
		"file_title",
		"file_author",
		"file_description",
		"frame_title",
		"frame_author",
		"frame_description",
	];
	return metadata
		.filter(key => graph[key])
		.map(key => `# ${key.split("_")[1]}: ${graph[key]}`)
		.join("\n");
};
const foldToObj = (graph, frame_num = 0) => {
	const frame = flattenFrame(graph, frame_num);
	const metadata = getMetadata(frame);
	const vertices = (frame.vertices_coords || [])
		.map(coords => coords.join(" "))
		.map(str => `v ${str}`)
		.join("\n");
	const faces = (frame.faces_vertices || [])
		.map(verts => verts.map(v => v + 1).join(" "))
		.map(str => `f ${str}`)
		.join("\n");
	return `${[metadata, vertices, faces].join("\n")} \n`;
};const convert = {
	objToFold,
	opxToFold,
	svgToFold,
	foldToSvg: FOLDtoSVG,
	foldToObj,
};const nearestPoint2 = (array_of_points, point) => {
	const index = smallestComparisonSearch(array_of_points, point, distance2);
	return index === undefined ? undefined : array_of_points[index];
};
const nearestPoint = (array_of_points, point) => {
	const index = smallestComparisonSearch(array_of_points, point, distance);
	return index === undefined ? undefined : array_of_points[index];
};
const nearestPointOnLine = (
	{ vector, origin },
	point,
	clampFunc = clampLine,
	epsilon = EPSILON,
) => {
	origin = resize(vector.length, origin);
	point = resize(vector.length, point);
	const magSq = magSquared(vector);
	const vectorToPoint = subtract(point, origin);
	const dotProd = dot(vector, vectorToPoint);
	const dist = dotProd / magSq;
	const d = clampFunc(dist, epsilon);
	return add(origin, scale(vector, d));
};
const nearestPointOnPolygon = (polygon, point) => polygon
	.map((p, i, arr) => subtract(arr[(i + 1) % arr.length], p))
	.map((vector, i) => ({ vector, origin: polygon[i] }))
	.map(line => nearestPointOnLine(line, point, clampSegment))
	.map((p, edge) => ({ point: p, edge, distance: distance(p, point) }))
	.sort((a, b) => a.distance - b.distance)
	.shift();
const nearestPointOnCircle = ({ radius, origin }, point) => (
	add(origin, scale(normalize(subtract(point, origin)), radius))
);const nearest$1=/*#__PURE__*/Object.freeze({__proto__:null,nearestPoint,nearestPoint2,nearestPointOnCircle,nearestPointOnLine,nearestPointOnPolygon});const nearestVertex = ({ vertices_coords }, point) => {
	if (!vertices_coords) { return undefined; }
	const p = resize(vertices_coords[0].length, point);
	const nearest = vertices_coords
		.map((v, i) => ({ d: distance(p, v), i }))
		.sort((a, b) => a.d - b.d)
		.shift();
	return nearest ? nearest.i : undefined;
};
const nearestEdge = ({ vertices_coords, edges_vertices }, point) => {
	if (!vertices_coords || !edges_vertices) { return undefined; }
	const nearest_points = edges_vertices
		.map(e => e.map(ev => vertices_coords[ev]))
		.map(e => nearestPointOnLine(
			{ vector: subtract(e[1], e[0]), origin: e[0] },
			point,
			clampSegment,
		));
	return smallestComparisonSearch(nearest_points, point, distance);
};
const faceContainingPoint = ({ vertices_coords, faces_vertices }, point) => {
	if (!vertices_coords || !faces_vertices) { return undefined; }
	const face = faces_vertices
		.map((fv, i) => ({ face: fv.map(v => vertices_coords[v]), i }))
		.filter(f => overlapConvexPolygonPoint(f.face, point))
		.shift();
	return (face === undefined ? undefined : face.i);
};
const nearestFace = (graph, point) => {
	const face = faceContainingPoint(graph, point);
	if (face !== undefined) { return face; }
	if (graph.edges_faces) {
		const edge = nearestEdge(graph, point);
		const faces = graph.edges_faces[edge];
		if (faces.length === 1) { return faces[0]; }
		if (faces.length > 1) {
			const faces_center = makeFacesConvexCenter({
				vertices_coords: graph.vertices_coords,
				faces_vertices: faces.map(f => graph.faces_vertices[f]),
			});
			const distances = faces_center
				.map(center => distance(center, point));
			let shortest = 0;
			for (let i = 0; i < distances.length; i += 1) {
				if (distances[i] < distances[shortest]) { shortest = i; }
			}
			return faces[shortest];
		}
	}
	return undefined;
};
const nearest = (graph, ...args) => {
	const nearestMethods = {
		vertices: nearestVertex,
		edges: nearestEdge,
		faces: nearestFace,
	};
	const point = getVector(...args);
	const nears = Object.create(null);
	["vertices", "edges", "faces"].forEach(key => {
		Object.defineProperty(nears, singularize[key], {
			enumerable: true,
			get: () => nearestMethods[key](graph, point),
		});
		filterKeysWithPrefix(graph, key)
			.forEach(fold_key => Object.defineProperty(nears, fold_key, {
				enumerable: true,
				get: () => graph[fold_key][nears[singularize[key]]],
			}));
	});
	return nears;
};const nearestMethods=/*#__PURE__*/Object.freeze({__proto__:null,faceContainingPoint,nearest,nearestEdge,nearestFace,nearestVertex});const selfRelationalArraySubset = (array_array, indices) => {
	const hash = {};
	indices.forEach(f => { hash[f] = true; });
	const array_arraySubset = [];
	indices.forEach(i => {
		array_arraySubset[i] = array_array[i].filter(j => hash[j]);
	});
	return array_arraySubset;
};
const subgraph = (graph, indices = {}) => {
	if (!indices.vertices) { indices.vertices = []; }
	if (!indices.edges) { indices.edges = []; }
	if (!indices.faces) { indices.faces = []; }
	const components = ["faces", "edges", "vertices"];
	const lookup = {};
	components.forEach(component => { lookup[component] = {}; });
	components.forEach(component => indices[component].forEach(i => {
		lookup[component][i] = true;
	}));
	const keys = {};
	components.forEach(c => {
		filterKeysWithPrefix(graph, c).forEach(key => { keys[key] = {}; });
		filterKeysWithSuffix(graph, c).forEach(key => { keys[key] = {}; });
	});
	components.forEach(c => {
		filterKeysWithPrefix(graph, c).forEach(key => { keys[key].prefix = c; });
		filterKeysWithSuffix(graph, c).forEach(key => { keys[key].suffix = c; });
	});
	const copy = { ...graph };
	foldKeys.graph.forEach(key => delete copy[key]);
	delete copy.file_frames;
	Object.keys(keys).forEach(key => { copy[key] = []; });
	Object.keys(keys).forEach(key => {
		const { prefix, suffix } = keys[key];
		if (prefix && suffix) {
			indices[prefix].forEach(i => {
				copy[key][i] = graph[key][i].filter(j => lookup[suffix][j]);
			});
		} else if (prefix) {
			indices[prefix].forEach(i => { copy[key][i] = graph[key][i]; });
		} else if (suffix) {
			copy[key] = graph[key].map(arr => arr.filter(j => lookup[suffix][j]));
		} else {
			copy[key] = graph[key];
		}
	});
	return copy;
};
const subgraphWithFaces = (graph, faces) => {
	let vertices = [];
	if (graph.faces_vertices) {
		vertices = uniqueSortedNumbers(
			faces.flatMap(f => graph.faces_vertices[f]),
		);
	}
	let edges = [];
	if (graph.faces_edges) {
		edges = uniqueSortedNumbers(
			faces.flatMap(f => graph.faces_edges[f]),
		);
	} else if (graph.edges_vertices) {
		const vertices_lookup = {};
		vertices.forEach(v => { vertices_lookup[v] = true; });
		edges = graph.edges_vertices
			.map((v, i) => (vertices_lookup[v[0]] && vertices_lookup[v[1]]
				? i
				: undefined))
			.filter(a => a !== undefined);
	}
	return subgraph(graph, {
		faces,
		edges,
		vertices,
	});
};const subgraphMethods=/*#__PURE__*/Object.freeze({__proto__:null,selfRelationalArraySubset,subgraph,subgraphWithFaces});const makeTriangleFan = (indices) => Array.from(Array(indices.length - 2))
	.map((_, i) => [indices[0], indices[i + 1], indices[i + 2]]);
const triangulateConvexFacesVertices = ({ faces_vertices }) => faces_vertices
	.flatMap(vertices => (vertices.length < 4
		? [vertices]
		: makeTriangleFan(vertices)));
const groupByThree = (array) => (array.length === 3 ? [array] : Array
	.from(Array(Math.floor(array.length / 3)))
	.map((_, i) => [i * 3 + 0, i * 3 + 1, i * 3 + 2]
		.map(j => array[j])));
const triangulateNonConvexFacesVertices = ({ vertices_coords, faces_vertices }, earcut) => {
	if (!vertices_coords || !vertices_coords.length) {
		throw new Error(Messages$1.nonConvexTriangulation);
	}
	const dimension = vertices_coords[0].length;
	return faces_vertices
		.map(fv => fv.flatMap(v => vertices_coords[v]))
		.map(polygon => earcut(polygon, null, dimension))
		.map((vertices, i) => vertices
			.map(j => faces_vertices[i][j]))
		.flatMap(res => groupByThree(res));
};
const rebuildWithNewFaces = (graph) => {
	if (!graph.edges_vertices) { graph.edges_vertices = []; }
	const edgeLookup = makeVerticesToEdgeBidirectional(graph);
	let e = graph.edges_vertices.length;
	const newEdgesVertices = [];
	graph.faces_edges = graph.faces_vertices
		.map(vertices => vertices
			.map((v, i, arr) => {
				const edge_vertices = [v, arr[(i + 1) % arr.length]];
				const vertexPair = edge_vertices.join(" ");
				if (vertexPair in edgeLookup) { return edgeLookup[vertexPair]; }
				newEdgesVertices.push(edge_vertices);
				edgeLookup[vertexPair] = e;
				edgeLookup[edge_vertices.reverse().join(" ")] = e;
				return e++;
			}));
	const newEdgeCount = newEdgesVertices.length;
	graph.edges_vertices.push(...newEdgesVertices);
	if (graph.edges_assignment) {
		graph.edges_assignment.push(...Array(newEdgeCount).fill("J"));
	}
	if (graph.edges_foldAngle) {
		graph.edges_foldAngle.push(...Array(newEdgeCount).fill(0));
	}
	if (graph.vertices_vertices) { delete graph.vertices_vertices; }
	if (graph.vertices_edges) { delete graph.vertices_edges; }
	if (graph.vertices_faces) { delete graph.vertices_faces; }
	if (graph.edges_faces) { delete graph.edges_faces; }
	if (graph.faces_faces) { delete graph.faces_faces; }
	if (graph.faceOrders) { delete graph.faceOrders; }
	return graph;
};
const makeTriangulatedFacesNextMap = ({ faces_vertices }) => {
	let count = 0;
	return faces_vertices
		.map(verts => Math.max(3, verts.length))
		.map(length => Array.from(Array(length - 2)).map(() => count++));
};
const triangulate = (graph, earcut) => {
	if (!graph.faces_vertices) { return {}; }
	const edgeCount = graph.edges_vertices ? graph.edges_vertices.length : 0;
	const nextMap = makeTriangulatedFacesNextMap(graph);
	graph.faces_vertices = earcut
		? triangulateNonConvexFacesVertices(graph, earcut)
		: triangulateConvexFacesVertices(graph);
	rebuildWithNewFaces(graph);
	const newEdges = Array
		.from(Array(graph.edges_vertices.length - edgeCount))
		.map((_, i) => edgeCount + i);
	return {
		faces: { map: nextMap },
		edges: { new: newEdges },
	};
};const triangulateMethods=/*#__PURE__*/Object.freeze({__proto__:null,triangulate,triangulateConvexFacesVertices,triangulateNonConvexFacesVertices});const explode = (graph) => {
	if (!graph.faces_vertices) { return {}; }
	const faces_edges = graph.faces_edges
		? graph.faces_edges
		: makeFacesEdgesFromVertices(graph);
	const verticesMap = graph.faces_vertices.flatMap(vertices => vertices);
	const edgesMap = faces_edges.flatMap(edges => edges);
	let fv = 0;
	let fe = 0;
	let ev = 0;
	graph.faces_vertices = graph.faces_vertices.map(face => face.map(() => fv++));
	graph.faces_edges = graph.faces_edges.map(face => face.map(() => fe++));
	graph.edges_vertices = graph.faces_edges
		.flatMap(face => face.map((_, i, arr) => {
			const edge_vertices = i === arr.length - 1
				? [ev, (ev + 1 - arr.length)]
				: [ev, (ev + 1)];
			ev += 1;
			return edge_vertices;
		}));
	if (graph.vertices_coords) {
		graph.vertices_coords = clone(verticesMap.map(i => graph.vertices_coords[i]));
	}
	if (graph.edges_assignment) {
		graph.edges_assignment = clone(edgesMap.map(i => graph.edges_assignment[i]));
	}
	if (graph.edges_foldAngle) {
		graph.edges_foldAngle = clone(edgesMap.map(i => graph.edges_foldAngle[i]));
	}
	if (graph.vertices_vertices) { delete graph.vertices_vertices; }
	if (graph.vertices_edges) { delete graph.vertices_edges; }
	if (graph.vertices_faces) { delete graph.vertices_faces; }
	if (graph.edges_edges) { delete graph.edges_edges; }
	if (graph.edges_faces) { delete graph.edges_faces; }
	if (graph.faces_faces) { delete graph.faces_faces; }
	return {
		vertices: { map: verticesMap },
		edges: { map: edgesMap },
	};
};
const explodeFaces = (graph) => {
	const vertices_coords = graph.faces_vertices
		.flatMap(face => face
			.map(v => graph.vertices_coords[v]));
	let i = 0;
	const faces_vertices = graph.faces_vertices
		.map(face => face.map(() => i++));
	return {
		vertices_coords: JSON.parse(JSON.stringify(vertices_coords)),
		faces_vertices,
	};
};const explodeMethods=/*#__PURE__*/Object.freeze({__proto__:null,explode,explodeFaces});const identity3x3 = Object.freeze([1, 0, 0, 0, 1, 0, 0, 0, 1]);
const identity3x4 = Object.freeze(identity3x3.concat(0, 0, 0));
const isIdentity3x4 = m => identity3x4
	.map((n, i) => Math.abs(n - m[i]) < EPSILON)
	.reduce((a, b) => a && b, true);
const multiplyMatrix3Vector3 = (m, vector) => [
	m[0] * vector[0] + m[3] * vector[1] + m[6] * vector[2] + m[9],
	m[1] * vector[0] + m[4] * vector[1] + m[7] * vector[2] + m[10],
	m[2] * vector[0] + m[5] * vector[1] + m[8] * vector[2] + m[11],
];
const multiplyMatrix3Line3 = (m, vector, origin) => ({
	vector: [
		m[0] * vector[0] + m[3] * vector[1] + m[6] * vector[2],
		m[1] * vector[0] + m[4] * vector[1] + m[7] * vector[2],
		m[2] * vector[0] + m[5] * vector[1] + m[8] * vector[2],
	],
	origin: [
		m[0] * origin[0] + m[3] * origin[1] + m[6] * origin[2] + m[9],
		m[1] * origin[0] + m[4] * origin[1] + m[7] * origin[2] + m[10],
		m[2] * origin[0] + m[5] * origin[1] + m[8] * origin[2] + m[11],
	],
});
const multiplyMatrices3 = (m1, m2) => [
	m1[0] * m2[0] + m1[3] * m2[1] + m1[6] * m2[2],
	m1[1] * m2[0] + m1[4] * m2[1] + m1[7] * m2[2],
	m1[2] * m2[0] + m1[5] * m2[1] + m1[8] * m2[2],
	m1[0] * m2[3] + m1[3] * m2[4] + m1[6] * m2[5],
	m1[1] * m2[3] + m1[4] * m2[4] + m1[7] * m2[5],
	m1[2] * m2[3] + m1[5] * m2[4] + m1[8] * m2[5],
	m1[0] * m2[6] + m1[3] * m2[7] + m1[6] * m2[8],
	m1[1] * m2[6] + m1[4] * m2[7] + m1[7] * m2[8],
	m1[2] * m2[6] + m1[5] * m2[7] + m1[8] * m2[8],
	m1[0] * m2[9] + m1[3] * m2[10] + m1[6] * m2[11] + m1[9],
	m1[1] * m2[9] + m1[4] * m2[10] + m1[7] * m2[11] + m1[10],
	m1[2] * m2[9] + m1[5] * m2[10] + m1[8] * m2[11] + m1[11],
];
const determinant3 = m => (
	m[0] * m[4] * m[8]
	- m[0] * m[7] * m[5]
	- m[3] * m[1] * m[8]
	+ m[3] * m[7] * m[2]
	+ m[6] * m[1] * m[5]
	- m[6] * m[4] * m[2]
);
const invertMatrix3 = (m) => {
	const det = determinant3(m);
	if (Math.abs(det) < 1e-6 || Number.isNaN(det)
		|| !Number.isFinite(m[9]) || !Number.isFinite(m[10]) || !Number.isFinite(m[11])) {
		return undefined;
	}
	const inv = [
		m[4] * m[8] - m[7] * m[5],
		-m[1] * m[8] + m[7] * m[2],
		m[1] * m[5] - m[4] * m[2],
		-m[3] * m[8] + m[6] * m[5],
		m[0] * m[8] - m[6] * m[2],
		-m[0] * m[5] + m[3] * m[2],
		m[3] * m[7] - m[6] * m[4],
		-m[0] * m[7] + m[6] * m[1],
		m[0] * m[4] - m[3] * m[1],
		-m[3] * m[7] * m[11] + m[3] * m[8] * m[10] + m[6] * m[4] * m[11]
			- m[6] * m[5] * m[10] - m[9] * m[4] * m[8] + m[9] * m[5] * m[7],
		m[0] * m[7] * m[11] - m[0] * m[8] * m[10] - m[6] * m[1] * m[11]
			+ m[6] * m[2] * m[10] + m[9] * m[1] * m[8] - m[9] * m[2] * m[7],
		-m[0] * m[4] * m[11] + m[0] * m[5] * m[10] + m[3] * m[1] * m[11]
			- m[3] * m[2] * m[10] - m[9] * m[1] * m[5] + m[9] * m[2] * m[4],
	];
	const invDet = 1.0 / det;
	return inv.map(n => n * invDet);
};
const makeMatrix3Translate = (x = 0, y = 0, z = 0) => identity3x3.concat(x, y, z);
const singleAxisRotate = (angle, origin, i0, i1, sgn) => {
	const mat = identity3x3.concat([0, 1, 2].map(i => origin[i] || 0));
	const cos = Math.cos(angle);
	const sin = Math.sin(angle);
	mat[i0 * 3 + i0] = cos;
	mat[i0 * 3 + i1] = (sgn ? +1 : -1) * sin;
	mat[i1 * 3 + i0] = (sgn ? -1 : +1) * sin;
	mat[i1 * 3 + i1] = cos;
	return mat;
};
const makeMatrix3RotateX = (angle, origin = [0, 0, 0]) => (
	singleAxisRotate(angle, origin, 1, 2, true));
const makeMatrix3RotateY = (angle, origin = [0, 0, 0]) => (
	singleAxisRotate(angle, origin, 0, 2, false));
const makeMatrix3RotateZ = (angle, origin = [0, 0, 0]) => (
	singleAxisRotate(angle, origin, 0, 1, true));
const makeMatrix3Rotate = (angle, vector = [0, 0, 1], origin = [0, 0, 0]) => {
	const pos = [0, 1, 2].map(i => origin[i] || 0);
	const [x, y, z] = resize(3, normalize(vector));
	const c = Math.cos(angle);
	const s = Math.sin(angle);
	const t = 1 - c;
	const trans = identity3x3.concat(-pos[0], -pos[1], -pos[2]);
	const trans_inv = identity3x3.concat(pos[0], pos[1], pos[2]);
	return multiplyMatrices3(trans_inv, multiplyMatrices3([
		t * x * x + c,     t * y * x + z * s, t * z * x - y * s,
		t * x * y - z * s, t * y * y + c,     t * z * y + x * s,
		t * x * z + y * s, t * y * z - x * s, t * z * z + c,
		0, 0, 0], trans));
};
const makeMatrix3Scale = (scale = [1, 1, 1], origin = [0, 0, 0]) => [
	scale[0], 0, 0,
	0, scale[1], 0,
	0, 0, scale[2],
	scale[0] * -origin[0] + origin[0],
	scale[1] * -origin[1] + origin[1],
	scale[2] * -origin[2] + origin[2],
];
const makeMatrix3UniformScale = (scale = 1, origin = [0, 0, 0]) => (
	makeMatrix3Scale([scale, scale, scale], origin)
);
const makeMatrix3ReflectZ = (vector, origin = [0, 0]) => {
	const m = makeMatrix2Reflect(vector, origin);
	return [m[0], m[1], 0, m[2], m[3], 0, 0, 0, 1, m[4], m[5], 0];
};const matrix3=/*#__PURE__*/Object.freeze({__proto__:null,determinant3,identity3x3,identity3x4,invertMatrix3,isIdentity3x4,makeMatrix3ReflectZ,makeMatrix3Rotate,makeMatrix3RotateX,makeMatrix3RotateY,makeMatrix3RotateZ,makeMatrix3Scale,makeMatrix3Translate,makeMatrix3UniformScale,multiplyMatrices3,multiplyMatrix3Line3,multiplyMatrix3Vector3});const getFaceFaceSharedVertices = (face_a_vertices, face_b_vertices) => {
	const hash = {};
	face_b_vertices.forEach((v) => { hash[v] = true; });
	const match = face_a_vertices.map(v => !!hash[v]);
	const shared_vertices = [];
	const notShared = match.indexOf(false);
	const already_added = {};
	for (let i = notShared + 1; i < match.length; i += 1) {
		if (match[i] && !already_added[face_a_vertices[i]]) {
			shared_vertices.push(face_a_vertices[i]);
			already_added[face_a_vertices[i]] = true;
		}
	}
	for (let i = 0; i < notShared; i += 1) {
		if (match[i] && !already_added[face_a_vertices[i]]) {
			shared_vertices.push(face_a_vertices[i]);
			already_added[face_a_vertices[i]] = true;
		}
	}
	return shared_vertices;
};
const makeFaceSpanningTree = ({ faces_vertices, faces_faces }, root_face = 0) => {
	if (!faces_faces) {
		faces_faces = makeFacesFaces({ faces_vertices });
	}
	if (faces_faces.length === 0) { return []; }
	const tree = [[{ face: root_face }]];
	const visited_faces = {};
	visited_faces[root_face] = true;
	do {
		const next_level_with_duplicates = tree[tree.length - 1]
			.map(current => faces_faces[current.face]
				.map(face => ({ face, parent: current.face })))
			.reduce((a, b) => a.concat(b), []);
		const dup_indices = {};
		next_level_with_duplicates.forEach((el, i) => {
			if (visited_faces[el.face]) { dup_indices[i] = true; }
			visited_faces[el.face] = true;
		});
		const next_level = next_level_with_duplicates
			.filter((_, i) => !dup_indices[i]);
		next_level
			.map(el => getFaceFaceSharedVertices(
				faces_vertices[el.face],
				faces_vertices[el.parent],
			)).forEach((ev, i) => {
				const edge_vertices = ev.slice(0, 2);
				next_level[i].edge_vertices = edge_vertices;
			});
		tree[tree.length] = next_level;
	} while (tree[tree.length - 1].length > 0);
	if (tree.length > 0 && tree[tree.length - 1].length === 0) {
		tree.pop();
	}
	return tree;
};const facesSpanningTree=/*#__PURE__*/Object.freeze({__proto__:null,getFaceFaceSharedVertices,makeFaceSpanningTree});const multiplyVerticesFacesMatrix2 = ({
	vertices_coords, vertices_faces, faces_vertices,
}, faces_matrix) => {
	if (!vertices_faces) {
		vertices_faces = makeVerticesFaces({ faces_vertices });
	}
	const vertices_matrix = vertices_faces
		.map(faces => faces
			.filter(a => a != null)
			.shift())
		.map(face => (face === undefined
			? identity2x3
			: faces_matrix[face]));
	return vertices_coords
		.map((coord, i) => multiplyMatrix2Vector2(vertices_matrix[i], coord));
};
const unassigned_angle = { U: true, u: true };
const makeFacesMatrix = ({
	vertices_coords, edges_vertices, edges_foldAngle, edges_assignment, faces_vertices, faces_faces,
}, root_face = 0) => {
	if (!edges_assignment && edges_foldAngle) {
		edges_assignment = makeEdgesAssignmentSimple({ edges_foldAngle });
	}
	if (!edges_foldAngle) {
		if (edges_assignment) {
			edges_foldAngle = makeEdgesFoldAngle({ edges_assignment });
		} else {
			edges_foldAngle = Array(edges_vertices.length).fill(0);
		}
	}
	const edge_map = makeVerticesToEdgeBidirectional({ edges_vertices });
	const faces_matrix = faces_vertices.map(() => identity3x4);
	makeFaceSpanningTree({ faces_vertices, faces_faces }, root_face)
		.slice(1)
		.forEach(level => level
			.forEach((entry) => {
				const coords = entry.edge_vertices.map(v => vertices_coords[v]);
				const edgeKey = entry.edge_vertices.join(" ");
				const edge = edge_map[edgeKey];
				const foldAngle = unassigned_angle[edges_assignment[edge]]
					? Math.PI
					: (edges_foldAngle[edge] * Math.PI) / 180;
				const local_matrix = makeMatrix3Rotate(
					foldAngle,
					subtract(...resizeUp(coords[1], coords[0])),
					coords[0],
				);
				faces_matrix[entry.face] = multiplyMatrices3(faces_matrix[entry.parent], local_matrix);
			}));
	return faces_matrix;
};
const makeFacesMatrix2 = ({
	vertices_coords, edges_vertices, edges_foldAngle, edges_assignment, faces_vertices, faces_faces,
}, root_face = 0) => {
	if (!edges_foldAngle) {
		if (edges_assignment) {
			edges_foldAngle = makeEdgesFoldAngle({ edges_assignment });
		} else {
			edges_foldAngle = Array(edges_vertices.length).fill(0);
		}
	}
	const edges_is_folded = makeEdgesIsFolded({ edges_vertices, edges_foldAngle, edges_assignment });
	const edge_map = makeVerticesToEdgeBidirectional({ edges_vertices });
	const faces_matrix = faces_vertices.map(() => identity2x3);
	makeFaceSpanningTree({ faces_vertices, faces_faces }, root_face)
		.slice(1)
		.forEach(level => level
			.forEach((entry) => {
				const coords = entry.edge_vertices.map(v => vertices_coords[v]);
				const edgeKey = entry.edge_vertices.join(" ");
				const edge = edge_map[edgeKey];
				const reflect_vector = subtract2(coords[1], coords[0]);
				const reflect_origin = coords[0];
				const local_matrix = edges_is_folded[edge]
					? makeMatrix2Reflect(reflect_vector, reflect_origin)
					: identity2x3;
				faces_matrix[entry.face] = multiplyMatrices2(faces_matrix[entry.parent], local_matrix);
			}));
	return faces_matrix;
};const facesMatrix=/*#__PURE__*/Object.freeze({__proto__:null,makeFacesMatrix,makeFacesMatrix2,multiplyVerticesFacesMatrix2});const makeVerticesCoordsFolded = ({
	vertices_coords, vertices_faces, edges_vertices, edges_foldAngle,
	edges_assignment, faces_vertices, faces_faces, faces_matrix,
}, root_face) => {
	faces_matrix = makeFacesMatrix({
		vertices_coords, edges_vertices, edges_foldAngle, edges_assignment, faces_vertices, faces_faces,
	}, root_face);
	if (!vertices_faces) {
		vertices_faces = makeVerticesFaces({ faces_vertices });
	}
	const vertices_matrix = vertices_faces
		.map(faces => faces
			.filter(a => a != null)
			.shift())
		.map(face => (face === undefined
			? identity3x4
			: faces_matrix[face]));
	return vertices_coords
		.map(coord => resize(3, coord))
		.map((coord, i) => multiplyMatrix3Vector3(vertices_matrix[i], coord));
};
const makeVerticesCoordsFlatFolded = ({
	vertices_coords, edges_vertices, edges_foldAngle, edges_assignment, faces_vertices, faces_faces,
}, root_face = 0) => {
	const edges_is_folded = makeEdgesIsFolded({ edges_vertices, edges_foldAngle, edges_assignment });
	const vertices_coords_folded = [];
	faces_vertices[root_face]
		.forEach(v => { vertices_coords_folded[v] = [...vertices_coords[v]]; });
	const faces_flipped = [];
	faces_flipped[root_face] = false;
	const edge_map = makeVerticesToEdgeBidirectional({ edges_vertices });
	makeFaceSpanningTree({ faces_vertices, faces_faces }, root_face)
		.slice(1)
		.forEach(level => level
			.forEach(entry => {
				const edge_key = entry.edge_vertices.join(" ");
				const edge = edge_map[edge_key];
				const coords = edges_vertices[edge].map(v => vertices_coords_folded[v]);
				if (coords[0] === undefined || coords[1] === undefined) { return; }
				const coords_cp = edges_vertices[edge].map(v => vertices_coords[v]);
				const origin_cp = coords_cp[0];
				const vector_cp = normalize2(subtract2(coords_cp[1], coords_cp[0]));
				const normal_cp = rotate90(vector_cp);
				faces_flipped[entry.face] = edges_is_folded[edge]
					? !faces_flipped[entry.parent]
					: faces_flipped[entry.parent];
				const vector_folded = normalize2(subtract2(coords[1], coords[0]));
				const origin_folded = coords[0];
				const normal_folded = faces_flipped[entry.face]
					? rotate270(vector_folded)
					: rotate90(vector_folded);
				faces_vertices[entry.face]
					.filter(v => vertices_coords_folded[v] === undefined)
					.forEach(v => {
						const to_point = subtract2(vertices_coords[v], origin_cp);
						const project_norm = dot(to_point, normal_cp);
						const project_line = dot(to_point, vector_cp);
						const walk_up = scale2(vector_folded, project_line);
						const walk_perp = scale2(normal_folded, project_norm);
						const folded_coords = add2(add2(origin_folded, walk_up), walk_perp);
						vertices_coords_folded[v] = folded_coords;
					});
			}));
	return vertices_coords_folded;
};const verticesFolded=/*#__PURE__*/Object.freeze({__proto__:null,makeVerticesCoordsFlatFolded,makeVerticesCoordsFolded});const edgeIsolatedVertices = ({ vertices_coords, edges_vertices }) => {
	if (!vertices_coords || !edges_vertices) { return []; }
	let count = vertices_coords.length;
	const seen = Array(count).fill(false);
	edges_vertices.forEach((ev) => {
		ev.filter(v => !seen[v]).forEach((v) => {
			seen[v] = true;
			count -= 1;
		});
	});
	return seen
		.map((s, i) => (s ? undefined : i))
		.filter(a => a !== undefined);
};
const faceIsolatedVertices = ({ vertices_coords, faces_vertices }) => {
	if (!vertices_coords || !faces_vertices) { return []; }
	let count = vertices_coords.length;
	const seen = Array(count).fill(false);
	faces_vertices.forEach((fv) => {
		fv.filter(v => !seen[v]).forEach((v) => {
			seen[v] = true;
			count -= 1;
		});
	});
	return seen
		.map((s, i) => (s ? undefined : i))
		.filter(a => a !== undefined);
};
const isolatedVertices = ({ vertices_coords, edges_vertices, faces_vertices }) => {
	if (!vertices_coords) { return []; }
	let count = vertices_coords.length;
	const seen = Array(count).fill(false);
	if (edges_vertices) {
		edges_vertices.forEach((ev) => {
			ev.filter(v => !seen[v]).forEach((v) => {
				seen[v] = true;
				count -= 1;
			});
		});
	}
	if (faces_vertices) {
		faces_vertices.forEach((fv) => {
			fv.filter(v => !seen[v]).forEach((v) => {
				seen[v] = true;
				count -= 1;
			});
		});
	}
	return seen
		.map((s, i) => (s ? undefined : i))
		.filter(a => a !== undefined);
};
const removeIsolatedVertices = (graph, remove_indices) => {
	if (!remove_indices) {
		remove_indices = isolatedVertices(graph);
	}
	return {
		map: removeGeometryIndices(graph, _vertices, remove_indices),
		remove: remove_indices,
	};
};const verticesIsolated=/*#__PURE__*/Object.freeze({__proto__:null,edgeIsolatedVertices,faceIsolatedVertices,isolatedVertices,removeIsolatedVertices});const makeEdgesEdgesSimilar = ({
	vertices_coords, edges_vertices, edges_coords,
}, epsilon = EPSILON) => {
	if (!edges_coords) {
		edges_coords = makeEdgesCoords({ vertices_coords, edges_vertices });
	}
	const edges_boundingBox = makeEdgesBoundingBox({
		vertices_coords, edges_vertices, edges_coords,
	});
	const matrix = Array.from(Array(edges_coords.length)).map(() => []);
	const dimensions = edges_boundingBox.length ? edges_boundingBox[0].min.length : 0;
	for (let i = 0; i < edges_coords.length - 1; i += 1) {
		for (let j = i + 1; j < edges_coords.length; j += 1) {
			let similar = true;
			for (let d = 0; d < dimensions; d += 1) {
				if (!epsilonEqual(
					edges_boundingBox[i].min[d],
					edges_boundingBox[j].min[d],
					epsilon,
				) || !epsilonEqual(
					edges_boundingBox[i].max[d],
					edges_boundingBox[j].max[d],
					epsilon,
				)) {
					similar = false;
				}
			}
			matrix[i][j] = similar;
			matrix[j][i] = similar;
		}
	}
	for (let i = 0; i < edges_coords.length - 1; i += 1) {
		for (let j = i + 1; j < edges_coords.length; j += 1) {
			if (!matrix[i][j]) { continue; }
			const test0 = epsilonEqualVectors(edges_coords[i][0], edges_coords[j][0], epsilon)
				&& epsilonEqualVectors(edges_coords[i][1], edges_coords[j][1], epsilon);
			const test1 = epsilonEqualVectors(edges_coords[i][0], edges_coords[j][1], epsilon)
				&& epsilonEqualVectors(edges_coords[i][1], edges_coords[j][0], epsilon);
			const similar = test0 || test1;
			matrix[i][j] = similar;
			matrix[j][i] = similar;
		}
	}
	return booleanMatrixToIndexedArray(matrix);
};
const makeEdgesEdgesParallel = ({
	vertices_coords, edges_vertices, edges_vector,
}, epsilon = EPSILON) => {
	if (!edges_vector) {
		edges_vector = makeEdgesVector({ vertices_coords, edges_vertices });
	}
	const normalized = edges_vector.map(vec => normalize(vec));
	return normalized
		.map((vec1, i) => normalized
			.map((vec2, j) => (i === j
				? undefined
				: (1 - Math.abs(dot(normalized[i], normalized[j])) < epsilon)))
			.map((parallel, j) => (parallel ? j : undefined))
			.filter(a => a !== undefined));
};
const makeEdgesEdgesNotParallel = ({
	vertices_coords, edges_vertices, edges_vector,
}, epsilon = EPSILON) => {
	if (!edges_vector) {
		edges_vector = makeEdgesVector({ vertices_coords, edges_vertices });
	}
	const normalized = edges_vector.map(vec => normalize(vec));
	return normalized
		.map((vec1, i) => normalized
			.map((vec2, j) => (i === j
				? undefined
				: (1 - Math.abs(dot(normalized[i], normalized[j])) < epsilon)))
			.map((parallel, j) => (parallel ? undefined : j))
			.filter(a => a !== undefined));
};
const makeEdgesEdges2DParallel = ({
	vertices_coords, edges_vertices, edges_vector,
}, epsilon = EPSILON) => {
	if (!edges_vector) {
		edges_vector = makeEdgesVector({ vertices_coords, edges_vertices });
	}
	const sorted = edges_vector
		.map(vec => Math.atan2(vec[1], vec[0]))
		.map((a, i) => ({ a, i }))
		.sort((a, b) => a.a - b.a);
	let found = -1;
	sorted.forEach((el, i) => {
		{ return; }
	});
	const shifted = sorted
		.slice(found)
		.concat(sorted.slice(0, found))
		.filter(a => a);
	console.log("shifted", shifted);
};
const overwriteEdgesOverlaps = (edges_edges, vectors, origins, func, epsilon) => {
	const edges_edgesOverlap = edges_edges.map(() => []);
	edges_edges
		.forEach((arr, i) => arr
			.forEach(j => {
				if (i >= j) { return; }
				if (overlapLineLine(
					{ vector: vectors[i], origin: origins[i] },
					{ vector: vectors[j], origin: origins[j] },
					func,
					func,
					epsilon,
				)) {
					edges_edgesOverlap[i].push(j);
					edges_edgesOverlap[j].push(i);
				}
			}));
	return edges_edgesOverlap;
};
const makeEdgesEdgesCrossing = ({
	vertices_coords, edges_vertices, edges_vector,
}, epsilon) => {
	if (!edges_vector) {
		edges_vector = makeEdgesVector({ vertices_coords, edges_vertices });
	}
	const edges_origin = edges_vertices.map(verts => vertices_coords[verts[0]]);
	const edge_edgesNotParallel = makeEdgesEdgesNotParallel({
		vertices_coords, edges_vertices, edges_vector,
	}, epsilon);
	return overwriteEdgesOverlaps(
		edge_edgesNotParallel,
		edges_vector,
		edges_origin,
		excludeS,
		epsilon,
	);
};
const makeEdgesEdgesParallelOverlap = ({
	vertices_coords, edges_vertices, edges_vector,
}, epsilon) => {
	if (!edges_vector) {
		edges_vector = makeEdgesVector({ vertices_coords, edges_vertices });
	}
	const edges_origin = edges_vertices.map(verts => vertices_coords[verts[0]]);
	const edges_edgesParallel = makeEdgesEdgesParallel({
		vertices_coords, edges_vertices, edges_vector,
	}, epsilon);
	return overwriteEdgesOverlaps(
		edges_edgesParallel,
		edges_vector,
		edges_origin,
		excludeS,
		epsilon,
	);
};const edgesEdges=/*#__PURE__*/Object.freeze({__proto__:null,makeEdgesEdges2DParallel,makeEdgesEdgesCrossing,makeEdgesEdgesParallel,makeEdgesEdgesParallelOverlap,makeEdgesEdgesSimilar});const makeEdgesFacesOverlap = ({
	vertices_coords, edges_vertices, edges_vector, edges_faces, faces_vertices,
}, epsilon) => {
	if (!edges_vector) {
		edges_vector = makeEdgesVector({ vertices_coords, edges_vertices });
	}
	const faces_winding = makeFacesWinding({ vertices_coords, faces_vertices });
	const edges_origin = edges_vertices.map(verts => vertices_coords[verts[0]]);
	const edges_coords = edges_vertices
		.map(verts => verts.map(v => vertices_coords[v]));
	const faces_coords = faces_vertices
		.map(verts => verts.map(v => vertices_coords[v]));
	faces_winding.forEach((winding, i) => {
		if (!winding) {
			faces_coords[i].reverse();
		}
	});
	const matrix = edges_vertices
		.map(() => faces_vertices
			.map(() => undefined));
	edges_faces.forEach((faces, e) => faces
		.forEach(f => { matrix[e][f] = false; }));
	const edges_bounds = makeEdgesBoundingBox({ edges_coords });
	const faces_bounds = faces_coords
		.map(coords => boundingBox$1(coords));
	edges_bounds.forEach((edge_bounds, e) => faces_bounds.forEach((face_bounds, f) => {
		if (matrix[e][f] === false) { return; }
		if (!overlapBoundingBoxes(face_bounds, edge_bounds)) {
			matrix[e][f] = false;
		}
	}));
	edges_coords.forEach((edge_coords, e) => faces_coords.forEach((face_coords, f) => {
		if (matrix[e][f] !== undefined) { return; }
		const point_in_poly = edges_coords[e]
			.map(point => overlapConvexPolygonPoint(
				faces_coords[f],
				point,
				exclude,
				epsilon,
			)).reduce((a, b) => a || b, false);
		if (point_in_poly) { matrix[e][f] = true; return; }
		const edge_intersect = intersectConvexPolygonLine(
			faces_coords[f],
			{ vector: edges_vector[e], origin: edges_origin[e] },
			excludeS,
			excludeS,
			epsilon,
		);
		if (edge_intersect) { matrix[e][f] = true; return; }
		matrix[e][f] = false;
	}));
	return matrix;
};const edgesOverlap=/*#__PURE__*/Object.freeze({__proto__:null,makeEdgesFacesOverlap});const getFacesFaces2DOverlap = ({
	vertices_coords, faces_vertices,
}, epsilon = EPSILON) => {
	const matrix = Array.from(Array(faces_vertices.length))
		.map(() => Array.from(Array(faces_vertices.length)));
	const faces_coords = faces_vertices
		.map(verts => verts.map(v => vertices_coords[v]));
	const faces_bounds = faces_coords
		.map(polygon => boundingBox$1(polygon));
	for (let i = 0; i < faces_bounds.length - 1; i += 1) {
		for (let j = i + 1; j < faces_bounds.length; j += 1) {
			if (!overlapBoundingBoxes(faces_bounds[i], faces_bounds[j])) {
				matrix[i][j] = false;
				matrix[j][i] = false;
			}
		}
	}
	const faces_polygon = faces_coords
		.map(polygon => makePolygonNonCollinear(polygon, epsilon));
	for (let i = 0; i < faces_vertices.length - 1; i += 1) {
		for (let j = i + 1; j < faces_vertices.length; j += 1) {
			if (matrix[i][j] === false) { continue; }
			const overlap = overlapConvexPolygons(
				faces_polygon[i],
				faces_polygon[j],
				epsilon,
			);
			matrix[i][j] = overlap;
			matrix[j][i] = overlap;
		}
	}
	return matrix;
};const facesOverlap=/*#__PURE__*/Object.freeze({__proto__:null,getFacesFaces2DOverlap});const apply_matrix_to_graph = function (graph, matrix) {
	filterKeysWithSuffix(graph, "coords").forEach((key) => {
		graph[key] = graph[key]
			.map(v => resize(3, v))
			.map(v => multiplyMatrix3Vector3(matrix, v));
	});
	filterKeysWithSuffix(graph, "matrix").forEach((key) => {
		graph[key] = graph[key]
			.map(m => multiplyMatrices3(m, matrix));
	});
	return graph;
};
const transform_scale = (graph, ...args) => {
	const scale = args.length === 1
		? [args[0], args[0], args[0]]
		: [1, 1, 1].map((n, i) => (args[i] === undefined ? n : args[i]));
	const matrix = makeMatrix3Scale(scale);
	return apply_matrix_to_graph(graph, matrix);
};
const transform_translate = (graph, ...args) => {
	const vector = getVector(...args);
	const vector3 = resize(3, vector);
	const matrix = makeMatrix3Translate(...vector3);
	return apply_matrix_to_graph(graph, matrix);
};
const transform_rotateZ = (graph, angle, ...args) => {
	const vector = getVector(...args);
	const vector3 = resize(3, vector);
	const matrix = makeMatrix3RotateZ(angle, ...vector3);
	return apply_matrix_to_graph(graph, matrix);
};
const transform = {
	scale: transform_scale,
	translate: transform_translate,
	rotateZ: transform_rotateZ,
	transform: apply_matrix_to_graph,
};const connectedComponents = (array_array) => {
	const groups = [];
	const recurse = (index, current_group) => {
		if (groups[index] !== undefined) { return 0; }
		groups[index] = current_group;
		array_array[index].forEach(i => recurse(i, current_group));
		return 1;
	};
	for (let row = 0, group = 0; row < array_array.length; row += 1) {
		if (!(row in array_array)) { continue; }
		group += recurse(row, group);
	}
	return groups;
};const validate_references = (graph) => {
	const counts = {
		vertices: count.vertices(graph),
		edges: count.edges(graph),
		faces: count.faces(graph),
	};
	const implied = {
		vertices: countImplied.vertices(graph),
		edges: countImplied.edges(graph),
		faces: countImplied.faces(graph),
	};
	return {
		vertices: counts.vertices >= implied.vertices,
		edges: counts.edges >= implied.edges,
		faces: counts.faces >= implied.faces,
	};
};
const validate = (graph, epsilon) => {
	const duplicate_edges = duplicateEdges(graph);
	const circular_edges = circularEdges(graph);
	const isolated_vertices = isolatedVertices(graph);
	const duplicate_vertices = duplicateVertices(graph, epsilon);
	const references = validate_references(graph);
	const is_perfect = duplicate_edges.length === 0
		&& circular_edges.length === 0
		&& isolated_vertices.length === 0
		&& references.vertices && references.edges && references.faces;
	const summary = is_perfect ? "valid" : "problematic";
	return {
		summary,
		vertices: {
			isolated: isolated_vertices,
			duplicate: duplicate_vertices,
			references: references.vertices,
		},
		edges: {
			circular: circular_edges,
			duplicate: duplicate_edges,
			references: references.edges,
		},
		faces: {
			references: references.faces,
		},
	};
};const clean = (graph, epsilon) => {
	const change_v1 = removeDuplicateVertices(graph, epsilon);
	const change_e1 = removeCircularEdges(graph);
	const change_e2 = removeDuplicateEdges(graph);
	const change_v2 = removeIsolatedVertices(graph);
	const change_v1_backmap = invertSimpleMap(change_v1.map);
	const change_v2_remove = change_v2.remove.map(e => change_v1_backmap[e]);
	const change_e1_backmap = invertSimpleMap(change_e1.map);
	const change_e2_remove = change_e2.remove.map(e => change_e1_backmap[e]);
	return {
		vertices: {
			map: mergeSimpleNextmaps(change_v1.map, change_v2.map),
			remove: change_v1.remove.concat(change_v2_remove),
		},
		edges: {
			map: mergeSimpleNextmaps(change_e1.map, change_e2.map),
			remove: change_e1.remove.concat(change_e2_remove),
		},
	};
};const build_assignments_if_needed = (graph) => {
	const len = graph.edges_vertices.length;
	if (!graph.edges_assignment) { graph.edges_assignment = []; }
	if (!graph.edges_foldAngle) { graph.edges_foldAngle = []; }
	if (graph.edges_assignment.length > graph.edges_foldAngle.length) {
		for (let i = graph.edges_foldAngle.length; i < graph.edges_assignment.length; i += 1) {
			graph.edges_foldAngle[i] = edgeAssignmentToFoldAngle(graph.edges_assignment[i]);
		}
	}
	if (graph.edges_foldAngle.length > graph.edges_assignment.length) {
		for (let i = graph.edges_assignment.length; i < graph.edges_foldAngle.length; i += 1) {
			graph.edges_assignment[i] = edgeFoldAngleToAssignment(graph.edges_foldAngle[i]);
		}
	}
	for (let i = graph.edges_assignment.length; i < len; i += 1) {
		graph.edges_assignment[i] = "U";
		graph.edges_foldAngle[i] = 0;
	}
};
const build_faces_if_needed = (graph, reface) => {
	if (reface === undefined && !graph.faces_vertices && !graph.faces_edges) {
		reface = true;
	}
	if (reface && graph.vertices_coords) {
		const faces = makePlanarFaces(graph);
		graph.faces_vertices = faces.map(face => face.vertices);
		graph.faces_edges = faces.map(face => face.edges);
		return;
	}
	if (graph.faces_vertices && graph.faces_edges) { return; }
	if (graph.faces_vertices && !graph.faces_edges) {
		graph.faces_edges = makeFacesEdgesFromVertices(graph);
	} else if (graph.faces_edges && !graph.faces_vertices) {
		graph.faces_vertices = makeFacesVerticesFromEdges(graph);
	} else {
		graph.faces_vertices = [];
		graph.faces_edges = [];
	}
};
const populate = (graph, reface) => {
	if (typeof graph !== "object") { return graph; }
	if (!graph.edges_vertices) { return graph; }
	graph.vertices_edges = makeVerticesEdgesUnsorted(graph);
	graph.vertices_vertices = makeVerticesVertices(graph);
	graph.vertices_edges = makeVerticesEdges(graph);
	build_assignments_if_needed(graph);
	build_faces_if_needed(graph, reface);
	graph.vertices_faces = makeVerticesFaces(graph);
	graph.edges_faces = makeEdgesFacesUnsorted(graph);
	graph.faces_faces = makeFacesFaces(graph);
	return graph;
};const removePlanarVertex = (graph, vertex) => {
	const edges = graph.vertices_edges[vertex];
	const faces = uniqueSortedNumbers(graph.vertices_faces[vertex]
		.filter(a => a != null));
	if (edges.length !== 2 || faces.length > 2) {
		console.warn("cannot remove non 2-degree vertex yet (e,f)", edges, faces);
		return;
	}
	const vertices = getOtherVerticesInEdges(graph, vertex, edges);
	const vertices_reverse = vertices.slice().reverse();
	edges.sort((a, b) => a - b);
	vertices.forEach(v => {
		const index = graph.vertices_edges[v].indexOf(edges[1]);
		if (index === -1) { return; }
		graph.vertices_edges[v][index] = edges[0];
	});
	vertices.forEach((v, i) => {
		const index = graph.vertices_vertices[v].indexOf(vertex);
		if (index === -1) {
			console.warn("removePlanarVertex unknown vertex issue");
			return;
		}
		graph.vertices_vertices[v][index] = vertices_reverse[i];
	});
	graph.edges_vertices[edges[0]] = [...vertices];
	faces.forEach(face => {
		const index = graph.faces_vertices[face].indexOf(vertex);
		if (index === -1) {
			console.warn("removePlanarVertex unknown face_vertex issue");
			return;
		}
		graph.faces_vertices[face].splice(index, 1);
	});
	faces.forEach(face => {
		const index = graph.faces_edges[face].indexOf(edges[1]);
		if (index === -1) {
			console.warn("removePlanarVertex unknown face_edge issue");
			return;
		}
		graph.faces_edges[face].splice(index, 1);
	});
	removeGeometryIndices(graph, "vertices", [vertex]);
	removeGeometryIndices(graph, "edges", [edges[1]]);
};const update_vertices_vertices$2 = ({ vertices_vertices }, vertices) => {
	const other = [vertices[1], vertices[0]];
	vertices
		.map((v, i) => vertices_vertices[v].indexOf(other[i]))
		.forEach((index, i) => vertices_vertices[vertices[i]].splice(index, 1));
};
const update_vertices_edges$2 = ({ vertices_edges }, edge, vertices) => {
	vertices
		.map((v, i) => vertices_edges[v].indexOf(edge))
		.forEach((index, i) => vertices_edges[vertices[i]].splice(index, 1));
};
const join_faces = (graph, faces, edge, vertices) => {
	const faces_edge_index = faces
		.map(f => graph.faces_edges[f].indexOf(edge));
	const faces_vertices_index = [];
	faces.forEach((face, f) => graph.faces_vertices[face]
		.forEach((v, i, arr) => {
			const next = arr[(i + 1) % arr.length];
			if ((v === vertices[0] && next === vertices[1])
				|| (v === vertices[1] && next === vertices[0])) {
				faces_vertices_index[f] = i;
			}
		}));
	if (faces_vertices_index[0] === undefined || faces_vertices_index[1] === undefined) { console.warn("removePlanarEdge error joining faces"); }
	const edges_len_before = faces
		.map(f => graph.faces_edges[f].length);
	const vertices_len_before = faces
		.map(f => graph.faces_vertices[f].length);
	const edges_len_after = edges_len_before.map(len => len - 1);
	const vertices_len_after = vertices_len_before.map(len => len - 1);
	const faces_edge_keep = faces_edge_index
		.map((e, i) => (e + 1) % edges_len_before[i]);
	const faces_vertex_keep = faces_vertices_index
		.map((v, i) => (v + 1) % vertices_len_before[i]);
	const new_faces_edges = faces
		.map((face, f) => Array.from(Array(edges_len_after[f]))
			.map((_, i) => (faces_edge_keep[f] + i) % edges_len_before[f])
			.map(index => graph.faces_edges[face][index]));
	const new_faces_vertices = faces
		.map((face, f) => Array.from(Array(vertices_len_after[f]))
			.map((_, i) => (faces_vertex_keep[f] + i) % vertices_len_before[f])
			.map(index => graph.faces_vertices[face][index]));
	const new_faces_faces = faces
		.map(f => graph.faces_faces[f])
		.reduce((a, b) => a.concat(b), [])
		.filter(f => f !== faces[0] && f !== faces[1]);
	return {
		vertices: new_faces_vertices[0].concat(new_faces_vertices[1]),
		edges: new_faces_edges[0].concat(new_faces_edges[1]),
		faces: new_faces_faces,
	};
};
const removePlanarEdge = (graph, edge) => {
	const vertices = [...graph.edges_vertices[edge]]
		.sort((a, b) => b - a);
	const faces = [...graph.edges_faces[edge]];
	update_vertices_vertices$2(graph, vertices);
	update_vertices_edges$2(graph, edge, vertices);
	const vertices_should_remove = vertices
		.map(v => graph.vertices_vertices[v].length === 0);
	const remove_vertices = vertices
		.filter((vertex, i) => vertices_should_remove[i]);
	if (faces.length === 2 && faces[0] !== faces[1]) {
		const new_face = graph.faces_vertices.length;
		const new_face_data = join_faces(graph, faces, edge, vertices);
		graph.faces_vertices.push(new_face_data.vertices);
		graph.faces_edges.push(new_face_data.edges);
		graph.faces_faces.push(new_face_data.faces);
		graph.vertices_faces.forEach((arr, i) => {
			let already_added = false;
			arr.forEach((face, j) => {
				if (face === faces[0] || face === faces[1]) {
					graph.vertices_faces[i][j] = new_face;
					const params = already_added ? [i, 1] : [i, 1, new_face];
					arr.splice(...params);
					already_added = true;
				}
			});
		});
		graph.edges_faces.forEach((arr, i) => arr.forEach((face, j) => {
			if (face === faces[0] || face === faces[1]) {
				graph.edges_faces[i][j] = new_face;
			}
		}));
		graph.faces_faces.forEach((arr, i) => arr.forEach((face, j) => {
			if (face === faces[0] || face === faces[1]) {
				graph.faces_faces[i][j] = new_face;
			}
		}));
		graph.faces_vertices.forEach(fv => fv.forEach(f => {
			if (f === undefined) {
				console.log("FOUND ONE before remove", graph.faces_vertices);
			}
		}));
		removeGeometryIndices(graph, "faces", faces);
	}
	if (faces.length === 2 && faces[0] === faces[1] && remove_vertices.length) {
		const face = faces[0];
		graph.faces_vertices[face] = graph.faces_vertices[face]
			.filter(v => !remove_vertices.includes(v))
			.filter((v, i, arr) => v !== arr[(i+1)%arr.length]);
		graph.faces_edges[face] = graph.faces_edges[face]
			.filter(e => e !== edge);
	}
	removeGeometryIndices(graph, "edges", [edge]);
	removeGeometryIndices(graph, "vertices", remove_vertices);
};const addVertices = (graph, vertices_coords, epsilon = EPSILON) => {
	if (!graph.vertices_coords) { graph.vertices_coords = []; }
	if (typeof vertices_coords[0] === "number") { vertices_coords = [vertices_coords]; }
	const vertices_equivalent_vertices = vertices_coords
		.map(vertex => graph.vertices_coords
			.map(v => distance(v, vertex) < epsilon)
			.map((on_vertex, i) => (on_vertex ? i : undefined))
			.filter(a => a !== undefined)
			.shift());
	let index = graph.vertices_coords.length;
	const unique_vertices = vertices_coords
		.filter((vert, i) => vertices_equivalent_vertices[i] === undefined);
	graph.vertices_coords.push(...unique_vertices);
	return vertices_equivalent_vertices
		.map(el => (el === undefined ? index++ : el));
};const addEdges = (graph, edges_vertices) => {
	if (!graph.edges_vertices) { graph.edges_vertices = []; }
	if (typeof edges_vertices[0] === "number") { edges_vertices = [edges_vertices]; }
	const indices = edges_vertices.map((_, i) => graph.edges_vertices.length + i);
	graph.edges_vertices.push(...edges_vertices);
	const index_map = removeDuplicateEdges(graph).map;
	return indices.map(i => index_map[i]);
};const update_vertices_vertices$1 = ({ vertices_vertices }, vertex, incident_vertices) => {
	if (!vertices_vertices) { return; }
	vertices_vertices[vertex] = [...incident_vertices];
	incident_vertices.forEach((v, i, arr) => {
		const otherV = arr[(i + 1) % arr.length];
		const otherI = vertices_vertices[v].indexOf(otherV);
		vertices_vertices[v][otherI] = vertex;
	});
};
const update_vertices_sectors = ({
	vertices_coords, vertices_vertices, vertices_sectors,
}, vertex) => {
	if (!vertices_sectors) { return; }
	vertices_sectors[vertex] = vertices_vertices[vertex].length === 1
		? [TWO_PI]
		: counterClockwiseSectors2(vertices_vertices[vertex]
			.map(v => subtract2(vertices_coords[v], vertices_coords[vertex])));
};
const update_vertices_edges$1 = ({
	vertices_edges,
}, old_edge, new_vertex, vertices, new_edges) => {
	if (!vertices_edges) { return; }
	vertices_edges[new_vertex] = [...new_edges];
	vertices
		.map(v => vertices_edges[v].indexOf(old_edge))
		.forEach((index, i) => {
			vertices_edges[vertices[i]][index] = new_edges[i];
		});
};
const update_vertices_faces$1 = ({ vertices_faces }, vertex, faces) => {
	if (!vertices_faces) { return; }
	vertices_faces[vertex] = [...faces];
};
const update_edges_faces$1 = ({ edges_faces }, new_edges, faces) => {
	if (!edges_faces) { return; }
	new_edges.forEach(edge => { edges_faces[edge] = [...faces]; });
};
const update_faces_vertices = ({ faces_vertices }, new_vertex, incident_vertices, faces) => {
	if (!faces_vertices) { return; }
	faces
		.map(i => faces_vertices[i])
		.forEach(face => face
			.map((fv, i, arr) => {
				const nextI = (i + 1) % arr.length;
				return (fv === incident_vertices[0]
								&& arr[nextI] === incident_vertices[1])
								|| (fv === incident_vertices[1]
								&& arr[nextI] === incident_vertices[0])
					? nextI : undefined;
			}).filter(el => el !== undefined)
			.sort((a, b) => b - a)
			.forEach(i => face.splice(i, 0, new_vertex)));
};
const update_faces_edges_with_vertices = ({
	edges_vertices, faces_vertices, faces_edges,
}, faces) => {
	const edge_map = makeVerticesToEdgeBidirectional({ edges_vertices });
	faces
		.map(f => faces_vertices[f]
			.map((vertex, i, arr) => [vertex, arr[(i + 1) % arr.length]])
			.map(pair => edge_map[pair.join(" ")]))
		.forEach((edges, i) => { faces_edges[faces[i]] = edges; });
};const splitEdgeIntoTwo = (graph, edge_index, new_vertex) => {
	const edge_vertices = graph.edges_vertices[edge_index];
	const new_edges = [
		{ edges_vertices: [edge_vertices[0], new_vertex] },
		{ edges_vertices: [new_vertex, edge_vertices[1]] },
	];
	new_edges.forEach(edge => [_edges_assignment, _edges_foldAngle]
		.filter(key => graph[key] && graph[key][edge_index] !== undefined)
		.forEach(key => { edge[key] = graph[key][edge_index]; }));
	return new_edges;
};
const splitEdge = (graph, old_edge, coords, epsilon = EPSILON) => {
	if (graph.edges_vertices.length < old_edge) { return {}; }
	const incident_vertices = graph.edges_vertices[old_edge];
	if (!coords) {
		coords = midpoint(...incident_vertices);
	}
	const similar = incident_vertices
		.map(v => graph.vertices_coords[v])
		.map(vert => distance(vert, coords) < epsilon);
	if (similar[0]) { return { vertex: incident_vertices[0], edges: {} }; }
	if (similar[1]) { return { vertex: incident_vertices[1], edges: {} }; }
	const vertex = graph.vertices_coords.length;
	graph.vertices_coords[vertex] = coords;
	const new_edges = [0, 1].map(i => i + graph.edges_vertices.length);
	splitEdgeIntoTwo(graph, old_edge, vertex)
		.forEach((edge, i) => Object.keys(edge)
			.forEach((key) => { graph[key][new_edges[i]] = edge[key]; }));
	update_vertices_vertices$1(graph, vertex, incident_vertices);
	update_vertices_sectors(graph, vertex);
	update_vertices_edges$1(graph, old_edge, vertex, incident_vertices, new_edges);
	const incident_faces = findAdjacentFacesToEdge(graph, old_edge);
	if (incident_faces) {
		update_vertices_faces$1(graph, vertex, incident_faces);
		update_edges_faces$1(graph, new_edges, incident_faces);
		update_faces_vertices(graph, vertex, incident_vertices, incident_faces);
		update_faces_edges_with_vertices(graph, incident_faces);
	}
	const edge_map = removeGeometryIndices(graph, _edges, [old_edge]);
	new_edges.forEach((_, i) => { new_edges[i] = edge_map[new_edges[i]]; });
	edge_map.splice(-2);
	edge_map[old_edge] = new_edges;
	return {
		vertex,
		edges: {
			map: edge_map,
			new: new_edges,
			remove: old_edge,
		},
	};
};const make_edge = ({ vertices_coords }, vertices, face) => {
	const new_edge_coords = vertices
		.map(v => vertices_coords[v])
		.reverse();
	return {
		edges_vertices: [...vertices],
		edges_foldAngle: 0,
		edges_assignment: "U",
		edges_length: distance(...new_edge_coords),
		edges_vector: subtract(...new_edge_coords),
		edges_faces: [face, face],
	};
};
const rebuild_edge = (graph, face, vertices) => {
	const edge = graph.edges_vertices.length;
	const new_edge = make_edge(graph, vertices, face);
	Object.keys(new_edge)
		.filter(key => graph[key] !== undefined)
		.forEach((key) => { graph[key][edge] = new_edge[key]; });
	return edge;
};const make_faces = ({
	edges_vertices, faces_vertices, faces_edges,
}, face, vertices) => {
	const indices = vertices.map(el => faces_vertices[face].indexOf(el));
	const faces = splitCircularArray(faces_vertices[face], indices)
		.map(fv => ({ faces_vertices: fv }));
	if (faces_edges) {
		const vertices_to_edge = makeVerticesToEdgeBidirectional({ edges_vertices });
		faces
			.map(this_face => this_face.faces_vertices
				.map((fv, i, arr) => `${fv} ${arr[(i + 1) % arr.length]}`)
				.map(key => vertices_to_edge[key]))
			.forEach((face_edges, i) => { faces[i].faces_edges = face_edges; });
	}
	return faces;
};
const build_faces = (graph, face, vertices) => {
	const faces = [0, 1].map(i => graph.faces_vertices.length + i);
	make_faces(graph, face, vertices)
		.forEach((newface, i) => Object.keys(newface)
			.forEach((key) => { graph[key][faces[i]] = newface[key]; }));
	return faces;
};const split_at_intersections = (graph, { vertices, edges }) => {
	let map;
	const split_results = edges.map((el) => {
		const res = splitEdge(graph, map ? map[el.edge] : el.edge, el.coords);
		map = map ? mergeNextmaps(map, res.edges.map) : res.edges.map;
		return res;
	});
	vertices.push(...split_results.map(res => res.vertex));
	let bkmap;
	split_results.forEach(res => {
		res.edges.remove = bkmap ? bkmap[res.edges.remove] : res.edges.remove;
		const inverted = invertSimpleMap(res.edges.map);
		bkmap = bkmap ? mergeBackmaps(bkmap, inverted) : inverted;
	});
	return {
		vertices,
		edges: {
			map,
			remove: split_results.map(res => res.edges.remove),
		},
	};
};const update_vertices_vertices = ({
	vertices_coords, vertices_vertices, edges_vertices,
}, edge) => {
	const v0 = edges_vertices[edge][0];
	const v1 = edges_vertices[edge][1];
	vertices_vertices[v0] = sortVerticesCounterClockwise(
		{ vertices_coords },
		vertices_vertices[v0].concat(v1),
		v0,
	);
	vertices_vertices[v1] = sortVerticesCounterClockwise(
		{ vertices_coords },
		vertices_vertices[v1].concat(v0),
		v1,
	);
};
const update_vertices_edges = ({
	edges_vertices, vertices_edges, vertices_vertices,
}, edge) => {
	if (!vertices_edges || !vertices_vertices) { return; }
	const vertices = edges_vertices[edge];
	vertices
		.map(v => vertices_vertices[v])
		.map((vert_vert, i) => vert_vert
			.indexOf(vertices[(i + 1) % vertices.length]))
		.forEach((radial_index, i) => vertices_edges[vertices[i]]
			.splice(radial_index, 0, edge));
};
const update_vertices_faces = (graph, old_face, new_faces) => {
	const vertices_replacement_faces = {};
	new_faces
		.forEach(f => graph.faces_vertices[f]
			.forEach(v => {
				if (!vertices_replacement_faces[v]) {
					vertices_replacement_faces[v] = [];
				}
				vertices_replacement_faces[v].push(f);
			}));
	graph.faces_vertices[old_face].forEach(v => {
		const index = graph.vertices_faces[v].indexOf(old_face);
		const replacements = vertices_replacement_faces[v];
		if (index === -1 || !replacements) {
			throw new Error(Messages$1.convexFace);
		}
		graph.vertices_faces[v].splice(index, 1, ...replacements);
	});
};
const update_edges_faces = (graph, old_face, new_edge, new_faces) => {
	const edges_replacement_faces = {};
	new_faces
		.forEach(f => graph.faces_edges[f]
			.forEach(e => {
				if (!edges_replacement_faces[e]) { edges_replacement_faces[e] = []; }
				edges_replacement_faces[e].push(f);
			}));
	const edges = [...graph.faces_edges[old_face], new_edge];
	edges.forEach(e => {
		const replacements = edges_replacement_faces[e];
		const indices = [];
		for (let i = 0; i < graph.edges_faces[e].length; i += 1) {
			if (graph.edges_faces[e][i] === old_face) { indices.push(i); }
		}
		if (indices.length === 0 || !replacements) {
			throw new Error(Messages$1.convexFace);
		}
		indices.reverse().forEach(index => graph.edges_faces[e].splice(index, 1));
		const index = indices[indices.length - 1];
		graph.edges_faces[e].splice(index, 0, ...replacements);
	});
};
const update_faces_faces = ({ faces_vertices, faces_faces }, old_face, new_faces) => {
	const incident_faces = faces_faces[old_face];
	const new_faces_vertices = new_faces.map(f => faces_vertices[f]);
	const incident_face_face = incident_faces.map(f => {
		const incident_face_vertices = faces_vertices[f];
		const score = [0, 0];
		for (let n = 0; n < new_faces_vertices.length; n += 1) {
			let count = 0;
			for (let j = 0; j < incident_face_vertices.length; j += 1) {
				if (new_faces_vertices[n].indexOf(incident_face_vertices[j]) !== -1) {
					count += 1;
				}
			}
			score[n] = count;
		}
		if (score[0] >= 2) { return new_faces[0]; }
		if (score[1] >= 2) { return new_faces[1]; }
	});
	new_faces.forEach((f, i, arr) => {
		faces_faces[f] = [arr[(i + 1) % new_faces.length]];
	});
	incident_faces.forEach((f, i) => {
		for (let j = 0; j < faces_faces[f].length; j += 1) {
			if (faces_faces[f][j] === old_face) {
				faces_faces[f][j] = incident_face_face[i];
				faces_faces[incident_face_face[i]].push(f);
			}
		}
	});
};const splitFace = (graph, face, vector, point, epsilon) => {
	const intersect = intersectConvexFaceLine(graph, face, { vector, origin: point }, epsilon);
	if (intersect === undefined) { return undefined; }
	const result = split_at_intersections(graph, intersect);
	result.edges.new = rebuild_edge(graph, face, result.vertices);
	update_vertices_vertices(graph, result.edges.new);
	update_vertices_edges(graph, result.edges.new);
	const faces = build_faces(graph, face, result.vertices);
	update_vertices_faces(graph, face, faces);
	update_edges_faces(graph, face, result.edges.new, faces);
	update_faces_faces(graph, face, faces);
	const faces_map = removeGeometryIndices(graph, _faces, [face]);
	faces.forEach((_, i) => { faces[i] = faces_map[faces[i]]; });
	faces_map.splice(-2);
	faces_map[face] = faces;
	result.faces = {
		map: faces_map,
		new: faces,
		remove: face,
	};
	return result;
};const foldFacesLayer = (faces_layer, faces_folding) => {
	const new_faces_layer = [];
	const arr = faces_layer.map((_, i) => i);
	const folding = arr.filter(i => faces_folding[i]);
	const not_folding = arr.filter(i => !faces_folding[i]);
	not_folding
		.sort((a, b) => faces_layer[a] - faces_layer[b])
		.forEach((face, i) => { new_faces_layer[face] = i; });
	folding
		.sort((a, b) => faces_layer[b] - faces_layer[a])
		.forEach((face, i) => { new_faces_layer[face] = not_folding.length + i; });
	return new_faces_layer;
};const make_face_side = (vector, origin, face_center, face_winding) => {
	const center_vector = subtract2(face_center, origin);
	const determinant = cross2(vector, center_vector);
	return face_winding ? determinant > 0 : determinant < 0;
};
const make_face_center = (graph, face) => (!graph.faces_vertices[face]
	? [0, 0]
	: graph.faces_vertices[face]
		.map(v => graph.vertices_coords[v])
		.reduce((a, b) => [a[0] + b[0], a[1] + b[1]], [0, 0])
		.map(el => el / graph.faces_vertices[face].length));
const unfolded_assignment = {
	F: true, f: true, U: true, u: true,
};
const opposite_lookup = {
	M: "V", m: "V", V: "M", v: "M",
};
const get_opposite_assignment = assign => opposite_lookup[assign] || assign;
const face_snapshot = (graph, face) => ({
	center: graph.faces_center[face],
	matrix: graph.faces_matrix2[face],
	winding: graph.faces_winding[face],
	crease: graph.faces_crease[face],
	side: graph.faces_side[face],
	layer: graph.faces_layer[face],
});
const flatFold = (graph, { vector, origin }, assignment = "V", epsilon = EPSILON) => {
	const opposite_assignment = get_opposite_assignment(assignment);
	populate(graph);
	if (!graph.faces_layer) {
		graph.faces_layer = Array(graph.faces_vertices.length).fill(0);
	}
	graph.faces_center = graph.faces_vertices
		.map((_, i) => make_face_center(graph, i));
	if (!graph.faces_matrix2) {
		graph.faces_matrix2 = makeFacesMatrix2(graph, 0);
	}
	graph.faces_winding = makeFacesWindingFromMatrix2(graph.faces_matrix2);
	graph.faces_crease = graph.faces_matrix2
		.map(invertMatrix2)
		.map(matrix => multiplyMatrix2Line2(matrix, vector, origin));
	graph.faces_side = graph.faces_vertices
		.map((_, i) => make_face_side(
			graph.faces_crease[i].vector,
			graph.faces_crease[i].origin,
			graph.faces_center[i],
			graph.faces_winding[i],
		));
	const vertices_coords_folded = multiplyVerticesFacesMatrix2(
		graph,
		graph.faces_matrix2,
	);
	const collinear_edges = makeEdgesLineParallelOverlap({
		vertices_coords: vertices_coords_folded,
		edges_vertices: graph.edges_vertices,
	}, vector, origin, epsilon)
		.map((is_collinear, e) => (is_collinear ? e : undefined))
		.filter(e => e !== undefined)
		.filter(e => unfolded_assignment[graph.edges_assignment[e]]);
	collinear_edges
		.map(e => graph.edges_faces[e].find(f => f != null))
		.map(f => graph.faces_winding[f])
		.map(winding => (winding ? assignment : opposite_assignment))
		.forEach((assign, e) => {
			graph.edges_assignment[collinear_edges[e]] = assign;
			graph.edges_foldAngle[collinear_edges[e]] = edgeAssignmentToFoldAngle(
				assign,
			);
		});
	const face0 = face_snapshot(graph, 0);
	const split_changes = graph.faces_vertices
		.map((_, i) => i)
		.reverse()
		.map((i) => {
			const face = face_snapshot(graph, i);
			const change = splitFace(
				graph,
				i,
				face.crease.vector,
				face.crease.origin,
				epsilon,
			);
			if (change === undefined) { return undefined; }
			graph.edges_assignment[change.edges.new] = face.winding
				? assignment
				: opposite_assignment;
			graph.edges_foldAngle[change.edges.new] = edgeAssignmentToFoldAngle(
				graph.edges_assignment[change.edges.new],
			);
			const new_faces = change.faces.map[change.faces.remove];
			new_faces.forEach(f => {
				graph.faces_center[f] = make_face_center(graph, f);
				graph.faces_side[f] = make_face_side(
					face.crease.vector,
					face.crease.origin,
					graph.faces_center[f],
					face.winding,
				);
				graph.faces_layer[f] = face.layer;
			});
			return change;
		})
		.filter(a => a !== undefined);
	const faces_map = mergeNextmaps(...split_changes.map(el => el.faces.map));
	const edges_map = mergeNextmaps(...split_changes.map(el => el.edges.map)
		.filter(a => a !== undefined));
	const faces_remove = split_changes.map(el => el.faces.remove).reverse();
	graph.faces_layer = foldFacesLayer(
		graph.faces_layer,
		graph.faces_side,
	);
	const face0_was_split = faces_map && faces_map[0] && faces_map[0].length === 2;
	const face0_newIndex = (face0_was_split
		? faces_map[0].filter(f => graph.faces_side[f]).shift()
		: 0);
	let face0_preMatrix = face0.matrix;
	if (assignment !== opposite_assignment) {
		face0_preMatrix = (!face0_was_split && !graph.faces_side[0]
			? face0.matrix
			: multiplyMatrices2(
				face0.matrix,
				makeMatrix2Reflect(
					face0.crease.vector,
					face0.crease.origin,
				),
			)
		);
	}
	graph.faces_matrix2 = makeFacesMatrix2(graph, face0_newIndex)
		.map(matrix => multiplyMatrices2(face0_preMatrix, matrix));
	delete graph.faces_center;
	delete graph.faces_winding;
	delete graph.faces_crease;
	delete graph.faces_side;
	return {
		faces: { map: faces_map, remove: faces_remove },
		edges: { map: edges_map },
	};
};const add_segment_edges = (graph, segment_vertices, pre_edge_map) => {
	const unfiltered_segment_edges_vertices = Array
		.from(Array(segment_vertices.length - 1))
		.map((_, i) => [segment_vertices[i], segment_vertices[i + 1]]);
	const seg_not_exist_yet = unfiltered_segment_edges_vertices
		.map(verts => verts.join(" "))
		.map(str => pre_edge_map[str] === undefined);
	const segment_edges_vertices = unfiltered_segment_edges_vertices
		.filter((_, i) => seg_not_exist_yet[i]);
	const segment_edges = Array
		.from(Array(segment_edges_vertices.length))
		.map((_, i) => graph.edges_vertices.length + i);
	segment_edges.forEach((e, i) => {
		graph.edges_vertices[e] = segment_edges_vertices[i];
	});
	if (graph.edges_assignment) {
		segment_edges.forEach(e => { graph.edges_assignment[e] = "U"; });
	}
	if (graph.edges_foldAngle) {
		segment_edges.forEach(e => { graph.edges_foldAngle[e] = 0; });
	}
	for (let i = 0; i < segment_vertices.length; i += 1) {
		const vertex = segment_vertices[i];
		const prev = seg_not_exist_yet[i - 1] ? segment_vertices[i - 1] : undefined;
		const next = seg_not_exist_yet[i] ? segment_vertices[i + 1] : undefined;
		const new_adjacent_vertices = [prev, next].filter(a => a !== undefined);
		const previous_vertices_vertices = graph.vertices_vertices[vertex]
			? graph.vertices_vertices[vertex] : [];
		const unsorted_vertices_vertices = previous_vertices_vertices
			.concat(new_adjacent_vertices);
		graph.vertices_vertices[vertex] = sortVerticesCounterClockwise(
			graph,
			unsorted_vertices_vertices,
			segment_vertices[i],
		);
	}
	const edge_map = makeVerticesToEdgeBidirectional(graph);
	for (let i = 0; i < segment_vertices.length; i += 1) {
		const vertex = segment_vertices[i];
		graph.vertices_edges[vertex] = graph.vertices_vertices[vertex]
			.map(v => edge_map[`${vertex} ${v}`]);
	}
	segment_vertices
		.map(center => (graph.vertices_vertices[center].length === 1
			? [TWO_PI]
			: counterClockwiseSectors2(graph.vertices_vertices[center]
				.map(v => subtract2(
					graph.vertices_coords[v],
					graph.vertices_coords[center],
				)))))
		.forEach((sectors, i) => {
			graph.vertices_sectors[segment_vertices[i]] = sectors;
		});
	return segment_edges;
};
const addPlanarSegment = (graph, point1, point2, epsilon = EPSILON) => {
	if (!graph.vertices_sectors) {
		graph.vertices_sectors = makeVerticesSectors(graph);
	}
	const segment = [point1, point2].map(p => [p[0], p[1]]);
	const segment_vector = subtract2(segment[1], segment[0]);
	const intersections = makeEdgesSegmentIntersection(
		graph,
		segment[0],
		segment[1],
		epsilon,
	);
	const intersected_edges = intersections
		.map((pt, e) => (pt === undefined ? undefined : e))
		.filter(a => a !== undefined)
		.sort((a, b) => a - b);
	const faces_map = {};
	intersected_edges
		.forEach(e => graph.edges_faces[e]
			.forEach(f => { faces_map[f] = true; }));
	const intersected_faces = Object.keys(faces_map)
		.map(s => parseInt(s, 10))
		.sort((a, b) => a - b);
	const splitEdge_results = intersected_edges
		.reverse()
		.map(edge => splitEdge(graph, edge, intersections[edge], epsilon));
	const splitEdge_vertices = splitEdge_results.map(el => el.vertex);
	const endpoint_vertices = addVertices(graph, segment, epsilon);
	const new_vertex_hash = {};
	splitEdge_vertices.forEach(v => { new_vertex_hash[v] = true; });
	endpoint_vertices.forEach(v => { new_vertex_hash[v] = true; });
	const new_vertices = Object.keys(new_vertex_hash).map(n => parseInt(n, 10));
	const segment_vertices = sortVerticesAlongVector(graph, new_vertices, segment_vector);
	const edge_map = makeVerticesToEdgeBidirectional(graph);
	const segment_edges = add_segment_edges(graph, segment_vertices, edge_map);
	segment_edges.forEach(e => {
		const v = graph.edges_vertices[e];
		edge_map[`${v[0]} ${v[1]}`] = e;
		edge_map[`${v[1]} ${v[0]}`] = e;
	});
	const face_walk_start_pairs = segment_vertices
		.map(v => graph.vertices_vertices[v]
			.map(adj_v => [[adj_v, v], [v, adj_v]]))
		.reduce((a, b) => a.concat(b), [])
		.reduce((a, b) => a.concat(b), []);
	const walked_edges = {};
	const all_walked_faces = face_walk_start_pairs
		.map(pair => counterClockwiseWalk(graph, pair[0], pair[1], walked_edges))
		.filter(a => a !== undefined);
	const walked_faces = filterWalkedBoundaryFace(all_walked_faces);
	removeGeometryIndices(graph, "faces", intersected_faces);
	const new_faces = walked_faces
		.map((_, i) => graph.faces_vertices.length + i);
	if (graph.faces_vertices) {
		new_faces.forEach((f, i) => {
			graph.faces_vertices[f] = walked_faces[i].vertices;
		});
	}
	if (graph.faces_edges) {
		new_faces.forEach((f, i) => {
			graph.faces_edges[f] = walked_faces[i].edges
				.map(pair => edge_map[pair]);
		});
	}
	if (graph.faces_angles) {
		new_faces.forEach((f, i) => {
			graph.faces_angles[f] = walked_faces[i].faces_angles;
		});
	}
	if (graph.vertices_faces) {
		graph.vertices_faces = makeVerticesFaces(graph);
	}
	if (graph.edges_faces) {
		graph.edges_faces = makeEdgesFacesUnsorted(graph);
	}
	if (graph.faces_faces) {
		graph.faces_faces = makeFacesFaces(graph);
	}
	if (graph.vertices_coords.length !== graph.vertices_vertices.length
		|| graph.vertices_coords.length !== graph.vertices_edges.length
		|| graph.vertices_coords.length !== graph.vertices_faces.length) {
		console.warn("vertices mismatch", JSON.parse(JSON.stringify(graph)));
	}
	if (graph.edges_vertices.length !== graph.edges_faces.length
		|| graph.edges_vertices.length !== graph.edges_assignment.length) {
		console.warn("edges mismatch", JSON.parse(JSON.stringify(graph)));
	}
	if (graph.faces_vertices.length !== graph.faces_edges.length
		|| graph.faces_vertices.length !== graph.faces_faces.length) {
		console.warn("faces mismatch", JSON.parse(JSON.stringify(graph)));
	}
	return segment_edges;
};const clip = function (graph, line) {
	const polygon = boundary(graph).vertices.map(v => graph.vertices_coords[v]);
	const vector = line.vector ? line.vector : subtract2(line[1], line[0]);
	const origin = line.origin ? line.origin : line[0];
	const fn_line = (line.domain ? line.domain : includeL);
	return clipLineConvexPolygon(
		polygon,
		{ vector, origin },
		include,
		fn_line,
	);
};const make_rect_vertices_coords = (w, h) => [[0, 0], [w, 0], [w, h], [0, h]];
const make_closed_polygon = (vertices_coords) => populate({
	vertices_coords,
	edges_vertices: vertices_coords
		.map((_, i, arr) => [i, (i + 1) % arr.length]),
	edges_assignment: Array(vertices_coords.length).fill("B"),
});
const square = (scale = 1) => (
	make_closed_polygon(make_rect_vertices_coords(scale, scale)));
const rectangle = (width = 1, height = 1) => (
	make_closed_polygon(make_rect_vertices_coords(width, height)));
const polygon = (sides = 3, radius = 1) => (
	make_closed_polygon(makePolygonCircumradius(sides, radius)));
const kite = () => populate({
	vertices_coords: [
		[0, 0], [1, 0], [1, Math.SQRT2 - 1], [1, 1], [Math.SQRT2 - 1, 1], [0, 1],
	],
	edges_vertices: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [0, 2], [0, 4], [0, 3]],
	edges_assignment: Array.from("BBBBBBVVF"),
});
const fish = () => populate({
	vertices_coords: [
		[0, 0], [1, 0], [1, 1], [0, 1], [0.5, 0.5], [1 - Math.SQRT1_2, Math.SQRT1_2],
		[Math.SQRT1_2, 1 - Math.SQRT1_2], [1, 1 - Math.SQRT1_2],
		[1 - Math.SQRT1_2, 1], [Math.SQRT1_2, 0], [0, Math.SQRT1_2],
	],
	edges_vertices: [
		[0, 4], [4, 2], [4, 5], [5, 3], [0, 5], [1, 6], [6, 4], [0, 6],
		[2, 5], [2, 6], [1, 7], [7, 2], [6, 7], [2, 8], [8, 3], [5, 8],
		[0, 9], [9, 1], [6, 9], [3, 10], [10, 0], [5, 10],
	],
	edges_assignment: Array.from("FFFVVVFVVVBBFBBFBBMBBM"),
	faces_vertices: [
		[7, 6, 1], [6, 7, 2], [6, 2, 4], [6, 4, 0], [6, 0, 9], [6, 9, 1],
		[2, 5, 4], [5, 2, 8], [5, 8, 3], [5, 3, 10], [5, 10, 0], [5, 0, 4],
	],
});const foldBases=/*#__PURE__*/Object.freeze({__proto__:null,fish,kite,polygon,rectangle,square});const graph = {
	count,
	countImplied,
	validate,
	clean,
	populate,
	remove: removeGeometryIndices,
	replace: replaceGeometryIndices,
	removePlanarVertex,
	removePlanarEdge,
	addVertices,
	addEdges,
	splitEdge,
	splitFace,
	flatFold,
	addPlanarSegment,
	clip,
	planarize: fragment,
	connectedComponents,
	clone,
	...foldKeyMethods,
	...foldSpecMethods,
	...foldFileFrames,
	...foldBases,
	...make,
	...boundary$1,
	...walk,
	...nearestMethods,
	...sortMethods,
	...span,
	...maps,
	...subgraphMethods,
	...intersectMethods$1,
	...triangulateMethods,
	...normals,
	...transform,
	...edgesEdges,
	...explodeMethods,
	...arrays,
	...verticesClusters$1,
	...verticesCollinear,
	...verticesDuplicate,
	...verticesFolded,
	...verticesIsolated,
	...edgesCircular,
	...edgesDuplicate,
	...edgesEdges,
	...edgesOverlap,
	...facesMatrix,
	...facesOverlap,
	...facesSpanningTree,
	...facesWinding,
};const countPlaces = function (num) {
	const m = (`${num}`).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
	return Math.max(0, (m[1] ? m[1].length : 0) - (m[2] ? +m[2] : 0));
};
const cleanNumber = function (num, places = 15) {
	if (typeof num !== "number") { return num; }
	const crop = parseFloat(num.toFixed(places));
	if (countPlaces(crop) === Math.min(places, countPlaces(num))) {
		return num;
	}
	return crop;
};const number=/*#__PURE__*/Object.freeze({__proto__:null,cleanNumber});const typeOf = (obj) => {
	if (typeof obj !== "object") { return typeof obj; }
	if (obj.radius !== undefined) { return "circle"; }
	if (obj.min && obj.max && obj.span) { return "box"; }
	if (typeof obj[0] === "number") { return "vector"; }
	if (obj.vector !== undefined && obj.origin !== undefined) { return "line"; }
	if (obj[0] !== undefined && obj[0].length && typeof obj[0][0] === "number") {
		return obj.length === 2 ? "segment" : "polygon";
	}
	return "object";
};const general = {
	...constant,
	..._function,
	...get,
	...convert$1,
	...array,
	...number,
	...search,
	...sort,
	typeof: typeOf,
};const identity4x4 = Object.freeze([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
const isIdentity4x4 = m => identity4x4
	.map((n, i) => Math.abs(n - m[i]) < EPSILON)
	.reduce((a, b) => a && b, true);
const multiplyMatrix4Vector3 = (m, vector) => [
	m[0] * vector[0] + m[4] * vector[1] + m[8] * vector[2] + m[12],
	m[1] * vector[0] + m[5] * vector[1] + m[9] * vector[2] + m[13],
	m[2] * vector[0] + m[6] * vector[1] + m[10] * vector[2] + m[14],
];
const multiplyMatrix4Line3 = (m, vector, origin) => ({
	vector: [
		m[0] * vector[0] + m[4] * vector[1] + m[8] * vector[2],
		m[1] * vector[0] + m[5] * vector[1] + m[9] * vector[2],
		m[2] * vector[0] + m[6] * vector[1] + m[10] * vector[2],
	],
	origin: [
		m[0] * origin[0] + m[4] * origin[1] + m[8] * origin[2] + m[12],
		m[1] * origin[0] + m[5] * origin[1] + m[9] * origin[2] + m[13],
		m[2] * origin[0] + m[6] * origin[1] + m[10] * origin[2] + m[14],
	],
});
const multiplyMatrices4 = (m1, m2) => [
	m1[0] * m2[0] + m1[4] * m2[1] + m1[8] * m2[2] + m1[12] * m2[3],
	m1[1] * m2[0] + m1[5] * m2[1] + m1[9] * m2[2] + m1[13] * m2[3],
	m1[2] * m2[0] + m1[6] * m2[1] + m1[10] * m2[2] + m1[14] * m2[3],
	m1[3] * m2[0] + m1[7] * m2[1] + m1[11] * m2[2] + m1[15] * m2[3],
	m1[0] * m2[4] + m1[4] * m2[5] + m1[8] * m2[6] + m1[12] * m2[7],
	m1[1] * m2[4] + m1[5] * m2[5] + m1[9] * m2[6] + m1[13] * m2[7],
	m1[2] * m2[4] + m1[6] * m2[5] + m1[10] * m2[6] + m1[14] * m2[7],
	m1[3] * m2[4] + m1[7] * m2[5] + m1[11] * m2[6] + m1[15] * m2[7],
	m1[0] * m2[8] + m1[4] * m2[9] + m1[8] * m2[10] + m1[12] * m2[11],
	m1[1] * m2[8] + m1[5] * m2[9] + m1[9] * m2[10] + m1[13] * m2[11],
	m1[2] * m2[8] + m1[6] * m2[9] + m1[10] * m2[10] + m1[14] * m2[11],
	m1[3] * m2[8] + m1[7] * m2[9] + m1[11] * m2[10] + m1[15] * m2[11],
	m1[0] * m2[12] + m1[4] * m2[13] + m1[8] * m2[14] + m1[12] * m2[15],
	m1[1] * m2[12] + m1[5] * m2[13] + m1[9] * m2[14] + m1[13] * m2[15],
	m1[2] * m2[12] + m1[6] * m2[13] + m1[10] * m2[14] + m1[14] * m2[15],
	m1[3] * m2[12] + m1[7] * m2[13] + m1[11] * m2[14] + m1[15] * m2[15],
];
const determinant4 = (m) => {
	const A2323 = m[10] * m[15] - m[11] * m[14];
	const A1323 = m[9] * m[15] - m[11] * m[13];
	const A1223 = m[9] * m[14] - m[10] * m[13];
	const A0323 = m[8] * m[15] - m[11] * m[12];
	const A0223 = m[8] * m[14] - m[10] * m[12];
	const A0123 = m[8] * m[13] - m[9] * m[12];
	return (
			m[0] * (m[5] * A2323 - m[6] * A1323 + m[7] * A1223)
		- m[1] * (m[4] * A2323 - m[6] * A0323 + m[7] * A0223)
		+ m[2] * (m[4] * A1323 - m[5] * A0323 + m[7] * A0123)
		- m[3] * (m[4] * A1223 - m[5] * A0223 + m[6] * A0123)
	);
};
const invertMatrix4 = (m) => {
	const det = determinant4(m);
	if (Math.abs(det) < 1e-6 || Number.isNaN(det)
		|| !Number.isFinite(m[12]) || !Number.isFinite(m[13]) || !Number.isFinite(m[14])) {
		return undefined;
	}
	const A2323 = m[10] * m[15] - m[11] * m[14];
	const A1323 = m[9] * m[15] - m[11] * m[13];
	const A1223 = m[9] * m[14] - m[10] * m[13];
	const A0323 = m[8] * m[15] - m[11] * m[12];
	const A0223 = m[8] * m[14] - m[10] * m[12];
	const A0123 = m[8] * m[13] - m[9] * m[12];
	const A2313 = m[6] * m[15] - m[7] * m[14];
	const A1313 = m[5] * m[15] - m[7] * m[13];
	const A1213 = m[5] * m[14] - m[6] * m[13];
	const A2312 = m[6] * m[11] - m[7] * m[10];
	const A1312 = m[5] * m[11] - m[7] * m[9];
	const A1212 = m[5] * m[10] - m[6] * m[9];
	const A0313 = m[4] * m[15] - m[7] * m[12];
	const A0213 = m[4] * m[14] - m[6] * m[12];
	const A0312 = m[4] * m[11] - m[7] * m[8];
	const A0212 = m[4] * m[10] - m[6] * m[8];
	const A0113 = m[4] * m[13] - m[5] * m[12];
	const A0112 = m[4] * m[9] - m[5] * m[8];
	const inv = [
		+(m[5] * A2323 - m[6] * A1323 + m[7] * A1223),
		-(m[1] * A2323 - m[2] * A1323 + m[3] * A1223),
		+(m[1] * A2313 - m[2] * A1313 + m[3] * A1213),
		-(m[1] * A2312 - m[2] * A1312 + m[3] * A1212),
		-(m[4] * A2323 - m[6] * A0323 + m[7] * A0223),
		+(m[0] * A2323 - m[2] * A0323 + m[3] * A0223),
		-(m[0] * A2313 - m[2] * A0313 + m[3] * A0213),
		+(m[0] * A2312 - m[2] * A0312 + m[3] * A0212),
		+(m[4] * A1323 - m[5] * A0323 + m[7] * A0123),
		-(m[0] * A1323 - m[1] * A0323 + m[3] * A0123),
		+(m[0] * A1313 - m[1] * A0313 + m[3] * A0113),
		-(m[0] * A1312 - m[1] * A0312 + m[3] * A0112),
		-(m[4] * A1223 - m[5] * A0223 + m[6] * A0123),
		+(m[0] * A1223 - m[1] * A0223 + m[2] * A0123),
		-(m[0] * A1213 - m[1] * A0213 + m[2] * A0113),
		+(m[0] * A1212 - m[1] * A0212 + m[2] * A0112),
	];
	const invDet = 1.0 / det;
	return inv.map(n => n * invDet);
};
const identity4x3 = Object.freeze([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0]);
const makeMatrix4Translate = (x = 0, y = 0, z = 0) => [...identity4x3, x, y, z, 1];
const singleAxisRotate4 = (angle, origin, i0, i1, sgn) => {
	const mat = makeMatrix4Translate(...origin);
	const cos = Math.cos(angle);
	const sin = Math.sin(angle);
	mat[i0 * 4 + i0] = cos;
	mat[i0 * 4 + i1] = (sgn ? +1 : -1) * sin;
	mat[i1 * 4 + i0] = (sgn ? -1 : +1) * sin;
	mat[i1 * 4 + i1] = cos;
	return mat;
};
const makeMatrix4RotateX = (angle, origin = [0, 0, 0]) => (
	singleAxisRotate4(angle, origin, 1, 2, true));
const makeMatrix4RotateY = (angle, origin = [0, 0, 0]) => (
	singleAxisRotate4(angle, origin, 0, 2, false));
const makeMatrix4RotateZ = (angle, origin = [0, 0, 0]) => (
	singleAxisRotate4(angle, origin, 0, 1, true));
const makeMatrix4Rotate = (angle, vector = [0, 0, 1], origin = [0, 0, 0]) => {
	const pos = [0, 1, 2].map(i => origin[i] || 0);
	const [x, y, z] = resize(3, normalize(vector));
	const c = Math.cos(angle);
	const s = Math.sin(angle);
	const t = 1 - c;
	const trans = makeMatrix4Translate(-pos[0], -pos[1], -pos[2]);
	const trans_inv = makeMatrix4Translate(pos[0], pos[1], pos[2]);
	return multiplyMatrices4(trans_inv, multiplyMatrices4([
		t * x * x + c,     t * y * x + z * s, t * z * x - y * s, 0,
		t * x * y - z * s, t * y * y + c,     t * z * y + x * s, 0,
		t * x * z + y * s, t * y * z - x * s, t * z * z + c, 0,
		0, 0, 0, 1], trans));
};
const makeMatrix4Scale = (scale = [1, 1, 1], origin = [0, 0, 0]) => [
	scale[0], 0, 0, 0,
	0, scale[1], 0, 0,
	0, 0, scale[2], 0,
	scale[0] * -origin[0] + origin[0],
	scale[1] * -origin[1] + origin[1],
	scale[2] * -origin[2] + origin[2],
	1,
];
const makeMatrix4UniformScale = (scale = 1, origin = [0, 0, 0]) => (
	makeMatrix4Scale([scale, scale, scale], origin)
);
const makeMatrix4ReflectZ = (vector, origin = [0, 0]) => {
	const m = makeMatrix2Reflect(vector, origin);
	return [m[0], m[1], 0, 0, m[2], m[3], 0, 0, 0, 0, 1, 0, m[4], m[5], 0, 1];
};
const makePerspectiveMatrix4 = (FOV, aspect, near, far) => {
	const f = Math.tan(Math.PI * 0.5 - 0.5 * FOV);
	const rangeInv = 1.0 / (near - far);
	return [
		f / aspect, 0, 0, 0,
		0, f, 0, 0,
		0, 0, (near + far) * rangeInv, -1,
		0, 0, near * far * rangeInv * 2, 0,
	];
};
const makeOrthographicMatrix4 = (top, right, bottom, left, near, far) => [
	2 / (right - left), 0, 0, 0,
	0, 2 / (top - bottom), 0, 0,
	0, 0, 2 / (near - far), 0,
	(left + right) / (left - right),
	(bottom + top) / (bottom - top),
	(near + far) / (near - far),
	1,
];
const makeLookAtMatrix4 = (position, target, up) => {
	const zAxis = normalize3(subtract3(position, target));
	const xAxis = normalize3(cross3(up, zAxis));
	const yAxis = normalize3(cross3(zAxis, xAxis));
	return [
		xAxis[0], xAxis[1], xAxis[2], 0,
		yAxis[0], yAxis[1], yAxis[2], 0,
		zAxis[0], zAxis[1], zAxis[2], 0,
		position[0], position[1], position[2], 1,
	];
};const matrix4=/*#__PURE__*/Object.freeze({__proto__:null,determinant4,identity4x4,invertMatrix4,isIdentity4x4,makeLookAtMatrix4,makeMatrix4ReflectZ,makeMatrix4Rotate,makeMatrix4RotateX,makeMatrix4RotateY,makeMatrix4RotateZ,makeMatrix4Scale,makeMatrix4Translate,makeMatrix4UniformScale,makeOrthographicMatrix4,makePerspectiveMatrix4,multiplyMatrices4,multiplyMatrix4Line3,multiplyMatrix4Vector3});const quaternionFromTwoVectors = (u, v) => {
	const w = cross3(u, v);
	const q = [w[0], w[1], w[2], dot(u, v)];
	q[3] += magnitude(q);
	return normalize(q);
};
const matrix4FromQuaternion = (quaternion) => multiplyMatrices4([
	quaternion[3], quaternion[2], -quaternion[1], quaternion[0],
	-quaternion[2], quaternion[3], quaternion[0], quaternion[1],
	quaternion[1], -quaternion[0], quaternion[3], quaternion[2],
	-quaternion[0], -quaternion[1], -quaternion[2], quaternion[3],
], [
	quaternion[3], quaternion[2], -quaternion[1], -quaternion[0],
	-quaternion[2], quaternion[3], quaternion[0], -quaternion[1],
	quaternion[1], -quaternion[0], quaternion[3], -quaternion[2],
	quaternion[0], quaternion[1], quaternion[2], quaternion[3],
]);const quaternion=/*#__PURE__*/Object.freeze({__proto__:null,matrix4FromQuaternion,quaternionFromTwoVectors});const algebra = {
	...vector,
	...matrix2,
	...matrix3,
	...matrix4,
	...quaternion,
};const mirrorArray = (arr) => arr.concat(arr.slice(0, -1).reverse());
const convexHull = (points = [], includeCollinear = false, epsilon = EPSILON) => {
	if (points.length < 2) { return []; }
	const order = radialSortPointIndices2(points, epsilon)
		.map(arr => (arr.length === 1 ? arr : mirrorArray(arr)))
		.flat();
	order.push(order[0]);
	const stack = [order[0]];
	let i = 1;
	const funcs = {
		"-1": () => stack.pop(),
		1: (next) => { stack.push(next); i += 1; },
		undefined: () => { i += 1; },
	};
	funcs[0] = includeCollinear ? funcs["1"] : funcs["-1"];
	while (i < order.length) {
		if (stack.length < 2) {
			stack.push(order[i]);
			i += 1;
			continue;
		}
		const prev = stack[stack.length - 2];
		const curr = stack[stack.length - 1];
		const next = order[i];
		const turn = threePointTurnDirection(...[prev, curr, next].map(j => points[j]), epsilon);
		funcs[turn](next);
	}
	stack.pop();
	return stack;
};const convexHull$1=/*#__PURE__*/Object.freeze({__proto__:null,convexHull});const recurseSkeleton = (points, lines, bisectors) => {
	const intersects = points
		.map((origin, i) => ({ vector: bisectors[i], origin }))
		.map((ray, i, arr) => intersectLineLine(
			ray,
			arr[(i + 1) % arr.length],
			excludeR,
			excludeR,
		));
	const projections = lines.map((line, i) => (
		nearestPointOnLine(line, intersects[i], a => a)
	));
	if (points.length === 3) {
		return points.map(p => ({ type: "skeleton", points: [p, intersects[0]] }))
			.concat([{ type: "perpendicular", points: [projections[0], intersects[0]] }]);
	}
	const projectionLengths = intersects
		.map((intersect, i) => distance(intersect, projections[i]));
	let shortest = 0;
	projectionLengths.forEach((len, i) => {
		if (len < projectionLengths[shortest]) { shortest = i; }
	});
	const solutions = [
		{
			type: "skeleton",
			points: [points[shortest], intersects[shortest]],
		},
		{
			type: "skeleton",
			points: [points[(shortest + 1) % points.length], intersects[shortest]],
		},
		{ type: "perpendicular", points: [projections[shortest], intersects[shortest]] },
	];
	const newVector = clockwiseBisect2(
		flip(lines[(shortest + lines.length - 1) % lines.length].vector),
		lines[(shortest + 1) % lines.length].vector,
	);
	const shortest_is_last_index = shortest === points.length - 1;
	points.splice(shortest, 2, intersects[shortest]);
	lines.splice(shortest, 1);
	bisectors.splice(shortest, 2, newVector);
	if (shortest_is_last_index) {
		points.splice(0, 1);
		bisectors.splice(0, 1);
		lines.push(lines.shift());
	}
	return solutions.concat(recurseSkeleton(points, lines, bisectors));
};
const straightSkeleton = (points) => {
	const lines = points
		.map((p, i, arr) => [p, arr[(i + 1) % arr.length]])
		.map(side => ({ vector: subtract(side[1], side[0]), origin: side[0] }));
	const bisectors = points
		.map((_, i, ar) => [(i - 1 + ar.length) % ar.length, i, (i + 1) % ar.length]
			.map(j => ar[j]))
		.map(p => [subtract(p[0], p[1]), subtract(p[2], p[1])])
		.map(v => clockwiseBisect2(...v));
	return recurseSkeleton([...points], lines, bisectors);
};const geometry = {
	...convexHull$1,
	...line,
	...nearest$1,
	...polygon$1,
	...radial,
	straightSkeleton,
};const enclosingBoundingBoxes = (outer, inner, epsilon = EPSILON) => {
	const dimensions = Math.min(outer.min.length, inner.min.length);
	for (let d = 0; d < dimensions; d += 1) {
		if (inner.min[d] < outer.min[d] - epsilon
			|| inner.max[d] > outer.max[d] + epsilon) {
			return false;
		}
	}
	return true;
};
const enclosingPolygonPolygon = (outer, inner, fnInclusive = include) => {
	const outerGoesInside = outer
		.map(p => overlapConvexPolygonPoint(inner, p, fnInclusive))
		.reduce((a, b) => a || b, false);
	const innerGoesOutside = inner
		.map(p => overlapConvexPolygonPoint(inner, p, fnInclusive))
		.reduce((a, b) => a && b, true);
	return (!outerGoesInside && innerGoesOutside);
};const encloses=/*#__PURE__*/Object.freeze({__proto__:null,enclosingBoundingBoxes,enclosingPolygonPolygon});const splitConvexPolygon = (poly, line) => {
	const vertices_intersections = poly.map((v, i) => {
		const intersection = overlapLinePoint(line, v, includeL);
		return { point: intersection ? v : null, at_index: i };
	}).filter(el => el.point != null);
	const edges_intersections = poly
		.map((v, i, arr) => ({
			vector: subtract(v, arr[(i + 1) % arr.length]),
			origin: arr[(i + 1) % arr.length],
		}))
		.map((polyLine, i) => ({
			point: intersectLineLine(line, polyLine, excludeL, excludeS),
			at_index: i,
		}))
		.filter(el => el.point != null);
	if (edges_intersections.length === 2) {
		const sorted_edges = edges_intersections.slice()
			.sort((a, b) => a.at_index - b.at_index);
		const face_a = poly
			.slice(sorted_edges[1].at_index + 1)
			.concat(poly.slice(0, sorted_edges[0].at_index + 1));
		face_a.push(sorted_edges[0].point);
		face_a.push(sorted_edges[1].point);
		const face_b = poly
			.slice(sorted_edges[0].at_index + 1, sorted_edges[1].at_index + 1);
		face_b.push(sorted_edges[1].point);
		face_b.push(sorted_edges[0].point);
		return [face_a, face_b];
	}
	if (edges_intersections.length === 1 && vertices_intersections.length === 1) {
		vertices_intersections[0].type = "v";
		edges_intersections[0].type = "e";
		const sorted_geom = vertices_intersections.concat(edges_intersections)
			.sort((a, b) => a.at_index - b.at_index);
		const face_a = poly.slice(sorted_geom[1].at_index + 1)
			.concat(poly.slice(0, sorted_geom[0].at_index + 1));
		if (sorted_geom[0].type === "e") { face_a.push(sorted_geom[0].point); }
		face_a.push(sorted_geom[1].point);
		const face_b = poly
			.slice(sorted_geom[0].at_index + 1, sorted_geom[1].at_index + 1);
		if (sorted_geom[1].type === "e") { face_b.push(sorted_geom[1].point); }
		face_b.push(sorted_geom[0].point);
		return [face_a, face_b];
	}
	if (vertices_intersections.length === 2) {
		const sorted_vertices = vertices_intersections.slice()
			.sort((a, b) => a.at_index - b.at_index);
		const face_a = poly
			.slice(sorted_vertices[1].at_index)
			.concat(poly.slice(0, sorted_vertices[0].at_index + 1));
		const face_b = poly
			.slice(sorted_vertices[0].at_index, sorted_vertices[1].at_index + 1);
		return [face_a, face_b];
	}
	return [poly.slice()];
};const split=/*#__PURE__*/Object.freeze({__proto__:null,splitConvexPolygon});const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);
const defaultDomain = {
	polygon: includeS,
	circle: include,
	line: includeL,
	ray: includeR,
	segment: includeS,
};
const intersect = (a, b, epsilon = EPSILON) => {
	const nameType = s => (s === "polygon" ? "ConvexPolygon" : capitalize(s));
	const types = [a, b].map(typeOf);
	const methods = [types, types.slice().reverse()]
		.map(pair => pair.map(nameType).join(""))
		.map(str => intersect$1[`intersect${str}`]);
	const doms = [a.domain, b.domain]
		.map((d, i) => d || defaultDomain[types[i]]);
	const parameters = [[a, b, ...doms], [b, a, ...doms.slice().reverse()]];
	const match = methods
		.map((fn, i) => ({ fn, params: parameters[i] }))
		.filter(el => el.fn)
		.shift();
	return match ? match.fn(...match.params, epsilon) : undefined;
};const intersectMethods = {
	...encloses,
	...overlap,
	...intersect$1,
	...clip$1,
	...split,
	intersect: intersect,
};const math = {
	...general,
	...algebra,
	...geometry,
	...intersectMethods,
};const get_unassigned_indices = (edges_assignment) => edges_assignment
	.map((_, i) => i)
	.filter(i => edges_assignment[i] === "U" || edges_assignment[i] === "u");
const maekawaAssignments = (vertices_edges_assignments) => {
	const unassigneds = get_unassigned_indices(vertices_edges_assignments);
	const permuts = Array.from(Array(2 ** unassigneds.length))
		.map((_, i) => i.toString(2))
		.map(l => Array(unassigneds.length - l.length + 1).join("0") + l)
		.map(str => Array.from(str).map(l => (l === "0" ? "V" : "M")));
	const all = permuts.map(perm => {
		const array = vertices_edges_assignments.slice();
		unassigneds.forEach((index, i) => { array[index] = perm[i]; });
		return array;
	});
	if (vertices_edges_assignments.includes("B")
		|| vertices_edges_assignments.includes("b")) {
		return all;
	}
	const count_m = all.map(a => a.filter(l => l === "M" || l === "m").length);
	const count_v = all.map(a => a.filter(l => l === "V" || l === "v").length);
	return all.filter((_, i) => Math.abs(count_m[i] - count_v[i]) === 2);
};const odd_assignment = (assignments) => {
	let ms = 0;
	let vs = 0;
	for (let i = 0; i < assignments.length; i += 1) {
		if (assignments[i] === "M" || assignments[i] === "m") { ms += 1; }
		if (assignments[i] === "V" || assignments[i] === "v") { vs += 1; }
	}
	for (let i = 0; i < assignments.length; i += 1) {
		if (ms > vs && (assignments[i] === "V" || assignments[i] === "v")) { return i; }
		if (vs > ms && (assignments[i] === "M" || assignments[i] === "m")) { return i; }
	}
	return undefined;
};
const foldAngles4 = (sectors, assignments, t = 0) => {
	const odd = odd_assignment(assignments);
	if (odd === undefined) { return; }
	const a = sectors[(odd + 1) % sectors.length];
	const b = sectors[(odd + 2) % sectors.length];
	const pbc = Math.PI * t;
	const cosE = -Math.cos(a) * Math.cos(b) + Math.sin(a) * Math.sin(b) * Math.cos(Math.PI - pbc);
	const res = Math.cos(Math.PI - pbc)
		- ((Math.sin(Math.PI - pbc) ** 2) * Math.sin(a) * Math.sin(b))
		/ (1 - cosE);
	const pab = -Math.acos(res) + Math.PI;
	return (odd % 2 === 0
		? [pab, pbc, pab, pbc].map((n, i) => (odd === i ? -n : n))
		: [pbc, pab, pbc, pab].map((n, i) => (odd === i ? -n : n)));
};const alternatingSum = (numbers) => [0, 1]
	.map(even_odd => numbers
		.filter((_, i) => i % 2 === even_odd)
		.reduce((a, b) => a + b, 0));
const alternatingSumDifference = (sectors) => {
	const halfsum = sectors.reduce((a, b) => a + b, 0) / 2;
	return alternatingSum(sectors).map(s => s - halfsum);
};
const kawasakiSolutionsRadians = (radians) => radians
	.map((v, i, arr) => [v, arr[(i + 1) % arr.length]])
	.map(pair => counterClockwiseAngleRadians(...pair))
	.map((_, i, arr) => arr.slice(i + 1, arr.length).concat(arr.slice(0, i)))
	.map(opposite_sectors => alternatingSum(opposite_sectors).map(s => Math.PI - s))
	.map((kawasakis, i) => radians[i] + kawasakis[0])
	.map((angle, i) => (isCounterClockwiseBetween(
		angle,
		radians[i],
		radians[(i + 1) % radians.length],
	)
		? angle
		: undefined));
const kawasakiSolutionsVectors = (vectors) => {
	const vectors_radians = vectors.map(v => Math.atan2(v[1], v[0]));
	return kawasakiSolutionsRadians(vectors_radians)
		.map(a => (a === undefined
			? undefined
			: [Math.cos(a), Math.sin(a)]));
};const kawasakiMath=/*#__PURE__*/Object.freeze({__proto__:null,alternatingSum,alternatingSumDifference,kawasakiSolutionsRadians,kawasakiSolutionsVectors});const kawasakiSolutions = ({ vertices_coords, vertices_edges, edges_vertices, edges_vectors }, vertex) => {
	if (!edges_vectors) {
		edges_vectors = makeEdgesVector({ vertices_coords, edges_vertices });
	}
	if (!vertices_edges) {
		vertices_edges = makeVerticesEdgesUnsorted({ edges_vertices });
	}
	const vectors = vertices_edges[vertex].map(i => edges_vectors[i]);
	const sortedVectors = counterClockwiseOrder2(vectors)
		.map(i => vectors[i]);
	return kawasakiSolutionsVectors(sortedVectors);
};const kawasakiGraph=/*#__PURE__*/Object.freeze({__proto__:null,kawasakiSolutions});const flat_assignment = {
	B: true, b: true, F: true, f: true, U: true, u: true,
};
const vertices_flat = ({ vertices_edges, edges_assignment }) => vertices_edges
	.map(edges => edges
		.map(e => flat_assignment[edges_assignment[e]])
		.reduce((a, b) => a && b, true))
	.map((valid, i) => (valid ? i : undefined))
	.filter(a => a !== undefined);
const folded_assignments = {
	M: true, m: true, V: true, v: true,
};
const maekawa_signs = {
	M: -1, m: -1, V: 1, v: 1,
};
const validateMaekawa = ({ edges_vertices, vertices_edges, edges_assignment }) => {
	if (!vertices_edges) {
		vertices_edges = makeVerticesEdgesUnsorted({ edges_vertices });
	}
	const is_valid = vertices_edges
		.map(edges => edges
			.map(e => maekawa_signs[edges_assignment[e]])
			.filter(a => a !== undefined)
			.reduce((a, b) => a + b, 0))
		.map(sum => sum === 2 || sum === -2);
	boundaryVertices({ edges_vertices, edges_assignment })
		.forEach(v => { is_valid[v] = true; });
	vertices_flat({ vertices_edges, edges_assignment })
		.forEach(v => { is_valid[v] = true; });
	return is_valid
		.map((valid, v) => (!valid ? v : undefined))
		.filter(a => a !== undefined);
};
const validateKawasaki = ({
	vertices_coords,
	vertices_vertices,
	vertices_edges,
	edges_vertices,
	edges_assignment,
	edges_vector,
}, epsilon = EPSILON) => {
	if (!vertices_vertices) {
		vertices_vertices = makeVerticesVertices({ vertices_coords, vertices_edges, edges_vertices });
	}
	const is_valid = makeVerticesVerticesVector({
		vertices_coords, vertices_vertices, edges_vertices, edges_vector,
	})
		.map((vectors, v) => vectors
			.filter((_, i) => folded_assignments[edges_assignment[vertices_edges[v][i]]]))
		.map(vectors => (vectors.length > 1
			? counterClockwiseSectors2(vectors)
			: [0, 0]))
		.map(sectors => alternatingSum(sectors))
		.map(pair => Math.abs(pair[0] - pair[1]) < epsilon);
	boundaryVertices({ edges_vertices, edges_assignment })
		.forEach(v => { is_valid[v] = true; });
	vertices_flat({ vertices_edges, edges_assignment })
		.forEach(v => { is_valid[v] = true; });
	return is_valid
		.map((valid, v) => (!valid ? v : undefined))
		.filter(a => a !== undefined);
};const validateSingleVertex=/*#__PURE__*/Object.freeze({__proto__:null,validateKawasaki,validateMaekawa});const singleVertex = Object.assign(
	Object.create(null),
	{
		maekawaAssignments,
		foldAngles4,
	},
	kawasakiMath,
	kawasakiGraph,
	validateSingleVertex,
);const compileShader = (gl, shaderSource, shaderType) => {
	const shader = gl.createShader(shaderType);
	gl.shaderSource(shader, shaderSource);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		throw new Error(gl.getShaderInfoLog(shader));
	}
	return shader;
};
const createProgramAndAttachShaders = (gl, vertexShader, fragmentShader) => {
	const program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		throw new Error(gl.getProgramInfoLog(program));
	}
	gl.deleteShader(vertexShader);
	gl.deleteShader(fragmentShader);
	return program;
};
const createProgram = (gl, vertexSource, fragmentSource) => {
	const vertexShader = compileShader(gl, vertexSource, gl.VERTEX_SHADER);
	const fragmentShader = compileShader(gl, fragmentSource, gl.FRAGMENT_SHADER);
	return createProgramAndAttachShaders(gl, vertexShader, fragmentShader);
};const initializeWebGL = (canvasElement, preferredVersion) => {
	const contextName = [null, "webgl", "webgl2"];
	const devicePixelRatio = window.devicePixelRatio || 1;
	canvasElement.width = canvasElement.clientWidth * devicePixelRatio;
	canvasElement.height = canvasElement.clientHeight * devicePixelRatio;
	if (preferredVersion) {
		return ({
			gl: canvasElement.getContext(contextName[preferredVersion]),
			version: preferredVersion,
		});
	}
	const gl2 = canvasElement.getContext(contextName[2]);
	if (gl2) { return { gl: gl2, version: 2 }; }
	const gl1 = canvasElement.getContext(contextName[1]);
	if (gl1) { return { gl: gl1, version: 1 }; }
	throw new Error(Messages$1.noWebGL);
};const rebuildViewport = (gl, canvas) => {
	if (!gl) { return; }
	const devicePixelRatio = window.devicePixelRatio || 1;
	const size = [canvas.clientWidth, canvas.clientHeight]
		.map(n => n * devicePixelRatio);
	if (canvas.width !== size[0] || canvas.height !== size[1]) {
		canvas.width = size[0];
		canvas.height = size[1];
	}
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
};
const makeProjectionMatrix = (canvas, perspective = "perspective", fov = 45) => {
	if (!canvas) { return identity4x4; }
	const Z_NEAR = 0.1;
	const Z_FAR = 20;
	const ORTHO_FAR = -100;
	const ORTHO_NEAR = 100;
	const bounds = [canvas.clientWidth, canvas.clientHeight];
	const vmin = Math.min(...bounds);
	const padding = [0, 1].map(i => ((bounds[i] - vmin) / vmin) / 2);
	const side = padding.map(p => p + 0.5);
	return perspective === "orthographic"
		? makeOrthographicMatrix4(side[1], side[0], -side[1], -side[0], ORTHO_FAR, ORTHO_NEAR)
		: makePerspectiveMatrix4(fov * (Math.PI / 180), bounds[0] / bounds[1], Z_NEAR, Z_FAR);
};
const makeModelMatrix = (graph) => {
	if (!graph) { return identity4x4; }
	const bounds = boundingBox(graph);
	if (!bounds) { return identity4x4; }
	const scale = Math.max(...bounds.span);
	const center = resize(3, midpoint(bounds.min, bounds.max));
	const scalePositionMatrix = [scale, 0, 0, 0, 0, scale, 0, 0, 0, 0, scale, 0, ...center, 1];
	return invertMatrix4(scalePositionMatrix);
};const view=/*#__PURE__*/Object.freeze({__proto__:null,makeModelMatrix,makeProjectionMatrix,rebuildViewport});const uniformFunc = (gl, i, func, value) => {
	switch (func) {
	case "uniformMatrix4fv": gl[func](i, false, value); break;
	default: gl[func](i, value); break;
	}
};
const drawProgram = (gl, version, bundle, uniforms = {}) => {
	gl.useProgram(bundle.program);
	bundle.flags.forEach(flag => gl.enable(flag));
	const uniformCount = gl.getProgramParameter(bundle.program, gl.ACTIVE_UNIFORMS);
	for (let i = 0; i < uniformCount; i += 1) {
		const uniformName = gl.getActiveUniform(bundle.program, i).name;
		const uniform = uniforms[uniformName];
		if (uniform) {
			const index = gl.getUniformLocation(bundle.program, uniformName);
			uniformFunc(gl, index, uniform.func, uniform.value);
		}
	}
	bundle.vertexArrays.forEach(el => {
		gl.bindBuffer(gl.ARRAY_BUFFER, el.buffer);
		gl.bufferData(gl.ARRAY_BUFFER, el.data, gl.STATIC_DRAW);
		gl.vertexAttribPointer(el.location, el.length, el.type, false, 0, 0);
		gl.enableVertexAttribArray(el.location);
	});
	bundle.elementArrays.forEach(el => {
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, el.buffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, el.data, gl.STATIC_DRAW);
		gl.drawElements(
			el.mode,
			el.data.length,
			version === 2 ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT,
			el.buffer,
		);
	});
	bundle.flags.forEach(flag => gl.disable(flag));
};
const deallocProgram = (gl, bundle) => {
	bundle.vertexArrays.forEach(vert => gl.disableVertexAttribArray(vert.location));
	bundle.vertexArrays.forEach(vert => gl.deleteBuffer(vert.buffer));
	bundle.elementArrays.forEach(elements => gl.deleteBuffer(elements.buffer));
	gl.deleteProgram(bundle.program);
};const program=/*#__PURE__*/Object.freeze({__proto__:null,deallocProgram,drawProgram});const ASSIGNMENT_COLOR = {
	B: [0.3, 0.3, 0.3],
	b: [0.3, 0.3, 0.3],
	V: [0.2, 0.4, 0.6],
	v: [0.2, 0.4, 0.6],
	M: [0.75, 0.25, 0.15],
	m: [0.75, 0.25, 0.15],
	F: [0.2, 0.2, 0.2],
	f: [0.2, 0.2, 0.2],
	C: [1.0, 0.75, 0.25],
	c: [1.0, 0.75, 0.25],
	U: [0.6, 0.25, 0.9],
	u: [0.6, 0.25, 0.9],
};const makeFacesVertexData = (graph, options = {}) => {
	const vertices_coords = graph.vertices_coords
		.map(coord => [...coord].concat(Array(3 - coord.length).fill(0)));
	const vertices_normal = makeVerticesNormal(graph);
	const vertices_barycentric = vertices_coords
		.map((_, i) => i % 3)
		.map(n => [n === 0 ? 1 : 0, n === 1 ? 1 : 0, n === 2 ? 1 : 0]);
	const facesEdgesIsJoined = graph.faces_edges
		.map(edges => edges
			.map(e => graph.edges_assignment[e])
			.map(a => a === "J" || a === "j"));
	if (!options.showTrianglulation) {
		for (let i = 0; i < facesEdgesIsJoined.length; i += 1) {
			if (facesEdgesIsJoined[i][0]) {
				vertices_barycentric[i * 3 + 0][2] = vertices_barycentric[i * 3 + 1][2] = 100;
			}
			if (facesEdgesIsJoined[i][1]) {
				vertices_barycentric[i * 3 + 1][0] = vertices_barycentric[i * 3 + 2][0] = 100;
			}
			if (facesEdgesIsJoined[i][2]) {
				vertices_barycentric[i * 3 + 0][1] = vertices_barycentric[i * 3 + 2][1] = 100;
			}
		}
	}
	return {
		vertices_coords,
		vertices_normal,
		vertices_barycentric,
	};
};
const makeThickEdgesVertexData = (graph, assignment_color = ASSIGNMENT_COLOR) => {
	if (!graph || !graph.vertices_coords || !graph.edges_vertices) { return []; }
	const vertices_coords3D = graph.vertices_coords
		.map(coord => [...coord].concat(Array(3 - coord.length).fill(0)));
	const vertices_coords = graph.edges_vertices
		.flatMap(edge => edge
			.map(v => vertices_coords3D[v]))
		.flatMap(coord => [coord, coord, coord, coord]);
	const edgesVector = makeEdgesVector(graph);
	const vertices_color = graph.edges_assignment
		? graph.edges_assignment
			.flatMap(a => Array(8).fill(assignment_color[a]))
		: graph.edges_vertices
			.flatMap(() => Array(8).fill(assignment_color.U));
	const verticesEdgesVector = edgesVector
		.flatMap(el => [el, el, el, el, el, el, el, el]);
	const vertices_vector = graph.edges_vertices
		.flatMap(() => [
			[1, 0],
			[0, 1],
			[-1, 0],
			[0, -1],
			[1, 0],
			[0, 1],
			[-1, 0],
			[0, -1],
		]);
	return {
		vertices_coords,
		vertices_color,
		verticesEdgesVector,
		vertices_vector,
	};
};const foldedData=/*#__PURE__*/Object.freeze({__proto__:null,makeFacesVertexData,makeThickEdgesVertexData});const makeFoldedVertexArrays = (gl, program, graph, options = {}) => {
	if (!graph || !graph.vertices_coords || !graph.faces_vertices) {
		return [];
	}
	const {
		vertices_coords,
		vertices_normal,
		vertices_barycentric,
	} = makeFacesVertexData(graph, options);
	return [{
		location: gl.getAttribLocation(program, "v_position"),
		buffer: gl.createBuffer(),
		type: gl.FLOAT,
		length: vertices_coords[0].length,
		data: new Float32Array(vertices_coords.flat()),
	}, {
		location: gl.getAttribLocation(program, "v_normal"),
		buffer: gl.createBuffer(),
		type: gl.FLOAT,
		length: vertices_normal[0].length,
		data: new Float32Array(vertices_normal.flat()),
	}, {
		location: gl.getAttribLocation(program, "v_barycentric"),
		buffer: gl.createBuffer(),
		type: gl.FLOAT,
		length: 3,
		data: new Float32Array(vertices_barycentric.flat()),
	},
	].filter(el => el.location !== -1);
};
const makeFoldedElementArrays = (gl, version = 1, graph = {}) => {
	if (!graph || !graph.vertices_coords || !graph.faces_vertices) { return []; }
	return [{
		mode: gl.TRIANGLES,
		buffer: gl.createBuffer(),
		data: version === 2
			? new Uint32Array(graph.faces_vertices.flat())
			: new Uint16Array(graph.faces_vertices.flat()),
	}];
};
const makeThickEdgesVertexArrays = (gl, program, graph, options = {}) => {
	if (!graph || !graph.vertices_coords || !graph.edges_vertices) {
		return [];
	}
	const {
		vertices_coords,
		vertices_color,
		verticesEdgesVector,
		vertices_vector,
	} = makeThickEdgesVertexData(graph, options.assignment_color);
	return [{
		location: gl.getAttribLocation(program, "v_position"),
		buffer: gl.createBuffer(),
		type: gl.FLOAT,
		length: vertices_coords[0].length,
		data: new Float32Array(vertices_coords.flat()),
	}, {
		location: gl.getAttribLocation(program, "v_color"),
		buffer: gl.createBuffer(),
		type: gl.FLOAT,
		length: vertices_color[0].length,
		data: new Float32Array(vertices_color.flat()),
	}, {
		location: gl.getAttribLocation(program, "edge_vector"),
		buffer: gl.createBuffer(),
		type: gl.FLOAT,
		length: verticesEdgesVector[0].length,
		data: new Float32Array(verticesEdgesVector.flat()),
	}, {
		location: gl.getAttribLocation(program, "vertex_vector"),
		buffer: gl.createBuffer(),
		type: gl.FLOAT,
		length: vertices_vector[0].length,
		data: new Float32Array(vertices_vector.flat()),
	}].filter(el => el.location !== -1);
};
const makeThickEdgesElementArrays = (gl, version = 1, graph = {}) => {
	if (!graph || !graph.edges_vertices) { return []; }
	const edgesTriangles = graph.edges_vertices
		.map((_, i) => i * 8)
		.flatMap(i => [
			i + 0, i + 1, i + 4,
			i + 4, i + 1, i + 5,
			i + 1, i + 2, i + 5,
			i + 5, i + 2, i + 6,
			i + 2, i + 3, i + 6,
			i + 6, i + 3, i + 7,
			i + 3, i + 0, i + 7,
			i + 7, i + 0, i + 4,
		]);
	return [{
		mode: gl.TRIANGLES,
		buffer: gl.createBuffer(),
		data: version === 2
			? new Uint32Array(edgesTriangles)
			: new Uint16Array(edgesTriangles),
	}];
};const foldedArrays=/*#__PURE__*/Object.freeze({__proto__:null,makeFoldedElementArrays,makeFoldedVertexArrays,makeThickEdgesElementArrays,makeThickEdgesVertexArrays});const topologicalOrder = ({ faceOrders, faces_normal }, faces) => {
	if (!faceOrders) { return []; }
	const facesHash = {};
	faces.forEach(face => { facesHash[face] = true; });
	faces[0];
	const faces_normal_match = [];
	faces.forEach(face => {
		faces_normal_match[face] = dot(faces_normal[face], faces_normal[faces[0]]) > 0;
	});
	const facesBelow = [];
	faces.forEach(face => { facesBelow[face] = []; });
	faceOrders.forEach(order => {
		if (!facesHash[order[0]]) { return; }
		const pair = (order[2] === -1) ^ (!faces_normal_match[order[1]])
			? [order[1], order[0]]
			: [order[0], order[1]];
		facesBelow[pair[0]].push(pair[1]);
	});
	const layers_face = [];
	const faces_visited = {};
	const recurse = (face) => {
		faces_visited[face] = true;
		facesBelow[face].forEach(f => {
			if (faces_visited[f]) { return; }
			recurse(f);
		});
		layers_face.push(face);
	};
	faces.forEach(face => {
		if (faces_visited[face]) { return; }
		recurse(face);
	});
	return layers_face;
};const nudgeFacesWithFacesLayer = ({ faces_layer }) => {
	const faces_nudge = [];
	const layers_face = invertMap(faces_layer);
	layers_face.forEach((face, layer) => {
		faces_nudge[face] = {
			vector: [0, 0, 1],
			layer,
		};
	});
	return faces_nudge;
};
const nudgeFacesWithFaceOrders = ({ vertices_coords, faces_vertices, faceOrders }) => {
	const faces_normal = makeFacesNormal({ vertices_coords, faces_vertices });
	const faces_sets = connectedComponents(makeVerticesVerticesUnsorted({
		edges_vertices: faceOrders.map(ord => [ord[0], ord[1]]),
	}));
	const sets_faces = invertMap(faces_sets)
		.map(el => (el.constructor === Array ? el : [el]));
	const sets_layers_face = sets_faces
		.map(faces => topologicalOrder({ faceOrders, faces_normal }, faces));
	const sets_normals = sets_faces.map(faces => faces_normal[faces[0]]);
	const faces_nudge = [];
	sets_layers_face.forEach((set, i) => set.forEach((face, index) => {
		faces_nudge[face] = {
			vector: sets_normals[i],
			layer: index,
		};
	}));
	return faces_nudge;
};const LAYER_NUDGE = 1e-5;
const makeExplodedGraph = (graph, layerNudge = LAYER_NUDGE) => {
	const exploded = JSON.parse(JSON.stringify(graph));
	if (!exploded.edges_assignment) {
		const edgeCount = count.edges(graph) || countImplied.edges(graph);
		exploded.edges_assignment = Array(edgeCount).fill("U");
	}
	let faces_nudge = [];
	if (exploded.faceOrders) {
		faces_nudge = nudgeFacesWithFaceOrders(exploded);
	} else if (exploded.faces_layer) {
		faces_nudge = nudgeFacesWithFacesLayer(exploded);
	}
	const change = triangulate(exploded);
	explode(exploded);
	if (change.faces) {
		const backmap = invertMap(change.faces.map);
		backmap.forEach((oldFace, face) => {
			const nudge = faces_nudge[oldFace];
			if (!nudge) { return; }
			exploded.faces_vertices[face].forEach(v => {
				const vec = scale(nudge.vector, nudge.layer * layerNudge);
				exploded.vertices_coords[v] = add(
					resize(3, exploded.vertices_coords[v]),
					vec,
				);
			});
		});
	}
	return exploded;
};const makeUniforms$1 = (gl, {
	projectionMatrix, viewMatrix, modelMatrix, canvas,
	opacity, touchPoint, frontColor, backColor, strokeWidth,
}) => ({
	u_matrix: {
		func: "uniformMatrix4fv",
		value: multiplyMatrices4(multiplyMatrices4(
			projectionMatrix,
			viewMatrix,
		), modelMatrix),
	},
	u_projection: {
		func: "uniformMatrix4fv",
		value: projectionMatrix,
	},
	u_modelView: {
		func: "uniformMatrix4fv",
		value: multiplyMatrices4(viewMatrix, modelMatrix),
	},
	u_opacity: {
		func: "uniform1f",
		value: opacity,
	},
	u_touch: {
		func: "uniform2fv",
		value: touchPoint,
	},
	u_resolution: {
		func: "uniform2fv",
		value: [canvas.clientWidth, canvas.clientHeight]
			.map(n => n * window.devicePixelRatio || 1),
	},
	u_frontColor: {
		func: "uniform3fv",
		value: hexToRGB(frontColor),
	},
	u_backColor: {
		func: "uniform3fv",
		value: hexToRGB(backColor),
	},
	u_strokeWidth: {
		func: "uniform1f",
		value: strokeWidth,
	},
});const model_300_vert = `#version 300 es
uniform mat4 u_modelView;
uniform mat4 u_matrix;
uniform vec3 u_frontColor;
uniform vec3 u_backColor;
in vec3 v_position;
in vec3 v_normal;
out vec3 front_color;
out vec3 back_color;
void main () {
	gl_Position = u_matrix * vec4(v_position, 1);
	vec3 light = abs(normalize((vec4(v_normal, 1) * u_modelView).xyz));
	float brightness = 0.5 + light.x * 0.15 + light.z * 0.35;
	front_color = u_frontColor * brightness;
	back_color = u_backColor * brightness;
}
`;
const thick_edges_300_vert$1 = `#version 300 es
uniform mat4 u_matrix;
uniform mat4 u_projection;
uniform mat4 u_modelView;
uniform float u_strokeWidth;
in vec3 v_position;
in vec3 v_color;
in vec3 edge_vector;
in vec2 vertex_vector;
out vec3 blend_color;
void main () {
	vec3 edge_norm = normalize(edge_vector);
	// axis most dissimilar to edge_vector
	vec3 absNorm = abs(edge_norm);
	vec3 xory = absNorm.x < absNorm.y ? vec3(1,0,0) : vec3(0,1,0);
	vec3 axis = absNorm.x > absNorm.z && absNorm.y > absNorm.z ? vec3(0,0,1) : xory;
	// two perpendiculars. with edge_vector these make basis vectors
	vec3 one = cross(axis, edge_norm);
	vec3 two = cross(one, edge_norm);
	vec3 displaceNormal = normalize(
		one * vertex_vector.x + two * vertex_vector.y
	);
	vec3 displace = displaceNormal * u_strokeWidth;
	gl_Position = u_matrix * vec4(v_position + displace, 1);
	blend_color = v_color;
}
`;
const outlined_model_300_frag = `#version 300 es
#ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
#else
  precision mediump float;
#endif
uniform float u_opacity;
in vec3 front_color;
in vec3 back_color;
in vec3 barycentric;
out vec4 outColor;
float edgeFactor(vec3 barycenter) {
	vec3 d = fwidth(barycenter);
	vec3 a3 = smoothstep(vec3(0.0), d*3.5, barycenter);
	return min(min(a3.x, a3.y), a3.z);
}
void main () {
	gl_FragDepth = gl_FragCoord.z;
	vec3 color = gl_FrontFacing ? front_color : back_color;
	outColor = vec4(mix(vec3(0.0), color, edgeFactor(barycentric)), u_opacity);
}
`;
const outlined_model_100_frag = `#version 100
precision mediump float;
uniform float u_opacity;
varying vec3 barycentric;
varying vec3 front_color;
varying vec3 back_color;
void main () {
	vec3 color = gl_FrontFacing ? front_color : back_color;
	vec3 boundary = vec3(0.0, 0.0, 0.0)
	// gl_FragDepth = 0.5;
	gl_FragColor = any(lessThan(barycentric, vec3(0.02)))
		? vec4(boundary, u_opacity)
		: vec4(color, u_opacity);
}
`;
const model_100_vert = `#version 100
attribute vec3 v_position;
attribute vec3 v_normal;
uniform mat4 u_projection;
uniform mat4 u_modelView;
uniform mat4 u_matrix;
uniform vec3 u_frontColor;
uniform vec3 u_backColor;
varying vec3 normal_color;
varying vec3 front_color;
varying vec3 back_color;
void main () {
	gl_Position = u_matrix * vec4(v_position, 1);
	vec3 light = abs(normalize((vec4(v_normal, 1) * u_modelView).xyz));
	float brightness = 0.5 + light.x * 0.15 + light.z * 0.35;
	front_color = u_frontColor * brightness;
	back_color = u_backColor * brightness;
}
`;
const thick_edges_100_vert$1 = `#version 100
attribute vec3 v_position;
attribute vec3 v_color;
attribute vec3 edge_vector;
attribute vec2 vertex_vector;
uniform mat4 u_matrix;
uniform mat4 u_projection;
uniform mat4 u_modelView;
uniform float u_strokeWidth;
varying vec3 blend_color;
void main () {
	vec3 edge_norm = normalize(edge_vector);
	// axis most dissimilar to edge_vector
	vec3 absNorm = abs(edge_norm);
	vec3 xory = absNorm.x < absNorm.y ? vec3(1,0,0) : vec3(0,1,0);
	vec3 axis = absNorm.x > absNorm.z && absNorm.y > absNorm.z ? vec3(0,0,1) : xory;
	// two perpendiculars. with edge_vector these make basis vectors
	vec3 one = cross(axis, edge_norm);
	vec3 two = cross(one, edge_norm);
	vec3 displaceNormal = normalize(
		one * vertex_vector.x + two * vertex_vector.y
	);
	vec3 displace = displaceNormal * u_strokeWidth;
	gl_Position = u_matrix * vec4(v_position + displace, 1);
	blend_color = v_color;
}
`;
const model_100_frag = `#version 100
precision mediump float;
uniform float u_opacity;
varying vec3 front_color;
varying vec3 back_color;
void main () {
	vec3 color = gl_FrontFacing ? front_color : back_color;
	gl_FragColor = vec4(color, u_opacity);
}
`;
const simple_300_frag = `#version 300 es
#ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
#else
  precision mediump float;
#endif
in vec3 blend_color;
out vec4 outColor;
 
void main() {
	outColor = vec4(blend_color.rgb, 1);
}
`;
const outlined_model_100_vert = `#version 100
attribute vec3 v_position;
attribute vec3 v_normal;
attribute vec3 v_barycentric;
uniform mat4 u_projection;
uniform mat4 u_modelView;
uniform mat4 u_matrix;
uniform vec3 u_frontColor;
uniform vec3 u_backColor;
varying vec3 normal_color;
varying vec3 barycentric;
varying vec3 front_color;
varying vec3 back_color;
void main () {
	gl_Position = u_matrix * vec4(v_position, 1);
	barycentric = v_barycentric;
	vec3 light = abs(normalize((vec4(v_normal, 1) * u_modelView).xyz));
	float brightness = 0.5 + light.x * 0.15 + light.z * 0.35;
	front_color = u_frontColor * brightness;
	back_color = u_backColor * brightness;
}
`;
const outlined_model_300_vert = `#version 300 es
uniform mat4 u_modelView;
uniform mat4 u_matrix;
uniform vec3 u_frontColor;
uniform vec3 u_backColor;
in vec3 v_position;
in vec3 v_normal;
in vec3 v_barycentric;
in float v_rawEdge;
out vec3 front_color;
out vec3 back_color;
out vec3 barycentric;
// flat out int rawEdge;
flat out int provokedVertex;
void main () {
	gl_Position = u_matrix * vec4(v_position, 1);
	provokedVertex = gl_VertexID;
	barycentric = v_barycentric;
	// rawEdge = int(v_rawEdge);
	vec3 light = abs(normalize((vec4(v_normal, 1) * u_modelView).xyz));
	float brightness = 0.5 + light.x * 0.15 + light.z * 0.35;
	front_color = u_frontColor * brightness;
	back_color = u_backColor * brightness;
}
`;
const model_300_frag = `#version 300 es
#ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
#else
  precision mediump float;
#endif
uniform float u_opacity;
in vec3 front_color;
in vec3 back_color;
out vec4 outColor;
void main () {
	gl_FragDepth = gl_FragCoord.z;
	vec3 color = gl_FrontFacing ? front_color : back_color;
	outColor = vec4(color, u_opacity);
}
`;
const simple_100_frag = `#version 100
precision mediump float;
varying vec3 blend_color;
void main () {
	gl_FragColor = vec4(blend_color.rgb, 1);
}
`;const foldedFormFaces = (gl, version = 1, graph = {}, options = {}) => {
	const exploded = makeExplodedGraph(graph, options.layerNudge);
	const program = version === 1
		? createProgram(gl, model_100_vert, model_100_frag)
		: createProgram(gl, model_300_vert, model_300_frag);
	return {
		program,
		vertexArrays: makeFoldedVertexArrays(gl, program, exploded, options),
		elementArrays: makeFoldedElementArrays(gl, version, exploded),
		flags: [gl.DEPTH_TEST],
		makeUniforms: makeUniforms$1,
	};
};
const foldedFormEdges = (gl, version = 1, graph = {}, options = {}) => {
	const program = version === 1
		? createProgram(gl, thick_edges_100_vert$1, simple_100_frag)
		: createProgram(gl, thick_edges_300_vert$1, simple_300_frag);
	return {
		program,
		vertexArrays: makeThickEdgesVertexArrays(gl, program, graph, options),
		elementArrays: makeThickEdgesElementArrays(gl, version, graph),
		flags: [gl.DEPTH_TEST],
		makeUniforms: makeUniforms$1,
	};
};
const foldedFormFacesOutlined = (gl, version = 1, graph = {}, options = {}) => {
	const exploded = makeExplodedGraph(graph, options.layerNudge);
	const program = version === 1
		? createProgram(gl, outlined_model_100_vert, outlined_model_100_frag)
		: createProgram(gl, outlined_model_300_vert, outlined_model_300_frag);
	return {
		program,
		vertexArrays: makeFoldedVertexArrays(gl, program, exploded, options),
		elementArrays: makeFoldedElementArrays(gl, version, exploded),
		flags: [gl.DEPTH_TEST],
		makeUniforms: makeUniforms$1,
	};
};const foldedPrograms=/*#__PURE__*/Object.freeze({__proto__:null,foldedFormEdges,foldedFormFaces,foldedFormFacesOutlined});const WebGLFoldedForm = (gl, version = 1, graph = {}, options = {}) => {
	const programs = [];
	if (options.faces !== false) {
		if (options.outlines === false) {
			programs.push(foldedFormFaces(gl, version, graph, options));
		} else {
			programs.push(foldedFormFacesOutlined(gl, version, graph, options));
		}
	}
	if (options.edges === true) {
		programs.push(foldedFormEdges(gl, version, graph, options));
	}
	return programs;
};const make2D$1 = (coords) => coords
	.map(coord => [0, 1]
		.map(i => coord[i] || 0));
const makeCPEdgesVertexData = (graph, assignment_color = ASSIGNMENT_COLOR) => {
	if (!graph || !graph.vertices_coords || !graph.edges_vertices) { return []; }
	const vertices_coords = make2D$1(graph.edges_vertices
		.flatMap(edge => edge
			.map(v => graph.vertices_coords[v]))
		.flatMap(coord => [coord, coord]));
	const edgesVector = make2D$1(makeEdgesVector(graph));
	const vertices_color = graph.edges_assignment
		? graph.edges_assignment.flatMap(a => [
			assignment_color[a],
			assignment_color[a],
			assignment_color[a],
			assignment_color[a],
		])
		: graph.edges_vertices.flatMap(() => [
			assignment_color.U,
			assignment_color.U,
			assignment_color.U,
			assignment_color.U,
		]);
	const verticesEdgesVector = edgesVector
		.flatMap(el => [el, el, el, el]);
	const vertices_vector = graph.edges_vertices
		.flatMap(() => [[1, 0], [-1, 0], [-1, 0], [1, 0]]);
	return {
		vertices_coords,
		vertices_color,
		verticesEdgesVector,
		vertices_vector,
	};
};const cpData=/*#__PURE__*/Object.freeze({__proto__:null,makeCPEdgesVertexData});const makeCPEdgesVertexArrays = (gl, program, graph) => {
	if (!graph || !graph.vertices_coords || !graph.edges_vertices) {
		return [];
	}
	const {
		vertices_coords,
		vertices_color,
		verticesEdgesVector,
		vertices_vector,
	} = makeCPEdgesVertexData(graph);
	return [{
		location: gl.getAttribLocation(program, "v_position"),
		buffer: gl.createBuffer(),
		type: gl.FLOAT,
		length: 2,
		data: new Float32Array(vertices_coords.flat()),
	}, {
		location: gl.getAttribLocation(program, "v_color"),
		buffer: gl.createBuffer(),
		type: gl.FLOAT,
		length: vertices_color[0].length,
		data: new Float32Array(vertices_color.flat()),
	}, {
		location: gl.getAttribLocation(program, "edge_vector"),
		buffer: gl.createBuffer(),
		type: gl.FLOAT,
		length: verticesEdgesVector[0].length,
		data: new Float32Array(verticesEdgesVector.flat()),
	}, {
		location: gl.getAttribLocation(program, "vertex_vector"),
		buffer: gl.createBuffer(),
		type: gl.FLOAT,
		length: vertices_vector[0].length,
		data: new Float32Array(vertices_vector.flat()),
	}].filter(el => el.location !== -1);
};
const makeCPEdgesElementArrays = (gl, version = 1, graph = {}) => {
	if (!graph || !graph.edges_vertices) { return []; }
	const edgesTriangles = graph.edges_vertices
		.map((_, i) => i * 4)
		.flatMap(i => [i + 0, i + 1, i + 2, i + 2, i + 3, i + 0]);
	return [{
		mode: gl.TRIANGLES,
		buffer: gl.createBuffer(),
		data: version === 2
			? new Uint32Array(edgesTriangles)
			: new Uint16Array(edgesTriangles),
	}];
};
const make2D = (coords) => coords
	.map(coord => [0, 1]
		.map(i => coord[i] || 0));
const makeCPFacesVertexArrays = (gl, program, graph) => {
	if (!graph || !graph.vertices_coords) { return []; }
	const vertices_color = graph.vertices_coords.map(() => [0.11, 0.11, 0.11]);
	return [{
		location: gl.getAttribLocation(program, "v_position"),
		buffer: gl.createBuffer(),
		type: gl.FLOAT,
		length: 2,
		data: new Float32Array(make2D(graph.vertices_coords).flat()),
	}, {
		location: gl.getAttribLocation(program, "v_color"),
		buffer: gl.createBuffer(),
		type: gl.FLOAT,
		length: vertices_color[0].length,
		data: new Float32Array(vertices_color.flat()),
	}].filter(el => el.location !== -1);
};
const makeCPFacesElementArrays = (gl, version = 1, graph = {}) => {
	if (!graph || !graph.vertices_coords || !graph.faces_vertices) { return []; }
	return [{
		mode: gl.TRIANGLES,
		buffer: gl.createBuffer(),
		data: version === 2
			? new Uint32Array(triangulateConvexFacesVertices(graph).flat())
			: new Uint16Array(triangulateConvexFacesVertices(graph).flat()),
	}];
};const cpArrays=/*#__PURE__*/Object.freeze({__proto__:null,makeCPEdgesElementArrays,makeCPEdgesVertexArrays,makeCPFacesElementArrays,makeCPFacesVertexArrays});const makeUniforms = (gl, {
	projectionMatrix, viewMatrix, modelMatrix, strokeWidth,
}) => ({
	u_matrix: {
		func: "uniformMatrix4fv",
		value: multiplyMatrices4(multiplyMatrices4(
			projectionMatrix,
			viewMatrix,
		), modelMatrix),
	},
	u_projection: {
		func: "uniformMatrix4fv",
		value: projectionMatrix,
	},
	u_modelView: {
		func: "uniformMatrix4fv",
		value: multiplyMatrices4(viewMatrix, modelMatrix),
	},
	u_strokeWidth: {
		func: "uniform1f",
		value: strokeWidth / 2,
	},
});const simple_2d_100_vert = `#version 100
uniform mat4 u_matrix;
attribute vec2 v_position;
attribute vec3 v_color;
varying vec3 blend_color;
void main () {
	gl_Position = u_matrix * vec4(v_position, 0, 1);
	blend_color = v_color;
}
`;
const thick_edges_300_vert = `#version 300 es
uniform mat4 u_matrix;
uniform float u_strokeWidth;
in vec2 v_position;
in vec3 v_color;
in vec2 edge_vector;
in vec2 vertex_vector;
out vec3 blend_color;
void main () {
	float sign = vertex_vector[0];
	vec2 side = normalize(vec2(edge_vector.y * sign, -edge_vector.x * sign)) * u_strokeWidth;
	gl_Position = u_matrix * vec4(side + v_position, 0, 1);
	blend_color = v_color;
}
`;
const simple_2d_300_vert = `#version 300 es
uniform mat4 u_matrix;
in vec2 v_position;
in vec3 v_color;
out vec3 blend_color;
void main () {
	gl_Position = u_matrix * vec4(v_position, 0, 1);
	blend_color = v_color;
}
`;
const thick_edges_100_vert = `#version 100
uniform mat4 u_matrix;
uniform float u_strokeWidth;
attribute vec2 v_position;
attribute vec3 v_color;
attribute vec2 edge_vector;
attribute vec2 vertex_vector;
varying vec3 blend_color;
void main () {
	float sign = vertex_vector[0];
	vec2 side = normalize(vec2(edge_vector.y * sign, -edge_vector.x * sign)) * u_strokeWidth;
	gl_Position = u_matrix * vec4(side + v_position, 0, 1);
	blend_color = v_color;
}
`;
const simple_2d_300_frag = `#version 300 es
#ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
#else
  precision mediump float;
#endif
in vec3 blend_color;
out vec4 outColor;
void main() {
	outColor = vec4(blend_color.rgb, 1);
}
`;
const simple_2d_100_frag = `#version 100
precision mediump float;
varying vec3 blend_color;
void main () {
	gl_FragColor = vec4(blend_color.rgb, 1);
}
`;const cpFacesV1 = (gl, version = 1, graph = {}) => {
	const program = createProgram(gl, simple_2d_100_vert, simple_2d_100_frag);
	return {
		program,
		vertexArrays: makeCPFacesVertexArrays(gl, program, graph),
		elementArrays: makeCPFacesElementArrays(gl, version, graph),
		flags: [],
		makeUniforms,
	};
};
const cpEdgesV1 = (gl, version = 1, graph = {}) => {
	const program = createProgram(gl, thick_edges_100_vert, simple_2d_100_frag);
	return {
		program,
		vertexArrays: makeCPEdgesVertexArrays(gl, program, graph),
		elementArrays: makeCPEdgesElementArrays(gl, version, graph),
		flags: [],
		makeUniforms,
	};
};
const cpFacesV2 = (gl, version = 2, graph = {}) => {
	const program = createProgram(gl, simple_2d_300_vert, simple_2d_300_frag);
	return {
		program,
		vertexArrays: makeCPFacesVertexArrays(gl, program, graph),
		elementArrays: makeCPFacesElementArrays(gl, version, graph),
		flags: [],
		makeUniforms,
	};
};
const cpEdgesV2 = (gl, version = 2, graph = {}) => {
	const program = createProgram(gl, thick_edges_300_vert, simple_2d_300_frag);
	return {
		program,
		vertexArrays: makeCPEdgesVertexArrays(gl, program, graph),
		elementArrays: makeCPEdgesElementArrays(gl, version, graph),
		flags: [],
		makeUniforms,
	};
};const cpPrograms=/*#__PURE__*/Object.freeze({__proto__:null,cpEdgesV1,cpEdgesV2,cpFacesV1,cpFacesV2});const WebGLCreasePattern = (gl, version = 1, graph = {}) => {
	switch (version) {
	case 1:
		return [cpFacesV1(gl, version, graph), cpEdgesV1(gl, version, graph)];
	case 2:
	default:
		return [cpFacesV2(gl, version, graph), cpEdgesV2(gl, version, graph)];
	}
};const webgl = Object.assign(
	Object.create(null),
	{
		createProgram,
		initialize: initializeWebGL,
		foldedForm: WebGLFoldedForm,
		creasePattern: WebGLCreasePattern,
	},
	view,
	program,
	foldedArrays,
	foldedData,
	foldedPrograms,
	cpArrays,
	cpData,
	cpPrograms,
);const ear = Object.assign(root, {
	axiom,
	convert,
	graph,
	math,
	singleVertex,
	svg: SVG,
	webgl,
});
lib.ear = ear;
Object.defineProperty(ear, "window", {
	enumerable: false,
	set: value => { SVG.window = setWindow(value); },
});export{ear as default};