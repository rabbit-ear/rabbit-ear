/**
 * Rabbit Ear (c) Robby Kraft
 */
import { remove_duplicate_edges } from "../clean/index";
// this method is meant to add edges between EXISTING vertices.
// this should split and rebuild faces.

// todo: we need to make a remove_duplicate_edges that returns merge info

// const edges = ear.graph.add_edges(graph, [[0, vertex], [1, vertex], [2, 3], [2, vertex]]);


const add_edges = (graph, edges_vertices) => {
  if (!graph.edges_vertices) {
    graph.edges_vertices = [];
  }
  // the user messed up the input and only provided one edge
  // it's easy to fix for them
  if (typeof edges_vertices[0] === "number") { edges_vertices = [edges_vertices]; }
  const indices = edges_vertices.map((_, i) => graph.edges_vertices.length + i);
  graph.edges_vertices.push(...edges_vertices);
  const index_map = remove_duplicate_edges(graph).map;
  return indices.map(i => index_map[i]);
};

export default add_edges;
