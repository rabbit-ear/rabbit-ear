/**
 * Rabbit Ear (c) Kraft
 */
import {
	scale3,
	add3,
	resize3,
} from "../../math/vector.js";
import {
	clone,
} from "../../general/clone.js";
import {
	nudgeFacesWithFaceOrders,
	nudgeFacesWithFacesLayer,
} from "../../graph/orders.js";
import {
	countEdges,
	countImpliedEdges,
} from "../../graph/count.js";
import {
	invertFlatMap,
} from "../../graph/maps.js";
import {
	triangulate,
} from "../../graph/triangulate.js";
import {
	explodeFaces,
} from "../../graph/explode.js";

const LAYER_NUDGE = 5e-6;

export const makeExplodedGraph = (graph, layerNudge = LAYER_NUDGE) => {
	// todo: remove the structured clone as long as everything is working.
	// update: shallow copy is not working. the input parameter is still modified.
	const copy = clone(graph);
	// const copy = { ...graph };
	// we render "J" joined edges differently from all others. if edges_assignment
	// doesn't exist, make it with all assignments set to "U".
	// the user will never see this data, it's just for visualization.
	if (!copy.edges_assignment) {
		const edgeCount = countEdges(copy) || countImpliedEdges(copy);
		copy.edges_assignment = Array(edgeCount).fill("U");
	}
	let faces_nudge = [];
	if (copy.faceOrders) {
		faces_nudge = nudgeFacesWithFaceOrders(copy);
	} else if (copy.faces_layer) {
		faces_nudge = nudgeFacesWithFacesLayer(copy);
	}
	// triangulate will modify faces and edges.
	// use face information to match data.
	const change = triangulate(copy);
	// explode will modify edges and vertices.
	// we don't need the return information for anything just yet.
	const exploded = explodeFaces(copy);
	// Object.assign(change, change2);

	if (change.faces) {
		const backmap = invertFlatMap(change.faces.map);
		backmap.forEach((oldFace, face) => {
			const nudge = faces_nudge[oldFace];
			if (!nudge) { return; }
			exploded.faces_vertices[face].forEach(v => {
				const vec = scale3(nudge.vector, nudge.layer * layerNudge);
				exploded.vertices_coords[v] = add3(
					resize3(exploded.vertices_coords[v]),
					vec,
				);
			});
		});
	}
	return exploded;
};
