/**
 * Rabbit Ear (c) Robby Kraft
 */
import math from "../math";
import {
  fn_cat,
  fn_def,
} from "../general/functions";
import * as S from "../general/strings";
import {
	edge_assignment_to_foldAngle,
	edge_foldAngle_to_assignment,
  get_graph_keys_with_prefix,
} from "../fold/spec";
import {
  remove_duplicate_vertices,
} from "./vertices_violations";
import {
  remove_duplicate_edges,
  remove_circular_edges,
} from "./edges_violations";
import { get_vertices_edges_overlap } from "./vertices_collinear";
import { make_edges_edges_intersection } from "./intersect";
import { sort_vertices_along_vector } from "./sort";
import {
	merge_simple_nextmaps,
	merge_nextmaps,
	merge_backmaps,
	invert_map,
} from "./maps";

/**
 * Fragment converts a graph into a planar graph. it flattens all the
 * coordinates onto the 2D plane.
 *
 * it modifies edges and vertices. splitting overlapping edges
 * at their intersections, merging vertices that lie too near to one another.
 * # of edges may increase. # of vertices may decrease. (is that for sure?)
 *
 * This function requires an epsilon (1e-6), for example a busy
 * edge crossing should be able to resolve to one point
 *
 * 1. merge vertices that are within the epsilon.
 *
 * 2. gather all intersections, for every line.
 *    for example, the first line in the list gets compared to other lines
 *    resulting in a list of intersection points,
 *
 * 3. replace the edge with a new, rebuilt, sequence of edges, with
 *    new vertices.
 */
const fragment_graph = (graph, epsilon = math.core.EPSILON) => {
  const edges_coords = graph.edges_vertices
    .map(ev => ev.map(v => graph.vertices_coords[v]));
  // when we rebuild an edge we need the intersection points sorted
  // so we can walk down it and rebuild one by one. sort along vector
  const edges_vector = edges_coords.map(e => math.core.subtract(e[1], e[0]));
  const edges_origin = edges_coords.map(e => e[0]);
  // for each edge, get all the intersection points
  // this array will match edges_, each an array containing intersection
  // points (an [x,y] array), with an important detail, because each edge
  // intersects with another edge, this [x,y] point is a shallow pointer
  // to the same one in the other edge's intersection array.
  const edges_intersections = make_edges_edges_intersection({
    vertices_coords: graph.vertices_coords,
    edges_vertices: graph.edges_vertices,
    edges_vector,
    edges_origin
  }, 1e-6);
  // check the new edges' vertices against every edge, in case
  // one of the endpoints lies along an edge.
  const edges_collinear_vertices = get_vertices_edges_overlap({
    vertices_coords: graph.vertices_coords,
    edges_vertices: graph.edges_vertices,
    edges_coords
  }, epsilon);
  // exit early
  if (edges_intersections.reduce(fn_cat, []).filter(fn_def).length === 0 &&
  edges_collinear_vertices.reduce(fn_cat, []).filter(fn_def).length === 0) {
    return;
  }
  // remember, edges_intersections contains intersections [x,y] points
  // each one appears twice (both edges that intersect) and is the same
  // object, shallow pointer.
  //
  // iterate over this list and move each vertex into new_vertices_coords.
  // in their place put the index of this new vertex in the new array.
  // when we get to the second appearance of the same point, it will have
  // been replaced with the index, so we can skip it. (check length of
  // item, 2=point, 1=index)
  const counts = { vertices: graph.vertices_coords.length };
  // add new vertices (intersection points) to the graph
  edges_intersections
    .forEach(edge => edge
      .filter(fn_def)
      .filter(a => a.length === 2)
      .forEach((intersect) => {
        const newIndex = graph.vertices_coords.length;
        graph.vertices_coords.push([...intersect]);
        intersect.splice(0, 2);
        intersect.push(newIndex);
      }));
  // replace arrays with indices
  edges_intersections.forEach((edge, i) => {
    edge.forEach((intersect, j) => {
      if (intersect) {
        edges_intersections[i][j] = intersect[0];
      }
    })
  });

  const edges_intersections_flat = edges_intersections
    .map(arr => arr.filter(fn_def));
  // add lists of vertices into each element in edges_vertices
  // edges verts now contains an illegal arrangement of more than 2 verts
  // to be resolved below
  graph.edges_vertices.forEach((verts, i) => verts
    .push(...edges_intersections_flat[i], ...edges_collinear_vertices[i]));
    // .push(...edges_intersections_flat[i]));

  graph.edges_vertices.forEach((edge, i) => {
    graph.edges_vertices[i] = sort_vertices_along_vector({
      vertices_coords: graph.vertices_coords
    }, edge, edges_vector[i]);
  });

  // edge_map is length edges_vertices in the new, fragmented graph.
  // the value at each index is the edge that this edge was formed from.
  const edge_map = graph.edges_vertices
    .map((edge, i) => Array(edge.length - 1).fill(i))
    .reduce(fn_cat, []);

  graph.edges_vertices = graph.edges_vertices
    .map(edge => Array.from(Array(edge.length - 1))
      .map((_, i, arr) => [edge[i], edge[i + 1]]))
    .reduce(fn_cat, []);
  // copy over edge metadata if it exists
	// make foldAngles and assignments match if foldAngle is longer
	if (graph.edges_assignment && graph.edges_foldAngle
		&& graph.edges_foldAngle.length > graph.edges_assignment.length) {
		for (let i = graph.edges_assignment.length; i < graph.edges_foldAngle.length; i += 1) {
			graph.edges_assignment[i] = edge_foldAngle_to_assignment(graph.edges_foldAngle[i]);
		}
	}
	// copy over assignments and fold angle and base fold angle off assigments if it's shorter
  if (graph.edges_assignment) {
    graph.edges_assignment = edge_map.map(i => graph.edges_assignment[i] || "U");
  }
  if (graph.edges_foldAngle) {
    graph.edges_foldAngle = edge_map
			.map(i => graph.edges_foldAngle[i])
			.map((a, i) => a === undefined
				? edge_assignment_to_foldAngle(graph.edges_assignment[i])
				: a);
  }
  return {
    vertices: {
      new: Array.from(Array(graph.vertices_coords.length - counts.vertices))
        .map((_, i) => counts.vertices + i),
    },
    edges: {
      backmap: edge_map
    }
  };
  // return graph;
};

const fragment_keep_keys = [
  S._vertices_coords,
  S._edges_vertices,
  S._edges_assignment,
  S._edges_foldAngle,
];

const fragment = (graph, epsilon = math.core.EPSILON) => {
  // project all vertices onto the XY plane
  graph.vertices_coords = graph.vertices_coords.map(coord => coord.slice(0, 2));

  [S._vertices, S._edges, S._faces]
    .map(key => get_graph_keys_with_prefix(graph, key))
    .reduce(fn_cat, [])
    .filter(key => !(fragment_keep_keys.includes(key)))
    .forEach(key => delete graph[key]);

  const change = {
		vertices: {},
		edges: {},
	};
	let i;
	for (i = 0; i < 20; i++) {
  	const resVert = remove_duplicate_vertices(graph, epsilon / 2);
  	const resEdgeDup = remove_duplicate_edges(graph);
    // console.log("before", JSON.parse(JSON.stringify(graph)));
  	const resEdgeCirc = remove_circular_edges(graph);
    // console.log("circular", resEdgeCirc);
  	const resFrag = fragment_graph(graph, epsilon);
  	if (resFrag === undefined) { 
			change.vertices.map = (change.vertices.map === undefined
				? resVert.map
				: merge_nextmaps(change.vertices.map, resVert.map));
			change.edges.map = (change.edges.map === undefined
				? merge_nextmaps(resEdgeDup.map, resEdgeCirc.map)
				: merge_nextmaps(change.edges.map, resEdgeDup.map, resEdgeCirc.map));
			break;
		}
  	const invert_frag = invert_map(resFrag.edges.backmap);
  	const edgemap = merge_nextmaps(resEdgeDup.map, resEdgeCirc.map, invert_frag);
		change.vertices.map = (change.vertices.map === undefined
			? resVert.map
			: merge_nextmaps(change.vertices.map, resVert.map));
		change.edges.map = (change.edges.map === undefined
			? edgemap
			: merge_nextmaps(change.edges.map, edgemap));
	}

	if (i === 20) {
    console.warn("fragment reached max iterations");
  }
  return change;
};

export default fragment;
