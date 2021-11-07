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
const up_down_map = { V: 1, v: 1, M: -1, m: -1 };
const upOrDown = (mv, i) => i % 2 === 0 ? up_down_map[mv] : -up_down_map[mv];

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
export const assignments_to_faces_vertical = (assignments) => {
  let iterator = 0;
  // because fencepost, we are relating assignments[1] to face[0]
  return assignments
    .slice(1)
    .concat([assignments[0]])
    .map(a => {
      const updown = upOrDown(a, iterator);
      iterator += up_down_map[a] === undefined ? 0 : 1;
      return updown;
    });
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
export const fold_sectors_with_assignments = (sectors, assignments) => {
  // one number for each sector, locally, the movement away from 0.
  const sector_end = assignments_to_faces_flip(assignments)
    .map((flip, i) => sectors[i] * (flip ? -1 : 1));
  // the cumulative position for each sector, stored as an array of 2:
  // [ the start of the sector, the end of the sector ]
  const cumulative = [
    [0, sector_end[0]]
  ];
  for (let i = 1; i < sectors.length; i++) {
    if (assignments[i] === "B" || assignments[i] === "b") { break; }
    const prev = (i - 1);
    const prev_end = cumulative[prev][1];
    cumulative[i] = [prev_end, prev_end + sector_end[i]];
  }
  // if we encountered no boundary creases, we are done
  if (cumulative.length === sectors.length) { return cumulative; }
  // boundaries exist. walk the other direction to fill in the other side.
  // now, instead of cumulatively adding to the previous' "end", we add
  // to the previous' "start", because, going in reverse.
  //
  // additionally, the sign of each sector (+/- sector) is totally messed
  // up, because the "boundary" crease threw it off. we have to re-calculate
  // this by reversing the assignments array and re-computing change in sign.
  //
  // treat all arrays as circular, reverse data, but keep index 0 the same.
  const flip_sectors = [sectors[0]].concat(sectors.slice(1).reverse());
  // const flip_assignments = [assignments[0]].concat(assignments.slice(1).reverse());
  const flip_assignments = assignments.slice(0, 2).reverse().concat(assignments.slice(2).reverse());
  // the sign of this is flipped now. so, still just + add it when using it.
  const flip_sector_end = assignments_to_faces_flip(flip_assignments)
    .map((flip, i) => flip_sectors[i] * (flip ? 1 : -1));
  // console.log("second half", flip_sectors, flip_assignments, flip_sector_end);
  // i relates to position in original arrays. flip_i relates to all flip_ arrays
  for (let flip_i = 1; flip_i < sectors.length; flip_i++) {
    const i = (sectors.length - flip_i) % sectors.length;
    const a = (sectors.length - (flip_i - 1)) % sectors.length;
    if (assignments[a] === "B" || assignments[a] === "b") { break; }
    const prev = (i + 1) % sectors.length;
    const prev_start = cumulative[prev][0]; // prev start, not end. 0 not 1
    cumulative[i] = [prev_start + flip_sector_end[flip_i], prev_start];
  }
  return cumulative;
};
