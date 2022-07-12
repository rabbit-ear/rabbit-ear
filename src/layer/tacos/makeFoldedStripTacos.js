/**
 * Rabbit Ear (c) Kraft
 */

// todo, should epsilon be multiplied by 2?

/**
 * @description make an array of objects where each object represents one
 * fold line, and contains all the tacos and tortillas sharing the fold line.
 * @returns {object[]} array of taco objects. each taco object represents one
 * fold location shared by multiple tacos. each taco object contains keys:
 * "both", "left", "right" where the values are an array of pairs of faces,
 * the pairs of adjacent faces around the taco edge. "left": [ [2,3] [6,0] ]
 */
const makeFoldedStripTacos = (folded_faces, is_circular, epsilon) => {
	// center of each face, will be used to see if a taco faces left or right
	const faces_center = folded_faces
		.map((ends) => (ends ? (ends[0] + ends[1]) / 2 : undefined));
	const locations = [];
	// gather all fold locations that match, add them to the same group.
	// for every fold location, make one of these objects where the pairs are
	// the two adjacent faces on either side of the crease line.
	// {
	//   min: -0.1,
	//   max: 0.1,
	//   pairs: [ [2,3], [0,1] ],
	// };
	folded_faces.forEach((ends, i) => {
		if (!ends) { return; }
		// if the strip is not circular, skip the final round and don't wrap around
		if (!is_circular && i === folded_faces.length - 1) { return; }
		const fold_end = ends[1];
		const min = fold_end - (epsilon * 2);
		const max = fold_end + (epsilon * 2);
		const faces = [i, (i + 1) % folded_faces.length];
		// which side of the crease is the face on?
		// false = left (-), true = right (+)
		const sides = faces
			.map(f => faces_center[f])
			.map(center => center > fold_end);
		// place left tacos at index 1, right at 2, and neither (tortillas) at 0
		const taco_type = (!sides[0] && !sides[1]) * 1 + (sides[0] && sides[1]) * 2;
		// todo: this searches every time. could be improved with a sorted array.
		const match = locations
			.filter(el => el.min < fold_end && el.max > fold_end)
			.shift();
		const entry = { faces, taco_type };
		if (match) {
			match.pairs.push(entry);
		} else {
			locations.push({ min, max, pairs: [entry] });
		}
	});
	// ignore stacks which have only one taco. we know they pass the test.
	// technically we can also filter out after they have been separated
	// as we can ignore the case with 1 left and 1 right. it always passes too.
	// but these will get ignored in the next function anyway
	return locations
		.map(el => el.pairs)
		.filter(pairs => pairs.length > 1)
		.map(pairs => ({
			both: pairs.filter(el => el.taco_type === 0).map(el => el.faces),
			left: pairs.filter(el => el.taco_type === 1).map(el => el.faces),
			right: pairs.filter(el => el.taco_type === 2).map(el => el.faces),
		}));
};

export default makeFoldedStripTacos;
