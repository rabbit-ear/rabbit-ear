import count from "./count";
import remove from "../core/remove";

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

const not_empty = el => (el !== null && el !== undefined);

// initial:
// [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
// maps:
// [0, 1, 2, null, 3, 4, null, null, 5, 6]
// [0, null, 1, 2, 3, 4, null]
// result:
// [0, 2, 4, 5, 8]

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

export const merge_change_maps = (a, b) => {
  // "a" came first
  let aRemoves = [];
  for (let i = 1; i < a.length; i++) {
    if (a[i] !== a[i-1]) { aRemoves.push(i); }
  }
  let bRemoves = [];
  for (let i = 1; i < b.length; i++) {
    if (b[i] !== b[i-1]) { bRemoves.push(i); }
  }
  let bCopy = b.slice();
  aRemoves.forEach(i => bCopy.splice(i, 0, (i === 0) ? 0 : bCopy[i-1] ));

  return a.map((v,i) => v + bCopy[i]);
};
