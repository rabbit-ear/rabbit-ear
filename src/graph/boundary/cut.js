/**
 * Rabbit Ear (c) Kraft
 */
import { makeVerticesVertices } from "../make/verticesVertices.js";
import { makeVerticesEdges } from "../make/verticesEdges.js";
import { makeVerticesFaces } from "../make/verticesFaces.js";
import { makeEdgesFacesUnsorted } from "../make/edgesFaces.js";
import { getDimensionQuick } from "../../fold/spec.js";
import { resize2, resize3 } from "../../math/vector.js";

/**
 * @description Around one vertex, group the faces into "fans": runs of
 * adjacent faces that are still connected to each other through an edge
 * that is not a cut. Every fan will end up owning one vertex.
 * Wedge j is the space between edge j and edge j+1 (counter-clockwise),
 * its face is the entry at index j in the (sorted) vertex's faces.
 * @param {boolean[]} vertex_edgesIsCut for each of the vertex's sorted edges,
 * is the edge a cut?
 * @param {(number|null|undefined)[]} vertex_faces the vertex's sorted faces,
 * null or undefined for wedges that lie outside the boundary.
 * @returns {{
 *   count: number,
 *   wedges_fan: (number|undefined)[],
 *   edges_fans: [number, number][],
 * }} an object with:
 * - count: the number of fans (the number of vertices this vertex becomes)
 * - wedges_fan: for each wedge, which fan is it in (undefined for no face)
 * - edges_fans: for each edge, the fan on its [clockwise, counter-clockwise] side.
 */
const makeVertexFans = (vertex_edgesIsCut, vertex_faces) => {
	const n = vertex_edgesIsCut.length;

	// does wedge j continue the fan of the wedge before it (across edge j)?
	// this requires that both wedges have a face, and the edge is not a cut.
	const wedges_joined = vertex_faces.map(
		(face, j) =>
			vertex_faces[(j + n - 1) % n] != null && face != null && !vertex_edgesIsCut[j],
	);

	// a wedge that is not joined to its predecessor starts a new fan. walk
	// around the vertex, labelling each wedge with the most recent start.
	// wedges before the first start belong to the last start (wrap around).
	const startCount = wedges_joined.filter((joined) => !joined).length;
	let label = startCount - 1;
	let startsSeen = 0;
	const wedges_label = wedges_joined.map((joined) => {
		if (!joined) {
			label = startsSeen;
			startsSeen += 1;
		}
		return label;
	});

	// wedges without a face don't get a fan (no vertex without faces).
	// renumber so fans are 0...k, in order of appearance. fan 0 keeps the vertex.
	const labelFan = {};
	let fanCount = 0;
	wedges_label.forEach((wedgeLabel, j) => {
		if (vertex_faces[j] == null || labelFan[wedgeLabel] !== undefined) {
			return;
		}
		labelFan[wedgeLabel] = fanCount;
		fanCount += 1;
	});
	const wedges_fan = wedges_label.map((wedgeLabel, j) =>
		vertex_faces[j] == null ? undefined : labelFan[wedgeLabel],
	);

	// edge j sits between wedge j-1 (clockwise) and wedge j (counter-clockwise).
	// if only one side has a face, both sides use that face's fan.
	/** @type {[number, number][]} */
	const edges_fans = vertex_edgesIsCut.map((_, j) => {
		const clockwise = wedges_fan[(j + n - 1) % n];
		const counterClockwise = wedges_fan[j];
		if (clockwise === undefined && counterClockwise === undefined) {
			return [0, 0];
		}
		if (clockwise === undefined) {
			return [counterClockwise, counterClockwise];
		}
		if (counterClockwise === undefined) {
			return [clockwise, clockwise];
		}
		return [clockwise, counterClockwise];
	});

	return {
		count: Math.max(fanCount, 1),
		wedges_fan,
		edges_fans,
	};
};

/**
 * @description For a vertex which has been split into fans, get the index
 * of the vertex which belongs to one of its fans. Fan 0 keeps the original
 * vertex index, the other fans are new vertices appended to the end.
 * @param {number[]} vertices_fanStart for every vertex, the index of its
 * first new vertex (the vertex for fan 1).
 * @param {number} vertex the index of the original vertex
 * @param {number} fan the index of the fan around the vertex
 * @returns {number} the index of the vertex in the new graph
 */
const getFanVertex = (vertices_fanStart, vertex, fan) =>
	fan === 0 ? vertex : vertices_fanStart[vertex] + fan - 1;

/**
 * @description Cuts the graph along "C" edges or "B" edges between two faces,
 * (assumes a manifold). This separates faces which were once joined.
 * creating two new edges and new vertices if needed.
 * @param {FOLD} input graph, manifold, graph is not modified in place.
 * @returns {{
 *   result: FOLD,
 *   changes: {
 *     vertices: { map: (number|number[])[] },
 *     edges: { map: (number|number[])[] },
 *   },
 * }} the new graph and nextmaps (old index to new index or indices) for
 * vertices and edges. Face indices do not change. A vertex that was split
 * maps to [original, ...new vertices]; a cut edge maps to [original, copy].
 * vertices_vertices, vertices_edges, vertices_faces, faces_edges, edgeOrders
 * and other derived arrays are not carried over, they are no longer valid.
 */
export const cutBoundaries = ({
	vertices_coords,
	vertices_vertices,
	vertices_edges,
	vertices_faces,
	edges_vertices,
	edges_assignment,
	edges_foldAngle,
	edges_faces,
	faces_vertices,
}) => {
	if (!vertices_vertices) {
		vertices_vertices = makeVerticesVertices({ vertices_coords, edges_vertices });
	}
	if (!vertices_edges) {
		vertices_edges = makeVerticesEdges({ edges_vertices, vertices_vertices });
	}
	if (!vertices_faces) {
		vertices_faces = makeVerticesFaces({
			vertices_coords,
			vertices_vertices,
			faces_vertices,
		});
	}

	// only need unsorted for a count of adjacent faces
	if (!edges_faces) {
		edges_faces = makeEdgesFacesUnsorted({ edges_vertices, faces_vertices });
	}

	// number of adjacent faces (ignore empty entries for positioning)
	const edges_faceCount = edges_faces.map(
		(faces) => faces.filter((f) => f !== null && f !== undefined).length,
	);

	// all edges to be cut are edges with assignment "C" or "B" boundary
	// edges which have 2 adjacent faces (this assumes manifold).
	const edges_isCut = edges_assignment.map(
		(a, e) =>
			a === "C" || a === "c" || ((a === "B" || a === "b") && edges_faceCount[e] === 2),
	);

	// for every vertex, group its faces into fans which are separated by cuts
	const vertices_fans = vertices_edges.map((edges, v) =>
		makeVertexFans(
			edges.map((e) => edges_isCut[e]),
			vertices_faces[v],
		),
	);

	// if a vertex has multiple fans, the vertex needs to be copied.
	// the first fan keeps the vertex at index "v", the vertices for
	// subsequent fans are appended at the end of the vertices_coords list.
	let newVertexIndex = vertices_coords.length;
	const vertices_fanStart = vertices_fans.map(({ count }) => {
		const start = newVertexIndex;
		newVertexIndex += count - 1;
		return start;
	});

	// a nextmap for vertices, a split vertex maps to [original, ...new vertices]
	const verticesMap = vertices_fans.map(({ count }, v) =>
		count === 1
			? v
			: [
					v,
					...Array.from(Array(count - 1)).map((_, i) =>
						getFanVertex(vertices_fanStart, v, i + 1),
					),
				],
	);

	// the new vertices are copies of the vertex they were split from.
	const vertices_coordsAll = vertices_coords.concat(
		vertices_fans.flatMap(({ count }, v) =>
			Array.from(Array(count - 1)).map(() => vertices_coords[v]),
		),
	);
	// resize creates a copy of each point, no shared references between points.
	/** @type {[number, number][] | [number, number, number][]} */
	const vertices_coordsNew =
		getDimensionQuick({ vertices_coords }) === 3
			? vertices_coordsAll.map(resize3)
			: vertices_coordsAll.map(resize2);

	// every cut edge gets a copy, appended to the end of the edges list.
	let newEdgeIndex = edges_vertices.length;
	const edges_copy = edges_isCut.map((isCut) => (isCut ? newEdgeIndex++ : undefined));

	// a nextmap for edges, a cut edge maps to [original, copy]
	const edgesMap = edges_copy.map((copy, e) => (copy === undefined ? e : [e, copy]));

	// for each edge, for each of its two vertices, the fans on the
	// [clockwise, counter-clockwise] side of the edge around that vertex.
	const edges_vertexFans = edges_vertices.map((vertices, e) =>
		vertices.map((v) => vertices_fans[v].edges_fans[vertices_edges[v].indexOf(e)]),
	);

	// an edge from vertex 0 to vertex 1. at vertex 0, the clockwise fan lies
	// to the right of the edge. at vertex 1 (looking back towards vertex 0),
	// the counter-clockwise fan lies to the right of the edge.
	// the original edge keeps the right side, the copy takes the left side.
	// for edges which are not cut, the fans on both sides are the same.
	/** @type {[number, number][]} */
	const edges_verticesOriginal = edges_vertices.map(([v0, v1], e) => [
		getFanVertex(vertices_fanStart, v0, edges_vertexFans[e][0][0]),
		getFanVertex(vertices_fanStart, v1, edges_vertexFans[e][1][1]),
	]);
	/** @type {[number, number][]} */
	const edges_verticesCopy = edges_vertices
		.map(([v0, v1], e) => [
			getFanVertex(vertices_fanStart, v0, edges_vertexFans[e][0][1]),
			getFanVertex(vertices_fanStart, v1, edges_vertexFans[e][1][0]),
		])
		.filter((_, e) => edges_isCut[e])
		.map(([a, b]) => [a, b]);
	const edges_verticesNew = edges_verticesOriginal.concat(edges_verticesCopy);

	// cut edges, and their copies, all become boundary edges.
	const cutCount = edges_verticesCopy.length;
	const edges_assignmentNew = edges_assignment
		.map((a, e) => (edges_isCut[e] ? "B" : a))
		.concat(Array(cutCount).fill("B"));

	// for every face, a lookup where the key is one of the face's vertices,
	// and the value is the new vertex which this vertex should become.
	const faces_vertexReplace = faces_vertices.map(() => ({}));
	vertices_faces.forEach((faces, v) =>
		faces.forEach((f, j) => {
			const fan = vertices_fans[v].wedges_fan[j];
			if (f == null || !fan) {
				return;
			}
			faces_vertexReplace[f][v] = getFanVertex(vertices_fanStart, v, fan);
		}),
	);
	const faces_verticesNew = faces_vertices.map((vertices, f) =>
		vertices.map((v) =>
			faces_vertexReplace[f][v] === undefined ? v : faces_vertexReplace[f][v],
		),
	);

	const result = {
		vertices_coords: vertices_coordsNew,
		edges_vertices: edges_verticesNew,
		edges_assignment: edges_assignmentNew,
		faces_vertices: faces_verticesNew,
	};

	// only include fold angles if the input graph contained them.
	if (edges_foldAngle) {
		result.edges_foldAngle = edges_foldAngle
			.map((angle, e) => (edges_isCut[e] ? 0 : angle))
			.concat(Array(cutCount).fill(0));
	}

	return {
		result,
		changes: {
			vertices: { map: verticesMap },
			edges: { map: edgesMap },
		},
	};
};
