/* Math (c) Kraft, MIT License */
import { excludeR } from '../general/functions.js';
import { subtract, distance, flip } from '../algebra/vectors.js';
import { clockwiseBisect2 } from './radial.js';
import { nearestPointOnLine } from './nearest.js';
import { intersectLineLine } from '../intersect/intersect.js';

const recurseSkeleton = (points, lines, bisectors) => {
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
};

export { straightSkeleton as default };
