/**
 * Rabbit Ear (c) Kraft
 */
import {
	topologicalSort,
} from "./directedGraph.js";
import {
	join,
} from "./join.js";
import {
	makeEdgesFacesUnsorted,
} from "./make/edgesFaces.js";
import {
	invertArrayMap,
	invertFlatMap,
} from "./maps.js";
import {
	makeFacesNormal,
} from "./normals.js";
import {
	faceOrdersToDirectedEdges,
	linearizeFaceOrders,
} from "./orders.js";
import {
	planarizeVerbose,
} from "./planarize/planarize.js";

/**
 * @param {FOLD} planar
 * @param {number[][]} backmap
 * @return {FOLD}
 */
const makeOneSide = (planar, backmap) => {
	planar.edges_faces.forEach((faces, e) => {
		if (faces.length !== 2) { return; }
		const [a, b] = faces.map(f => backmap[f]);
		// console.log("edge", e, a[0], b[0], "from", a, b);
		if (a[0] === b[0]) {
			planar.edges_assignment[e] = "J";
			// planar.edges_foldAngle[e] = 0;
		}
	});
	return planar;
};

/**
 * @description {FOLD} graph a FOLD object in foldedForm, can contain holes.
 * @param {FOLD} graph a FOLD object
 * @returns {FOLD}
 */
export const fixCycles = (graph) => {
	const {
		result: planar,
		changes: { faces: { map } },
	} = planarizeVerbose(graph);
	planar.edges_faces = makeEdgesFacesUnsorted(planar);
	const facesBackMap = invertArrayMap(map);

	// this should happen on the input graph, not the planar graph.
	const faces_normal = makeFacesNormal(graph);
	const directedFacesOld = faceOrdersToDirectedEdges({ ...graph, faces_normal });
	// const layers_face = linearizeFaceOrders(graph);
	// const faces_layer = invertFlatMap(layers_face);

	// backmap contains values with old face indices
	const facesBackMapOrdered = facesBackMap.map(faces => {
		const lookup = {};
		faces.forEach(f => { lookup[f] = true; });
		const theseFaces = directedFacesOld.filter(([a, b]) => lookup[a] && lookup[b]);
		const facesSorted = topologicalSort(theseFaces);
		const missingFaces = faces.filter(f => facesSorted.indexOf(f) === -1);
		return missingFaces.concat(facesSorted); // .reverse();
	});

	const front = makeOneSide({
		...planar,
		edges_assignment: structuredClone(planar.edges_assignment),
	}, facesBackMapOrdered);

	const back = makeOneSide({
		...planar,
		edges_assignment: structuredClone(planar.edges_assignment),
	}, facesBackMapOrdered.map(arr => arr.reverse()));

	// console.log("nextmap", map);
	// console.log("backmap", facesBackMap);
	// console.log("facesBackMapOrdered", facesBackMapOrdered);
	// console.log("faces_normal", faces_normal);
	// console.log("directedFacesOld", directedFacesOld);
	// console.log("layers_face", layers_face);
	// console.log("faces_layer", faces_layer);
	// console.log(planar);

	// join(front, back);
	return front;
	// return back;
};
