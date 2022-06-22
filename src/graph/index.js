/**
 * Rabbit Ear (c) Kraft
 */
import * as make from "./make";
import * as boundary from "./boundary";
import * as walk from "./walk";
import * as nearest from "./nearest";
import * as fold_spec from "../fold/spec";
import * as sort from "./sort";
import * as span from "./span";
import * as maps from "./maps";
import * as query from "./query";
import * as intersect from "./intersect";
import transform from "./affine";
import * as overlap from "./overlap";
import * as verticesViolations from "./verticesViolations";
import * as edgesViolations from "./edgesViolations";
import * as vertices_collinear from "./verticesCollinear";
import * as facesLayer from "./facesLayer";
import * as edgesEdges from "./edgesEdges";
import * as verticesCoordsFolded from "./verticesCoordsFolded";
import * as faceSpanningTree from "./faceSpanningTree";
import * as facesMatrix from "./facesMatrix";
import * as facesWinding from "./facesWinding";
import * as explodeFacesMethods from "./explodeFaces";
import count from "./count";
import implied from "./countImplied";
import validate from "./validate";
import clean from "./clean";
import populate from "./populate";
import remove from "./remove";
import replace from "./replace";
import removePlanarVertex from "./remove/removePlanarVertex";
import removePlanarEdge from "./remove/removePlanarEdge";
import addVertices from "./add/addVertices";
import addEdges from "./add/addEdges";
import splitEdge from "./splitEdge/index";
import splitFace from "./splitFace/index";
import flatFold from "./flatFold/index";
import addPlanarSegment from "./add/addPlanarSegment";
// import assign from "./assign";
import subgraph from "./subgraph";
import clip from "./clip";
import fragment from "./fragment";
import getVerticesClusters from "./verticesClusters";
// import create from "./create";
// todo: not sure about this organization
import * as arrays from "../general/arrays";
import clone from "../general/clone";
// import addVertices_splitEdges from "./add/addVertices_splitEdges";

export default Object.assign(Object.create(null), {
	count,
	implied,
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
	subgraph,
	clip,
	fragment,
	getVerticesClusters,
	clone,
},
	make,
	boundary,
	walk,
	nearest,
	fold_spec,
	sort,
	span,
	maps,
	query,
	intersect,
	overlap,
	transform,
	verticesViolations,
	edgesViolations,
	vertices_collinear,
	facesLayer,
	edgesEdges,
	verticesCoordsFolded,
	faceSpanningTree,
	facesMatrix,
	facesWinding,
	explodeFacesMethods,
	arrays,
);
