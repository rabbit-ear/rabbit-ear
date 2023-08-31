/**
 * Math (c) Kraft
 */
import { EPSILON } from "../general/constant.js";
import * as Intersect from "./intersect.js";
import typeOf from "../general/typeOf.js";
import {
	include,
	includeL,
	includeR,
	includeS,
} from "../general/function.js";

const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);

const defaultDomain = {
	polygon: includeS,
	circle: include,
	line: includeL,
	ray: includeR,
	segment: includeS,
};

const intersect = (a, b, epsilon = EPSILON) => {
	// method names are: (a) capitalized, and
	// (b) "Polygon" appears as "ConvexPolygon"
	const nameType = s => (s === "polygon" ? "ConvexPolygon" : capitalize(s));
	// get the type of each parameter
	const types = [a, b].map(typeOf);
	// all methods names follow the format "intersect" + type1 + type2.
	// try both iterations because things like intersectCircleLine is a
	// valid method, but intersectLineCircle does not exist.
	const methods = [types, types.slice().reverse()]
		.map(pair => pair.map(nameType).join(""))
		.map(str => Intersect[`intersect${str}`]);
	// build the corresponding list of parameters
	const doms = [a.domain, b.domain]
		.map((d, i) => d || defaultDomain[types[i]]);
	const parameters = [[a, b, ...doms], [b, a, ...doms.slice().reverse()]];
	// run one of these two methods, if one exists.
	const match = methods
		.map((fn, i) => ({ fn, params: parameters[i] }))
		.filter(el => el.fn)
		.shift();
	return match ? match.fn(...match.params, epsilon) : undefined;
};

export default intersect;
