/**
 * Rabbit Ear (c) Kraft
 */
import * as S from "../general/strings";

export const mergeSimpleNextmaps = (...maps) => {
	if (maps.length === 0) { return; }
	const solution = maps[0].map((_, i) => i);
	maps.forEach(map => solution.forEach((s, i) => { solution[i] = map[s]; }));
	return solution;
};

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

export const mergeSimpleBackmaps = (...maps) => {
	if (maps.length === 0) { return; }
	let solution = maps[0].map((_, i) => i);
	maps.forEach((map, i) => {
		const next = map.map(n => solution[n]);
		solution = next;
	});
	return solution;
};

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

export const invertSimpleMap = (map) => {
	const inv = [];
	map.forEach((n, i) => { inv[n] = i; });
	return inv;
};
