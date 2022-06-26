/**
 * Rabbit Ear (c) Kraft
 */
import * as S from "../general/strings";
/**
 * @description Provide two or more simple nextmaps in the order they were made
 * and this will merge them into one nextmap which reflects all changes to the graph.
 * @param {...number[]} ...maps a sequence of simple nextmaps
 * @returns {number[]} one nextmap reflecting the sum of changes
 * @linkcode Origami ./src/graph/maps.js 10
 */
export const mergeSimpleNextmaps = (...maps) => {
	if (maps.length === 0) { return; }
	const solution = maps[0].map((_, i) => i);
	maps.forEach(map => solution.forEach((s, i) => { solution[i] = map[s]; }));
	return solution;
};
/**
 * @description Provide two or more nextmaps in the order they were made
 * and this will merge them into one nextmap which reflects all changes to the graph.
 * @param {...number[][]} ...maps a sequence of nextmaps
 * @returns {number[][]} one nextmap reflecting the sum of changes
 * @linkcode Origami ./src/graph/maps.js 23
 */
export const mergeNextmaps = (...maps) => {
	if (maps.length === 0) { return; }
	const solution = maps[0].map((_, i) => [i]);
	maps.forEach(map => {
		solution.forEach((s, i) => s.forEach((indx,j) => { solution[i][j] = map[indx]; }));
		solution.forEach((arr, i) => {
			solution[i] = arr
				.reduce((a,b) => a.concat(b), [])
				.filter(a => a !== undefined);
		});
	});
	return solution;
};
/**
 * @description Provide two or more simple backmaps in the order they were made
 * and this will merge them into one backmap which reflects all changes to the graph.
 * @param {...number[]} ...maps a sequence of simplebackmaps
 * @returns {number[]} one backmap reflecting the sum of changes
 * @linkcode Origami ./src/graph/maps.js 43
 */
export const mergeSimpleBackmaps = (...maps) => {
	if (maps.length === 0) { return; }
	let solution = maps[0].map((_, i) => i);
	maps.forEach((map, i) => {
		const next = map.map(n => solution[n]);
		solution = next;
	});
	return solution;
};
/**
 * @description Provide two or more  backmaps in the order they were made
 * and this will merge them into one backmap which reflects all changes to the graph.
 * @param {...number[][]} ...maps a sequence of backmaps
 * @returns {number[][]} one backmap reflecting the sum of changes
 * @linkcode Origami ./src/graph/maps.js 59
 */
export const mergeBackmaps = (...maps) => {
	if (maps.length === 0) { return; }
	let solution = maps[0].reduce((a, b) => a.concat(b), []).map((_, i) => [i]);
	maps.forEach((map, i) => {
		let next = [];
		map.forEach((el, j) => {
			if (typeof el === S._number) { next[j] = solution[el]; }
			else { next[j] = el.map(n => solution[n]).reduce((a,b) => a.concat(b), []); }
		});
		solution = next;
	});
	return solution;
};
/**
 * @description invert an array of integers so that indices become values and values become indices. in the case of multiple values trying to insert into the same index, a child array is made to house both (or more) numbers.
 * @param {number[]|number[][]} map an array of integers
 * @returns {number[]|number[][]} the inverted map
 * @linkcode Origami ./src/graph/maps.js 78
 */
export const invertMap = (map) => {
	const inv = [];
	map.forEach((n, i) => {
		if (n == null) { return; }
		if (typeof n === S._number) { 
			// before we set the inverted map [i] spot, check if something is already there
			if (inv[n] !== undefined) {
				// if that thing is a number, turn it into an array
				if (typeof inv[n] === S._number) { inv[n] = [inv[n], i]; }
				// already an array, add to it
				else { inv[n].push(i); }
			}
			else { inv[n] = i; }
		}
		if (n.constructor === Array) { n.forEach(m => { inv[m] = i; }); }	
	});
	return inv;
};
/**
 * @description invert an array of integers so that indices become values and values become indices. duplicate entries will be overwritten.
 * @param {number[]} map an array of integers
 * @returns {number[]} the inverted map
 * @linkcode Origami ./src/graph/maps.js 102
 */
export const invertSimpleMap = (map) => {
	const inv = [];
	map.forEach((n, i) => { inv[n] = i; });
	return inv;
};
