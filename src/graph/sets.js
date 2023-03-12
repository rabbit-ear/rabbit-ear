// /**
//  * Rabbit Ear (c) Kraft
//  */
// import math from "../math.js";
// import connectedComponents from "./connectedComponents.js";
// import { invertMap } from "./maps.js";
// import { coplanarFacesGroups } from "./coplanar.js";
// /**
//  * @description For every face, gather all other faces which not only lie in
//  * the same plane in 3D space, but also overlap this face.
//  * @param {FOLD} graph a FOLD object
//  * @param {number} [epsilon=1e-6] an optional epsilon
//  * @returns {number[][]} an array matching the length of faces, for every face,
//  * the list of indices of faces which overlap this face.
//  * @linkcode Origami ./src/graph/sets.js 15
//  */
// export const disjointFacePlaneSets = ({
// 	vertices_coords, faces_vertices,
// }, epsilon = math.EPSILON) => {
// 	const coplanarFaces = coplanarFacesGroups({ vertices_coords, faces_vertices }, epsilon);
// 	// before we go too far, make a reverse lookup for fast-access of the above data
// 	const faces_coplanarIndex = [];
// 	coplanarFaces.forEach((cluster, i) => cluster.faces
// 		.forEach(f => { faces_coplanarIndex[f] = i; }));
// 	// for every face, is the face's normal aligned with the group's normal?
// 	// true: aligned, false: flipped 180 degrees (the only options. these faces are planar)
// 	// this also indicates if the winding is counterclockwise (true) or clockwise (false)
// 	const faces_winding = [];
// 	coplanarFaces.forEach(cluster => cluster.facesAligned
// 		.forEach((aligned, j) => { faces_winding[cluster.faces[j]] = aligned; }));
// 	// all polygon sets will be planar to each other, however the polygon-polygon
// 	// intersection algorithm is 2D only, so we just need to create a transform for
// 	// each cluster which rotates the plane in common with all faces into the XY plane.
// 	const targetVector = [0, 0, 1];
// 	const transforms = coplanarFaces
// 		.map(cluster => cluster.plane.normal)
// 		.map(normal => {
// 			// if dot is -1, the points are already in XY plane and the normal is inverted.
// 			// the quaternion will be undefined, so we need a special case because
// 			// we still need the points to undergo a 180 degree flip over
// 			const dot = math.core.dot(normal, targetVector);
// 			return (Math.abs(dot + 1) < epsilon * 10)
// 				? math.core.makeMatrix4Rotate(Math.PI, [1, 0, 0])
// 				: math.core
// 					.matrix4FromQuaternion(math.core
// 						.quaternionFromTwoVectors(normal, targetVector));
// 		});
// 	// make sure we are using 3D points for this next part
// 	const vertices_coords3D = vertices_coords
// 		.map(coord => math.core.resize(3, coord));
// 	// polygon-polygon intersection requires faces be the same winding.
// 	// if the normal is flipped from the group normal, reverse the winding
// 	const polygons3D = coplanarFaces
// 		.map(cluster => cluster.faces
// 			.map((f, i) => (cluster.facesAligned[i]
// 				? faces_vertices[f]
// 				: faces_vertices[f].slice().reverse()))
// 			.map(verts => verts.map(v => vertices_coords3D[v])));
// 	// rotate the polygon into the XY plane (though it will still be translated
// 	// in the +/- Z axis), so we just remove the Z value.
// 	const polygons2D = polygons3D
// 		.map((cluster, i) => cluster
// 			.map(points => points
// 				.map(point => math.core.multiplyMatrix4Vector3(transforms[i], point))
// 				.map(point => [point[0], point[1]])));
// 	// todo: we can store and return the actual polygon that is the overlap
// 	// of the two faces. which would be used in some folding algorithms.
// 	const faces_facesOverlap = faces_vertices.map(() => []);
// 	polygons2D.forEach((polygons, c) => {
// 		for (let i = 0; i < polygons.length - 1; i += 1) {
// 			for (let j = i + 1; j < polygons.length; j += 1) {
// 				const clip = math.core.clipPolygonPolygon(polygons[i], polygons[j]);
// 				if (clip !== undefined) {
// 					const faces = [coplanarFaces[c].faces[i], coplanarFaces[c].faces[j]];
// 					faces_facesOverlap[faces[0]].push(faces[1]);
// 					faces_facesOverlap[faces[1]].push(faces[0]);
// 				}
// 			}
// 		}
// 	});
// 	// console.log("faces_facesOverlap", faces_facesOverlap);
// 	const faces_group = connectedComponents(faces_facesOverlap);
// 	// console.log("faces_group", faces_group);
// 	const groups_faces = invertMap(faces_group)
// 		.map(el => (typeof el === "number" ? [el] : el));
// 	// console.log("coplanarFaces", coplanarFaces);
// 	// console.log("transforms", transforms);
// 	// console.log("polygons3D", polygons3D);
// 	// console.log("polygons2D", polygons2D);
// 	// console.log("faces_facesOverlap", faces_facesOverlap);
// 	// console.log("faces_group", faces_group);
// 	// console.log("groups_faces", groups_faces);
// 	return {
// 		groups_plane: groups_faces
// 			.map(faces => coplanarFaces[faces_coplanarIndex[faces[0]]].plane),
// 		groups_transformXY: groups_faces.map(faces => transforms[faces_coplanarIndex[faces[0]]]),
// 		// groups_normal: groups_faces
// 		// 	.map(faces => coplanarFaces[faces_coplanarIndex[faces[0]]].normal),
// 		faces_group: faces_group,
// 		faces_winding,
// 		faces_facesOverlap,
// 	};
// };
