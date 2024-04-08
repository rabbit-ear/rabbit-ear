/**
 * Rabbit Ear (c) Kraft
 */
/**
 * faces and assignments are fencepost aligned. assignments precedes faces.
 *       faces: |-----(0)-----(1)-----(2)---- ... -(n-2)-------(n-1)-|
 * assignments: |-(0)-----(1)-----(2)-----(3) ... -------(n-1)-------|
 */
/**
 * these are the only creases that change the direction of the paper
 */
const change_map = {
	V: true, v: true, M: true, m: true,
};
/**
 * @description convert a list of assignments into an array of
 * booleans stating if that face between the pair of assignments
 * has been flipped (true) or not (false). the first face is false.
 *
 * another way of saying this is if a face is "false", the face is
 * moving to the right, if "true" moving to the left.
 */
export const assignmentsToFacesFlip = (assignments) => {
	let counter = 0;
	// because fencepost, and we are hard-coding the first face to be false,
	// we don't need to append the first post back to the end of this slice.
	const shifted_assignments = assignments.slice(1);
	// globally, the location that each fold takes place along the +X
	return [false].concat(shifted_assignments
		.map(a => (change_map[a] ? ++counter : counter))
		.map(count => count % 2 === 1));
};
/**
 * model the movement of layers above or below the previous layer after a fold.
 * valley fold sets the paper above the previous sector (and mountain below),
 * but a valley fold AFTER a valley fold moves the paper below.
 */
const up_down = {
	V: 1, v: 1, M: -1, m: -1,
};
const upOrDown = (mv, i) => (i % 2 === 0
	? (up_down[mv] || 0)
	: -(up_down[mv] || 0));
/**
 * @description convert a list of assignments into an array of
 * numbers stating if that face between the pair of assignments
 * has been raised above or below the previous face in the +Z axis.
 *
 * +1 means this face lies above the previous face, -1 below.
 * the first face implicitly starts at 0.
 *
 * These values describe the relationship between the current index
 * and the next face (i + 1)%length index. and it describes the location
 * of the second of the pair.
 * index [0] indicates how face [1] is above/below face[0].
 * @returns {number[]} unit directionality. +1 for up, -1 down
 */
export const assignmentsToFacesVertical = (assignments) => {
	let iterator = 0;
	// because fencepost, we are relating assignments[1] to face[0]
	return assignments
		.slice(1)
		.concat([assignments[0]])
		.map(a => {
			const updown = upOrDown(a, iterator);
			iterator += up_down[a] === undefined ? 0 : 1;
			return updown;
		});
};
