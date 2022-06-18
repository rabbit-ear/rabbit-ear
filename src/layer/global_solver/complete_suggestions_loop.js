/**
 * Rabbit Ear (c) Kraft
 */
import table from "./table";
// "taco_taco", "taco_tortilla", "tortilla_tortilla", "transitivity"
const taco_types = Object.freeze(Object.keys(table));
/**
 * @description a layer orientation between two faces is encoded as:
 * 0: unknown, 1: face A is above B, 2: face B is above A.
 * this map will flip 1 and 2, leaving 0 to be 0.
 */
const flip_conditions = { 0:0, 1:2, 2:1 };

const fill_layers_from_conditions = (layers, maps, conditions, fill_indices) => {
	// todo, get the CHANGED conditions. changed from last time we updated things.
	// then, this return array "changed" will actually be relevant.
	// this is an object, so we can set the key and prevent duplicates.
	const changed = {};
	const iterators = fill_indices
		? fill_indices
		: Object.keys(layers);
	// layers.forEach((layer, i) => maps[i].face_keys
	iterators.forEach(i => maps[i].face_keys
		.forEach((key, j) => {
			// todo: possible this error will never show if we can guarantee that
			// tacos/tortillas have been properly built
			if (!(key in conditions)) {
				console.warn(key, "not in conditions");
				return;
			}
			// if conditions[key] is 1 or 2, not 0, apply the suggestion.
			if (conditions[key] !== 0) {
				// orient the suggestion based on if the face pair was flipped or not.
				const orientation = maps[i].keys_ordered[j]
					? conditions[key]
					: flip_conditions[conditions[key]];
				// now it's possible that this face pair has already been set (not 0).
				// if so, double check that the previously set value is the same as
				// the new one, otherwise the conflict means that this layer
				// arrangement is unsolvable and needs to report the fail all the way
				// back up to the original recursive call.
				if (layers[i][j] !== 0 && layers[i][j] !== orientation) {
					throw "fill conflict";
				}
				layers[i][j] = orientation;
				changed[i] = true;
			}
		}));
	return changed;
};
const infer_next_steps = (layers, maps, lookup_table, changed_indices) => {
	const iterators = changed_indices
		? changed_indices
		: Object.keys(layers);
	return iterators.map(i => {
		const map = maps[i];
		const key = layers[i].join("");
		const next_step = lookup_table[key];
		if (next_step === false) { throw "unsolvable"; }
		if (next_step === true) { return; }
		if (layers[i][next_step[0]] !== 0 && layers[i][next_step[0]] !== next_step[1]) {
			throw "infer conflict";
		}
		layers[i][next_step[0]] = next_step[1];
		// if (layers[i].indexOf(0) === -1) { delete layers[i]; }
		// format this next_step change into face-pair-key and above/below value
		// so that it can be added to the conditions object.
		const condition_key = map.face_keys[next_step[0]];
		const condition_value = map.keys_ordered[next_step[0]]
			? next_step[1]
			: flip_conditions[next_step[1]];
		// console.log("conditions value", map.keys_ordered[next_step[0]], map.face_keys[next_step[0]]);
		// if (avoid[condition_key] === condition_value) { throw "avoid"; }
		// if (map.face_keys[0] === "3 6") {
		//   console.log("layer, map, next_step", layer, map, next_step);
		//   console.log("condition key value", condition_key, condition_value);
		// }
		return [condition_key, condition_value];
	}).filter(a => a !== undefined);
};

/**
 * @description complete_suggestions_loop
 */
const complete_suggestions_loop = (layers, maps, conditions, pair_layer_map) => {
	// given the current set of conditions, complete them as much as possible
	// only adding the determined results certain from the current state.
	// let time_one = 0;
	// let time_two = 0;
	let next_steps;
	let next_steps_indices = {};
	do {
		try {
			// inner_inner_loop_count++;
			// for each: taco_taco, taco_tortilla, tortilla_tortilla, transitivity
			// const start_one = new Date();
			const fill_changed = {};
			taco_types.forEach(taco_type => { fill_changed[taco_type] = {}; });
			for (let t = 0; t < taco_types.length; t++) {
				const type = taco_types[t];
				fill_changed[type] = fill_layers_from_conditions(layers[type], maps[type], conditions, next_steps_indices[type]);
			}
			taco_types.forEach(type => {
				fill_changed[type] = Object.keys(fill_changed[type]);
			});
			// console.log("fill_changed", fill_changed);
			// time_one += (Date.now() - start_one);
			// const start_two = new Date();
			next_steps = taco_types
				.flatMap(type => infer_next_steps(layers[type], maps[type], table[type], fill_changed[type]));
			next_steps.forEach(el => { conditions[el[0]] = el[1]; });
			// reset next_step_indices
			taco_types.forEach(type => { next_steps_indices[type] = {}; });
			// each next step is [condition_key, condition_value]. get the key.
			taco_types.forEach(taco_type => next_steps
				.forEach(el => pair_layer_map[taco_type][el[0]]
					.forEach(i => {
						next_steps_indices[taco_type][i] = true;
					})));
			taco_types.forEach(type => {
				next_steps_indices[type] = Object.keys(next_steps_indices[type]);
			});
			// console.log("next steps changed", next_steps_indices);
			// time_two += (Date.now() - start_two);
		} catch (error) { return false; } // no solution on this branch
	} while (next_steps.length > 0);
	// console.log("complete", time_one, time_two);
	return true;
};

export default complete_suggestions_loop;
