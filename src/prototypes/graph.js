/**
 * Rabbit Ear (c) Kraft
 */
// import count from "../graph/count.js";
// import addVertices from "../graph/add/addVertices.js";
import * as transform from "../graph/transform.js";
import clean from "../graph/clean.js";
import * as explode from "../graph/explode.js";
import { nearest } from "../graph/nearest.js";
import planarize from "../graph/planarize.js";
import populate from "../graph/populate.js";
import splitEdge from "../graph/splitEdge/index.js";
import splitFace from "../graph/splitFace/index.js";
import { subgraph } from "../graph/subgraph.js";
import * as validate from "../graph/validate.js";
import {
	boundary,
	boundingBox,
} from "../graph/boundary.js";
import {
	makeVerticesCoordsFolded,
	makeVerticesCoordsFlatFolded,
} from "../graph/vertices/folded.js";
// import {
// 	makeFaceSpanningTree as faceSpanningTree,
// } from "../graph/faces/spanningTree.js";
import {
	multiplyVerticesFacesMatrix2,
} from "../graph/faces/matrix.js";
import clone from "../general/clone.js";
import { invertAssignments } from "../fold/spec.js";
import foldToSvg from "../convert/foldToSvg/index.js";
import foldToObj from "../convert/foldToObj/index.js";
/**
 * @name Graph
 * @description a graph which includes faces, edges, and vertices, and additional
 * origami-specific information like fold angles of edges and layer order of faces.
 * @param {FOLD} [graph] an optional FOLD object, otherwise the graph will initialize empty
 * @linkcode Origami ./src/classes/graph.js 50
 */
const Graph = {};
Graph.prototype = Object.create(Object.prototype);
Graph.prototype.constructor = Graph;
/**
 * methods where "graph" is the first parameter, followed by ...arguments
 * func(graph, ...args)
 */
Object.entries({
	// count,
	clean,
	populate,
	// planarize, // not sure if this should be here now that it returns
	// a new planar graph instead of modifying itself
	subgraph,
	// todo: get boundaries, plural
	boundary,
	boundingBox,
	// addVertices,
	nearest,
	splitEdge,
	splitFace,
	// faceSpanningTree,
	invertAssignments,
	svg: foldToSvg,
	obj: foldToObj,
	...explode,
	...transform,
	...validate,
}).forEach(([key, value]) => {
	Graph.prototype[key] = function () {
		return value(this, ...arguments);
	};
});
/**
 * @returns {this} a deep copy of this object
 */
Graph.prototype.clone = function () {
	return Object.assign(Object.create(Object.getPrototypeOf(this)), clone(this));
};
/**
 * this clears all components from the graph, leaving metadata and other
 * keys untouched.
 */
// Graph.prototype.clear = function () {
// 	foldKeys.graph.forEach(key => delete this[key]);
// 	foldKeys.orders.forEach(key => delete this[key]);
// 	// the code above just avoided deleting all "file_" keys,
// 	// however, file_frames needs to be removed as it contains geometry.
// 	delete this.file_frames;
// 	return this;
// };
/**
 * @param {object} is a FOLD object.
 * @param {options}
 *   "append" import will first, clear FOLD keys. "append":true prevents this clearing
 */
// Graph.prototype.load = function (object, options = {}) {
//   if (typeof object !== "object") { return; }
//   if (options.append !== true) {
//     keys.forEach(key => delete this[key]);
//   }
//   // allow overwriting of file_spec and file_creator if included in import
//   Object.assign(this, { file_spec, file_creator }, clone(object));
// };
/**
 * @description return a shallow copy of this graph with the vertices folded.
 * This method works for both 2D and 3D origami.
 * The angle of the fold is searched for in this order:
 * - faces_matrix2 if it exists
 * - edges_foldAngle if it exists
 * - edges_assignment if it exists
 * Repeated calls to this method will repeatedly fold the vertices
 * resulting in a behavior that is surely unintended.
 */
Graph.prototype.folded = function () {
	const vertices_coords = this.faces_matrix2
		? multiplyVerticesFacesMatrix2(this, this.faces_matrix2)
		: makeVerticesCoordsFolded(this, ...arguments);
	return {
		...this,
		vertices_coords,
		frame_classes: ["foldedForm"],
	};
};
/**
 * @description return a copy of this graph with the vertices folded.
 * This method will work for 2D only.
 * The angle of the fold is searched for in this order:
 * - faces_matrix2 if it exists
 * - edges_assignment or edges_foldAngle if it exists
 * If neither exists, this method will assume that ALL edges are flat-folded.
 */
Graph.prototype.flatFolded = function () {
	const vertices_coords = this.faces_matrix2
		? multiplyVerticesFacesMatrix2(this, this.faces_matrix2)
		: makeVerticesCoordsFlatFolded(this, ...arguments);
	return {
		...this,
		vertices_coords,
		frame_classes: ["foldedForm"],
	};
};

const setAssignment = (graph, edges, assignment, foldAngle) => {
	edges.forEach(edge => {
		graph.edges_assignment[edge] = assignment;
		graph.edges_foldAngle[edge] = foldAngle;
	});
	return edges;
};

Graph.prototype.setValley = function (edges = [], degrees = 180) {
	return setAssignment(this, edges, "V", Math.abs(degrees));
};

Graph.prototype.setMountain = function (edges = [], degrees = -180) {
	return setAssignment(this, edges, "M", -Math.abs(degrees));
};

Graph.prototype.setFlat = function (edges = []) {
	return setAssignment(this, edges, "F", 0);
};

Graph.prototype.setUnassigned = function (edges = []) {
	return setAssignment(this, edges, "U", 0);
};

Graph.prototype.setCut = function (edges = []) {
	return setAssignment(this, edges, "C", 0);
};

export default Graph.prototype;
