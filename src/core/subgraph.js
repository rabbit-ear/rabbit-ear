// import { clone } from "./";
import remove from "./remove";
import count from "./count";
// maybe we can do this without copying the entire graph first. use the component arrays to bring over only what is necessary

const subgraph = (graph, components) => {

  const remove_indices = {
    faces: undefined,
    edges: undefined,
    vertices: undefined
  };
  ["faces", "edges", "vertices"]
    .filter(key => components[key])
    .forEach(key => {
      remove_indices[key] = Array.from(Array(count[key](graph)))
        .map((_, i) => i)
        .filter(i => !components[key].includes(i))
    });

  // const subgraph = clone(graph);
  ["faces", "edges", "vertices"]
    .filter(key => components[key])
    .forEach(key => remove(graph, key, remove_indices[key]));
  return graph;
};

export default subgraph;
