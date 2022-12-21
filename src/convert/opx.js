import math from "../math";
import window from "../environment/window";
import {
	makeVerticesVertices,
	makeEdgesFoldAngle,
	makePlanarFaces,
} from "../graph/make";
import { removeDuplicateVertices } from "../graph/verticesViolations";
/**
 *
 */
const getContainingValue = (oripa, key) => Array
	.from(oripa.children)
	.filter(el => el.attributes.length && Array.from(el.attributes)
		.filter(attr => attr.nodeValue === key)
		.shift() !== undefined)
	.shift();
/**
 * @description There are top level nodes which contain metadata,
 * I'm not sure how many there are, but at least I've seen:
 * memo, originalAuthorName, title
 */
const getMetadataValue = (oripa, key) => {
	const parentNode = getContainingValue(oripa, key);
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
 * I'm not sure how many types of lines there are,
 * or which one (2,3) is mountain and valley.
 */
const opxAssignment = {
	0: "U", // not sure what this is
	1: "B", // boundary
	2: "M", // unsure which is M and V
	3: "V", // unsure which is M and V
	4: "U", // not sure if used
	5: "U", // not sure if used
};
const makeFOLD = (lines, epsilon) => {
	const fold = {};
	fold.vertices_coords = lines
		.flatMap(line => [[line[1], line[3]], [line[2], line[4]]]);
	fold.edges_vertices = lines.map((_, i) => [i * 2, i * 2 + 1]);
	fold.edges_assignment = lines.map(line => opxAssignment[line[0]]);
	fold.edges_foldAngle = makeEdgesFoldAngle(fold);
	// analysis on vertices_coords to find an appropriate epsilon
	if (epsilon === undefined) {
		const { span } = math.core.boundingBox(fold.vertices_coords);
		epsilon = Math.min(...span) * 1e-6;
	}
	removeDuplicateVertices(fold, epsilon);
	fold.vertices_vertices = makeVerticesVertices(fold);
	const faces = makePlanarFaces(fold);
	fold.faces_vertices = faces.map(el => el.vertices);
	fold.faces_edges = faces.map(el => el.edges);
	// replace these values with their entry inside the OPX file (if exists)
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
 * @description Convert an ORIPA file (string) into an SVG (string).
 * @param {string} oripa an oripa file as a string
 * @returns {string} an SVG rendering of the ORIPA file
 */
const opxToFOLD = (file, epsilon) => {
	try {
		const parsed = (new DOMParser()).parseFromString(file, "text/xml");
		const oripa = Array.from(parsed.documentElement.children)
			.filter(el => Array.from(el.classList).includes("oripa.DataSet"))
			.shift();
		const fold = makeFOLD(parseLines(getLines(oripa)), epsilon);
		setMetadata(oripa, fold);
		return fold;
	} catch (error) {
		console.error("ORIPA bad file format", error);
	}
	return undefined;
};

export default opxToFOLD;
