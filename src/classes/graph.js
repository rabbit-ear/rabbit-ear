/**
 * Rabbit Ear (c) Kraft
 */
import math from "../math";
import setup from "./components";
import * as S from "../general/strings";
import {
	foldKeys,
	keys,
	file_spec,
	file_creator,
} from "../fold/keys";
import {
	singularize,
	filterKeysWithPrefix,
	transposeGraphArrays,
	transposeGraphArrayAtIndex,
} from "../fold/spec";
// import count from "../graph/count";
import clean from "../graph/clean";
import validate from "../graph/validate";
import populate from "../graph/populate";
import fragment from "../graph/fragment";
// import assign from "../graph/assign";
// import subgraph from "../graph/subgraph";
import { getBoundary } from "../graph/boundary";
import transform from "../graph/affine";
import {
	makeVerticesCoordsFolded,
	makeVerticesCoordsFlatFolded,
} from "../graph/verticesCoordsFolded";
import { makeFaceSpanningTree } from "../graph/faceSpanningTree";
import { multiplyVerticesFacesMatrix2 } from "../graph/facesMatrix";
import { explodeFaces, explodeShrinkFaces } from "../graph/explodeFaces";
import {
	nearestVertex,
	nearestEdge,
	nearestFace,
} from "../graph/nearest";
import clone from "../general/clone";
import addVertices from "../graph/add/addVertices";
import splitEdge from "../graph/splitEdge/index";
import splitFace from "../graph/splitFace/index";
/**
 * @name Graph
 * @description a graph which includes faces, edges, and vertices, and additional
 * origami-specific information like fold angles of edges and layer order of faces.
 * @param {FOLD} [graph] an optional FOLD object, otherwise the graph will initialize empty
 */
const Graph = {};
Graph.prototype = Object.create(Object.prototype);
Graph.prototype.constructor = Graph;
/**
 * methods where "graph" is the first parameter, followed by ...arguments
 * func(graph, ...args)
 */
const graphMethods = Object.assign({
	// count,
	clean,
	validate,
	populate,
	fragment,
	// subgraph,
	// assign,
	// convert snake_case to camelCase
	addVertices: addVertices,
	splitEdge: splitEdge,
	faceSpanningTree: makeFaceSpanningTree,
	explodeFaces: explodeFaces,
	explodeShrinkFaces: explodeShrinkFaces,
},
	transform,
);
Object.keys(graphMethods).forEach(key => {
	Graph.prototype[key] = function () {
		return graphMethods[key](this, ...arguments);
	}
});
/**
 * methods below here need some kind of pre-processing of their arguments
 */
Graph.prototype.splitFace = function (face, ...args) {
	const line = math.core.getLine(...args);
	return splitFace(this, face, line.vector, line.origin);
};
/**
 * @returns {this} a deep copy of this object
 */
Graph.prototype.copy = function () {
	// return Object.assign(Object.create(Graph.prototype), clone(this));
	return Object.assign(Object.create(this.__proto__), clone(this));
	// todo: switch this for:
	// Object.getPrototypeOf(this);
};
/**
 * @param {object} is a FOLD object.
 * @param {options}
 *   "append" import will first, clear FOLD keys. "append":true prevents this clearing
 */
// Graph.prototype.load = function (object, options = {}) {
//   if (typeof object !== S._object) { return; }
//   if (options.append !== true) {
//     keys.forEach(key => delete this[key]);
//   }
//   // allow overwriting of file_spec and file_creator if included in import
//   Object.assign(this, { file_spec, file_creator }, clone(object));
// };
/**
 * this clears all components from the graph, leaving metadata and other
 * keys untouched.
 */
Graph.prototype.clear = function () {
	foldKeys.graph.forEach(key => delete this[key]);
	foldKeys.orders.forEach(key => delete this[key]);
	// the code above just avoided deleting all "file_" keys,
	// however, file_frames needs to be removed as it contains geometry.
	delete this.file_frames;
	return this;
};
/**
 * @description get the axis-aligned bounding rectangle that encloses
 * all the vertices of the graph. not only the boundary vertices.
 */
Graph.prototype.boundingBox = function () {
	return math.rect.fromPoints(this.vertices_coords);
};
/**
 * @description alter the vertices by moving the corner of the graph
 * to the origin and shrink or expand the vertices until they
 * aspect fit inside the unit square.
 */
Graph.prototype.unitize = function () {
	if (!this.vertices_coords) { return; }
	const box = math.core.bounding_box(this.vertices_coords);
	const longest = Math.max(...box.span);
	const scale = longest === 0 ? 1 : (1 / longest);
	const origin = box.min;
	this.vertices_coords = this.vertices_coords
		.map(coord => math.core.subtract(coord, origin))
		.map(coord => coord.map((n, i) => n * scale));
	return this;
};
/**
 * @description return a copy of this graph with the vertices folded.
 * This method works for both 2D and 3D origami.
 * The angle of the fold is searched for in this order:
 * - faces_matrix2 if it exists
 * - edges_foldAngle if it exists
 * - edges_assignment if it exists
 * Careful, repeated calls to this method will repeatedly fold the vertices
 * resulting in a behavior that is surely unintended.
 */
Graph.prototype.folded = function () {
	const vertices_coords = this.faces_matrix2
		? multiplyVerticesFacesMatrix2(this, this.faces_matrix2)
		: makeVerticesCoordsFolded(this, ...arguments);
	// const faces_layer = this["faces_re:layer"]
	//   ? this["faces_re:layer"]
	//   : makeFacesLayer(this, arguments[0], 0.001);
	return Object.assign(
		// todo: switch this for:
		// Object.getPrototypeOf(this);
		Object.create(this.__proto__),
		Object.assign(clone(this), {
			vertices_coords,
			// "faces_re:layer": faces_layer,
			frame_classes: [S._foldedForm]
		}));
	// delete any arrays that becomes incorrect due to folding
	// delete copy.edges_vector;
	// return copy;
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
	return Object.assign(
		// todo: switch this for:
		// Object.getPrototypeOf(this);
		Object.create(this.__proto__),
		Object.assign(clone(this), {
			vertices_coords,
			frame_classes: [S._foldedForm]
		}));
};
/**
 * graph components
 */
// bind "vertices", "edges", or "faces" to "this"
// then we can pass in this function directly to map()
const shortenKeys = function (el, i, arr) {
	const object = Object.create(null);
	Object.keys(el).forEach((k) => {
		object[k.substring(this.length + 1)] = el[k];
	});
	return object;
};
// bind the FOLD graph to "this"
const getComponent = function (key) {
	return transposeGraphArrays(this, key)
		.map(shortenKeys.bind(key))
		.map(setup[key].bind(this));
};

[S._vertices, S._edges, S._faces]
	.forEach(key => Object.defineProperty(Graph.prototype, key, {
		enumerable: true,
		get: function () { return getComponent.call(this, key); }
	}));

// todo: get boundaries, plural
// get boundary. only if the edges_assignment
Object.defineProperty(Graph.prototype, S._boundary, {
	enumerable: true,
	get: function () {
		const boundary = getBoundary(this);
		// const poly = math.polygon(boundary.vertices.map(v => this.vertices_coords[v]));
		const poly = boundary.vertices.map(v => this.vertices_coords[v]);
		Object.keys(boundary).forEach(key => { poly[key] = boundary[key]; });
		return Object.assign(poly, boundary);
	}
});
/**
 * graph components based on Euclidean distance
 */
const nearestMethods = {
	vertices: nearestVertex,
	edges: nearestEdge,
	faces: nearestFace,
};
/**
 * @description given a point, this will return the nearest vertex, edge,
 * and face, as well as the nearest entry inside all of the "vertices_",
 * "edges_", and "faces_" arrays.
 */
Graph.prototype.nearest = function () {
	const point = math.core.getVector(arguments);
	const nears = Object.create(null);
	const cache = {};
	[S._vertices, S._edges, S._faces].forEach(key => {
		Object.defineProperty(nears, singularize[key], {
			enumerable: true,
			get: () => {
				if (cache[key] !== undefined) { return cache[key]; }
				cache[key] = nearestMethods[key](this, point);
				return cache[key];
			}
		});
		filterKeysWithPrefix(this, key).forEach(fold_key =>
			Object.defineProperty(nears, fold_key, {
				enumerable: true,
				get: () => this[fold_key][nears[singularize[key]]]
			}));
	});
	return nears;
};

export default Graph.prototype;
