/**
 * Rabbit Ear (c) Kraft
 */
import { EPSILON } from "../math/constant.js";
import { excludeS } from "../math/compare.js";
import {
	cross2,
	subtract2,
} from "../math/vector.js";
import {
	getEdgesLineIntersection,
	getEdgesCollinearToLine,
} from "./intersect/edges.js";
import { makeFacesEdgesFromVertices } from "./make.js";
import { makeFacesNormal } from "./normals.js";
import {
	faceOrdersSubset,
	linearizeFaceOrders,
} from "./orders.js";
/**
 *
 */
export const getEdgesSide = ({ vertices_coords, edges_vertices }, line, epsilon = EPSILON) => {
	const edgeSide = (edge_vertices) => edge_vertices
		.map(v => vertices_coords[v])
		.map(coord => subtract2(coord, line.origin))
		.map(vec => cross2(line.vector, vec))
		.sort((a, b) => Math.abs(b) - Math.abs(a))
		.map(Math.sign)
		.shift();
	const edgesIntersection = getEdgesLineIntersection({
		vertices_coords, edges_vertices,
	}, line, epsilon, excludeS);
	const edgesCollinear = {};
	getEdgesCollinearToLine({ vertices_coords, edges_vertices }, line, epsilon)
		.forEach(e => { edgesCollinear[e] = true; });
	// -1: left, +1: right (todo check these), 0: both, 2: collinear (neither side)
	return edges_vertices.map((edge_vertices, e) => {
		if (edgesCollinear[e] === true) { return 2; }
		if (edgesIntersection[e].point !== undefined) { return 0; }
		return edgeSide(edge_vertices);
	});
};
/**
 *
 */
export const getFacesSide = ({
	vertices_coords, edges_vertices, faces_vertices, faces_edges,
}, line, epsilon = EPSILON) => {
	if (!faces_edges) {
		faces_edges = makeFacesEdgesFromVertices({ edges_vertices, faces_vertices });
	}
	const edgesSide = getEdgesSide({ vertices_coords, edges_vertices }, line, epsilon);
	// filter out "collinear" edges, they don't matter here
	const facesEdgesSide = faces_edges
		.map(edges => edges
			.map(e => edgesSide[e])
			.filter(side => side !== 2));
	const facesOverlapLine = facesEdgesSide
		.map(sides => sides.includes(0));
	const facesEdgesSameSide = facesEdgesSide
		.map((sides, i) => (facesOverlapLine[i]
			? false
			: sides.reduce((a, b) => a && (b === sides[0]), true)));
	return facesEdgesSameSide
		.map((sameSide, f) => (sameSide ? facesEdgesSide[f][0] : 0));
};
/**
 * @description flat folded crease patterns only (2D)
 */
export const getFlapsThroughLine = ({
	vertices_coords, edges_vertices, faces_vertices, faces_edges, faceOrders,
}, line, epsilon = EPSILON) => {
	if (!faceOrders) { throw new Error("faceOrders required"); }
	// for every face, get the intersection
	const facesSide = getFacesSide({
		vertices_coords, edges_vertices, faces_vertices, faces_edges,
	}, line, epsilon);
	const sidesFaces = [-1, 1]
		.map(side => facesSide
			.map((s, f) => ({ s, f }))
			.filter(el => el.s === side || el.s === 0)
			.map(el => el.f));
	const sidesFaceOrders = sidesFaces
		.map(faces => faceOrdersSubset(faceOrders, faces));
	console.log("facesSide", facesSide);
	console.log("sidesFaces", sidesFaces);
	console.log("sidesFaceOrders", sidesFaceOrders);
	const faces_normal = makeFacesNormal({ vertices_coords, faces_vertices });
	const sidesLayersFace = sidesFaceOrders.map(orders => linearizeFaceOrders({
		faceOrders: orders, faces_normal,
	}));
	console.log("sidesLayersFace", sidesLayersFace);
};
