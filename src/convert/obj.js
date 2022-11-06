import {
	makeEdgesFaces,
	makeEdgesFoldAngleFromFaces,
	makeEdgesAssignment,
	makeFacesEdgesFromVertices,
	makeFacesNormal,
	makeFacesCenterQuick,
} from "../graph/make";

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
	// console.log("parsing OBJ", lines.length, "lines",
	// 	lines.filter(l => l[0] === "f" || l[0] === "F"), "faces",
	// 	lines.filter(l => l[0] === "v" || l[0] === "V"), "vertices");
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
	graph.edges_faces = makeEdgesFaces(graph);
	graph.edges_foldAngle = makeEdgesFoldAngleFromFaces(graph);
	graph.edges_assignment = makeEdgesAssignment(graph);
	delete graph.faces_normal;
	delete graph.faces_center;
	return graph;
};

export default objToFold;
