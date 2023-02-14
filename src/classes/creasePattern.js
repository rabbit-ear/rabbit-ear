/**
 * Rabbit Ear (c) Kraft
 */
import {
	includeL,
	includeR,
	includeS,
} from "../math/general/functions.js";
import {
	getLine,
	getVectorOfVectors,
} from "../math/general/types.js";
import GraphProto from "./graph.js";
import clip from "../graph/clip.js";
import addVertices from "../graph/add/addVertices.js";
import addEdges from "../graph/add/addEdges.js";
import fragment from "../graph/fragment.js";
import populate from "../graph/populate.js";
import addPlanarSegment from "../graph/add/addPlanarSegment.js";
import removePlanarEdge from "../graph/remove/removePlanarEdge.js";
import { isVertexCollinear } from "../graph/verticesCollinear.js";
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
const CreasePattern = {};
CreasePattern.prototype = Object.create(GraphProto);
CreasePattern.prototype.constructor = CreasePattern;
/**
 * how many segments will curves be converted into.
 * todo: user should be able to change this
 */
const arcResolution = 96;

const make_edges_array = function (array) {
	array.mountain = (degrees = -180) => {
		array.forEach(i => {
			this.edges_assignment[i] = "M";
			this.edges_foldAngle[i] = degrees;
		});
		return array;
	};
	array.valley = (degrees = 180) => {
		array.forEach(i => {
			this.edges_assignment[i] = "V";
			this.edges_foldAngle[i] = degrees;
		});
		return array;
	};
	array.flat = () => {
		array.forEach(i => {
			this.edges_assignment[i] = "F";
			this.edges_foldAngle[i] = 0;
		});
		return array;
	};
	return array;
};

const clipLineTypeToCP = (cp, primitive) => {
	const segment = clip(cp, primitive);
	if (!segment) { return undefined; }
	const edges = addPlanarSegment(cp, segment[0], segment[1]);
	// if (!edges) { return undefined; }
	return make_edges_array.call(cp, edges);
};

CreasePattern.prototype.line = function (...args) {
	const primitive = getLine(...args);
	if (!primitive) { return undefined; }
	primitive.domain_function = includeL;
	return clipLineTypeToCP(this, primitive);
};

CreasePattern.prototype.ray = function (...args) {
	const primitive = getLine(...args);
	if (!primitive) { return undefined; }
	primitive.domain_function = includeR;
	return clipLineTypeToCP(this, primitive);
};

CreasePattern.prototype.segment = function (...args) {
	const primitive = getVectorOfVectors(...args);
	if (!primitive) { return undefined; }
	primitive.domain_function = includeS;
	return clipLineTypeToCP(this, primitive);
};

["circle", "ellipse", "rect", "polygon"].forEach((fName) => {
	CreasePattern.prototype[fName] = function () {
		const primitive = math[fName](...arguments);
		if (!primitive) { return; }
		const segments = primitive.segments(arcResolution)
			.map(segment => math.segment(segment))
			.map(segment => clip(this, segment))
			.filter(a => a !== undefined);
		if (!segments) { return; }
		const vertices = [];
		const edges = [];
		segments.forEach(segment => {
			const verts = addVertices(this, segment);
			vertices.push(...verts);
			edges.push(...addEdges(this, verts));
		});
		const { map } = fragment(this).edges;
		populate(this);
		return make_edges_array.call(this, edges.map(e => map[e])
			.reduce((a, b) => a.concat(b), []));
	};
});

// ["circle", "ellipse", "rect", "polygon"].forEach((fName) => {
//   CreasePattern.prototype[fName] = function () {
//     const primitive = math[fName](...arguments);
//     if (!primitive) { return; }
//     const segments = primitive.segments(arcResolution)
//       .map(segment => math.segment(segment))
//       .map(segment => clip(this, segment))
//       .filter(a => a !== undefined);
//     if (!segments) { return; }
//     const vertices = [];
//     // const edges = [];
//     const edges = segments.map(segment => {
//       return addPlanarSegment(this, segment[0], segment[1]);
//     });
//     console.log("verts, edges", vertices, edges);
//     // return make_edges_array.call(this, edges
//     //   .reduce((a, b) => a.concat(b), []));
//   };
// });

CreasePattern.prototype.removeEdge = function (edge) {
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

CreasePattern.prototype.validate = function (epsilon) {
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

export default CreasePattern.prototype;
