/**
 * Rabbit Ear (c) Kraft
 */
import * as foldColors from "../fold/colors.js";
import * as foldFileFrames from "../fold/frames.js";
import * as foldKeyMethods from "../fold/keys.js";
import * as foldSpecMethods from "../fold/spec.js";
import * as axioms from "./axioms.js";
import * as boundary from "./boundary.js";
import * as clip from "./clip.js";
import * as directedGraph from "./directedGraph.js";
import * as disjoint from "./disjoint.js";
import * as explodeMethods from "./explode.js";
import * as flaps from "./flaps.js";
import * as join from "./join.js";
import * as make from "./make.js";
import * as maps from "./maps.js";
import * as nearestMethods from "./nearest.js";
import * as normals from "./normals.js";
import * as orders from "./orders.js";
import * as pleat from "./pleat.js";
import * as span from "./span.js";
import * as subgraphMethods from "./subgraph.js";
import * as sweep from "./sweep.js";
import * as symmetry from "./symmetry.js";
import * as transform from "./transform.js";
import * as trees from "./trees.js";
import * as triangulateMethods from "./triangulate.js";
import * as walk from "./walk.js";
import * as verticesClusters from "./vertices/clusters.js";
import * as verticesCollinear from "./vertices/collinear.js";
import * as verticesDuplicate from "./vertices/duplicate.js";
import * as verticesFolded from "./vertices/folded.js";
import * as verticesIsolated from "./vertices/isolated.js";
import * as verticesSort from "./vertices/sort.js";
import * as edgesCircular from "./edges/circular.js";
import * as edgesDuplicate from "./edges/duplicate.js";
import * as edgesGeneral from "./edges/general.js";
import * as edgesLines from "./edges/lines.js";
import * as facesCoplanar from "./faces/coplanar.js";
import * as facesGeneral from "./faces/general.js";
import * as facesMatrix from "./faces/matrix.js";
// import * as facesSpanningTree from "./faces/spanningTree.js";
import * as facesWinding from "./faces/winding.js";
import * as intersectVertices from "./intersect/vertices.js";
import * as intersectEdges from "./intersect/edges.js";
import * as intersectEdgesEdges from "./intersect/edgesEdges.js";
import * as intersectEdgesFaces from "./intersect/edgesFaces.js";
import * as intersectFaces from "./intersect/faces.js";
import * as intersectFacesFaces from "./intersect/facesFaces.js";
// not sure about including this
import * as arrays from "../general/arrays.js";
// import addVertices from "./add/addVertices.js";
// import addEdges from "./add/addEdges.js";
import addVertex from "./add/addVertex.js";
import addNonPlanarEdge from "./add/addNonPlanarEdge.js";
import addPlanarLine from "./add/addPlanarLine.js";
import addPlanarSegment from "./add/addPlanarSegment.js";
import addPlanarSegmentNew from "./add/addPlanarSegmentNew.js";
import clean from "./clean.js";
import clone from "../general/clone.js";
import count from "./count.js";
import countImplied from "./countImplied.js";
import connectedComponents from "./connectedComponents.js";
import flatFold from "./flatFold/index.js";
import planarize from "./planarize.js";
import populate from "./populate.js";
import remove from "./remove.js";
import replace from "./replace.js";
import removePlanarVertex from "./remove/removePlanarVertex.js";
import removePlanarEdge from "./remove/removePlanarEdge.js";
import splitEdge from "./splitEdge/index.js";
import splitFace from "./splitFace/index.js";
import validate from "./validate.js";
// import addVertices_splitEdges from "./add/addVertices_splitEdges.js";
// not included because the Graph object places them in the same location
// import * as foldBases from "../fold/bases.js";

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
	// addVertices,
	// addEdges,
	splitEdge,
	splitFace,
	flatFold,
	addVertex,
	addNonPlanarEdge,
	addPlanarLine,
	addPlanarSegment,
	addPlanarSegmentNew,
	planarize,
	connectedComponents,
	clone,
	...foldColors,
	...foldFileFrames,
	...foldKeyMethods,
	...foldSpecMethods,
	...axioms,
	...boundary,
	...clip,
	...explodeMethods,
	...flaps,
	...join,
	...make,
	...maps,
	...nearestMethods,
	...normals,
	...orders,
	...pleat,
	...span,
	...subgraphMethods,
	...sweep,
	...symmetry,
	...directedGraph,
	...disjoint,
	...transform,
	...trees,
	...triangulateMethods,
	...walk,
	...arrays,
	...verticesClusters,
	...verticesCollinear,
	...verticesDuplicate,
	...verticesFolded,
	...verticesIsolated,
	...verticesSort,
	...edgesCircular,
	...edgesDuplicate,
	...edgesGeneral,
	...edgesLines,
	...facesCoplanar,
	...facesGeneral,
	...facesMatrix,
	// ...facesSpanningTree,
	...facesWinding,
	...intersectVertices,
	...intersectEdges,
	...intersectEdgesEdges,
	...intersectEdgesFaces,
	...intersectFaces,
	...intersectFacesFaces,
};
