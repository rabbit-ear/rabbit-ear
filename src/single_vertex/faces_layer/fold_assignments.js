/**
 * faces (sectors) and assignments are fencepost aligned so that assignments
 * precedes faces faces[0] is between assignments[0] and assignments[1].
 *
 *       faces: |-----(0)-----(1)-----(2)---- ... -(n-2)-------(n-1)-|----- ..
 * assignments: |-(0)-----(1)-----(2)-----(3) ... -------(n-1)-------|-(0)- ..
 */
/**
 * these are the only creases that change the direction of the paper
 */
const change_map = { V: true, v: true, M: true, m: true };
const assignments_change_direction = assignments => assignments
  .map(a => change_map[a] || false);
/**
 * these are the only creases that change the direction of the paper
 */
// const up_down_map = { V: 1, v: 1, M: -1, m: -1 };
// const upOrDown = (mv, i) => i % 2 === 0 ? up_down_map[mv] : -up_down_map[mv];


const up_down_map = { V: 1, v: 1, M: -1, m: -1 };
const upOrDown = (mv, i) => i % 2 === 0
  ? (up_down_map[mv] || 0)
  : -(up_down_map[mv] || 0);

// the first place face is hard-coded to flat.
/**
 * @description convert a list of assignments into an array of
 * booleans stating if that face between the pair of assignments
 * has been flipped (true) or not (false). the first face is false.
 * 
 * another way of saying this is if a face is "false", the face is
 * moving to the right, if "true" moving to the left.
 */
export const assignments_to_faces_flip = (assignments) => {
  let counter = 0;
  // because fencepost, and we are hard-coding the first face to be false,
  // we don't need to append the first post back to the end of this slice.
  const shifted_assignments = assignments.slice(1);
  // globally, the location that each fold takes place along the +X
  return [false].concat(shifted_assignments
    .map(a => change_map[a] ? ++counter : counter)
    .map(count => count % 2 === 1));
};
/**
 * valley fold sets the paper above the previous sector, but a valley fold
 * AFTER a valley fold moves the paper below. up or down is based on i % 2 
 *
 * @description convert a list of assignments into an array of
 * numbers stating if that face between the pair of assignments
 * has been raised above or below the previous face in the +Z axis.
 * 
 * +1 means this face lies above the previous face, -1 below.
 * the first face starts at 0.
 * @returns {number[]} unit directionality. +1 for up, -1 down
 */
// export const assignments_to_faces_vertical = (assignments, start_face = 0) => {
//   let iterator = 0;
//   // because fencepost, we are relating assignments[1] to face[0]
//   return assignments
//     .slice(1)
//     .concat([assignments[0]])
//     .map(a => {
//       const updown = upOrDown(a, iterator);
//       iterator += up_down_map[a] === undefined ? 0 : 1;
//       return updown;
//     });
// };
export const assignments_to_faces_vertical = (assignments, start_face = 0) => {
  let iterator = 0;
  const result = [];
  for (let ii = 0; ii < assignments.length; ii++) {
    // + 1 to align fencepost face=0 with assignment=1. they are off by one
    const i = (ii + start_face + 1) % assignments.length;
    result[i] = upOrDown(assignments[i], iterator);
    iterator += up_down_map[assignments[i]] === undefined ? 0 : 1;
  }
  return result;
};
/**
 * @description Given an array of sectors (defined by length),
 * and a fenceposted-array of fold assignments, fold the sectors
 * along the numberline, returning each sector as a pair of numbers,
 * [start, end], the location of the beginning and end of the folded sector.
 * The first sector is always starts at 0, and spans [0, sector].
 * 
 * When a boundary edge is encountered, the walk stops, no sectors after
 * the boundary will be included in the result. The algorithm will walk in
 * both directions, starting at index 0.
 * 
 * @returns array of sector positions. any sectors caught between
 * multiple boundaries will be undefined.
 */
export const fold_sectors_with_assignments = (sectors, assignments, start, end) => {
  // one number for each sector, locally, the movement away from 0.
  const sector_end = assignments_to_faces_flip(assignments)
    .map((flip, i) => sectors[i] * (flip ? -1 : 1));
  // the cumulative position for each sector, stored as an array of 2:
  // [ the start of the sector, the end of the sector ]
  const cumulative = sectors.map(() => undefined);
  cumulative[start] = [0, sector_end[start]];
  for (let ii = 1; ii < sectors.length; ii++) {
    const i = (start + ii) % sectors.length;
    if (assignments[i] === "B" || assignments[i] === "b") { break; }
    const prev = (i - 1 + sectors.length) % sectors.length;
    const prev_end = cumulative[prev][1];
    cumulative[i] = [prev_end, prev_end + sector_end[i]];
  }
  return cumulative;
};
