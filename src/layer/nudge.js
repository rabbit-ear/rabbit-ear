import { makeFacesNormal } from "../graph/normals";
import { invertMap } from "../graph/maps";
import topologicalOrder from "./topological";
import { getDisjointedVertices } from "../graph/sets";

export const nudgeVerticesWithFacesLayer = ({ faces_layer }) => {
	const result = [];
	const layers_face = invertMap(faces_layer);
	layers_face.forEach((face, layer) => {
		result[face] = {
			vector: [0, 0, 1],
			layer,
		};
	});
	return result;
};

export const nudgeVerticesWithFaceOrders = ({ vertices_coords, faces_vertices, faceOrders }) => {
	const faces_normal = makeFacesNormal({ vertices_coords, faces_vertices });
	const sets_faces = getDisjointedVertices({
		edges_vertices: faceOrders.map(ord => [ord[0], ord[1]]),
	});
	const sets_layers_face = sets_faces
		.map(faces => topologicalOrder({ faceOrders, faces_normal }, faces));
	const sets_normals = sets_faces.map(faces => faces_normal[faces[0]]);
	const result = [];
	sets_layers_face.forEach((set, i) => set.forEach((face, index) => {
		result[face] = {
			vector: sets_normals[i],
			layer: index,
		};
	}));
	// console.log("sets_faces", sets_faces);
	// console.log("sets_normals", sets_normals);
	// console.log("sets_layers_face", sets_layers_face);
	return result;
};

// export const nudgeVerticesWithFaceOrdersOld = ({ vertices_coords, faces_vertices, faceOrders }, normals) => {
// 	const sets_faces = ear.graph.getDisjointedVertices({ edges_vertices: faceOrders.map(tri => [tri[0], tri[1]]) });
// 	const sets_single_face = sets_faces.map(faces => faces[0]);
// 	const sets_normal = sets_single_face.map(face => normals[face]);
// 	console.log("sets_faces", sets_faces);
// 	console.log("sets_normal", sets_normal);
// 	const faces_set_hash = {};
// 	sets_faces.forEach((faces, i) => faces.forEach(f => {
// 		faces_set_hash[f] = i;
// 	}));
// 	const faces_set = [];
// 	Object.keys(faces_set_hash).map(n => parseInt(n, 10)).forEach(f => {
// 		faces_set[f] = faces_set_hash[f];
// 	});
// 	console.log("faces_set", faces_set);
// };
