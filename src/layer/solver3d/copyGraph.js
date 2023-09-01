/**
 * Rabbit Ear (c) Kraft
 */
import { resize } from "../../math/vector.js";
import { multiplyMatrix4Vector3 } from "../../math/matrix4.js";
import { subgraphWithFaces } from "../../graph/subgraph.js";
import {
	filterKeysWithPrefix,
	edgeFoldAngleIsFlat,
} from "../../fold/spec.js";
/**
 * @description make copies of 
 */
export const graphGroupCopies = (graph, sets_faces, sets_transform) => {
	// transform point by a matrix, return result as 2D
	const transformTo2D = (matrix, point) => {
		const p = multiplyMatrix4Vector3(matrix, point);
		return [p[0], p[1]];
	};
	// make all vertices 3D in case they are not already
	const vertices_coords_3d = graph.vertices_coords
		.map(coord => resize(3, coord));
	// make shallow copies of the graph, one for every group
	const copies = sets_faces.map(faces => subgraphWithFaces(graph, faces));
	// transform all vertices_coords by the inverse transform
	// to bring them all into the XY plane. convert to 2D
	sets_transform.forEach((matrix, i) => {
		copies[i].vertices_coords = copies[i].vertices_coords
			.map((_, v) => transformTo2D(matrix, vertices_coords_3d[v]));
	});
	// non-flat edges are anything other than 0, -180, or +180 fold angles.
	const nonFlatEdges = graph.edges_foldAngle
		.map(edgeFoldAngleIsFlat)
		.map((flat, i) => (!flat ? i : undefined))
		.filter(a => a !== undefined);
	// all keys in the graph that start with "edges_"
	const edgesKeys = filterKeysWithPrefix(graph, "edges");
	// delete all non-flat edge information
	copies.forEach(copy => nonFlatEdges
		.forEach(e => edgesKeys
			.forEach(key => { delete copy[key][e]; })));
	// now, any arrays referencing edges (_edges) are out of sync with
	// the edge arrays themselves (edges_). Therefore this method really
	// isn't intended to be used outside of this higly specific context.
	return copies;
};
