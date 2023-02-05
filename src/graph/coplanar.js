import math from "../math.js";
import { makeFacesNormal } from "./normals.js";
import { clusterScalars } from "../general/arrays.js";
import connectedComponents from "./connectedComponents.js";
import { invertMap } from "./maps.js";
/**
 * @description query whether two normalized vectors are parallel, which
 * includes the case where they are exactly 180 degrees from one another.
 */
const parallelNormalized = (v, u, epsilon = math.core.EPSILON) => 1 - Math
	.abs(math.core.dot(v, u)) < epsilon;
/**
 * @description Cluster the faces of a graph into groups of face indices where
 * all faces in the same group lie in the same plane in 3D (but are not
 * required to overlap).
 * @param {FOLD} graph a FOLD object
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {object[]} an array of cluster objects where each cluster contains:
 * a normal vector, a list of face indices, and a matching list indicating
 * if the face shares the normal vector or the face is flipped 180 degrees.
 */
export const coplanarFacesGroups = ({
	vertices_coords, faces_vertices,
}, epsilon = math.core.EPSILON) => {
	const faces_normal = makeFacesNormal({ vertices_coords, faces_vertices });
	// for every face, get the indices of all faces with matching normals
	const facesNormalMatch = faces_vertices.map(() => []);
	// todo: n^2. this should be able to be improved. possibly by sorting
	// their dot products, then walking the sorted array, but we have to watch
	// out for degenerate cases and a circular array.
	for (let a = 0; a < faces_vertices.length - 1; a += 1) {
		for (let b = a + 1; b < faces_vertices.length; b += 1) {
			if (a === b) { continue; }
			if (parallelNormalized(faces_normal[a], faces_normal[b], epsilon)) {
				facesNormalMatch[a].push(b);
				facesNormalMatch[b].push(a);
			}
		}
	}
	// create disjoint sets of faces which all share the same normal
	const facesNormalMatchCluster = connectedComponents(facesNormalMatch);
	const normalClustersFaces = invertMap(facesNormalMatchCluster)
		.map(el => (typeof el === "number" ? [el] : el));
	// for each cluster, choose one normal, this normal is now associated with the cluster.
	const normalClustersNormal = normalClustersFaces
		.map(faces => faces_normal[faces[0]]);
	// a face can be a part of a group if the normal is aligned, or 180 flipped.
	// true: aligned. false: flipped
	const faces_clusterAligned = [];
	normalClustersFaces.forEach((faces, i) => faces.forEach(f => {
		faces_clusterAligned[f] = math.core
			.dot(faces_normal[f], normalClustersNormal[i]) > 0;
	}));
	// using each cluster's shared normal, find the plane (dot prod) for each face
	const facesOneVertex = faces_vertices.map(fv => vertices_coords[fv[0]]);
	const normalClustersFacesDot = normalClustersFaces
		.map((faces, i) => faces
			.map(f => math.core.dot(facesOneVertex[f], normalClustersNormal[i])));
	// for every cluster of a shared normal, further divide into clusters where
	// each inner cluster contains faces which share the same plane
	const clustersClusters = normalClustersFacesDot
		.map((dots, i) => clusterScalars(dots)
			.map(cluster => cluster.map(index => normalClustersFaces[i][index])));
	// flatten the data one level, there is no need to return these as nested clusters.
	// before flattening, create a matching array of normals.
	const clustersNormal = clustersClusters
		.flatMap((cluster, i) => cluster
			.map(() => [...normalClustersNormal[i]]));
	const clusters = clustersClusters.flat();
	// console.log("facesNormalMatch", facesNormalMatch);
	// console.log("facesNormalMatchCluster", facesNormalMatchCluster);
	// console.log("normalClustersFaces", normalClustersFaces);
	// console.log("normalClustersNormal", normalClustersNormal);
	// console.log("facesOneVertex", facesOneVertex);
	// console.log("normalClustersFacesDot", normalClustersFacesDot);
	// console.log("faces_clusterAligned", faces_clusterAligned);
	// console.log("clusterClusters", clustersClusters);
	// console.log("cluster", clusters);
	// console.log("clusterNormal", clustersNormal);
	return clusters.map((faces, i) => ({
		normal: clustersNormal[i],
		faces,
		facesAligned: faces.map(f => faces_clusterAligned[f]),
	}));
};
