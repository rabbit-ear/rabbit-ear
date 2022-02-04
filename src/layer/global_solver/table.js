/**
 * @description algorithm designed by Jason Ku.
 * Every taco/tortilla event encodes the relationship between 3 or 4 faces,
 * and given a known subset of orders between faces involved, we can either:
 * (a) confirm that this layer order is valid (even if not yet finished)
 * (b) confirm that this layer order is invalid
 * (c) not only confirm validity (a) but also uncover another relationship
 * between other pairs of faces involved in the taco/tortilla event.
 * 
 * The values of each state above is encoded as:
 * (a) is true, (b) is false, (c) encodes which index needs to change and
 * what the new value should become (either a 1 or 2).
 * 
 * And the keys representing each state are n-long, one for every pair of
 * faces involved, and encodes each pair as a 0, 1, or 2, each meaning:
 * 0: order unknown, 1: face a is above b, 2: face b is above a.
 */
/**
 * @description each state encodes a valid layer combination. each number
 * describes a relationship between pairs of faces, indicating:
 * - 1: the first face is above the second face
 * - 2: the second face is above the first face
 * each taco/tortilla set has its own encoding of face pairs.
 */
// A-C and B-D are connected
// "(A,C) (B,D) (B,C) (A,D) (A,B) (C,D)"
const taco_taco_valid_states = [
  "111112",
  "111121",
  "111222",
  "112111",
  "121112",
  "121222",
  "122111",
  "122212",
  "211121",
  "211222",
  "212111",
  "212221",
  "221222",
  "222111",
  "222212",
  "222221",
];
// A-C is the taco, B is the tortilla
// (A,C) (A,B) (B,C)
const taco_tortilla_valid_states = ["112", "121", "212", "221"];

// A-B and C-D are connected, A is above/below C, B is above/below D
// (A,C) (B,D)
// in the case of tortilla-crossing face, the crossing face
// appears twice, the same index appears in place of both C and D
const tortilla_tortilla_valid_states = ["11", "22"];

// const tortilla_face_valid_states = [];
// (A,B) (B,C) (C,A)
const transitivity_valid_states = [
  "112",
  "121",
  "122",
  "211",
  "212",
  "221",
];
/**
 * @param {object[]} states, array of objects containing permutations (keys)
 *  and their values (solution is possible or not)
 * @param {number} t, 0...N the index in "states" we are looking at.
 * @param {string} key, a layer order as a string, like "001221"
 */
const check_state = (states, t, key) => {
  // convert the key into an array of integers (0, 1, 2)
  const A = Array.from(key).map(char => parseInt(char));
  // for each "t" index of states, only include keys which contain
  // "t" number of unknowns (0s).
  if (A.filter(x => x === 0).length !== t) { return; }
  states[t][key] = false;
  // solution will either be 0, 1, or an array of modifications
  let solution = false;
  for (let i = 0; i < A.length; i++) {
    const modifications = [];
    // look at the unknown layers only (index is 0)
    if (A[i] !== 0) { continue; }
    // in place of the unknowns, try each of the possible states (1, 2)
    for (let x = 1; x <= 2; x++) {
      // temporarily set the state to this new possible state.
      A[i] = x;
      // if this state exists in the previous set, save this solution.
      if (states[t - 1][A.join("")] !== false) {
        modifications.push([i, x]);
      }
    }
    // reset the state back to 0
    A[i] = 0;
    // if we found modifications (even if we aren't using them), the
    // solution is no longer 0. solution is either 1 or modifications.
    if (modifications.length > 0 && solution === false) {
      solution = [];
    }
    // this round's modifications will be length of 2 if we added
    // both possible states (1, 2), if this happens, we can't infer anything.
    // only accept a modification when it's the only one (length is 1).
    if (modifications.length === 1) {
      solution.push(modifications[0]);
    }
  }
  // if we invalidated a 0 solution (solution impossible), and no modifications
  // were able to be added, solution is 1, meaning, currently valid (if unsolved).
  if (solution !== false && solution.length === 0) {
    solution = true;
  }
  states[t][key] = solution;
};
/**
 * @description make a lookup table for every possible state of a taco/
 * tortilla combination, given the particular taco/tortilla valid states.
 * the value of each state is one of 3 values (2 numbers, 1 array):
 * - 0: layer order is not valid
 * - 1: layer order is currently valid. and is either solved (key contains
 *   no zeros / unknowns), or it is not yet invalid and can still be solved.
 * - (Array): two numbers, [index, value], modify the current layer by
 *   changing the number at index to the value.
 * @param {string[]} valid_states, one of the 3 set of valid states above
 * @returns {object} keys are layer states, possible solution as values.
 */
// const flip = { 0:0, 1:2, 2:1 };
const make_lookup = (valid_states) => {
  // the choose count can be inferred by the length of the valid states
  // (assuming they are all the same length)
  const choose_count = valid_states[0].length;
  // array of empty objects
  const states = Array
    .from(Array(choose_count + 1))
    .map(() => ({}));
  // all permutations of 1s and 2s (no zeros), length of choose_count.
  // examples for (6): 111112, 212221
  // set the value of these to "false" (solution is impossible)
  // with the valid cases to be overwritten in the next step.
  Array.from(Array( Math.pow(2, choose_count) ))
    .map((_, i) => i.toString(2))
    .map(str => Array.from(str).map(n => parseInt(n) + 1).join(""))
    .map(str => ("11111" + str).slice(-choose_count))
    .forEach(key => { states[0][key] = false; });
  // set the valid cases to "true" (solution is possible)
  valid_states.forEach(s => { states[0][s] = true; });
  // "t" relates to the number of unknowns (# zeros). layer 0 is complete,
  // start at layer 1 and count up to choose_count.
  Array.from(Array(choose_count))
    .map((_, i) => i + 1)
    // make all permuations of 0s, 1s, and 2s now, length of choose_count.
    // (all possibile permuations of layer orders)
    .map(t => Array.from(Array( Math.pow(3, choose_count) ))
      .map((_, i) => i.toString(3))
      .map(str => ("000000" + str).slice(-choose_count))
      .forEach(key => check_state(states, t, key)));
  // todo: the filter at the beginning of check_state is throwing away
  // a lot of solutions, duplicating work, in the first array here, instead
  // of being smart about it, only doing one loop, and sorting them here
  // before entering check_state.
  // gather solutions together into one object. if a layer order has
  // multiple suggested modifications, grab the first one
  let outs = [];
  // array decrementing integers from [choose_count...0]
  Array.from(Array(choose_count + 1))
    .map((_, i) => choose_count - i)
    .forEach(t => {
      const A = [];
      // currently, each value is either a number (0 or 1), or
      // an array of multiple modifications, in which case, we only need one.
      Object.keys(states[t]).forEach(key => {
        let out = states[t][key];
        // multiple modifications are possible, get the first one.
        if (out.constructor === Array) { out = out[0]; }
        // if (out.constructor === Array) {
        //   const key_correct = Array.from(key);
        //   const key_flipped = Array.from(key);
        //   key_correct[out[0][0]] = out[0][1];
        //   key_flipped[out[0][0]] = flip[out[0][1]];
        //   out = {
        //     true: key_correct.join(""),
        //     false: key_flipped.join(""),
        //   };
        // }
        A.push([key, out]);
      });
      outs = outs.concat(A);
    });
  // this is unnecessary but because for Javascipt object keys,
  // insertion order is preserved, sort keys for cleaner output.
  outs.sort((a, b) => parseInt(a[0]) - parseInt(b[0]));
  // return data as an object.
  // recursively freeze result, this is intended to be an immutable reference
  const lookup = {};
  outs.forEach(el => { lookup[el[0]] = Object.freeze(el[1]); });
  return Object.freeze(lookup);
};

const slow_lookup = {
  taco_taco: make_lookup(taco_taco_valid_states),
  taco_tortilla: make_lookup(taco_tortilla_valid_states),
  tortilla_tortilla: make_lookup(tortilla_tortilla_valid_states),
  transitivity: make_lookup(transitivity_valid_states),
};

export default slow_lookup;

// const done_result = { 0: false, 1: true };
// const make_number = (key, value) => {
//   const arr = Array.from(key);
//   arr[value[0]] = value[1];
//   const base_three = arr.join("");
//   return parseInt(base_three, 3);
// };
// const quick_lookup = {};
// Object.keys(slow_lookup).forEach(type => {
//   quick_lookup[type] = [];
//   Object.keys(slow_lookup[type]).forEach(key => {
//     const base_ten = parseInt(key, 3);
//     const value = slow_lookup[type][key];
//     const done = value === 0 || value === 1;
//     const new_value = done ? done_result[value] : make_number(key, value);
//     quick_lookup[type][base_ten] = new_value;
//   });
// });

// export default quick_lookup;
