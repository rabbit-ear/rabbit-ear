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
import * as subgraphMethods from "./subgraph.js";
import * as intersectMethods from "./intersect.js";
import * as triangulateMethods from "./triangulate.js";
import * as normals from "./normals.js";
import * as explodeMethods from "./explode.js";
import * as verticesClusters from "./vertices/clusters.js";
import * as verticesCollinear from "./vertices/collinear.js";
import * as verticesDuplicate from "./vertices/duplicate.js";
import * as verticesFolded from "./vertices/folded.js";
import * as verticesIsolated from "./vertices/isolated.js";
import * as edgesCircular from "./edges/circular.js";
import * as edgesDuplicate from "./edges/duplicate.js";
import * as edgesEdges from "./edges/edgesEdges.js";
import * as edgesOverlap from "./edges/overlap.js";
import * as facesMatrix from "./faces/matrix.js";
import * as facesOverlap from "./faces/overlap.js";
import * as facesSpanningTree from "./faces/spanningTree.js";
import * as facesWinding from "./faces/winding.js";
import transform from "./affine.js";
import count from "./count.js";
import countImplied from "./countImplied.js";
import connectedComponents from "./connectedComponents.js";
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
import planarize from "./planarize.js";
// todo: not sure about this organization
import * as arrays from "../general/arrays.js";
import clone from "../general/clone.js";
// import addVertices_splitEdges from "./add/addVertices_splitEdges.js";
import * as foldKeyMethods from "../fold/keys.js";
import * as foldSpecMethods from "../fold/spec.js";
import * as foldFileFrames from "../fold/fileFrames.js";
import * as foldBases from "../fold/bases.js";

export default {
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
	planarize,
	connectedComponents,
	clone,
	...foldKeyMethods,
	...foldSpecMethods,
	...foldFileFrames,
	...foldBases,
	...make,
	...boundary,
	...walk,
	...nearestMethods,
	...sortMethods,
	...span,
	...maps,
	...subgraphMethods,
	...intersectMethods,
	...triangulateMethods,
	...normals,
	...transform,
	...edgesEdges,
	...explodeMethods,
	...arrays,
	...verticesClusters,
	...verticesCollinear,
	...verticesDuplicate,
	...verticesFolded,
	...verticesIsolated,
	...edgesCircular,
	...edgesDuplicate,
	...edgesEdges,
	...edgesOverlap,
	...facesMatrix,
	...facesOverlap,
	...facesSpanningTree,
	...facesWinding,
};
