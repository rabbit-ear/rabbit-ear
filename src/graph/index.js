/**
 * Rabbit Ear (c) Kraft
 */
import * as make from "./make.js";
import * as boundary from "./boundary.js";
import * as walk from "./walk.js";
import * as nearestMethods from "./nearest.js";
import * as sortMethods from "./sort.js";
import * as span from "./span.js";
import * as maps from "./maps.js";
import * as query from "./query.js";
import * as setsMethods from "./sets.js";
import * as subgraphMethods from "./subgraph.js";
import * as intersectMethods from "./intersect.js";
import transform from "./affine.js";
import * as overlapGraph from "./overlap.js";
import * as triangulateMethods from "./triangulate.js";
import * as normals from "./normals.js";
import * as verticesViolations from "./verticesViolations.js";
import * as edgesViolations from "./edgesViolations.js";
import * as vertices_collinear from "./verticesCollinear.js";
// import * as facesLayer from "./facesLayer.js";
import connectedComponents from "./connectedComponents.js";
import * as edgesEdges from "./edgesEdges.js";
import * as verticesCoordsFolded from "./verticesCoordsFolded.js";
import * as faceSpanningTree from "./faceSpanningTree.js";
import * as facesMatrix from "./facesMatrix.js";
import * as facesWinding from "./facesWinding.js";
import * as explodeFacesMethods from "./explodeFaces.js";
import count from "./count.js";
import countImplied from "./countImplied.js";
import validate from "./validate.js";
import clean from "./clean.js";
import populate from "./populate.js";
import remove from "./remove.js";
import replace from "./replace.js";
import removePlanarVertex from "./remove/removePlanarVertex.js";
import removePlanarEdge from "./remove/removePlanarEdge.js";
import addVertices from "./add/addVertices.js";
import addEdges from "./add/addEdges.js";
import splitEdge from "./splitEdge/index.js";
import splitFace from "./splitFace/index.js";
import flatFold from "./flatFold/index.js";
import addPlanarSegment from "./add/addPlanarSegment.js";
// import assign from "./assign.js";
import clip from "./clip.js";
import fragment from "./fragment.js";
import { flattenFrame } from "./fileFrames.js";
import verticesClusters from "./verticesClusters.js";
// import create from "./create.js";
// todo: not sure about this organization
import * as arrays from "../general/arrays.js";
import clone from "../general/clone.js";
// import addVertices_splitEdges from "./add/addVertices_splitEdges.js";
import * as foldKeyMethods from "../fold/keys.js";
import * as foldSpecMethods from "../fold/spec.js";

export default Object.assign(
	Object.create(null),
	{
		count,
		countImplied,
		validate,
		clean,
		populate,
		remove,
		replace,
		removePlanarVertex,
		removePlanarEdge,
		addVertices,
		addEdges,
		splitEdge,
		splitFace,
		flatFold,
		addPlanarSegment,
		// assign,
		clip,
		fragment,
		verticesClusters,
		connectedComponents,
		clone,
		flattenFrame,
	},
	foldKeyMethods,
	foldSpecMethods,
	make,
	boundary,
	walk,
	nearestMethods,
	sortMethods,
	span,
	maps,
	query,
	setsMethods,
	subgraphMethods,
	intersectMethods,
	overlapGraph,
	triangulateMethods,
	normals,
	transform,
	verticesViolations,
	edgesViolations,
	vertices_collinear,
	// facesLayer,
	edgesEdges,
	verticesCoordsFolded,
	faceSpanningTree,
	facesMatrix,
	facesWinding,
	explodeFacesMethods,
	arrays,
);
