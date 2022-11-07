import {
	// makeEdgesFaces,
	makeEdgesFacesUnsorted,
	makeEdgesFoldAngleFromFaces,
	makeEdgesAssignment,
	makeFacesEdgesFromVertices,
	makeFacesNormal,
	makeFacesCenterQuick,
} from "../graph/make";
import {
	file_spec,
	file_creator,
} from "../fold/keys";

const addMetadata = (graph) => {
	graph.file_spec = file_spec;
	graph.file_creator = file_creator;
	let frameClass = "creasePattern";
	for (let i = 0; i < graph.edges_foldAngle.length; i += 1) {
		if (graph.edges_foldAngle[i] !== 0
			&& graph.edges_foldAngle[i] !== -180
			&& graph.edges_foldAngle[i] !== 180) {
			frameClass = "foldedForm";
			break;
		}
	}
	graph.frame_classes = [frameClass];
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
 * @param {string} obj the contents of an OBJ file,
 * expected to contain vertices and faces
 */
const objToFold = (file) => {
	const lines = file.split("\n").map(line => line.trim().split(/\s+/));
	const graph = {
		vertices_coords: [],
		faces_vertices: [],
	};
	for (let i = 0; i < lines.length; i += 1) {
		// groups and objects ("g", "o") separation is currently ignored
		switch (lines[i][0].toLowerCase()) {
		case "f": graph.faces_vertices.push(parseFace(lines[i])); break;
		case "v": graph.vertices_coords.push(parseVertex(lines[i])); break;
		default: break;
		}
	}
	graph.faces_normal = makeFacesNormal(graph);
	graph.faces_center = makeFacesCenterQuick(graph);
	graph.edges_vertices = makeEdgesVertices(graph);
	graph.faces_edges = makeFacesEdgesFromVertices(graph);
	// graph.edges_faces = makeEdgesFaces(graph);
	graph.edges_faces = makeEdgesFacesUnsorted(graph);
	graph.edges_foldAngle = makeEdgesFoldAngleFromFaces(graph);
	graph.edges_assignment = makeEdgesAssignment(graph);
	delete graph.faces_normal;
	delete graph.faces_center;
	delete graph.edges_faces;
	addMetadata(graph);
	return graph;
};

export default objToFold;
