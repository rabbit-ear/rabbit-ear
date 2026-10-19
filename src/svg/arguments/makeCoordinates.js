/* SVG (c) Kraft */
import { str_number, str_object } from "../environment/strings.js";

/**
 * Rabbit Ear (c) Kraft
 */
/**
 * this will extract coordinates from a set of inputs
 * and present them as a stride-2 flat array. length % 2 === 0
 * a 1D array of numbers, alternating x y
 *
 * use flatten() everytime you call this!
 * it's necessary the entries sit at the top level of ...args
 * findCoordinates(...flatten(...args));
 */
const makeCoordinates = (...args) =>
	// the order of the arguments is preserved, numbers and points can be mixed
	args.flatMap((el) => {
		if (typeof el === str_number) {
			return [el];
		}
		if (typeof el !== str_object || el === null) {
			return [];
		}
		if (typeof el.x === str_number) {
			return [el.x, el.y];
		}
		if (typeof el[0] === str_number) {
			return [el[0], el[1]];
		}
		return [];
	});

export { makeCoordinates as default };
