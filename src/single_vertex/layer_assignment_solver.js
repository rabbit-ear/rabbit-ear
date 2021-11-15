/**
 * Rabbit Ear (c) Robby Kraft
 */
import layer_solver from "./layer_solver/index";
import maekawa_assignments from "./maekawa_assignments";
/**
 * faces and assignments are fencepost aligned. assignments precedes faces.
 *       faces: |-----(0)-----(1)-----(2)---- ... -(n-2)-------(n-1)-|
 * assignments: |-(0)-----(1)-----(2)-----(3) ... -------(n-1)-------|
 */
const layer_assignment_solver = (faces, assignments, epsilon) => {
	if (assignments == null) {
		assignments = faces.map(() => "U");
	}
	// enumerate all possible assignments by replacing "U" with both "M" and "V"
	const all_assignments = maekawa_assignments(assignments);
	const layers = all_assignments
		.map(assigns => layer_solver(faces, assigns, epsilon));
	return all_assignments
		.map((_, i) => i)
		.filter(i => layers[i].length > 0)
		.map(i => ({
			assignment: all_assignments[i],
			layer: layers[i],
		}));
};

export default layer_assignment_solver;
