
const all_topological_orderings = (conditions, overlap_matrix) => {
  const conditions_keys = Object.keys(conditions);
  const face_pairs = conditions_keys
    .map(key => key.split(" ").map(n => parseInt(n)));
  const faces = [];
  face_pairs
    .reduce((a, b) => a.concat(b), [])
    .forEach(f => faces[f] = undefined);
  const matrix = faces.map(() => []);
  face_pairs
    .filter((_, i) => conditions[conditions_keys[i]] !== 0)
    .map(([a, b]) => {
      matrix[a][b] = conditions[`${a} ${b}`];
      matrix[b][a] = -conditions[`${a} ${b}`];
    });
  const starting_in_nodes_count = matrix
    .map((row, i) => row
      .map(n => n === -1 ? 1 : 0)
      .reduce((a, b) => a + b, 0));
  const recurse = (order, in_nodes_count) => {
    const next_in_nodes = in_nodes_count
      .map((count, i) => count === 0 ? i : undefined)
      .filter(a => a !== undefined);
    const next_overlaps = [];
    const top_faces_in_groups = [];
    const visited_faces = {};
    next_in_nodes.forEach(i => {
      if (visited_faces[i]) { return; }
      visited_faces[i] = true;
      const next_group = [i];
      next_in_nodes.forEach(j => {
        if (i === j) { return; }
        if (overlap_matrix[i][j] === false) {
          if (visited_faces[j]) { return; }
          visited_faces[j] = true;
          next_group.push(j);
        }
      });
      top_faces_in_groups.push(next_group);
    });
    // console.log("top_faces_in_groups", top_faces_in_groups);
    return top_faces_in_groups.map(top_faces => {
      const clone_in_nodes = JSON.parse(JSON.stringify(in_nodes_count));
      clone_in_nodes.forEach((el, i) => el === null
        ? delete clone_in_nodes[i]
        : undefined);
      const clone_order = JSON.parse(JSON.stringify(order));
      top_faces
        .forEach(top_face => matrix[top_face]
          .forEach((dir, i) => {
            if (dir === 1) { clone_in_nodes[i]--; }
          }));
      top_faces.forEach(top_face => delete clone_in_nodes[top_face]);
      top_faces.forEach(top_face => clone_order.push(top_face));
      if (Object.keys(clone_in_nodes).length === 0) {
        return [clone_order];
      }
      return recurse(clone_order, clone_in_nodes);
    }).reduce((a, b) => a.concat(b), []);
  };
  return recurse([], starting_in_nodes_count)
};


const make_all_conditions = (conditions, taco_taco_map, taco_tortilla_map, tortilla_tortilla_map) => {
  
};

export default make_all_conditions;
