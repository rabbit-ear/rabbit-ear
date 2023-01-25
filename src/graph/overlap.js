/**
 * Rabbit Ear (c) Kraft
 */
import math from "../math";
import {
	clusterScalars,
} from "../general/arrays";
import connectedComponents from "./connectedComponents";
import { invertMap } from "./maps";
import {
	makeEdgesVector,
	makeEdgesBoundingBox,
} from "./make";
import { makeFacesNormal } from "./normals";
// import { makeEdgesEdgesSimilar } from "./edgesEdges";
import { makeFacesWinding } from "./facesWinding";
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
/**
 * @description For every face, gather all other faces which not only lie in
 * the same plane in 3D space, but also overlap this face.
 * @param {FOLD} graph a FOLD object
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {number[][]} an array matching the length of faces, for every face,
 * the list of indices of faces which overlap this face.
 */
export const overlappingFacesGroups = ({
	vertices_coords, faces_vertices,
}, epsilon = math.core.EPSILON) => {
	const coplanarFaces = coplanarFacesGroups({ vertices_coords, faces_vertices }, epsilon);
	// before we go too far, make a reverse lookup for fast-access of the above data
	const faces_coplanarIndex = [];
	coplanarFaces.forEach((cluster, i) => cluster.faces
		.forEach(f => { faces_coplanarIndex[f] = i; }));
	// for every face, is the face's normal aligned with the group's normal?
	// true: aligned, false: flipped 180 degrees (the only options. these faces are planar)
	// this also indicates if the winding is counterclockwise (true) or clockwise (false)
	const faces_winding = [];
	coplanarFaces.forEach(cluster => cluster.facesAligned
		.forEach((aligned, j) => { faces_winding[cluster.faces[j]] = aligned; }));
	// all polygon sets will be planar to each other, however the polygon-polygon
	// intersection algorithm is 2D only, so we just need to create a transform for
	// each cluster which rotates the plane in common with all faces into the XY plane.
	const targetVector = [0, 0, 1];
	const transforms = coplanarFaces
		.map(cluster => math.core.resize(3, cluster.normal))
		.map(normal => {
			// if dot is -1, the points are already in XY plane and the normal is inverted.
			// the quaternion will be undefined, so we need a special case because
			// we still need the points to undergo a 180 degree flip over
			const dot = math.core.dot(normal, targetVector);
			return (Math.abs(dot + 1) < epsilon * 10)
				? math.core.makeMatrix4Rotate(Math.PI, [1, 0, 0])
				: math.core
					.matrix4FromQuaternion(math.core
						.quaternionFromTwoVectors(normal, targetVector));
		});
	// make sure we are using 3D points for this next part
	const vertices_coords3D = vertices_coords
		.map(coord => math.core.resize(3, coord));
	// polygon-polygon intersection requires faces be the same winding.
	// if the normal is flipped from the group normal, reverse the winding
	const polygons3D = coplanarFaces
		.map(cluster => cluster.faces
			.map((f, i) => (cluster.facesAligned[i]
				? faces_vertices[f]
				: faces_vertices[f].slice().reverse()))
			.map(verts => verts.map(v => vertices_coords3D[v])));
	// rotate the polygon into the XY plane (though it will still be translated
	// in the +/- Z axis), so we just remove the Z value.
	const polygons2D = polygons3D
		.map((cluster, i) => cluster
			.map(points => points
				.map(point => math.core.multiplyMatrix4Vector3(transforms[i], point))
				.map(point => [point[0], point[1]])));
	// todo: we can store and return the actual polygon that is the overlap
	// of the two faces. which would be used in some folding algorithms.
	const faces_facesOverlap = faces_vertices.map(() => []);
	polygons2D.forEach((polygons, c) => {
		for (let i = 0; i < polygons.length - 1; i += 1) {
			for (let j = i + 1; j < polygons.length; j += 1) {
				const clip = math.core.clipPolygonPolygon(polygons[i], polygons[j]);
				if (clip !== undefined) {
					const faces = [coplanarFaces[c].faces[i], coplanarFaces[c].faces[j]];
					faces_facesOverlap[faces[0]].push(faces[1]);
					faces_facesOverlap[faces[1]].push(faces[0]);
				}
			}
		}
	});
	const faces_group = connectedComponents(faces_facesOverlap);
	const groups_faces = invertMap(faces_group)
		.map(el => (typeof el === "number" ? [el] : el));
	// console.log("coplanarFaces", coplanarFaces);
	// console.log("transforms", transforms);
	// console.log("polygons3D", polygons3D);
	// console.log("polygons2D", polygons2D);
	// console.log("faces_facesOverlap", faces_facesOverlap);
	// console.log("faces_group", faces_group);
	// console.log("groups_faces", groups_faces);
	return {
		groups_plane: groups_faces.map(faces => ({
			normal: coplanarFaces[faces_coplanarIndex[faces[0]]].normal,
			origin: vertices_coords3D[faces_vertices[faces[0]][0]],
		})),
		groups_transformXY: groups_faces.map(faces => transforms[faces_coplanarIndex[faces[0]]]),
		// groups_normal: groups_faces
		// 	.map(faces => coplanarFaces[faces_coplanarIndex[faces[0]]].normal),
		faces_group: faces_group,
		faces_winding,
		faces_facesOverlap,
	};
};
/**
 * @description Return an ExF matrix (number of: E=edges, F=faces), relating every edge
 * to every face. Value will contain true if the edge and face overlap each other, excluding
 * the space around the edge's endpoints, and the edges of the face.
 * @param {FOLD} graph a FOLD object
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {boolean[][]} matrix relating edges to faces, answering, do they overlap?
 * @linkcode Origami ./src/graph/overlap.js 199
 */
export const makeEdgesFacesOverlap = ({
	vertices_coords, edges_vertices, edges_vector, edges_faces, faces_vertices,
}, epsilon) => {
	if (!edges_vector) {
		edges_vector = makeEdgesVector({ vertices_coords, edges_vertices });
	}
	const faces_winding = makeFacesWinding({ vertices_coords, faces_vertices });
	// use graph vertices_coords for edges vertices
	const edges_origin = edges_vertices.map(verts => vertices_coords[verts[0]]);
	// const edges_similar = makeEdgesEdgesSimilar({ vertices_coords, edges_vertices });
	const edges_coords = edges_vertices
		.map(verts => verts.map(v => vertices_coords[v]));
	const faces_coords = faces_vertices
		.map(verts => verts.map(v => vertices_coords[v]));
	faces_winding.forEach((winding, i) => {
		if (!winding) {
			faces_coords[i].reverse();
		}
	});

	// the result object
	const matrix = edges_vertices
		.map(() => faces_vertices
			.map(() => undefined));
	// edges which define a face are already known to not-overlap
	edges_faces.forEach((faces, e) => faces
		.forEach(f => { matrix[e][f] = false; }));

	// quick bounding box test to eliminate non-overlapping axis-aligned areas
	// todo improve n^2
	const edges_bounds = makeEdgesBoundingBox({ edges_coords });
	const faces_bounds = faces_coords
		.map(coords => math.core.boundingBox(coords));
	edges_bounds.forEach((edge_bounds, e) => faces_bounds.forEach((face_bounds, f) => {
		if (matrix[e][f] === false) { return; }
		if (!math.core.overlapBoundingBoxes(face_bounds, edge_bounds)) {
			matrix[e][f] = false;
		}
	}));

	edges_coords.forEach((edge_coords, e) => faces_coords.forEach((face_coords, f) => {
		if (matrix[e][f] !== undefined) { return; }
		const point_in_poly = edges_coords[e]
			.map(point => math.core.overlapConvexPolygonPoint(
				faces_coords[f],
				point,
				math.core.exclude,
				epsilon,
			)).reduce((a, b) => a || b, false);
		if (point_in_poly) { matrix[e][f] = true; return; }
		const edge_intersect = math.core.intersectConvexPolygonLine(
			faces_coords[f],
			edges_vector[e],
			edges_origin[e],
			math.core.excludeS,
			math.core.excludeS,
			epsilon,
		);
		if (edge_intersect) { matrix[e][f] = true; return; }
		matrix[e][f] = false;
	}));

	// faster code. todo: switch this out for the block just above here
	// but refactor so that we use forEach instead of for()
	// const finished_edges = {};
	// for (let e = 0; e < matrix.length; e += 1) {
	// 	if (finished_edges[e]) { continue; }
	// 	for (let f = 0; f < matrix[e].length; f += 1) {
	// 		if (matrix[e][f] !== undefined) { continue; }
	// 		const point_in_poly = edges_coords[e]
	// 			.map(point => math.core.overlapConvexPolygonPoint(
	// 				faces_coords[f],
	// 				point,
	// 				math.core.exclude,
	// 				epsilon,
	// 			)).reduce((a, b) => a || b, false);
	// 		if (point_in_poly) { matrix[e][f] = true; continue; }
	// 		const edge_intersect = math.core.intersectConvexPolygonLine(
	// 			faces_coords[f],
	// 			edges_vector[e],
	// 			edges_origin[e],
	// 			math.core.excludeS,
	// 			math.core.excludeS,
	// 			epsilon,
	// 		);
	// 		if (edge_intersect) { matrix[e][f] = true; continue; }
	// 		matrix[e][f] = false;
	// 	}
	// 	edges_similar[e].forEach(adjacent_edge => {
	// 		matrix[adjacent_edge] = matrix[e].slice();
	// 		finished_edges[adjacent_edge] = true;
	// 	});
	// }

	// old code
	// matrix.forEach((row, e) => row.forEach((val, f) => {
	// 	if (val === false) { return; }
	// 	// both segment endpoints, true if either one of them is inside the face.
	// 	const point_in_poly = edges_coords[e]
	// 		.map(point => math.core.overlapConvexPolygonPoint(
	// 			faces_coords[f],
	// 			point,
	// 			math.core.exclude,
	// 			epsilon,
	// 		)).reduce((a, b) => a || b, false);
	// 	if (point_in_poly) { matrix[e][f] = true; return; }
	// 	const edge_intersect = math.core.intersectConvexPolygonLine(
	// 		faces_coords[f],
	// 		edges_vector[e],
	// 		edges_origin[e],
	// 		math.core.excludeS,
	// 		math.core.excludeS,
	// 		epsilon,
	// 	);
	// 	if (edge_intersect) { matrix[e][f] = true; return; }
	// 	matrix[e][f] = false;
	// }));
	return matrix;
};

// const makeFacesFacesOverlap = ({ vertices_coords, faces_vertices }, epsilon = math.core.EPSILON) => {
//   const matrix = Array.from(Array(faces_vertices.length))
//     .map(() => Array.from(Array(faces_vertices.length)));
//   const faces_polygon = makeFacesPolygon({ vertices_coords, faces_vertices }, epsilon);
//   for (let i = 0; i < faces_vertices.length - 1; i++) {
//     for (let j = i + 1; j < faces_vertices.length; j++) {
//       const intersection = math.core.intersect_polygon_polygon(
//         faces_polygon[i],
//         faces_polygon[j],
//         // math.core.exclude,
//         epsilon);
//       console.log("testing", faces_polygon[i], faces_polygon[j], intersection, epsilon);
//       const overlap = intersection.length !== 0;
//       matrix[i][j] = overlap;
//       matrix[j][i] = overlap;
//     }
//   }
//   return matrix;
// };
/**
 * @description Compare every face to every face to answer: do the two faces overlap?
 * Return the result in the form of a matrix, an array of arrays of booleans,
 * where both halves of the matrix are filled, matrix[i][j] === matrix[j][i].
 * @param {FOLD} graph a FOLD object
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {boolean[][]} face-face matrix answering: do they overlap?
 * @linkcode Origami ./src/graph/overlap.js 347
 */
export const getFacesFaces2DOverlap = ({
	vertices_coords, faces_vertices,
}, epsilon = math.core.EPSILON) => {
	const matrix = Array.from(Array(faces_vertices.length))
		.map(() => Array.from(Array(faces_vertices.length)));
	const faces_coords = faces_vertices
		.map(verts => verts.map(v => vertices_coords[v]));
	const faces_bounds = faces_coords
		.map(polygon => math.core.boundingBox(polygon));

	for (let i = 0; i < faces_bounds.length - 1; i += 1) {
		for (let j = i + 1; j < faces_bounds.length; j += 1) {
			if (!math.core.overlapBoundingBoxes(faces_bounds[i], faces_bounds[j])) {
				matrix[i][j] = false;
				matrix[j][i] = false;
			}
		}
	}

	const faces_polygon = faces_coords
		.map(polygon => math.core.makePolygonNonCollinear(polygon, epsilon));
	for (let i = 0; i < faces_vertices.length - 1; i += 1) {
		for (let j = i + 1; j < faces_vertices.length; j += 1) {
			if (matrix[i][j] === false) { continue; }
			const overlap = math.core.overlapConvexPolygons(
				faces_polygon[i],
				faces_polygon[j],
				epsilon,
			);
			matrix[i][j] = overlap;
			matrix[j][i] = overlap;
		}
	}
	return matrix;
};
