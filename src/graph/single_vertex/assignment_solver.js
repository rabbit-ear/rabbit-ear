/**
 * Rabbit Ear (c) Robby Kraft
 */
import layerSolver from "./layer_solver";

const get_unassigneds = (edges_assignment) => edges_assignment
  .map((_, i) => i)
  .filter(i => edges_assignment[i] === "U" || edges_assignment[i] === "u");

// sectors and assignments are fenceposted.
// sectors[i] is bounded by assignment[i] assignment[i + 1]
const all_possible_assignments = (assignments) => {
  const unassigneds = get_unassigneds(assignments);
  const permuts = Array.from(Array(2 ** unassigneds.length))
    .map((_, i) => i.toString(2))
    .map(l => Array(unassigneds.length - l.length + 1).join("0") + l)
    .map(str => Array.from(str).map(l => l === "0" ? "V" : "M"));
  const all = permuts.map(perm => {
    const array = assignments.slice();
    unassigneds.forEach((index, i) => { array[index] = perm[i]; })
    return array;
  });
  const count_m = all.map(a => a.filter(l => l === "M" || l === "m").length);
  const count_v = all.map(a => a.filter(l => l === "V" || l === "v").length);
  return all.filter((_, i) => Math.abs(count_m[i] - count_v[i]) === 2);
};

const assignment_solver = (sectors, assignments) => {
	if (assignments == null) {
		assignments = sectors.map(() => "U");
	}
  // consider doing a sectors test too...
  const possibilities = all_possible_assignments(assignments);
  const layers = possibilities.map(assigns => layerSolver(sectors, assigns));
  return possibilities
    .map((_, i) => i)
    .filter(i => layers[i].length > 0)
    .map(i => ({
      assignment: possibilities[i],
      layer: layers[i],
    }));
};

export default assignment_solver;
