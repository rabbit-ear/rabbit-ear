/**
 * this method modifies graph1, leaves graph2 untouched
 * graph2 will be merged into graph1
 * vertices_coords
 */

import math from "../../include/math";
import { similar_vertices_coords } from "./similar";
import clean from "./clean";
import populate from "./populate";
import fragment from "./fragment";

const join = function (target, source, epsilon = math.core.EPSILON) {
  const sourceMap = similar_vertices_coords(target, source, epsilon);
  const additional_vertices_coords = source.vertices_coords
    .filter((_, i) => sourceMap[i] === undefined);

  let new_index = target.vertices_coords.length;
  for (let i = 0; i < sourceMap.length; i += 1) {
    if (sourceMap[i] === undefined) {
      sourceMap[i] = new_index;
      new_index += 1;
    }
  }
  const additional_edges_vertices = source.edges_vertices
    .map(ev => ev.map(v => sourceMap[v]));

  target.vertices_coords = target.vertices_coords.concat(additional_vertices_coords);
  target.edges_vertices = target.edges_vertices.concat(additional_edges_vertices);

  delete target.vertices_vertices;
  delete target.vertices_edges;
  delete target.vertices_faces;
  delete target.edges_edges;
  delete target.edges_faces;
  delete target.faces_vertices;
  delete target.faces_edges;
  delete target.faces_faces;

  clean(target);
  fragment(target);
  populate(target);

  return target;
};

export default join;
