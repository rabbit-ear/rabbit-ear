/**
 * Rabbit Ear (c) Kraft
 */
import {
	scale,
	add,
	resize,
} from "../../math/vector.js";
import {
	nudgeFacesWithFaceOrders,
	nudgeFacesWithFacesLayer,
} from "../../graph/orders.js";
import count from "../../graph/count.js";
import countImplied from "../../graph/countImplied.js";
import { invertMap } from "../../graph/maps.js";
import { triangulate } from "../../graph/triangulate.js";
import { explodeFaces } from "../../graph/explode.js";

const LAYER_NUDGE = 5e-6;

export const makeExplodedGraph = (graph, layerNudge = LAYER_NUDGE) => {
	// todo: remove the structured clone as long as everything is working.
	// const copy = structuredClone(graph);
	const copy = { ...graph };
	// we render "J" joined edges differently from all others. if edges_assignment
	// doesn't exist, make it with all assignments set to "U".
	// the user will never see this data, it's just for visualization.
	if (!copy.edges_assignment) {
		const edgeCount = count.edges(graph) || countImplied.edges(graph);
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
		const backmap = invertMap(change.faces.map);
		backmap.forEach((oldFace, face) => {
			const nudge = faces_nudge[oldFace];
			if (!nudge) { return; }
			exploded.faces_vertices[face].forEach(v => {
				const vec = scale(nudge.vector, nudge.layer * layerNudge);
				exploded.vertices_coords[v] = add(
					resize(3, exploded.vertices_coords[v]),
					vec,
				);
			});
		});
	}
	return exploded;
};
