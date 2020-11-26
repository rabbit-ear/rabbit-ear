const up_down_map = { V: 1, v: 1, M: -1, m: -1 };
/**
 * valley fold sets the paper above the previous sector, but a valley fold
 * AFTER a valley fold moves the paper below. up or down is based on i % 2 
 * @returns {number} unit directionality. +1 for up, -1 down
 */
const upOrDown = (ass, i) => i % 2 === 0 ? up_down_map[ass] : -up_down_map[ass];
/**
 * @returns {any[]} given two indices return the contents of the array between them
 */
const between = (arr, i, j) => (i < j) ? arr.slice(i + 1, j) : arr.slice(j + 1, i);

const get_sectors_layer = (sectors, assignments) => {
  // build a 
  let pointer = 0;
  // globally, the location that each fold takes place along the +X
  const fold_location = sectors
    .map((sec, i) => i % 2 === 0 ? sec : -sec) // sectors as relative motions
    .map(move => pointer += move);
  const sector_mins = fold_location
    .map((sec, i, arr) => i % 2 === 0 ? arr[(i + arr.length - 1) % arr.length] : sec);
  const sector_maxs = fold_location
    .map((sec, i, arr) => i % 2 === 0 ? sec : arr[(i + arr.length - 1) % arr.length]);

  const test = (layering) => {
    const index_index = [];
    layering.forEach((layer, i) => { index_index[layer] = i; });
    for (let i = 0; i < layering.length - 1; i += 1) {
      const j = i + 1;
      // add epsilon comparison, <= x + epsilon ...
      const res = between(layering, index_index[i], index_index[j])
        .map(index => fold_location[i] <= sector_mins[index]
          || fold_location[i] >= sector_maxs[index])
        .reduce((a, b) => a && b, true);
      if (!res) { return false; }
    }
    return true;
  };

  // sectors and assignments are fenceposted.
  // sectors[i] is bounded by assignment[i] assignment[i + 1]
  const recurse = (stack = [], iter = 0, currentLayer = 0) => {
    stack = stack.slice(0, currentLayer).concat(
      [iter],
      stack.slice(currentLayer, stack.length));
    // check for a violation
    if (!test(stack)) { return []; }
    // return if done
    if (iter >= sectors.length - 1) { return [stack]; }
    const next_dir = upOrDown(assignments[(iter + 1) % sectors.length], iter);
    const spliceIndices = next_dir === 1
      ? Array.from(Array(stack.length - currentLayer)).map((_, i) => currentLayer + i + 1)
      : Array.from(Array(currentLayer + 1)).map((_, i) => i);
    // if done
    return spliceIndices
      .map(i => recurse(stack, iter + 1, i))
      .reduce((a, b) => a.concat(b), []);
  };

  return recurse();
};

export default get_sectors_layer;
