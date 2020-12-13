/**
 * Rabbit Ear (c) Robby Kraft
 */
// initial:
// [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
// maps:
// [0, 1, 2, null, 3, 4, null, null, 5, 6];
// [0, null, 1, 2, 3, 4, null];
// result:
// [0, null, 1, null, 2, 3, null, null, 4, null];
export const merge_maps = (...maps) => {
  if (maps.length === 0) { return; }
  const solution = Array.from(Array(maps[0].length)).map((_, i) => i);
  maps.forEach(map => {
    let bi = 0;
    solution.forEach((n, i) => {
      solution[i] = (n === null || n === undefined) ? null : map[bi];
      bi += (n === null || n === undefined) ? 0 : 1;
    });
  });
  return solution;
};

export const merge_simple_nextmaps = (...maps) => {
  if (maps.length === 0) { return; }
	const solution = maps[0].map((_, i) => i);
	maps.forEach(map => solution.forEach((s, i) => { solution[i] = map[s]; }));
	return solution;
};

export const merge_nextmaps = (...maps) => {
  if (maps.length === 0) { return; }
	const solution = maps[0].map((_, i) => [i]);
	maps.forEach(map => {
		solution.forEach((s, i) => s.forEach((indx,j) => { solution[i][j] = map[indx]; }));
		solution.forEach((arr, i) => { solution[i] = arr.reduce((a,b) => a.concat(b), []); });
	});
	return solution;
};

export const merge_simple_backmaps = (...maps) => {
  if (maps.length === 0) { return; }
	let solution = maps[0].map((_, i) => i);
	maps.forEach((map, i) => {
		const next = map.map(n => solution[n]);
	  solution = next;
	});
  return solution;
};

export const merge_backmaps = (...maps) => {
  if (maps.length === 0) { return; }
  let solution = maps[0].reduce((a, b) => a.concat(b), []).map((_, i) => [i]);
  maps.forEach((map, i) => {
		let next = [];
	  map.forEach((el, j) => {
      if (typeof el === "number") { next[j] = solution[el]; }
			else { next[j] = el.map(n => solution[n]).reduce((a,b) => a.concat(b), []); }
		});
		solution = next;
	});
	return solution;
};

// initial:
// [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
// maps:
// [0, 1, 2, null, 3, 4, null, null, 5, 6]
// [0, null, 1, 2, 3, 4, null]
// result:
// [0, 2, 4, 5, 8]

const not_empty = el => (el !== null && el !== undefined);
/**
 * param maps in increasing chronological order. the newest (shortest) at the end.
 * 
 */
export const reverse_maps = (...maps) => {
  if (maps.length === 0) { return; }
  let solution = Array.from(Array(maps[0].length)).map((_, i) => i);
  maps.forEach(map => {
    solution = solution.filter((n, i) => not_empty(map[i]));
  });
  return solution;
};
