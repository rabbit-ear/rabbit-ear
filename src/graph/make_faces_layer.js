import math from "../math";
import { invert_map } from "./maps";
import make_vertices_faces_layer from "./vertices_faces_layer";

// size will be (length * (length-1)) / 2
const make_triangle_pairs = (array) => {
  const pairs = Array((array.length * (array.length - 1)) / 2);
  let index = 0;
  for (let i = 0; i < array.length - 1; i++) {
    for (let j = i + 1; j < array.length; j++, index++) {
      pairs[index] = [array[i], array[j]];
    }
  }
  return pairs;
}


const normalize = number => {
  if (number === 0) { return 0; }
  if (number < 0) { return -1; }
  return 1;
};
// relationship is one of [1,0,-1], is i above j?: +1
const add_to_matrix = (matrix, i, j, relationship) => {
  matrix[i][j] = relationship;
  matrix[j][i] = relationship === 0 ? 0 : -relationship;
};
/**
 * @description given a set of solutions for layer ordering of a folded
 * single-vertex, and given that this is the complete set, extract all the
 * rules (relationships between pairs of faces) that are true for every case.
 */
const extract_common_rules = (solutions) => {
  const one_way_relationships = solutions
    .map(solution => make_triangle_pairs(Object.keys(solution)))
    .map((pairs, i) => pairs
      .map(pair => pair.concat(
        normalize(solutions[i][pair[0]] - solutions[i][pair[1]])
      )))
    .reduce((a, b) => a.concat(b), []);
  // inverted relationships is necessary in uncovering consistencies.
  const inverted_relationships = one_way_relationships
    .map(rule => [rule[1], rule[0], rule[2] === 0 ? 0 : -rule[2]]);
  const relationships = one_way_relationships
    .concat(inverted_relationships);
  // use this hashtable "rules" to ensure consistencies across all rules.
  // keys are indices of two faces in a string: "2 5"
  // values are -1,0,1 for a valid rule, "false" for invalid rule.
  const rules = {};
  // iterate all rules (these already include their inverses), store them in
  // the hashtable which checking for contradictions to the rule.
  for (let r = 0; r < relationships.length; r++) {
    const rule = relationships[r];
    const key = `${rule[0]} ${rule[1]}`;
    // if the rule was already invalidated, skip.
    if (rules[key] === false) { continue; }
    // if the rule hasn't been set, set it and return.
    if (rules[key] === undefined) {
      rules[key] = rule[2];
      continue;
    }
    // if we uncover an inconsistency, invalidate both this rule and
    // the rule's inverse to prevent future contradictions.
    if (rules[key] !== rule[2]) {
      rules[key] = false;
      rules[`${rule[1]} ${rule[0]}`] = false;
    }
  }
  // extract rules with values 1, -1, ignoring values of 0 and false
  return [1, -1]
    .map(direction => Object.keys(rules)
      .filter(rule => rules[rule] === direction)
      .map(rule => rule.split(" ").concat(direction)))
    .reduce((a, b) => a.concat(b), []);
};

const matrix_count = (matrix) => {
  let count = 0;
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix.length; j++) {
      if (matrix[i][j] !== undefined) { count++; }
    }
  }
  return count;
}
/**
 * @param {number[][]} matrix of relationships between faces.
 * @param {number} from. index of face. will be "above/below" the "to" face.
 * @param {number} to. index of face. the other face in the comparison.
 * @param {number} 1 or -1. reads as: face "from" is above/below face "to".
 */
const walk_a_unidirectional_path = (matrix, from, to, direction, visited = {}) => {
  const visited_key = `${from} ${to}`;
  if (visited[visited_key]) { return; }
  visited[visited_key] = true;
  add_to_matrix(matrix, from, to, direction);
  // gather the next iteration's indices, recurse.
  matrix[to]
    .map((dir, index) => dir === direction ? index : undefined)
    .filter(a => a !== undefined)
    .map(index => walk_a_unidirectional_path(matrix, from, index, direction, visited));
};
/**
 * 
 * 
 */
const make_faces_layer = (graph, face = 0, epsilon = math.core.EPSILON) => {
  const vertices_faces_layer = make_vertices_faces_layer(graph, face, epsilon);
  // extract all the solutions at vertices where there is only one solution
  // we can be absolutely certain about these rules. add them first.
  const single_solutions = vertices_faces_layer
    .filter(solutions => solutions.length === 1)
    .map(solutions => solutions[0]);
  const certain_rules = single_solutions
    .map(solution => make_triangle_pairs(Object.keys(solution)))
    .map((pairs, i) => pairs
      .map(pair => pair.concat(
        normalize(single_solutions[i][pair[0]] - single_solutions[i][pair[1]])
      )))
    .reduce((a, b) => a.concat(b), []);
  // complex cases have more than one solution, but among all their solutions,
  // there are consistent rules that are true among all solutions. find those.
  const multiple_common_rules = vertices_faces_layer
    .filter(solutions => solutions.length > 1)
    .map(solutions => extract_common_rules(solutions));
  // this matrix will hold all relationship between faces.
  // todo: using faces_vertices to get face count?
  const matrix = Array
    .from(Array(graph.faces_vertices.length))
    .map(() => Array.from(Array(graph.faces_vertices.length)));
  // add rules to matrix
  certain_rules.forEach(rule => add_to_matrix(matrix, ...rule));
  multiple_common_rules.forEach(rules => rules
    .forEach(rule => { matrix[rule[0]][rule[1]] = rule[2]; }));
  // at this point, all single-vertex local layer ordering have been
  // individually added to the relationship matrix. 
  // next,
  // starting from every face, for both "above" and "below" walk by only
  // visiting one of each kind. this is analogous to walking from face to
  // face down a mountain-valley pleating, where we can be certain that
  // faces are above/below the starting face.
  //
  // this all only works with simple folds, origami without cycles.
  // todo: "cycles", what is the word i'm looking for?
  const visited = {};
  matrix.forEach((_, from) => [-1, 1]
    .forEach(direction => matrix[from]
      .map((dir, i) => dir === direction ? i : undefined)
      .filter(a => a !== undefined)
      .forEach(to => walk_a_unidirectional_path(matrix, from, to, direction, visited))));
  // our matrix is complete
  // figure out a layer ordering.
  // todo: this one is severely lacking.
  const rows_sum = matrix.map(row => row
    .map(n => n === undefined ? 0 : n)
    .reduce((a, b) => a + b, 0));

  const initial_face_order = Array
    .from(Array(matrix.length))
    .map((_, i) => i)
    .sort((a, b) => rows_sum[a] - rows_sum[b]);

  // todo: remove after testing.
  const inverse = ear.graph.invert_map(initial_face_order);
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (i === j) { continue; }
      const rule = matrix[i][j];
      if (rule === undefined) { continue; }
      const face_direction = normalize(inverse[i] - inverse[j]);
      if (rule !== face_direction) {
        console.log("found a violation", i, j, "should be", matrix[i][j], "but is", face_direction);
      }
    }
  }
  // console.log("vertex 3 rules", extract_common_rules(vertices_faces_layer[3]));
  // console.log("vertices_faces_layer", vertices_faces_layer);
  // console.log("relationships", relationships);
  // console.log("matrix 1", JSON.parse(JSON.stringify(matrix)));
  // console.log("matrix", matrix);
  // console.log("rows_sum", rows_sum);
  // console.log("initial_face_order", initial_face_order);

  return ear.graph.invert_map(initial_face_order);
};

export default make_faces_layer;
