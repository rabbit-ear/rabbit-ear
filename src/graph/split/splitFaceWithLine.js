/**
 * Rabbit Ear (c) Kraft
 */
import { EPSILON } from "../../math/constant.js";
import {
	includeL,
	excludeS,
} from "../../math/compare.js";
import { overlapLinePoint } from "../../math/overlap.js";
import { intersectLineLine } from "../../math/intersect.js";
import {
	distance,
	subtract,
	subtract2,
} from "../../math/vector.js";
import {
	sortVerticesCounterClockwise,
} from "../vertices/sort.js";
import {
	makeVerticesToEdgeBidirectional,
} from "../make.js";
import {
	mergeNextmaps,
	mergeBackmaps,
	invertFlatMap,
} from "../maps.js";
import {
	splitEdge,
} from "./splitEdge.js";
import remove from "../remove.js";
import Messages from "../../environment/messages.js";

/**
 * @description intersect a convex face with a line and return the location
 * of the intersections as components of the graph. this is an EXCLUSIVE
 * intersection. line collinear to the edge counts as no intersection.
 * there are 5 cases:
 * - no intersection (undefined)
 * - intersect one vertex (undefined)
 * - intersect two vertices (valid, or undefined if neighbors)
 * - intersect one vertex and one edge (valid)
 * - intersect two edges (valid)
 * @param {FOLD} graph a FOLD object
 * @param {number} face the index of the face
 * @param {number[]} vector the vector component describing the line
 * @param {number[]} origin a point that lies along the line
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {object|undefined} "vertices" and "edges" keys, indices of the
 * components which intersect the line. or undefined if no intersection
 * @linkcode Origami ./src/graph/intersect.js 162
 */
export const intersectConvexFaceLine = ({
	vertices_coords, edges_vertices, faces_vertices, faces_edges,
}, face, { vector, origin }, epsilon = EPSILON) => {
	// give us back the indices in the faces_vertices[face] array
	// we can count on these being sorted (important later)
	const face_vertices_indices = faces_vertices[face]
		.map(v => vertices_coords[v])
		.map(coord => overlapLinePoint({ vector, origin }, coord, () => true, epsilon))
		.map((overlap, i) => (overlap ? i : undefined))
		.filter(i => i !== undefined);
	// o-----o---o  we have to test against cases like this, where more than two
	// |         |  vertices lie along one line.
	// o---------o
	const vertices = face_vertices_indices.map(i => faces_vertices[face][i]);
	// concat a duplication of the array where the second array's vertices'
	// indices' are all increased by the faces_vertices[face].length.
	// ask every neighbor pair if they are 1 away from each other, if so, the line
	// lies along an outside edge of the convex poly, return "no intersection".
	// the concat is needed to detect neighbors across the end-beginning loop.
	const vertices_are_neighbors = face_vertices_indices
		.concat(face_vertices_indices.map(i => i + faces_vertices[face].length))
		.map((n, i, arr) => arr[i + 1] - n === 1)
		.reduce((a, b) => a || b, false);
	// if vertices are neighbors
	// because convex polygon, if collinear vertices lie along an edge,
	// it must be an outside edge. this case returns no intersection.
	if (vertices_are_neighbors) { return undefined; }
	if (vertices.length > 1) { return { vertices, edges: [] }; }
	// run the line-segment intersection on every side of the face polygon
	const edges = faces_edges[face]
		.map(edge => edges_vertices[edge]
			.map(v => vertices_coords[v]))
		.map(seg => intersectLineLine(
			{ vector, origin },
			{ vector: subtract2(seg[1], seg[0]), origin: seg[0] },
			includeL,
			excludeS,
			epsilon,
		).point).map((coords, face_edge_index) => ({
			coords,
			edge: faces_edges[face][face_edge_index],
		}))
		// remove edges with no intersection
		.filter(el => el.coords !== undefined)
		// remove edges which share a vertex with a previously found vertex.
		// these edges are because the intersection is near a vertex but also
		// intersects the edge very close to the end.
		.filter(el => !(vertices
			.map(v => edges_vertices[el.edge].includes(v))
			.reduce((a, b) => a || b, false)));
	// only return the case with 2 intersections. for example, only 1 vertex
	// intersection implies outside the polygon, collinear with one vertex.
	return (edges.length + vertices.length === 2
		? { vertices, edges }
		: undefined);
};

/**
 * @description A circular array (data wraps around) requires 2 indices
 * if you intend to split it into two arrays. The pair of indices can be
 * provided in any order, they will be sorted, smaller index first.
 * @param {any[]} array an array that is meant to be thought of as circular
 * @param {number[]} indices two numbers, indices that divide the array into 2 parts
 * @returns {any[][]} the same array split into two arrays
 * @linkcode Origami ./src/general/arrays.js 49
 */
const splitCircularArray = (array, indices) => {
	indices.sort((a, b) => a - b);
	return [
		array.slice(indices[1]).concat(array.slice(0, indices[0] + 1)),
		array.slice(indices[0], indices[1] + 1),
	];
};

/**
 * this must be done AFTER edges_vertices has been updated with the new edge.
 *
 * @param {object} FOLD graph
 * @param {number} the face that will be replaced by these 2 new
 * @param {number[]} vertices (in the face) that split the face into 2 sides
 */
const make_faces = ({
	edges_vertices, faces_vertices, faces_edges,
}, face, vertices) => {
	// the indices of the two vertices inside the face_vertices array.
	// this is where we will split the face into two.
	const indices = vertices.map(el => faces_vertices[face].indexOf(el));
	const faces = splitCircularArray(faces_vertices[face], indices)
		.map(fv => ({ faces_vertices: fv }));
	if (faces_edges) {
		// table to build faces_edges
		const vertices_to_edge = makeVerticesToEdgeBidirectional({ edges_vertices });
		faces
			.map(this_face => this_face.faces_vertices
				.map((fv, i, arr) => `${fv} ${arr[(i + 1) % arr.length]}`)
				.map(key => vertices_to_edge[key]))
			.forEach((face_edges, i) => { faces[i].faces_edges = face_edges; });
	}
	return faces;
};

/**
 *
 */
const build_faces = (graph, face, vertices) => {
	// new face indices at the end of the list
	const faces = [0, 1].map(i => graph.faces_vertices.length + i);
	// construct new face data for faces_vertices, faces_edges
	// add them to the graph
	make_faces(graph, face, vertices)
		.forEach((newface, i) => Object.keys(newface)
			.forEach((key) => { graph[key][faces[i]] = newface[key]; }));
	return faces;
};

/**
 * @description given two vertices and incident faces, create all new
 * "edges_" entries to describe a new edge that sits between the params.
 * @param {object} FOLD graph
 * @param {number[]} two incident vertices that make up this edge
 * @param {number[]} two edge-adjacent faces to this new edge
 * @param {number[]} TEMPORARILY holds 2x the index of the face that
 *  this edge currently lies inside, because the faces arrays will be
 *  rebuilt from scratch, we need the old data.
 * @returns {object} all FOLD spec "edges_" entries for this new edge.
 */
// const make_edge = ({ vertices_coords }, vertices, faces) => {
const make_edge = ({ vertices_coords }, vertices, face) => {
	// coords reversed for "vector", so index [0] comes last in subtract
	const new_edge_coords = vertices
		.map(v => vertices_coords[v])
		.reverse();
	return {
		edges_vertices: [...vertices],
		edges_foldAngle: 0,
		edges_assignment: "U",
		edges_length: distance(...new_edge_coords),
		edges_vector: subtract(...new_edge_coords),
		edges_faces: [face, face],
	};
};
/**
 *
 */
const rebuild_edge = (graph, face, vertices) => {
	// now that 2 vertices are in place, add a new edge between them.
	const edge = graph.edges_vertices.length;
	// construct data for our new edge (vertices, assignent, foldAngle...)
	// and the entry for edges_faces will be [x, x] where x is the index of
	// the old face, twice, and will be replaced later in this function.
	const new_edge = make_edge(graph, vertices, face);
	// ignoring any keys that aren't a part of our graph, add the new edge
	Object.keys(new_edge)
		.filter(key => graph[key] !== undefined)
		.forEach((key) => { graph[key][edge] = new_edge[key]; });
	return edge;
};

/**
 * @description this is a highly specific method, it takes in the output
 * from intersectConvexFaceLine and applies it to a graph by splitting
 * the edges (in the case of edge, not vertex intersection),
 * @param {object} a FOLD object. modified in place.
 * @param {object} the result from calling "intersectConvexFaceLine".
 * each value must be an array. these will be modified in place.
 * @returns {object} with "vertices" and "edges" keys where
 * - vertices is an array of indices (the new vertices)
 * - edges is an object with keys "map", the changes to edge array, and
 * "remove", the indices of edges that have been removed.
 * look inside of "map" at the indices from "removed" for the indices
 * of the new edges which replaced them.
 */
const split_at_intersections = (graph, { vertices, edges }) => {
	// intersection will contain 2 items, either in "vertices" or "edges",
	// however we will split edges and store their new vertex in "vertices"
	// so in the end, "vertices" will contain 2 items.
	let map;
	// split the edge (modifying the graph), and store the changes so that during
	// the next loop the second edge to split will be updated to the new index
	const split_results = edges.map((el) => {
		const res = splitEdge(graph, map ? map[el.edge] : el.edge, el.coords);
		map = map ? mergeNextmaps(map, res.edges.map) : res.edges.map;
		return res;
	});
	vertices.push(...split_results.map(res => res.vertex));
	// if two edges were split, the second one contains a "remove" key that was
	// based on the mid-operation graph, update this value to match the graph
	// before any changes occurred.
	let bkmap;
	// todo: if we extend this to include non-convex polygons, this is the
	// only part of the code we need to test. cumulative backmap merge.
	// this was written without any testing, as convex polygons never have
	// more than 2 intersections
	split_results.forEach(res => {
		res.edges.remove = bkmap ? bkmap[res.edges.remove] : res.edges.remove;
		const inverted = invertFlatMap(res.edges.map);
		bkmap = bkmap ? mergeBackmaps(bkmap, inverted) : inverted;
	});
	return {
		vertices,
		edges: {
			map,
			remove: split_results.map(res => res.edges.remove),
		},
	};
};

/**
 * @description a newly-added edge needs to update its two endpoints'
 * vertices_vertices. each vertices_vertices gains one additional
 * vertex, then the whole array is re-sorted counter-clockwise
 * @param {object} FOLD object
 * @param {number} index of the newly-added edge
 */
export const update_vertices_vertices = ({
	vertices_coords, vertices_vertices, edges_vertices,
}, edge) => {
	const v0 = edges_vertices[edge][0];
	const v1 = edges_vertices[edge][1];
	vertices_vertices[v0] = sortVerticesCounterClockwise(
		{ vertices_coords },
		vertices_vertices[v0].concat(v1),
		v0,
	);
	vertices_vertices[v1] = sortVerticesCounterClockwise(
		{ vertices_coords },
		vertices_vertices[v1].concat(v0),
		v1,
	);
};
/**
 * vertices_vertices was just run before this method. use it.
 * vertices_edges should be up to date, except for the addition
 * of this one new edge at both ends of
 */
export const update_vertices_edges = ({
	edges_vertices, vertices_edges, vertices_vertices,
}, edge) => {
	// the expensive way, rebuild all arrays
	// graph.vertices_edges = makeVerticesEdges(graph);
	if (!vertices_edges || !vertices_vertices) { return; }
	const vertices = edges_vertices[edge];
	// for each of the two vertices, check its vertices_vertices for the
	// index of the opposite vertex. this is the edge. return its position
	// in the vertices_vertices to be used to insert into vertices_edges.
	vertices
		.map(v => vertices_vertices[v])
		.map((vert_vert, i) => vert_vert
			.indexOf(vertices[(i + 1) % vertices.length]))
		.forEach((radial_index, i) => vertices_edges[vertices[i]]
			.splice(radial_index, 0, edge));
};
/**
 * @description search inside vertices_faces for an occurence
 * of the removed face, determine which of our two new faces
 * needs to be put in its place by checking faces_vertices
 * by way of this map we build at the beginning.
 */
export const update_vertices_faces = (graph, old_face, new_faces) => {
	// for each of the vertices (only the vertices involved in this split),
	// use the new faces_vertices data (built in the previous method) to get
	// a list of the new faces to be added to this vertex's vertices_faces.
	const vertices_replacement_faces = {};
	new_faces
		.forEach(f => graph.faces_vertices[f]
			.forEach(v => {
				if (!vertices_replacement_faces[v]) {
					vertices_replacement_faces[v] = [];
				}
				vertices_replacement_faces[v].push(f);
			}));
	// these vertices need updating
	graph.faces_vertices[old_face].forEach(v => {
		const index = graph.vertices_faces[v].indexOf(old_face);
		const replacements = vertices_replacement_faces[v];
		if (index === -1 || !replacements) {
			throw new Error(Messages.convexFace);
		}
		graph.vertices_faces[v].splice(index, 1, ...replacements);
	});
};
/**
 * @description called near the end of the split_convex_face method.
 * update the "edges_faces" array for every edge involved.
 * figure out where the old_face's index is in each edges_faces array,
 * figure out which of the new faces (or both) need to be added and
 * substitute the old index with the new face's index/indices.
 */
export const update_edges_faces = (graph, old_face, new_edge, new_faces) => {
	// for each of the edges (only the edges involved in this split),
	// use the new faces_edges data (built in the previous method) to get
	// a list of the new faces to be added to this edge's edges_faces.
	// most will be length of 1, except the edge which split the face will be 2.
	const edges_replacement_faces = {};
	new_faces
		.forEach(f => graph.faces_edges[f]
			.forEach(e => {
				if (!edges_replacement_faces[e]) { edges_replacement_faces[e] = []; }
				edges_replacement_faces[e].push(f);
			}));
	// these edges need updating
	const edges = [...graph.faces_edges[old_face], new_edge];
	edges.forEach(e => {
		// these are the faces which should be inserted into this edge's
		// edges_faces array, we just need to find the old index to replace.
		const replacements = edges_replacement_faces[e];
		// basically rewriting .indexOf(), but supporting multiple results.
		// these will be the indices containing a reference to the old face.
		const indices = [];
		for (let i = 0; i < graph.edges_faces[e].length; i += 1) {
			if (graph.edges_faces[e][i] === old_face) { indices.push(i); }
		}
		if (indices.length === 0 || !replacements) {
			throw new Error(Messages.convexFace);
		}
		// "indices" will most often be length 1, except for the one edge which
		// was added which splits the face in half. the previous methods which
		// did this gave that edge two references both to the same face, knowing
		// that here we will replace both references to the pair of the new
		// faces which the edge now divides.
		// remove the old indices.
		indices.reverse().forEach(index => graph.edges_faces[e].splice(index, 1));
		// in both cases when "indices" is length 1 or 2, get just one index
		// at which to insert the new reference(s).
		const index = indices[indices.length - 1];
		graph.edges_faces[e].splice(index, 0, ...replacements);
	});
};
/**
 * @description one face was removed and two faces put in its place.
 * regarding the faces_faces array, updates need to be made to the two
 * new faces, as well as all the previously neighboring faces of
 * the removed face.
 */
export const update_faces_faces = ({ faces_vertices, faces_faces }, old_face, new_faces) => {
	// this is presuming that new_faces have their updated faces_vertices by now
	const incident_faces = faces_faces[old_face];
	const new_faces_vertices = new_faces.map(f => faces_vertices[f]);
	// for each of the incident faces (to the old face), set one of two
	// indices, one of the two new faces. this is the new incident face.
	const incident_face_face = incident_faces.map(f => {
		const incident_face_vertices = faces_vertices[f];
		const score = [0, 0];
		for (let n = 0; n < new_faces_vertices.length; n += 1) {
			let count = 0;
			for (let j = 0; j < incident_face_vertices.length; j += 1) {
				if (new_faces_vertices[n].indexOf(incident_face_vertices[j]) !== -1) {
					count += 1;
				}
			}
			score[n] = count;
		}
		if (score[0] >= 2) { return new_faces[0]; }
		if (score[1] >= 2) { return new_faces[1]; }
	});
	// prepare the new faces' face_faces empty arrays, filled with one
	// face, the opposite of the pair of the new faces.
	new_faces.forEach((f, i, arr) => {
		faces_faces[f] = [arr[(i + 1) % new_faces.length]];
	});
	// 2 things, fill the new face's arrays and update each of the
	// incident faces to point to the correct of the two new faces.
	incident_faces.forEach((f, i) => {
		for (let j = 0; j < faces_faces[f].length; j += 1) {
			if (faces_faces[f][j] === old_face) {
				faces_faces[f][j] = incident_face_face[i];
				faces_faces[incident_face_face[i]].push(f);
			}
		}
	});
};

/**
 * @description divide a **convex** face into two polygons with a straight line cut.
 * if the line ends exactly along existing vertices, they will be
 * used, otherwise, new vertices will be added (splitting edges).
 * @param {FOLD} graph a FOLD object, modified in place
 * @param {number} face index of face to split
 * @param {VecLine} line with a "vector" and an "origin" component
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {object|undefined} a summary of changes to the FOLD object,
 *  or undefined if no change (no intersection).
 * @linkcode Origami ./src/graph/splitFace/index.js 28
 */
export const splitFaceWithLine = (graph, face, line, epsilon) => {
	// survey face for any intersections which cross directly over a vertex
	const intersect = intersectConvexFaceLine(graph, face, line, epsilon);
	// if no intersection exists, return undefined.
	if (intersect === undefined) { return undefined; }
	// this result will be appended to (vertices, edges) and returned by this method.
	const result = split_at_intersections(graph, intersect);
	// this modifies the graph by only adding an edge between existing vertices
	result.edges.new = rebuild_edge(graph, face, result.vertices);
	// update all changes to vertices and edges (anything other than faces).
	update_vertices_vertices(graph, result.edges.new);
	update_vertices_edges(graph, result.edges.new);
	// done: vertices_coords, vertices_edges, vertices_vertices, edges_vertices
	// at this point the graph is once again technically valid, except
	// the face data is a little weird as one face is ignoring the newly-added
	// edge that cuts through it.
	const faces = build_faces(graph, face, result.vertices);
	// update all arrays having to do with face data
	update_vertices_faces(graph, face, faces);
	update_edges_faces(graph, face, result.edges.new, faces);
	update_faces_faces(graph, face, faces);
	// remove old data
	const faces_map = remove(graph, "faces", [face]);
	// the graph is now complete, however our return object needs updating.
	// shift our new face indices since these relate to the graph before remove().
	faces.forEach((_, i) => { faces[i] = faces_map[faces[i]]; });
	// we had to run "remove" with the new faces added. to return the change info,
	// we need to adjust the map to exclude these faces.
	faces_map.splice(-2);
	// replace the "undefined" in the map with the two new edge indices.
	faces_map[face] = faces;
	result.faces = {
		map: faces_map,
		new: faces,
		remove: face,
	};
	return result;
};
