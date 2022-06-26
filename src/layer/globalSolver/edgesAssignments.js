/**
 * Rabbit Ear (c) Kraft
 */
import { makeFacesWinding } from "../../graph/facesWinding";
import { makeEdgesFaces } from "../../graph/make";
import { invertMap } from "../../graph/maps";

export const facesLayerToEdgesAssignments = (graph, faces_layer) => {
	const edges_assignment = [];
	const faces_winding = makeFacesWinding(graph);
	// set boundary creases
	const edges_faces = graph.edges_faces
		? graph.edges_faces
		: makeEdgesFaces(graph);
	edges_faces.forEach((faces, e) => {
		if (faces.length === 1) { edges_assignment[e] = "B"; }
		if (faces.length === 2) {
			const windings = faces.map(f => faces_winding[f]);
			if (windings[0] === windings[1]) { return "F"; }
			const layers = faces.map(f => faces_layer[f]);
			const local_dir = layers[0] < layers[1];
			const global_dir = windings[0] ? local_dir : !local_dir;
			edges_assignment[e] = global_dir ? "V" : "M";
		}
	});  
	return edges_assignment;
};


// export const layer_conditions_to_edges_assignments = (graph, conditions) => {
//   const edges_assignment = [];
//   const faces_winding = makeFacesWinding(graph);
//   // set boundary creases
//   const edges_faces = graph.edges_faces
//     ? graph.edges_faces
//     : makeEdgesFaces(graph);
//  
//   return edges_assignment;
// };
