/**
 * Rabbit Ear (c) Kraft
 */
import * as foldColors from "../fold/colors.js";
import * as foldFileFrames from "../fold/frames.js";
import * as foldKeyMethods from "../fold/keys.js";
import * as foldSpecMethods from "../fold/spec.js";
import * as boundary from "./boundary.js";
import * as connectedComponents from "./connectedComponents.js";
import * as directedGraph from "./directedGraph.js";
import * as disjoint from "./disjoint.js";
import * as explodeMethods from "./explode.js";
import * as flaps from "./flaps.js";
import * as intersect from "./intersect.js";
import * as join from "./join.js";
import * as make from "./make.js";
import * as maps from "./maps.js";
import * as nearestMethods from "./nearest.js";
import * as normals from "./normals.js";
import * as orders from "./orders.js";
import * as pleat from "./pleat.js";
import * as span from "./span.js";
import * as splitEdge from "./split/splitEdge.js";
import * as splitFace from "./split/splitFace.js";
import * as splitLine from "./split/splitLine.js";
import * as subgraphMethods from "./subgraph.js";
import * as sweep from "./sweep.js";
import * as symmetry from "./symmetry.js";
import * as transfer from "./transfer.js";
import * as transform from "./transform.js";
import * as trees from "./trees.js";
import * as triangulateMethods from "./triangulate.js";
import * as walk from "./walk.js";
import * as validate from "./validate.js";
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
import * as facesWinding from "./faces/winding.js";
import * as intersectVertices from "./intersect/vertices.js";
import * as intersectEdges from "./intersect/edges.js";
import * as intersectEdgesEdges from "./intersect/edgesEdges.js";
import * as intersectEdgesFaces from "./intersect/edgesFaces.js";
import * as intersectFaces from "./intersect/faces.js";
import * as intersectFacesFaces from "./intersect/facesFaces.js";
import * as foldCreasePattern from "./fold/foldCreasePattern.js";
import * as foldFoldedForm from "./fold/foldFoldedForm.js";
import * as flatFold from "./fold/flatFold.js";
// import addEdges from "./add/addEdges.js";
import addVertex from "./add/addVertex.js";
import addVertices from "./add/addVertices.js";
import addNonPlanarEdge from "./add/addNonPlanarEdge.js";
import addPlanarLine from "./add/addPlanarLine.js";
import addPlanarSegment from "./add/addPlanarSegment.js";
import addPlanarSegmentNew from "./add/addPlanarSegmentNew.js";
import clean from "./clean.js";
import count from "./count.js";
import countImplied from "./countImplied.js";
import normalize from "./normalize.js";
import planarize from "./planarize.js";
import populate from "./populate.js";
import remove from "./remove.js";
import replace from "./replace.js";
// import addVertices_splitEdges from "./add/addVertices_splitEdges.js";
// not included because the Graph object places them in the same location
// import * as foldBases from "../fold/bases.js";

export default {
	count,
	countImplied,
	clean,
	populate,
	remove,
	replace,
	// addVertices,
	// addEdges,
	flatFold,
	normalize,
	addVertex,
	addVertices,
	addNonPlanarEdge,
	addPlanarLine,
	addPlanarSegment,
	addPlanarSegmentNew,
	planarize,
	...foldColors,
	...foldFileFrames,
	...foldKeyMethods,
	...foldSpecMethods,
	...boundary,
	...connectedComponents,
	...directedGraph,
	...disjoint,
	...explodeMethods,
	...flaps,
	...intersect,
	...join,
	...make,
	...maps,
	...nearestMethods,
	...normals,
	...orders,
	...pleat,
	...span,
	...splitEdge,
	...splitFace,
	...splitLine,
	...subgraphMethods,
	...sweep,
	...symmetry,
	...transfer,
	...transform,
	...trees,
	...triangulateMethods,
	...walk,
	...validate,
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
	...facesWinding,
	...intersectVertices,
	...intersectEdges,
	...intersectEdgesEdges,
	...intersectEdgesFaces,
	...intersectFaces,
	...intersectFacesFaces,
	...foldCreasePattern,
	...foldFoldedForm,
	...flatFold,
};
