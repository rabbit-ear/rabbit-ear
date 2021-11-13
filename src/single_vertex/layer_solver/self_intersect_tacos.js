/**
 * Rabbit Ear (c) Robby Kraft
 */
import math from "../../math";
// const example = {
//   min: -0.1,
//   max: 0.1,
//   faces: [ [2,3], [0,1] ],
// };
const common_fold_location = (folded_faces, is_circular, epsilon) => {
  // console.log("common_fold_location", folded_faces, is_circular, epsilon);
  // center of each face
  const faces_center = folded_faces
    .map((ends) => ends ? (ends[0] + ends[1]) / 2 : undefined);
  const locations = [];
  folded_faces.forEach((ends, i) => {
    if (!ends) { return; }
    if (!is_circular && i === folded_faces.length - 1) { return; }
    const fold_end = ends[1];
    const min = fold_end - (epsilon * 2);
    const max = fold_end + (epsilon * 2);
    const faces = [i, (i+1) % folded_faces.length];
    // which side of the crease is the face on?
    // false = left (-), true = right (+)
    const sides = faces
      .map(f => faces_center[f])
      .map(center => center > fold_end);
    const left_taco = !sides[0] && !sides[1];
    const right_taco = sides[0] && sides[1];
    const tortilla = sides[0] !== sides[1];
    const match = locations
      .filter(el => el.min < fold_end && el.max > fold_end)
      .shift();
    const entry = { faces, left_taco, right_taco, tortilla };
    if (match) {
      match.pairs.push(entry);
    } else {
      locations.push({ min, max, pairs: [entry] });
    }
  });
  return locations;
};

// tacos and tortillas are built from the folded_faces, so they contain
// all faces. however, generate_taco_stack only uses faces contained in
// layers_face, so, its possible we build a layer stack that doesn't
// contain a taco anymore (one face)
const generate_taco_stack = (layers_face, tacos) => {
  const stack = [];
  const taco_faces = JSON.parse(JSON.stringify(tacos.map(el => el.faces)));
  // console.log("CREATE taco stack", JSON.parse(JSON.stringify(tacos)), JSON.parse(JSON.stringify(taco_faces)), layers_face);
  // move up through the layers, incrementing up in the +Z direction.
  for (let layer = 0; layer < layers_face.length; layer++) {
    for (let pair = 0; pair < taco_faces.length; pair++) {
      // console.log(" - layer, pair", layer, pair, "(len)", layers_face.length, taco_faces.length);
      const indexOf = taco_faces[pair].indexOf(layers_face[layer]);
      if (indexOf === -1) { continue; }
      stack.push(pair);
      taco_faces[pair].splice(indexOf, 1);
    }
  }
  // create a reference counter for each pair in the stack. only allow
  // pairs to be returned if they appear twice (taco). this is necessary
  // because the layers_face is a subset of the total faces, and its
  // possible that only one face from a taco was added to this stack, in
  // which case, that faces can be removed since it is not causing issues.
  const pair_count = {};
  stack.forEach(n => {
    if (pair_count[n] === undefined) { pair_count[n] = 0; }
    pair_count[n]++;
  });
  return stack.filter(n => pair_count[n] > 1);
};

const validate_taco_stack = (stack) => {
  // create a copy of "stack" that removes 
  const pairs = {};
  let count = 0;
  for (let i = 0; i < stack.length; i++) {
    // console.log(i, "validate stack", stack, JSON.parse(JSON.stringify(pairs)));
    if (pairs[stack[i]] === undefined) {
      count++;
      pairs[stack[i]] = count;
    }
    // if we have seen this layer pair already, it MUST be appearing
    // in the correct order, that is, as it gets popped off the stack,
    // it must be the next-most-recently added pair to the stack.
    else if (pairs[stack[i]] !== undefined) {
      if (pairs[stack[i]] !== count) {
        // console.log("stack fail", pairs, stack[i], count);
        return true;
      }
      count--;
      pairs[stack[i]] = undefined;
    }
  }
  return false;
};

const self_intersect_tacos = (folded_faces, layers_face, is_circular = true, epsilon = math.core.EPSILON) => {
  const common_locations = common_fold_location(folded_faces, is_circular, epsilon);
  // console.log("common_locations", JSON.parse(JSON.stringify(common_locations)));
  // often the case during execution that the folded_faces array 
  // contains the entire set of faces, but the layers_face
  // is a subset of the faces.
  for (let l = 0; l < common_locations.length; l++) {
    const location = common_locations[l];
    const left_tacos = location.pairs.filter(el => el.left_taco);
    const right_tacos = location.pairs.filter(el => el.right_taco);
    const tortillas = location.pairs.filter(el => el.tortilla);
    // console.log("left/right tacos", left_tacos, right_tacos);

    // these check taco-taco relationships
    if (left_tacos.length > 1) {
      const stack = generate_taco_stack(layers_face, left_tacos);
      // console.log("TEST left taco", JSON.parse(JSON.stringify(stack)));
      if (validate_taco_stack(stack)) {
        // console.log("left taco fail");
        return true;
      }
    }
    if (right_tacos.length > 1) {
      const stack = generate_taco_stack(layers_face, right_tacos);
      // console.log("TEST right taco", JSON.parse(JSON.stringify(stack)));
      if (validate_taco_stack(stack)) {
        // console.log("right taco fail");
        return true;
      }
    }
  }
  return false;
};

export default self_intersect_tacos;

