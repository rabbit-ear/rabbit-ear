/* Math (c) Kraft, MIT License */
const overlapBoundingBoxes = (box1, box2) => {
	const dimensions = Math.min(box1.min.length, box2.min.length);
	for (let d = 0; d < dimensions; d += 1) {
		if (box1.min[d] > box2.max[d] || box1.max[d] < box2.min[d]) {
			return false;
		}
	}
	return true;
};

export { overlapBoundingBoxes as default };
