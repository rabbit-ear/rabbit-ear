import {
	normalize2,
	dot2,
	scale2,
	add2,
	subtract2,
} from "./vector.js";
/**
 * @description Given a set of collinear segments which came from a line,
 * reduce the total number of segments by joining segments that share a
 * point, and leave gaps where no segments touch.
 * Note: this will modify the "segments" parameter in place (shuffle point order)
 * @todo make it so that it does not modify the segments parameter.
 * @param {number[][][]} segments an array of segments. Each segment is
 * a pair of points, each point is an array of numbers.
 * @param {VecLine} line the line that these segments were made from.
 * @returns {number[][][]} an array of segments, each an array of two points.
 */
export const joinCollinearSegments = (segments, { vector, origin }, epsilon) => {
	if (segments.length < 2) { return segments; }
	const segmentIsFlipped = segments
		.map(pts => subtract2(pts[1], pts[0]))
		.map(vec => dot2(vec, vector) < epsilon);
	segments
		.map((_, i) => i)
		.filter(i => segmentIsFlipped[i])
		.forEach(i => { segments[i] = [segments[i][1], segments[i][0]]; });
	const normalized = normalize2(vector);
	const segmentsScalars = segments
		.map(pts => pts.map(point => dot2(subtract2(point, origin), normalized)))
		.sort((a, b) => a[0] - b[0]);
	const joined = [
		[segmentsScalars[0][0], segmentsScalars[0][1]],
	];
	for (let i = 1; i < segmentsScalars.length; i += 1) {
		const curr = segmentsScalars[i];
		if ((curr[0] - epsilon) < (joined[joined.length - 1][1] + epsilon)) {
			// if neighboring segments overlap, increase the current segment length
			joined[joined.length - 1][1] = Math.max(curr[1], joined[joined.length - 1][1]);
		} else {
			// neighbors do not overlap. start a new segment
			joined.push([curr]);
		}
	}
	// convert scalars back into point form.
	return joined.map(seg => seg.map(s => add2(origin, scale2(normalized, s))));
};
