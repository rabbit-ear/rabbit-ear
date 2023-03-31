/**
 * Rabbit Ear (c) Kraft
 */
import makeEpsilon from "../general/makeEpsilon.js";
import { makeEdgesFoldAngle } from "../../graph/make.js";
import planarizeGraph from "../general/planarizeGraph.js";
import { xmlStringToElement } from "../../svg/general/dom.js";
import { findEpsilonInObject } from "../general/options.js";
/**
 * @description given a parsed xml object, get the branch which
 * contains a node which has some node containing the value specified.
 */
const getContainingValue = (oripa, value) => (oripa == null
	? null
	: Array.from(oripa.childNodes)
		.filter(el => el.attributes && el.attributes.length)
		.filter(el => Array.from(el.attributes)
			.filter(attr => attr.nodeValue === value)
			.shift() !== undefined)
		.shift());
/**
 * @description There are top level nodes which contain metadata,
 * I'm not sure how many there are, but at least I've seen:
 * memo, originalAuthorName, title
 */
const getMetadataValue = (oripa, value) => {
	const parentNode = getContainingValue(oripa, value);
	const node = parentNode
		? Array.from(parentNode.childNodes).shift()
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
		? Array.from(linesParent.childNodes)
			.filter(el => el.getAttribute)
			.filter(el => el.getAttribute("class").split(" ").includes("oripa.OriLineProxy"))
			.shift()
		: undefined;
	return linesNode ? Array.from(linesNode.childNodes) : [];
};
/**
 * @description For each ORIPA line, extract the coordinates
 * and the assignment type. Return each line as a simple
 * Javascript object. XML Entries will be missing if
 * their value is 0, this is taken care of. All values will be
 * parsed into floats.
 * @param {object[]} lines the result of calling getLines()
 */
const parseLines = (lines) => lines
	.filter(line => line.nodeName === "void")
	.filter(line => line.childNodes)
	.map(line => getContainingValue(line, "oripa.OriLineProxy"))
	.filter(lineData => lineData)
	.map(lineData => ["type", "x0", "x1", "y0", "y1"]
		.map(key => getContainingValue(lineData, key))
		.map(el => (el ? Array.from(el.childNodes) : []))
		.map(children => children
			.filter(child => child.nodeName === "double" || child.nodeName === "int")
			.shift())
		.map(node => (node && node.childNodes[0] ? node.childNodes[0].data : "0"))
		.map(parseFloat));
/**
 * @description ORIPA line assignments are numbered.
 */
const opxAssignment = ["F", "B", "M", "V", "U"];

const makeFOLD = (lines) => {
	const fold = {};
	fold.vertices_coords = lines
		.flatMap(line => [[line[1], line[3]], [line[2], line[4]]]);
	fold.edges_vertices = lines.map((_, i) => [i * 2, i * 2 + 1]);
	fold.edges_assignment = lines.map(line => opxAssignment[line[0]]);
	fold.edges_foldAngle = makeEdgesFoldAngle(fold);
	return fold;
};
/**
 * @param {string} file an ORIPA file as a string
 */
const opxEdgeGraph = (file) => {
	const parsed = xmlStringToElement(file, "text/xml");
	const oripa = Array.from(parsed.childNodes)
		.filter(el => el.getAttribute)
		.filter(el => el.getAttribute("class").split(" ").includes("oripa.DataSet"))
		.shift();
	return makeFOLD(parseLines(getLines(oripa)));
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
 * @param {number | object} options an epsilon or an options object
 * used to merge nearby vertices
 * @returns {FOLD} a FOLD representation of the ORIPA file
 */
const opxToFold = (file, options) => {
	const parsed = xmlStringToElement(file, "text/xml");
	const children = parsed && parsed.childNodes
		? Array.from(parsed.childNodes)
		: [];
	const oripa = children
		.filter(el => el.getAttribute)
		.filter(el => el.getAttribute("class").split(" ").includes("oripa.DataSet"))
		.shift();
	const graph = makeFOLD(parseLines(getLines(oripa)));
	// analysis on vertices_coords to find an appropriate epsilon
	const epsilon = findEpsilonInObject(graph, options);
	const planarGraph = planarizeGraph(graph, epsilon);
	setMetadata(oripa, planarGraph);
	return planarGraph;
};

Object.assign(opxToFold, {
	opxEdgeGraph,
});

export default opxToFold;
