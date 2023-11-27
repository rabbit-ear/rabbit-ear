/**
 * Rabbit Ear (c) Kraft
 */
import { EPSILON } from "../../math/constant.js";
import {
	dot,
	scale,
	add,
	subtract,
} from "../../math/vector.js";
import { epsilonUniqueSortedNumbers } from "../../general/array.js";
import addPlanarSegment from "./addPlanarSegment.js";
import { getEdgesLineIntersection } from "../intersect/edges.js";

const addPlanarLine = (graph, { vector, origin }, epsilon = EPSILON) => {
	// console.log("addPlanarLine", vector, origin, epsilon);
	const points = getEdgesLineIntersection(graph, { vector, origin }, epsilon)
		.map(el => el.point)
		.filter(Boolean);
	// console.log("points", points);
	const dots = points
		.map(p => subtract(p, origin))
		.map(vec => dot(vec, vector));
	const uniqueParams = epsilonUniqueSortedNumbers(dots);
	const uniquePoints = uniqueParams
		.map(t => add(scale(vector, t), origin));
	const results = Array.from(Array(uniquePoints.length - 1))
		.map((_, i) => [uniquePoints[i], uniquePoints[i + 1]])
		.map(seg => addPlanarSegment(graph, seg[0], seg[1], epsilon));
	// console.log("uniqueParams", uniqueParams);
	// console.log("results", results);
	// addPlanarSegment(graph, point1, point2, epsilon);
	return results;
};

export default addPlanarLine;
