import math from "../../math";
import {
	nudgeVerticesWithFaceOrders,
	nudgeVerticesWithFacesLayer,
} from "../../layer/nudge";
import count from "../../graph/count";
import countImplied from "../../graph/countImplied";
import { triangulate } from "../../graph/triangulate";
import { explode } from "../../graph/explodeFaces";

// const LAYER_NUDGE = 1e-4;
const LAYER_NUDGE = 1e-5;
// const LAYER_NUDGE = 12e-6;

export const makeExplodedGraph = (graph, layerNudge = LAYER_NUDGE) => {
	const exploded = JSON.parse(JSON.stringify(graph));
	// we render "J" joined edges differently from all others. if edges_assignment
	// doesn't exist, make it with all assignments set to "U".
	// the user will never see this data, it's just for visualization.
	if (!exploded.edges_assignment) {
		const edgeCount = count.edges(graph) || countImplied.edges(graph);
		exploded.edges_assignment = Array(edgeCount).fill("U");
	}
	let faces_nudge = [];
	if (exploded.faceOrders) {
		faces_nudge = nudgeVerticesWithFaceOrders(exploded);
	} else if (exploded.faces_layer) {
		faces_nudge = nudgeVerticesWithFacesLayer(exploded);
	}
	// console.log("faces_nudge", faces_nudge);
	const change = triangulate(exploded);
	const change2 = explode(exploded);
	Object.assign(change, change2);
	// console.log("change", change);

	if (change.faces) {
		change.faces.map.forEach((oldFace, face) => {
			const nudge = faces_nudge[oldFace];
			if (!nudge) { return; }
			exploded.faces_vertices[face].forEach(v => {
				const vec = math.core.scale(nudge.vector, nudge.layer * layerNudge);
				exploded.vertices_coords[v] = math.core.add(
					math.core.resize(3, exploded.vertices_coords[v]),
					vec,
				);
			});
		});
	}
	return exploded;
};
