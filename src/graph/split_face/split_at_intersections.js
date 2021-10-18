import split_edge from "../split_edge/index";
import {
  merge_nextmaps,
  merge_backmaps,
  invert_simple_map,
} from "../maps";
/**
 * @param {object} a FOLD object. modified in place.
 * @param {object} the result from calling "intersect_convex_face_line".
 * each value must be an array. these will be modified in place.
 */
const split_at_intersections = (graph, { vertices, edges }) => {
  // intersection will contain 2 items, either in "vertices" or "edges",
  // however we will split edges and store their new vertex in "vertices"
  // so in the end, "vertices" will contain 2 items.
  let map;
  // split the edge (modifying the graph), and store the changes so that during
  // the next loop the second edge to split will be updated to the new index
  const split_results = edges.map((el) => {
    const res = split_edge(graph, map ? map[el.edge] : el.edge, el.coords);
    map = map ? merge_nextmaps(map, res.edges.map) : res.edges.map;
    return res;
  });
  vertices.push(...split_results.map(res => res.vertex));
  // if two edges were split, the second one contains a "remove" key that was
  // based on the mid-operation graph, update this value to match the graph
  // before any changes occurred.
  let bkmap;
  split_results.forEach(res => {
    res.edges.remove = bkmap ? bkmap[res.edges.remove] : res.edges.remove;
    const inverted = invert_simple_map(res.edges.map);
    bkmap = bkmap ? merge_backmaps(bkmap, inverted) : inverted;
  });
  // todo: if we extend this to include non-convex polygons, this is the
  // only part of the code we need to test. cumulative backmap merge.
  // this was written without any testing, as convex polygons never have
  // more than 2 intersections
  return {
    vertices,
    edges: {
      map,
      remove: split_results.map(res => res.edges.remove),
    }
  };
};

export default split_at_intersections;
