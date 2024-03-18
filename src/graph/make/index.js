/**
 * Rabbit Ear (c) Kraft
 */
import * as makeEdges from "./edges.js";
import * as makeEdgesAssignment from "./edgesAssignment.js";
import * as makeEdgesEdges from "./edgesEdges.js";
import * as makeEdgesFaces from "./edgesFaces.js";
import * as makeEdgesFoldAngle from "./edgesFoldAngle.js";
import * as makeFaces from "./faces.js";
import * as makeFacesEdges from "./facesEdges.js";
import * as makeFacesFaces from "./facesFaces.js";
import * as makeFacesVertices from "./facesVertices.js";
import * as makeLookup from "./lookup.js";
import * as makeVertices from "./vertices.js";
import * as makeVerticesEdges from "./verticesEdges.js";
import * as makeVerticesFaces from "./verticesFaces.js";
import * as makeVerticesVertices from "./verticesVertices.js";

export default {
	...makeEdges,
	...makeEdgesAssignment,
	...makeEdgesEdges,
	...makeEdgesFaces,
	...makeEdgesFoldAngle,
	...makeFaces,
	...makeFacesEdges,
	...makeFacesFaces,
	...makeFacesVertices,
	...makeLookup,
	...makeVertices,
	...makeVerticesEdges,
	...makeVerticesFaces,
	...makeVerticesVertices,
};
