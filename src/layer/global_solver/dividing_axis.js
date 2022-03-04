import math from "../../math";
import { make_faces_center_quick } from "../../graph/make";
/**
 * @description {object} unlike most methods in the layer solver, "graph"
 * here refers to the crease pattern, not the folded form
 */
const dividing_axis = (graph, line, conditions) => {
	const faces_side = make_faces_center_quick(graph)
		.map(center => math.core.subtract2(center, line.origin))
		.map(vector => math.core.cross2(line.vector, vector))
		.map(cross => Math.sign(cross));
	const sides = Object.keys(conditions)
		.map(key => {
			const pair = key.split(" ");
			if (conditions[key] === 0) { return }
			if (conditions[key] === 2) { pair.reverse(); }
			if (faces_side[pair[0]] === 1 && faces_side[pair[1]] === -1) {
				return true;
			}
			if (faces_side[pair[0]] === -1 && faces_side[pair[1]] === 1) {
				return false;
			}
			// pair of faces are on the same side of the axis
		}).filter(a => a !== undefined);
	const is_valid = sides.reduce((a, b) => a && (b === sides[0]), true);
	if (!is_valid) { console.warn("line is not a dividing axis"); return; }
	// there are two toggles going on. depending on the condition result (1 or 2)
	const side = sides[0];
	Object.keys(conditions)
		.forEach(key => {
			const pair = key.split(" ");
			if (conditions[key] !== 0) { return }
			if (faces_side[pair[0]] === faces_side[pair[1]]) { return; }
			if (faces_side[pair[0]] === 1 && faces_side[pair[1]] === -1) {
				if (side) { conditions[key] = 1; } // A is above B
				else      { conditions[key] = 2; } // B is above A
			}
			if (faces_side[pair[0]] === -1 && faces_side[pair[1]] === 1) {
				if (side) { conditions[key] = 2; } // B is above A
				else      { conditions[key] = 1; } // A is above B
			}
		});
};

export default dividing_axis;
