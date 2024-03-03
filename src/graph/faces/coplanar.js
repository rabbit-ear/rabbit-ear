/**
 * Rabbit Ear (c) Kraft
 */
import {
	EPSILON,
} from "../../math/constant.js";
import {
	dot,
	dot3,
	scale3,
	resize,
	parallelNormalized,
} from "../../math/vector.js";
import {
	makePolygonNonCollinear,
} from "../../math/polygon.js";
import {
	multiplyMatrix4Vector3,
} from "../../math/matrix4.js";
import {
	matrix4FromQuaternion,
	quaternionFromTwoVectors,
} from "../../math/quaternion.js";
import {
	overlapConvexPolygons,
} from "../../math/overlap.js";
import {
	makeFacesNormal,
} from "../normals.js";
import {
	clusterScalars,
} from "../../general/cluster.js";
import {
	connectedComponents,
} from "../connectedComponents.js";
import {
	invertArrayToFlatMap,
	invertFlatToArrayMap,
} from "../maps.js";
import {
	makeFacesFaces,
} from "../make.js";
import {
	selfRelationalArraySubset,
} from "../subgraph.js";

/**
 * @description Cluster the faces of a graph into groups of face indices where
 * all faces in the same group lie in the same plane in 3D.
 * Faces in the same plane are not required to overlap, only be coplanar.
 * @param {FOLD} graph a FOLD object
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {object[]} an array of cluster objects where each cluster contains:
 * a normal vector, a list of face indices, and a matching list indicating
 * if the face shares the normal vector or the face is flipped 180 degrees.
 */
export const coplanarFacesGroups = (
	{ vertices_coords, faces_vertices },
	epsilon = EPSILON,
) => {
	// face normals will be always 3D. These vectors are normalized.
	const faces_normal = makeFacesNormal({ vertices_coords, faces_vertices });

	// for every face, get the indices of all faces with matching normals
	const facesNormalMatch = faces_vertices.map(() => []);

	// todo: this is n^2.
	// We need to create a linear sorting of 3D vectors. Possibly we can project
	// all vectors onto one axis, sort and compare the non-degenerate vectors,
	// then gather all degenerate cases and run these at n^2.
	// also, the parallel test is non-directional, the sorted array should be
	// treated as a wrapping array, compare the start with the end.
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
	const normalClustersFaces = invertFlatToArrayMap(facesNormalMatchCluster);

	// for each cluster, choose one normal, this normal is now associated with the cluster.
	const normalClustersNormal = normalClustersFaces
		.map(faces => faces_normal[faces[0]]);

	// coplanar faces are clustered together even if their normals are flipped.
	// for each face, is this face's normal aligned (true) with the cluster's
	// normal, or is it 180deg flipped (false).
	const faces_clusterAligned = [];
	normalClustersFaces.forEach((faces, i) => faces.forEach(f => {
		faces_clusterAligned[f] = dot3(faces_normal[f], normalClustersNormal[i]) > 0;
	}));

	// using each cluster's shared normal, find the plane (dot prod)
	// for each face. make facesOneVertex always 3D.
	const facesOneVertex = faces_vertices
		.map(fv => vertices_coords[fv[0]])
		.map(point => resize(3, point));
	const normalClustersFacesDot = normalClustersFaces
		.map((faces, i) => faces
			.map(f => dot3(normalClustersNormal[i], facesOneVertex[f])));

	// for every cluster of a shared normal, further divide into clusters where
	// each inner cluster contains faces which share the same plane
	const clustersClusters = normalClustersFacesDot
		.map((dots, i) => clusterScalars(dots)
			.map(cluster => cluster.map(index => normalClustersFaces[i][index])));

	// flatten the data one level.
	// there is no need to return these as nested clusters.
	// before flattening, create a matching array of normals.
	const clustersNormal = clustersClusters
		.flatMap((cluster, i) => cluster
			.map(() => [...normalClustersNormal[i]]));
	const clusters = clustersClusters.flat();

	// get the point in the plane closest to the origin
	const clustersOrigin = clusters
		.map(faces => faces[0])
		.map(face => facesOneVertex[face])
		.map((point, i) => dot3(clustersNormal[i], point))
		.map((mag, i) => scale3(clustersNormal[i], mag));

	// make a plane with the origin and normal
	const clustersPlane = clusters.map((_, i) => ({
		normal: clustersNormal[i],
		origin: clustersOrigin[i],
	}));
	return clusters.map((faces, i) => ({
		faces,
		facesAligned: faces.map(f => faces_clusterAligned[f]),
		plane: clustersPlane[i],
	}));
};

/**
 *
 */
const makeFacesPolygon2D = (graph, coplanarFaces, transforms, epsilon) => {
	// make sure we are using 3D points for this next part
	const vertices_coords3D = graph.vertices_coords
		.map(coord => resize(3, coord));

	// polygon-polygon intersection requires faces be the same winding.
	// if the normal is flipped from the group normal, reverse the winding
	const planarSets_polygons3D = coplanarFaces
		.map(cluster => cluster.faces
			.map((f, i) => (cluster.facesAligned[i]
				? graph.faces_vertices[f]
				: graph.faces_vertices[f].slice().reverse()))
			.map(verts => verts.map(v => vertices_coords3D[v]))
			.map(polygon => makePolygonNonCollinear(polygon, epsilon)));

	// rotate the polygon to align with the XY plane (though it will still be
	// translated in the +/- Z axis), so we just remove the Z component.
	const faces_polygon = [];
	const planarSets_polygons2D = planarSets_polygons3D
		.map((cluster, i) => cluster
			.map(points => points
				.map(point => multiplyMatrix4Vector3(transforms[i], point))
				.map(point => [point[0], point[1]])));
	coplanarFaces
		.map(cluster => cluster.faces)
		.forEach((faces, i) => faces
			.forEach((face, j) => {
				faces_polygon[face] = planarSets_polygons2D[i][j];
			}));
	return faces_polygon;
};

/**
 * @description Cluster the faces of a graph into groups of face indices
 * where all faces in the same group both lie in the same plane and
 * overlap or are edge-connected to at least one face in the group.
 * @param {FOLD} graph a FOLD object
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {object} a large object containing:
 * - sets_plane: the plane defining each set
 * - sets_transformXY: the transform that takes each set's plane into the XY
 * - faces_set: for every face, which set does it belong to
 * - faces_winding: for every face, is it counterclockwise in the plane
 * - faces_facesOverlap: for every face, what are the other faces
 * which overlap this face.
 */
export const coplanarOverlappingFacesGroups = (
	{ vertices_coords, faces_vertices, faces_faces },
	epsilon = EPSILON,
) => {
	if (!faces_faces) {
		faces_faces = makeFacesFaces({ faces_vertices });
	}

	// get our initial groups of faces which share a common plane in 3D
	const coplanarFaces = coplanarFacesGroups(
		{ vertices_coords, faces_vertices },
		epsilon,
	);

	// each group will have a plane normal. within this plane, faces can be
	// aligned or flipped over, use this to build a winding for every face.
	// "faces_winding" can be one flat array, as faces will only ever be from
	// one group. the winding is in reference to this face's group's plane normal.
	const faces_winding = [];
	coplanarFaces.forEach(cluster => cluster.facesAligned
		.forEach((aligned, j) => { faces_winding[cluster.faces[j]] = aligned; }));

	// all polygon sets will be planar to each other, however the polygon-polygon
	// intersection algorithm is 2D only, so we just need to create a transform
	// for each cluster which rotates this cluster's plane into the XY plane.
	const targetVector = [0, 0, 1];
	const transforms = coplanarFaces
		.map(cluster => cluster.plane.normal)
		.map(normal => {
			// if dot is -1, this plane is already in the XY plane, but the plane's
			// normal and target are exactly 180deg flipped, meaning that the result of
			// the quaternion constructor will be undefined, in which case we manually
			// build a rotation matrix that rotates 180 degrees around the X axis.
			const d = dot(normal, targetVector);
			// 180 degree rotate around the X axis, or general rotation matrix
			return (Math.abs(d + 1) < 1e-2)
				? [1, 0, 0, 0, 0, -1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1]
				: matrix4FromQuaternion(quaternionFromTwoVectors(normal, targetVector));
		});

	const faces_polygon = makeFacesPolygon2D(
		{ vertices_coords, faces_vertices },
		coplanarFaces,
		transforms,
		epsilon,
	);

	// for each group, create a faces_faces which only includes
	// those faces inside each group producing an array with holes
	const planarSets_faces_faces = coplanarFaces
		.map(el => el.faces)
		.map(faces => selfRelationalArraySubset(faces_faces, faces));

	// for each planar group, make another group subset that includes only faces
	// which are connected to each other through the graph.
	//
	// uh oh. is this causing issues.
	const planarSets_faces_set = planarSets_faces_faces
		.map(f_f => connectedComponents(f_f));

	// merge groups (within a common plane) if an overlap exists
	// between any two faces in either group.
	const planarSets_sets_faces = planarSets_faces_set
		.map(faces => invertFlatToArrayMap(faces));

	// merge groups if they are overlapping
	const planarSets_disjointSetsOtherFaces = planarSets_faces_set
		.map(faces_group => {
			const faces = faces_group.map((_, i) => i);
			return faces_group.map(groupIndex => faces
				.filter(face => faces_group[face] !== groupIndex));
		});

	//
	const faces_facesOverlap = faces_vertices.map(() => []);
	planarSets_disjointSetsOtherFaces
		.forEach(planarSet => planarSet.forEach((otherFaces, face) => {
			for (let f = 0; f < otherFaces.length; f += 1) {
				const otherFace = otherFaces[f];
				const polygons = [face, otherFace]
					.map(i => faces_polygon[i]);
				const overlap = overlapConvexPolygons(...polygons, epsilon);
				if (overlap) {
					faces_facesOverlap[face][otherFace] = true;
					faces_facesOverlap[otherFace][face] = true;
				}
			}
		}));

	//
	const planarSets_overlapping_faces_faces = planarSets_disjointSetsOtherFaces
		.map(group => group.map((faces, f) => faces.filter(face => faces_facesOverlap[f][face])));

	//
	const planarSets_overlapping_sets_sets = [];
	planarSets_overlapping_faces_faces
		.forEach((overlapFaces_faces, s) => {
			planarSets_overlapping_sets_sets[s] = [];
			overlapFaces_faces.forEach((values, key) => {
				const thisSet = planarSets_faces_set[s][key];
				const otherSets = values.map(f => planarSets_faces_set[s][f]);
				if (!planarSets_overlapping_sets_sets[s][thisSet]) {
					planarSets_overlapping_sets_sets[s][thisSet] = new Set();
				}
				otherSets.forEach(v => {
					if (!planarSets_overlapping_sets_sets[s][v]) {
						planarSets_overlapping_sets_sets[s][v] = new Set();
					}
				});
				otherSets.forEach(v => {
					planarSets_overlapping_sets_sets[s][thisSet].add(v);
					planarSets_overlapping_sets_sets[s][v].add(thisSet);
				});
			});
		});

	//
	planarSets_overlapping_sets_sets
		.forEach((sets, i) => sets
			.forEach((set, j) => {
				planarSets_overlapping_sets_sets[i][j] = [...set];
			}));

	//
	const planarSets_disjointSetsSets = planarSets_overlapping_sets_sets
		.map(set_set => invertFlatToArrayMap(connectedComponents(set_set)));

	// originalSet refers to "coplanarFaces", the result from
	// coplanarFacesGroups(). this relates a new set (index) to the
	// coplanarFaces set that it came from (value).
	const newSets_originalSet = planarSets_disjointSetsSets
		.flatMap((arrays, i) => arrays.map(() => i));

	//
	const planarSets_faces = coplanarFaces
		.map((el, i) => planarSets_disjointSetsSets[i]
			.map(set => set.flatMap(s => planarSets_sets_faces[i][s])));

	//
	const coplanarOverlappingFaces = planarSets_faces
		.flatMap((set, s) => set
			.map(faces => ({
				faces,
				facesAligned: faces.map(f => faces_winding[f]),
				plane: coplanarFaces[s].plane,
			})));

	// return values
	const sets_plane = newSets_originalSet.map(i => coplanarFaces[i].plane);
	const sets_transformXY = newSets_originalSet.map(i => transforms[i]);
	const sets_faces = coplanarOverlappingFaces.map(sets => sets.faces);
	const faces_set = invertArrayToFlatMap(sets_faces);

	// console.log("planarSets_polygons3D", planarSets_polygons3D);
	// console.log("planarSets_polygons2D", planarSets_polygons2D);
	// console.log("faces_polygon", faces_polygon);
	// console.log("coplanarFaces", coplanarFaces);
	// console.log("sets_faces", sets_faces);
	// console.log("faces_set", faces_set);
	// console.log("planarSets_faces_faces", planarSets_faces_faces);
	// console.log("planarSets_faces_set", planarSets_faces_set);
	// console.log("planarSets_sets_faces", planarSets_sets_faces);
	// console.log("planarSets_disjointSetsOtherFaces", planarSets_disjointSetsOtherFaces);
	// console.log("faces_facesOverlap", faces_facesOverlap);
	// console.log("planarSets_overlapping_faces_faces", planarSets_overlapping_faces_faces);
	// console.log("planarSets_overlapping_sets_sets", planarSets_overlapping_sets_sets);
	// console.log("planarSets_disjointSetsSets", planarSets_disjointSetsSets);
	// console.log("planarSets_faces", planarSets_faces);
	// console.log("coplanarOverlappingFaces", coplanarOverlappingFaces);
	// console.log("newSets_originalSet", newSets_originalSet);

	return {
		sets_faces,
		sets_plane,
		sets_transformXY,
		faces_set,
		faces_winding,
		// faces_facesOverlap: faces_facesOverlapAll
		// // faces_facesOverlap: faces_facesOverlap
		// 	.map(overlap => overlap
		// 		.map((_, i) => i)
		// 		.filter(a => a !== undefined)),
	};
};
