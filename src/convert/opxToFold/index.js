/**
 * Rabbit Ear (c) Kraft
 */
import makeEpsilon from "../general/makeEpsilon.js";
import window from "../../environment/window.js";
import {
	makeVerticesVertices,
	makeEdgesFoldAngle,
	makePlanarFaces,
} from "../../graph/make.js";
import { removeDuplicateVertices } from "../../graph/vertices/duplicate.js";
import planarize from "../../graph/planarize.js";
/**
 * @description given a parsed xml object, get the branch which
 * contains a node which has some node containing the value specified.
 */
const getContainingValue = (oripa, value) => Array
	.from(oripa.children)
	.filter(el => el.attributes.length && Array.from(el.attributes)
		.filter(attr => attr.nodeValue === value)
		.shift() !== undefined)
	.shift();
/**
 * @description There are top level nodes which contain metadata,
 * I'm not sure how many there are, but at least I've seen:
 * memo, originalAuthorName, title
 */
const getMetadataValue = (oripa, value) => {
	const parentNode = getContainingValue(oripa, value);
	const node = parentNode
		? Array.from(parentNode.children).shift()
		: null;
	return node
		? node.textContent
		: undefined;
};
/**
 * @description Get all line elements from the OPX file.
 */
const getLines = (oripa) => {
	const linesParent = getContainingValue(oripa, "lines");
	const linesNode = linesParent
		? Array.from(linesParent.children)
			.filter(el => el.className === "oripa.OriLineProxy")
			.shift()
		: undefined;
	return linesNode ? Array.from(linesNode.children) : [];
};

const nullXMLValue = { children: [{ textContent: "0" }] };
/**
 * @description For each ORIPA line, extract the coordinates
 * and the assignment type. Return each line as a simple
 * Javascript object. XML Entries will be missing if
 * their value is 0, this is taken care of. All values will be
 * parsed into floats.
 * @param {object[]} lines the result of calling getLines()
 */
const parseLines = (lines) => lines.map(line => {
	const attributes = Array.from(line.children[0].children);
	return ["type", "x0", "x1", "y0", "y1"]
		.map(key => parseFloat((attributes
			.filter(el => el.attributes[0].nodeValue === key)
			.shift() || nullXMLValue)
			.children[0]
			.textContent));
});
/**
 * @description ORIPA line assignments are numbered.
 */
const opxAssignment = ["F", "B", "M", "V", "U"];
const makeFOLD = (lines, epsilon) => {
	const fold = {};
	fold.vertices_coords = lines
		.flatMap(line => [[line[1], line[3]], [line[2], line[4]]]);
	fold.edges_vertices = lines.map((_, i) => [i * 2, i * 2 + 1]);
	fold.edges_assignment = lines.map(line => opxAssignment[line[0]]);
	fold.edges_foldAngle = makeEdgesFoldAngle(fold);
	// analysis on vertices_coords to find an appropriate epsilon
	const eps = typeof epsilon === "number"
		? epsilon
		: makeEpsilon(fold);
	removeDuplicateVertices(fold, eps);
	planarize(fold, eps);
	fold.vertices_vertices = makeVerticesVertices(fold);
	const faces = makePlanarFaces(fold);
	fold.faces_vertices = faces.faces_vertices;
	fold.faces_edges = faces.faces_edges;
	// replace these values with their entry inside the OPX file (if exists)
	return fold;
};
/**
 * @param {string} file an ORIPA file as a string
 */
const opxEdgeGraph = (file) => {
	const parsed = (new (window().DOMParser)())
		.parseFromString(file, "text/xml");
	const oripa = Array.from(parsed.documentElement.children)
		.filter(el => Array.from(el.classList).includes("oripa.DataSet"))
		.shift();
	const lines = parseLines(getLines(oripa));
	const fold = {};
	fold.vertices_coords = lines
		.flatMap(line => [[line[1], line[3]], [line[2], line[4]]]);
	fold.edges_vertices = lines.map((_, i) => [i * 2, i * 2 + 1]);
	fold.edges_assignment = lines.map(line => opxAssignment[line[0]]);
	fold.edges_foldAngle = makeEdgesFoldAngle(fold);
	return fold;
};

const setMetadata = (oripa, fold) => {
	const metadata = {
		file_description: "memo",
		file_author: "originalAuthorName",
		file_title: "title",
	};
	Object.keys(metadata).forEach(key => {
		metadata[key] = getMetadataValue(oripa, metadata[key]);
	});
	Object.keys(metadata)
		.filter(key => metadata[key])
		.forEach(key => { fold[key] = metadata[key]; });
	fold.file_classes = ["singleModel"];
	fold.frame_classes = ["creasePattern"];
};
/**
 * @description Convert an ORIPA file into a FOLD object
 * @param {string} file an ORIPA file as a string
 * @param {number} [epsilon=1e-6] an optional epsilon
 * used to merge nearby vertices
 * @returns {FOLD} a FOLD representation of the ORIPA file
 */
const opxToFold = (file, epsilon) => {
	try {
		const parsed = (new (window().DOMParser)())
			.parseFromString(file, "text/xml");
		const oripa = Array.from(parsed.documentElement.children)
			.filter(el => Array.from(el.classList).includes("oripa.DataSet"))
			.shift();
		const fold = makeFOLD(parseLines(getLines(oripa)), epsilon);
		setMetadata(oripa, fold);
		return fold;
	} catch (error) {
		console.error(error);
	}
	return undefined;
};

opxToFold.opxEdgeGraph = opxEdgeGraph;

export default opxToFold;
