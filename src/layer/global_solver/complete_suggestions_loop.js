import table from "./table";
const taco_types = Object.freeze(Object.keys(table));
/**
 * @description a layer orientation between two faces is encoded as:
 * 0: unknown, 1: face A is above B, 2: face B is above A.
 * this map will flip 1 and 2, leaving 0 to be 0.
 */
const flip = { 0:0, 1:2, 2:1 };

const fill_layers_from_conditions = (layers, maps, conditions) => layers
  .forEach((layer, i) => maps[i].face_keys
    .forEach((key, j) => {
      // todo: possible this error will never show if we can guarantee that
      // tacos/tortillas have been properly built
      if (!(key in conditions)) { console.warn(key, "not in conditions"); return }
      if (conditions[key] !== 0) {
        const orientation = maps[i].keys_ordered[j]
          ? conditions[key]
          : flip[conditions[key]];
        if (layers[i][j] !== 0 && layers[i][j] !== orientation) {
          throw "fill conflict";
        }
        layers[i][j] = orientation;
      }
    }));

const infer_next_steps = (layers, maps, lookup_table) => layers
  .map((layer, i) => {
    const map = maps[i];
    const key = layer.join("");
    const next_step = lookup_table[key];
    if (next_step === false) { throw "unsolvable"; }
    if (next_step === true) { return; }
    if (layer[next_step[0]] !== 0 && layer[next_step[0]] !== next_step[1]) {
      throw "infer conflict";
    }
    layers[i][next_step[0]] = next_step[1];
    // if (layers[i].indexOf(0) === -1) { delete layers[i]; }
    // format this next_step change into face-pair-key and above/below value
    // so that it can be added to the conditions object.
    const condition_key = map.face_keys[next_step[0]];
    const condition_value = map.keys_ordered[next_step[0]]
      ? next_step[1]
      : flip[next_step[1]];
    // console.log("conditions value", map.keys_ordered[next_step[0]], map.face_keys[next_step[0]]);
    // if (avoid[condition_key] === condition_value) { throw "avoid"; }
    return [condition_key, condition_value];
  }).filter(a => a !== undefined);

const complete_suggestions_loop = (layers, maps, conditions, avoid) => {
  // console.log("complete_suggestions_loop", Object.keys(lookup).map(type => layers[type].filter(el => el !== undefined).length));
  // given the current set of conditions, complete them as much as possible
  // only adding the determined results certain from the current state.
  let next_steps;
  do {
    try {
      // inner_inner_loop_count++;
      // for each: taco_taco, taco_tortilla, tortilla_tortilla, transitivity
      for (let t = 0; t < taco_types.length; t++) {
        const type = taco_types[t];
        fill_layers_from_conditions(layers[type], maps[type], conditions);
      }
      next_steps = taco_types
        .map(type => infer_next_steps(layers[type], maps[type], table[type], avoid))
        .reduce((a, b) => a.concat(b), []);
      next_steps.forEach(el => { conditions[el[0]] = el[1]; });
    } catch (error) { return false; } // no solution on this branch
  } while (next_steps.length > 0);
  return true;
};

export default complete_suggestions_loop;
