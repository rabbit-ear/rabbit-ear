/**
 * Rabbit Ear (c) Kraft
 */
import {
	// makeEdgesFaces,
	makeVerticesVerticesFromFaces,
	makeEdgesFacesUnsorted,
	makeEdgesFoldAngleFromFaces,
	makeEdgesAssignment,
	makeFacesEdgesFromVertices,
	makeFacesConvexCenter,
} from "../graph/make.js";
import { makeFacesNormal } from "../graph/normals.js";
import {
	file_spec,
	file_creator,
} from "../fold/rabbitear.js";

const newFoldFile = () => {
	const graph = {};
	graph.file_spec = file_spec;
	graph.file_creator = file_creator;
	graph.file_classes = ["singleModel"];
	graph.frame_classes = [];
	graph.frame_attributes = [];
	graph.vertices_coords = [];
	graph.faces_vertices = [];
	return graph;
};

const updateMetadata = (graph) => {
	if (!graph.edges_foldAngle || !graph.edges_foldAngle.length) { return; }
	let is2D = true;
	for (let i = 0; i < graph.edges_foldAngle.length; i += 1) {
		if (graph.edges_foldAngle[i] !== 0
			&& graph.edges_foldAngle[i] !== -180
			&& graph.edges_foldAngle[i] !== 180) {
			is2D = false;
			break;
		}
	}
	graph.frame_classes.push(is2D ? "creasePattern" : "foldedForm");
	graph.frame_attributes.push(is2D ? "2D" : "3D");
};

const pairify = (list) => list.map((val, i, arr) => [val, arr[(i + 1) % arr.length]]);

const makeEdgesVertices = ({ faces_vertices }) => {
	const edgeExists = {};
	const edges_vertices = [];
	faces_vertices
		.flatMap(pairify)
		.forEach(edge => {
			const keys = [edge.join(" "), `${edge[1]} ${edge[0]}`];
			if (keys[0] in edgeExists || keys[1] in edgeExists) { return; }
			edges_vertices.push(edge);
			edgeExists[keys[0]] = true;
		});
	return edges_vertices;
};

const parseFace = (face) => face
	.slice(1)
	.map(str => parseInt(str, 10) - 1);

const parseVertex = (vertex) => vertex
	.slice(1)
	.map(str => parseFloat(str));
/**
 * @description Convert an OBJ mesh file into a FOLD object. The conversion
 * will create edge definitions and give them assignments and fold angles
 * depending on the dihedral angles, or boundary edges if only one face is adjacent.
 * @param {string} obj a string containing the contents of an OBJ file,
 * expected to contain at least vertices and faces. All groups or object
 * separations are currently ignored, the contents are treated as one object.
 * @returns {object} a FOLD representation of the OBJ file.
 * @linkcode Origami ./src/convert/obj.js 77
 */
const objToFold = (file) => {
	const lines = file.split("\n").map(line => line.trim().split(/\s+/));
	const graph = newFoldFile();
	for (let i = 0; i < lines.length; i += 1) {
		// groups and objects ("g", "o") separation is currently ignored
		switch (lines[i][0].toLowerCase()) {
		case "f": graph.faces_vertices.push(parseFace(lines[i])); break;
		case "v": graph.vertices_coords.push(parseVertex(lines[i])); break;
		default: break;
		}
	}
	graph.faces_normal = makeFacesNormal(graph);
	graph.faces_center = makeFacesConvexCenter(graph);
	graph.edges_vertices = makeEdgesVertices(graph);
	graph.faces_edges = makeFacesEdgesFromVertices(graph);
	// graph.edges_faces = makeEdgesFaces(graph);
	graph.edges_faces = makeEdgesFacesUnsorted(graph);
	graph.edges_foldAngle = makeEdgesFoldAngleFromFaces(graph);
	graph.edges_assignment = makeEdgesAssignment(graph);
	graph.vertices_vertices = makeVerticesVerticesFromFaces(graph);
	// faces_normal and faces_center are not a part of the spec.
	// edges_faces was built unsorted. the sorted method is slower to construct,
	// and unnecessary for our purposes. the user can build this (and the
	// other incomplete fields) if they want them.
	delete graph.faces_normal;
	delete graph.faces_center;
	delete graph.edges_faces;
	updateMetadata(graph);
	return graph;
};

export default objToFold;
