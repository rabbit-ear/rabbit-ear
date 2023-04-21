/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description given a full set of transitivity conditions (trios of faces which
 * overlap each other), and the set of pre-computed taco-taco and
 * taco-tortilla events, remove any transitivity condition where the three
 * faces are already covered in a taco-taco case.
 * @linkcode Origami ./src/layer/solver3d/filterTransitivity.js 9
 */
export const filterTransitivity = (transitivity_trios, { taco_taco, taco_tortilla }) => {
	// will contain taco-taco and taco-tortilla events encoded as all
	// permutations of 3 faces involved in each event.
	const tacos_trios = {};
	// using the list of all taco-taco conditions, store all permutations of
	// the three faces (sorted low to high) into a dictionary for quick lookup.
	// store them as space-separated strings.
	taco_taco
		.map(tacos => [tacos[0][0], tacos[0][1], tacos[1][0], tacos[1][1]]
			.sort((a, b) => a - b))
		.forEach(taco => [
			`${taco[0]} ${taco[1]} ${taco[2]}`,
			`${taco[0]} ${taco[1]} ${taco[3]}`,
			`${taco[0]} ${taco[2]} ${taco[3]}`,
			`${taco[1]} ${taco[2]} ${taco[3]}`,
		].forEach(key => { tacos_trios[key] = true; }));
	// convert all taco-tortilla cases into similarly-formatted,
	// space-separated strings.
	taco_tortilla
		.map(el => [el.taco[0], el.taco[1], el.tortilla]
			.sort((a, b) => a - b).join(" "))
		.forEach(key => { tacos_trios[key] = true; });
	// return the filtered set of trios.
	return transitivity_trios
		.filter(trio => tacos_trios[trio.join(" ")] === undefined);
};
