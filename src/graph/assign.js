import math from "../math";
import count from "./count";
import add_vertices from "./add/add_vertices";
import {
  get_graph_keys_with_prefix,
  get_graph_keys_with_suffix,
} from "./fold_spec";

const vef = ["vertices", "edges", "faces"];

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

// todo, make the second param ...sources
const assign = (target, source, epsilon = math.core.EPSILON) => {
  // these all relate to the source, not target
  const prefixes = {};
  const suffixes = {};
  const counts = {};
  const maps = {};
  // gather info
  vef.forEach(key => {
    counts[key] = count[key](source);
    prefixes[key] = get_graph_keys_with_prefix(source, key);
    suffixes[key] = get_graph_keys_with_suffix(source, key);
  });
  // if source keys don't exist in the target, create empty arrays
  vef.forEach(geom => prefixes[geom].filter(key => !target[key]).forEach(key => {
    target[key] = [];
  }));
  // create vertex map based on duplicate vertices based on distance epsilon
  maps.vertices = make_vertices_map_and_consider_duplicates(target, source, epsilon);
  // correct indices in all vertex suffixes, like "faces_vertices", "edges_vertices"
  suffixes.vertices.forEach(key => {
    // faces_vertices: [ [1,4,5], [3,6,2], ... ]
    source[key].forEach((el, i) => el.forEach((vert, j) => {
      source[key][i][j] = maps.vertices[vert];
    }));
  });
  // build edge map based on duplicate edges based on edges_vertices
  const target_edges_count = count.edges(target);
  maps.edges = Array.from(Array(counts.edges)).map((_, i) => target_edges_count + i);
  const edge_dups = get_edges_duplicate_from_source_in_target(target, source);
  Object.keys(edge_dups).forEach(i => { maps.edges[i] = edge_dups[i]; });
  // correct indices in all edges suffixes, like "faces_edges", "vertices_edges"
  suffixes.edges.forEach((key) => {
    source[key].forEach((el, i) => el.forEach((edge, j) => {
      source[key][i][j] = maps.edges[edge];
    }));
  });

  // faces map
  const target_faces_count = count.faces(target);
  maps.faces = Array.from(Array(counts.faces)).map((_, i) => target_faces_count + i);
  // todo find duplicate faces, correct map

  // add vertices
  // correct indices in all faces suffixes, like "faces_faces", "vertices_faces"
  suffixes.faces.forEach((key) => {
    source[key].forEach((el, i) => el.forEach((face, j) => {
      source[key][i][j] = maps.faces[face];
    }));
  });
  // copy all geometry arrays from source to target
  vef.forEach((geom) => {
    prefixes[geom].forEach((key) => {
      source[key].forEach((el, i) => {
        const new_index = maps[geom][i];
        target[key][new_index] = el;
      });
    });
  });
  return target;
};

export default assign;


  // // add vertices to the graph using coords first, to get back a map in case
  // // there are duplicate vertices.
  // const vertices_map = source.vertices_coords
  //   ? add_vertices(target, source.vertices_coords)
  //   : Array.from(Array(counts.vertices)).map((_, i) => i);
  // // adjust things like "faces_vertices", "edges_vertices" with new vertices indices
  // suffixes.vertices.forEach(key => {
  //   // faces_vertices: [ [1,4,5], [3,6,2], ... ]
  //   source[key].forEach((el, i) => el.forEach((vert, j) => {
  //     source[key][i][j] = vertices_map[vert];
  //   }));
  // });
