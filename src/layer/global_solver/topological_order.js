const topological_order = (conditions, graph) => {
  if (!conditions) { return []; }
  const faces_children = [];
  Object.keys(conditions).map(key => {
    const pair = key.split(" ").map(n => parseInt(n));
    if (conditions[key] === -1) { pair.reverse(); }
    if (faces_children[pair[0]] === undefined) {
      faces_children[pair[0]] = [];
    }
    faces_children[pair[0]].push(pair[1]);
  });
  if (graph && graph.faces_vertices) {
    graph.faces_vertices.forEach((_, f) => {
      if (faces_children[f] === undefined) {
        faces_children[f] = [];
      }
    });
  }
  // console.log("faces_children", JSON.parse(JSON.stringify(faces_children)));
  const layers_face = [];
  const faces_visited = [];
  let protection = 0;
  for (let f = 0; f < faces_children.length; f++) {
    if (faces_visited[f]) { continue; }
    const stack = [f];
    while (stack.length && protection < faces_children.length * 2) {
      const stack_end = stack[stack.length - 1];
      if (faces_children[stack_end].length) {
        const next = faces_children[stack_end].pop();
        if (!faces_visited[next]) { stack.push(next); }
        continue;
      } else {
        // we reached a leaf, add it to the layers.
        layers_face.push(stack_end);
        faces_visited[stack_end] = true;
        stack.pop();
      }
      protection++;
    }
  }
  // console.log("faces_children", faces_children);
  // console.log("protection", protection);
  if (protection >= faces_children.length * 2) {
    console.warn("fix protection in topological order");
  }
  // console.log("layers_face", layers_face);
  // console.log("faces_visited", faces_visited);
  return layers_face;
};

export default topological_order;
