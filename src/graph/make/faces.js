/**
 * Rabbit Ear (c) Kraft
 */
import {
	makePolygonNonCollinear,
	centroid,
} from "../../math/polygon.js";
import {
	add,
} from "../../math/vector.js";
import {
	walkPlanarFaces,
	filterWalkedBoundaryFace,
} from "../walk.js";
import {
	makeVerticesVertices,
} from "./verticesVertices.js";
import {
	makeVerticesSectors,
} from "./vertices.js";
import {
	makeVerticesToEdge,
} from "./lookup.js";

/**
 * @description Rebuild all faces in a 2D planar graph by walking counter-clockwise
 * down every edge (both ways). This does not include the outside face which winds
 * around the boundary backwards enclosing the outside space.
 * @param {FOLD} graph a FOLD object
 * @returns {object[]} array of faces as objects containing "vertices",
 * "edges", and "angles"
 * @example
 * // to convert the return object into faces_vertices and faces_edges
 * var faces = makePlanarFaces(graph);
 * faces_vertices = faces.map(el => el.vertices);
 * faces_edges = faces.map(el => el.edges);
 * @linkcode Origami ./src/graph/make.js 694
 */
export const makePlanarFaces = ({
	vertices_coords, vertices_vertices, vertices_edges,
	vertices_sectors, edges_vertices, edges_vector,
}) => {
	if (!vertices_vertices) {
		vertices_vertices = makeVerticesVertices({
			vertices_coords, edges_vertices, vertices_edges,
		});
	}
	if (!vertices_sectors) {
		vertices_sectors = makeVerticesSectors({
			vertices_coords, vertices_vertices, edges_vertices, edges_vector,
		});
	}
	const vertices_edges_map = makeVerticesToEdge({ edges_vertices });
	// removes the one face that outlines the piece with opposite winding.
	// walkPlanarFaces stores edges as vertex pair strings, "4 9",
	// convert these into edge indices
	const res = filterWalkedBoundaryFace(walkPlanarFaces({
		vertices_vertices, vertices_sectors,
	})).map(f => ({ ...f, edges: f.edges.map(e => vertices_edges_map[e]) }));
	return {
		faces_vertices: res.map(el => el.vertices),
		faces_edges: res.map(el => el.edges),
		faces_sectors: res.map(el => el.angles),
	};
};

// export const makePlanarFacesVertices = graph => makePlanarFaces(graph)
// 	.faces_vertices;
// export const makePlanarFacesEdges = graph => makePlanarFaces(graph)
// 	.faces_edges;

/**
 * @description map vertices_coords onto each face's set of vertices,
 * turning each face into an array of points, with an additional step:
 * ensure that each polygon has 0 collinear vertices.
 * this can result in a polygon with fewer vertices than is contained
 * in that polygon's faces_vertices array.
 * @param {FOLD} graph a FOLD graph, with vertices_coords, faces_vertices
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {number[][][]} array of array of points, where each point is an array of numbers
 * @linkcode Origami ./src/graph/make.js 820
 */
export const makeFacesPolygon = ({ vertices_coords, faces_vertices }, epsilon) => faces_vertices
	.map(verts => verts.map(v => vertices_coords[v]))
	.map(polygon => makePolygonNonCollinear(polygon, epsilon));

/**
 * @description map vertices_coords onto each face's set of vertices,
 * turning each face into an array of points. "Quick" meaning collinear vertices are
 * not removed, which in some cases, this will be the preferred method.
 * @param {FOLD} graph a FOLD graph, with vertices_coords, faces_vertices
 * @returns {number[][][]} array of array of points, where each point is an array of numbers
 * @linkcode Origami ./src/graph/make.js 831
 */
export const makeFacesPolygonQuick = ({ vertices_coords, faces_vertices }) => faces_vertices
	.map(verts => verts.map(v => vertices_coords[v]));

/**
 * @description For every face, get the face's centroid.
 * @param {FOLD} graph a FOLD graph, with vertices_coords, faces_vertices
 * @returns {number[][]} array of points, where each point is an array of numbers
 * @linkcode Origami ./src/graph/make.js 839
 */
export const makeFacesCenter2D = ({ vertices_coords, faces_vertices }) => faces_vertices
	.map(fv => fv.map(v => vertices_coords[v]))
	.map(coords => centroid(coords));

/**
 * @description This uses point average, not centroid, faces must
 * be convex, and again it's not precise, but in many use cases
 * this is often more than sufficient.
 * @param {FOLD} graph a FOLD graph, with vertices_coords, faces_vertices
 * @returns {number[][]} array of points, where each point is an array of numbers
 * @linkcode Origami ./src/graph/make.js 850
 */
export const makeFacesConvexCenter = ({ vertices_coords, faces_vertices }) => {
	const oneVertex = vertices_coords.filter(() => true).shift();
	if (!oneVertex) { return faces_vertices.map(() => []); }
	const dimensions = oneVertex.length;
	return faces_vertices.map(vertices => vertices
		.map(v => vertices_coords[v])
		.reduce((a, b) => add(a, b), Array(dimensions).fill(0))
		.map(el => el / vertices.length));
};
