/**
 * Rabbit Ear (c) Kraft
 */
import { isFoldedForm } from "../../../fold/spec.js";
import { invertMap } from "../../../graph/maps.js";
import { makeFacesWinding } from "../../../graph/faces/winding.js";
import { addClass } from "../../../svg/general/dom.js";
import SVG from "../../../svg/index.js";
import { linearizeFaceOrders } from "../../../graph/orders.js";

const FACE_STYLE_FOLDED_ORDERED = {
	back: { fill: "white" },
	front: { fill: "#ddd" },
};
const FACE_STYLE_FOLDED_UNORDERED = {
	back: { opacity: 0.1 },
	front: { opacity: 0.1 },
};
const FACE_STYLE_FLAT = {
	// back: { fill: "white", stroke: "none" },
	// front: { fill: "#ddd", stroke: "none" }
};
const GROUP_STYLE_FOLDED_ORDERED = {
	stroke: "black",
	"stroke-linejoin": "bevel",
};
const GROUP_STYLE_FOLDED_UNORDERED = {
	stroke: "none",
	fill: "black",
	"stroke-linejoin": "bevel",
};
const GROUP_STYLE_FLAT = {
	fill: "none",
};

/**
 * todo: assuming faces_vertices instead of faces_edges
 * @returns {number[]} layers_face
 */
const fillInMissingFaces = (graph, faces_layer) => {
	const missingFaces = graph.faces_vertices
		.map((_, i) => i)
		.filter(i => faces_layer[i] == null);
	return missingFaces.concat(invertMap(faces_layer));
};
/**
 * @returns {number[]} layers_face
 */
const orderFaceIndices = (graph) => {
	if (graph.faceOrders) {
		return fillInMissingFaces(graph, invertMap(linearizeFaceOrders(graph)));
	}
	if (graph.faces_layer) {
		return fillInMissingFaces(graph, graph.faces_layer);
	}
	return graph.faces_vertices.map((_, i) => i).filter(() => true);
};

const setDataValue = (el, key, value) => el.setAttribute(`data-${key}`, value);

const applyFacesStyle = (el, attributes = {}) => Object.keys(attributes)
	.forEach(key => el.setAttributeNS(null, key, attributes[key]));

/**
 * @description this method will check for layer order, face windings,
 * and apply a style to each face accordingly, adds them to the group,
 * and applies style attributes to the group itself too.
 */
const finalize_faces = (graph, svg_faces, group, attributes) => {
	const isFolded = isFoldedForm(graph);
	// currently, layer order is determined by "faces_layer" key, and
	// ensuring that the length matches the number of faces in the graph.
	const orderIsCertain = !!(graph.faceOrders || graph.faces_layer);
	const classNames = [["front"], ["back"]];
	const faces_winding = makeFacesWinding(graph);
	// counter-clockwise faces are "face up", their front facing the camera
	// clockwise faces means "flipped", their back is facing the camera.
	// set these class names, and apply the style as attributes on each face.
	faces_winding.map(w => (w ? classNames[0] : classNames[1]))
		.forEach((className, i) => {
			addClass(svg_faces[i], className);
			setDataValue(svg_faces[i], "side", className);
			// svg_faces[i].classList.add(className);
			// svg_faces[i].setAttributeNS(null, "class", className);
			applyFacesStyle(svg_faces[i], (isFolded
				? (orderIsCertain
					? FACE_STYLE_FOLDED_ORDERED[className]
					: FACE_STYLE_FOLDED_UNORDERED[className])
				: FACE_STYLE_FLAT[className]));
			applyFacesStyle(svg_faces[i], attributes[className]);
		});
	// if the layer-order exists, sort the faces in order of faces_layer
	orderFaceIndices(graph).forEach(f => group.appendChild(svg_faces[f]));
	// these custom getters allows you to grab all "front" or "back" faces only.
	Object.defineProperty(group, "front", {
		get: () => svg_faces.filter((_, i) => faces_winding[i]),
	});
	Object.defineProperty(group, "back", {
		get: () => svg_faces.filter((_, i) => !faces_winding[i]),
	});
	// set style attributes to the group itself which contains the faces.
	applyFacesStyle(group, (isFolded
		? (orderIsCertain
			? GROUP_STYLE_FOLDED_ORDERED
			: GROUP_STYLE_FOLDED_UNORDERED)
		: GROUP_STYLE_FLAT));
	return group;
};
/**
 * @description build SVG faces using faces_vertices data. this is
 * slightly faster than the other method which uses faces_edges.
 * @returns {SVGElement[]} an SVG <g> group element containing all
 * of the <polygon> faces as children.
 */
export const facesVerticesPolygon = (graph, attributes = {}) => {
	const g = SVG.g();
	if (!graph || !graph.vertices_coords || !graph.faces_vertices) { return g; }
	const svg_faces = graph.faces_vertices
		.map(fv => fv.map(v => [0, 1].map(i => graph.vertices_coords[v][i])))
		.map(face => SVG.polygon(face));
	svg_faces.forEach((face, i) => face.setAttributeNS(null, "index", i)); // `${i}`));
	g.setAttributeNS(null, "fill", "white");
	return finalize_faces(graph, svg_faces, g, attributes);
};
/**
 * @description build SVG faces using faces_edges data. this is
 * slightly slower than the other method which uses faces_vertices.
 * @returns {SVGElement[]} an SVG <g> group element containing all
 * of the <polygon> faces as children.
 */
export const facesEdgesPolygon = function (graph, attributes = {}) {
	const g = SVG.g();
	if (!graph
		|| "faces_edges" in graph === false
		|| "edges_vertices" in graph === false
		|| "vertices_coords" in graph === false) {
		return g;
	}
	const svg_faces = graph["faces_edges"]
		.map(face_edges => face_edges
			.map(edge => graph["edges_vertices"][edge])
			.map((vi, i, arr) => {
				const next = arr[(i + 1) % arr.length];
				return (vi[1] === next[0] || vi[1] === next[1] ? vi[0] : vi[1]);
			// }).map(v => graph["vertices_coords"][v]))
			}).map(v => [0, 1].map(i => graph["vertices_coords"][v][i])))
		.map(face => SVG.polygon(face));
	svg_faces.forEach((face, i) => face.setAttributeNS(null, "index", i)); // `${i}`));
	g.setAttributeNS(null, "fill", "white");
	return finalize_faces(graph, svg_faces, g, attributes);
};

const drawFaces = (graph, options) => {
	if (graph && graph["faces_vertices"]) {
		return facesVerticesPolygon(graph, options);
	}
	if (graph && graph["faces_edges"]) {
		return facesEdgesPolygon(graph, options);
	}
	return SVG.g();
};

export default drawFaces;
