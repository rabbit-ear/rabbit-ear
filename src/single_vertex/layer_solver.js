/**
 * Rabbit Ear (c) Robby Kraft
 */
import get_sectors_layer from "./sectors_layer/index";
import maekawa_assignments from "./maekawa_assignments";

// sectors and assignments are fenceposted.
// sectors[i] is bounded by assignment[i] assignment[i + 1]
const layer_solver = (sectors, assignments, epsilon) => {
	if (assignments == null) {
		assignments = sectors.map(() => "U");
	}
	// consider doing a sectors test too...
	const possibilities = maekawa_assignments(assignments);
	const layers = possibilities
		.map(assigns => get_sectors_layer(sectors, assigns, epsilon));
	// console.log("layer solver", possibilities, layers);
	return possibilities
		.map((_, i) => i)
		.filter(i => layers[i].length > 0)
		.map(i => ({
			assignment: possibilities[i],
			layer: layers[i],
		}));
};

export default layer_solver;

