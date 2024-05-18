/**
 * Rabbit Ear (c) Kraft
 */
import {
	EPSILON,
} from "../math/constant.js";
import {
	cross2,
	subtract2,
} from "../math/vector.js";
import {
	clone,
} from "../general/clone.js";
import {
	invertArrayToFlatMap,
	invertFlatToArrayMap,
} from "./maps.js";
import {
	subgraphWithFaces,
} from "./subgraph.js";
import {
	connectedComponents,
} from "./connectedComponents.js";
import {
	makeFacesFaces,
} from "./make/facesFaces.js";
import {
	makeFacesCenter2DQuick,
} from "./make/faces.js";
import {
	foldLine,
} from "./fold/foldGraph.js";

/**
 * @description Divide a folded graph with a line and return lists of connected
 * faces (flaps). The result is returned as two sets representing either side
 * of the line, inside each set is a list of connected faces arrays.
 * Currently, flat folded crease patterns only (2D)
 * @param {FOLD} graph a FOLD object
 * @param {VecLine2} line
 * @param {[number, number][]} [vertices_coordsFolded]
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {[ number[][], number[][] ]} left and right sides, each side
 * contains a list of lists of faces, groups of connected sets of faces (flaps).
 */
export const getFlaps = ({
	vertices_coords, edges_vertices, faces_vertices,
}, line, vertices_coordsFolded = undefined, epsilon = EPSILON) => {
	const graph = clone({ vertices_coords, edges_vertices, faces_vertices });
	const {
		vertices,
		faces: { map }
	} = foldLine(graph, line, { assignment: "F", vertices_coordsFolded }, epsilon);
	const backmap = invertArrayToFlatMap(map);

	const folded = { ...graph, vertices_coords: vertices.folded };
	const faces_faces = makeFacesFaces(graph);
	const faces_center = makeFacesCenter2DQuick(folded);
	const faces_side = faces_center
		.map(point => subtract2(point, line.origin))
		.map(vector => cross2(vector, line.vector))
		.map(Math.sign)
		.map(s => (s + 1) / 2); // convert to 0, 1
	const sidesFaces = invertFlatToArrayMap(faces_side);
	// two subgraphs, each containing only the faces from either side of the line
	const sidesGraphs = sidesFaces
		.map(faces => subgraphWithFaces({ faces_faces }, faces));

	// convert each side into connected components (this first comes in as an
	// inverted result, faces_set, convert it to sets_faces)
	const sidesConnectedFaces = sidesGraphs
		.map(({ faces_faces }) => connectedComponents(faces_faces))
		.map(invertFlatToArrayMap);

	// console.log("map", map);
	// console.log("backmap", backmap);
	const [sideA, sideB] = sidesConnectedFaces
		.map(connectedFaces => connectedFaces
			.map(faces => faces
				.map(face => backmap[face])));
	return [sideA, sideB];
};
