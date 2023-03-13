/**
 * Rabbit Ear (c) Kraft
 */
import {
	includeL,
	includeR,
	includeS,
} from "../math/general/function.js";
import {
	getLine,
	getSegment,
	getArrayOfVectors,
} from "../math/general/get.js";
import { pointsToLine } from "../math/general/convert.js";
import GraphProto from "./graph.js";
import clip from "../graph/clip.js";
import addPlanarSegment from "../graph/add/addPlanarSegment.js";
import removePlanarEdge from "../graph/remove/removePlanarEdge.js";
import { isVertexCollinear } from "../graph/vertices/collinear.js";
import { edgeFoldAngleIsFlat } from "../fold/spec.js";
import removePlanarVertex from "../graph/remove/removePlanarVertex.js";
import validate from "../graph/validate.js";
import {
	validateMaekawa,
	validateKawasaki,
} from "../singleVertex/validate.js";
/**
 * Crease Pattern - a flat-array, index-based graph with faces, edges, and vertices
 * that exist in 2D space, edges resolved so there are no edge crossings.
 * The naming scheme for keys follows the FOLD format.
 */
const CP = {};
CP.prototype = Object.create(GraphProto);
CP.prototype.constructor = CP;

const makeEdgesReturnObject = function (edges) {
	edges.valley = (degrees) => this.setValley(edges, degrees);
	edges.mountain = (degrees) => this.setMountain(edges, degrees);
	edges.flat = () => this.setFlat(edges);
	edges.unassigned = () => this.setUnassigned(edges);
	edges.cut = () => this.setCut(edges);
	return edges;
};

const clipLineTypeToCP = (cp, primitive) => {
	const segment = clip(cp, primitive);
	if (!segment) { return undefined; }
	const edges = addPlanarSegment(cp, segment[0], segment[1]);
	// if (!edges) { return undefined; }
	return makeEdgesReturnObject.call(cp, edges);
};

CP.prototype.line = function (...args) {
	const primitive = getLine(...args);
	if (!primitive) { return undefined; }
	primitive.domain = includeL;
	return clipLineTypeToCP(this, primitive);
};

CP.prototype.ray = function (...args) {
	const primitive = getLine(...args);
	if (!primitive) { return undefined; }
	primitive.domain = includeR;
	return clipLineTypeToCP(this, primitive);
};

CP.prototype.segment = function (...args) {
	const primitive = pointsToLine(...getSegment(...args));
	if (!primitive) { return undefined; }
	primitive.domain = includeS;
	return clipLineTypeToCP(this, primitive);
};

CP.prototype.polygon = function (...args) {
	const points = getArrayOfVectors(...args);
	if (!points) { return undefined; }
	const segments = points
		.map((p, i, arr) => [p, arr[(i + 1) % arr.length]])
		.map(seg => pointsToLine(...seg))
		.map(line => ({ ...line, domain: includeS }))
		.map(line => clip(this, line))
		.filter(a => a !== undefined);
	if (!segments) { return undefined; }
	const edges = segments
		.flatMap(segment => addPlanarSegment(this, segment[0], segment[1]));
	return makeEdgesReturnObject.call(this, edges);
};

// CP.prototype.polyline = function (...args) {};

// ["circle", "rect", "polygon"].forEach((fName) => {
// 	CP.prototype[fName] = function () {
// 		const primitive = math[fName](...arguments);
// 		if (!primitive) { return; }
// 		const segments = primitive.segments(arcResolution)
// 			.map(segment => math.segment(segment))
// 			.map(segment => clip(this, segment))
// 			.filter(a => a !== undefined);
// 		if (!segments) { return; }
// 		const vertices = [];
// 		const edges = [];
// 		segments.forEach(segment => {
// 			const verts = addVertices(this, segment);
// 			vertices.push(...verts);
// 			edges.push(...addEdges(this, verts));
// 		});
// 		const { map } = planarize(this).edges;
// 		populate(this);
// 		return makeEdgesReturnObject.call(this, edges.map(e => map[e])
// 			.reduce((a, b) => a.concat(b), []));
// 	};
// });

CP.prototype.removeEdge = function (edge) {
	const vertices = this.edges_vertices[edge];
	removePlanarEdge(this, edge);
	vertices
		.map(v => isVertexCollinear(this, v))
		.map((collinear, i) => (collinear ? vertices[i] : undefined))
		.filter(a => a !== undefined)
		.sort((a, b) => b - a)
		.forEach(v => removePlanarVertex(this, v));
	return true;
};

CP.prototype.validate = function (epsilon) {
	const valid = validate(this, epsilon);
	valid.vertices.kawasaki = validateKawasaki(this, epsilon);
	valid.vertices.maekawa = validateMaekawa(this);
	if (this.edges_foldAngle) {
		valid.edges.not_flat = this.edges_foldAngle
			.map((angle, i) => (edgeFoldAngleIsFlat(angle) ? undefined : i))
			.filter(a => a !== undefined);
	}
	if (valid.summary === "valid") {
		if (valid.vertices.kawasaki.length || valid.vertices.maekawa.length) {
			valid.summary = "invalid";
		} else if (valid.edges.not_flat.length) {
			valid.summary = "not flat";
		}
	}
	return valid;
};

export default CP.prototype;
