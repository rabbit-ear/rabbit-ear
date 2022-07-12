/**
 * Rabbit Ear (c) Kraft
 */
import layer_solver from "./index";
import maekawaAssignments from "../../singleVertex/maekawaAssignments";
/**
 * @name singleVertexAssignmentSolver
 * @description This extends the singleVertexSolver to also solve unassigned
 * assignments. The assignments parameter can be left empty entirely, or,
 * if you only know some assignments, place "U" in the unknown spots.
 * faces and assignments are fencepost aligned. assignments precedes faces.
 *       faces: |-----(0)-----(1)-----(2)---- ... -(n-2)-------(n-1)-|
 * assignments: |-(0)-----(1)-----(2)-----(3) ... -------(n-1)-------|
 * @param {number[]} orderedScalars an ordered list of scalars, the lengths of the faces
 * @param {string[]|undefined} assignments an array of single character assignment values
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {object[]} array of solutions where each solution contains
 * "layer" and "assignment", where layer is a "faces_layer" mapping, and assignment
 * is an array of assignment characters.
 */
const assignmentSolver = (orderedScalars, assignments, epsilon) => {
	if (assignments == null) {
		assignments = orderedScalars.map(() => "U");
	}
	// enumerate all possible assignments by replacing "U" with both "M" and "V"
	const all_assignments = maekawaAssignments(assignments);
	const layers = all_assignments
		.map(assigns => layer_solver(orderedScalars, assigns, epsilon));
	return all_assignments
		.map((_, i) => i)
		.filter(i => layers[i].length > 0)
		.map(i => ({
			assignment: all_assignments[i],
			layer: layers[i],
		}));
};

export default assignmentSolver;
