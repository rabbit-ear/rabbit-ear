/* Math (c) Kraft, MIT License */
/**
 * Math (c) Kraft
 */
/**
 * @description Count the number of places deep past the decimal point.
 * @param {number} num any number
 * @returns {number} an integer, the number of decimal digits.
 * @linkcode
 */
const countPlaces = function (num) {
	const m = (`${num}`).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
	if (!m) { return 0; }
	return Math.max(0, (m[1] ? m[1].length : 0) - (m[2] ? +m[2] : 0));
};
/**
 * @description clean floating point numbers, where 15.0000000000000002 becomes 15,
 * this method involves encoding and parsing so it is relatively expensive.
 * @param {number} num the floating point number to clean
 * @param {number} [places=15] the whole number of decimal places to
 * keep, beyond this point can be considered to be noise.
 * @returns {number} the cleaned floating point number
 */
const cleanNumber = function (num, places = 15) {
	if (typeof num !== "number") { return num; }
	const crop = parseFloat(num.toFixed(places));
	if (countPlaces(crop) === Math.min(places, countPlaces(num))) {
		return num;
	}
	return crop;
};

export { cleanNumber };
