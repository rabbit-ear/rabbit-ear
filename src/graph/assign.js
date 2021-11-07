/**
 * Rabbit Ear (c) Robby Kraft
 */
import math from "../math";
import count from "./count";
import add_vertices from "./add/add_vertices";
import * as S from "../symbols/strings";
import {
  get_graph_keys_with_prefix,
  get_graph_keys_with_suffix,
} from "../fold/spec";

const vef = [S._vertices, S._edges, S._faces];

const make_vertices_map_and_consider_duplicates = (target, source, epsilon = math.core.EPSILON) => {
  let index = target.vertices_coords.length;
  return source.vertices_coords
    .map(vertex => target.vertices_coords
      .map(v => math.core.distance(v, vertex) < epsilon)
      .map((on_vertex, i) => on_vertex ? i : undefined)
      .filter(a => a !== undefined)
      .shift())
    .map(el => el === undefined ? index++ : el);
};

const get_edges_duplicate_from_source_in_target = (target, source) => {
  const source_duplicates = {};
  const target_map = {};
  for (let i = 0; i < target.edges_vertices.length; i += 1) {
    // we need to store both, but only need to test one
    target_map[`${target.edges_vertices[i][0]} ${target.edges_vertices[i][1]}`] = i;
    target_map[`${target.edges_vertices[i][1]} ${target.edges_vertices[i][0]}`] = i;
  }
  for (let i = 0; i < source.edges_vertices.length; i += 1) {
    const index = target_map[`${source.edges_vertices[i][0]} ${source.edges_vertices[i][1]}`]
    if (index !== undefined) {
      source_duplicates[i] = index;
    }
  }
  return source_duplicates;
};

/**
 * @param {object} FOLD graph
 * @param {string[]} array of strings like "vertices_edges"
 * @param {string[]} array of any combination of "vertices", "edges", or "faces"
 * @param {object} object with keys VEF each with an array of index maps
 */
const update_suffixes = (source, suffixes, keys, maps) => keys
  .forEach(geom => suffixes[geom]
    .forEach(key => source[key]
      .forEach((arr, i) => arr
        .forEach((el, j) => { source[key][i][j] = maps[geom][el]; }))));

// todo, make the second param ...sources
const assign = (target, source, epsilon = math.core.EPSILON) => {
  // these all relate to the source, not target
  const prefixes = {};
  const suffixes = {};
  const maps = {};
  // gather info
  vef.forEach(key => {
    prefixes[key] = get_graph_keys_with_prefix(source, key);
    suffixes[key] = get_graph_keys_with_suffix(source, key);
  });
  // if source keys don't exist in the target, create empty arrays
  vef.forEach(geom => prefixes[geom].filter(key => !target[key]).forEach(key => {
    target[key] = [];
  }));
  // vertex map
  maps.vertices = make_vertices_map_and_consider_duplicates(target, source, epsilon);
  // correct indices in all vertex suffixes, like "faces_vertices", "edges_vertices"
  update_suffixes(source, suffixes, [S._vertices], maps);
  // edge map
  const target_edges_count = count.edges(target);
  maps.edges = Array.from(Array(count.edges(source)))
    .map((_, i) => target_edges_count + i);
  const edge_dups = get_edges_duplicate_from_source_in_target(target, source);
  Object.keys(edge_dups).forEach(i => { maps.edges[i] = edge_dups[i]; });
  // faces map
  const target_faces_count = count.faces(target);
  maps.faces = Array.from(Array(count.faces(source)))
    .map((_, i) => target_faces_count + i);
  // todo find duplicate faces, correct map
  // correct indices in all edges and faces suffixes
  update_suffixes(source, suffixes, [S._edges, S._faces], maps);
  // copy all geometry arrays from source to target
  vef.forEach(geom => prefixes[geom].forEach(key => source[key].forEach((el, i) => {
    const new_index = maps[geom][i];
    target[key][new_index] = el;
  })));
  return maps;
};

export default assign;
