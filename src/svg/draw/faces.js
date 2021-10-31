/**
 * Rabbit Ear (c) Robby Kraft
 */
import * as S from "../../symbols/strings";
import math from "../../math";
import { is_folded_form } from "../../graph/query";
// get the SVG library from its binding to the root of the library
import root from "../../root";

const FACE_STYLE_FOLDED = {
	back: { fill: "white" },
	front: { fill: "#ddd" }
};
const FACE_STYLE_FLAT = {
	// back: { fill: "white", stroke: "none" },
	// front: { fill: "#ddd", stroke: "none" }
};
const GROUP_STYLE_FOLDED = {
	stroke: "black",
	"stroke-linejoin": "bevel"
};
const GROUP_STYLE_FLAT = {
	fill: "none"
};

// todo: include sorting with "facesOrder"
const get_faces_winding = (graph) => graph
  .faces_vertices
  .map(fv => fv.map(v => graph.vertices_coords[v]) // face coords
    .map((c, i, arr) => [c, arr[(i + 1) % arr.length], arr[(i + 2) % arr.length]])
    .map(tri => math.core.cross2(
      math.core.subtract(tri[1], tri[0]),
      math.core.subtract(tri[2], tri[1]),
    )).reduce((a, b) => a + b, 0));

const faces_sorted_by_layer = function (faces_layer) {
  return faces_layer.map((layer, i) => ({ layer, i }))
    .sort((a, b) => a.layer - b.layer)
    .map(el => el.i);
};

const apply_style = (el, attributes = {}) => Object.keys(attributes)
	.forEach(key => el.setAttributeNS(null, key, attributes[key]));

const finalize_faces = (graph, svg_faces, group, attributes) => {
	const isFolded = is_folded_form(graph);
  // todo: include other ways of determining faces_ordering
  const orderIsCertain = graph[S.faces_re_layer] != null
    && graph[S.faces_re_layer].length === graph[S.faces_vertices].length;
  const classNames = [ [S.front], [S.back] ];
  const faceDir = get_faces_winding(graph).map(c => c < 0)
  faceDir.map(w => (w ? classNames[0] : classNames[1]))
    .forEach((className, i) => {
			svg_faces[i].setAttributeNS(null, S._class, className);
			apply_style(svg_faces[i], isFolded
				? FACE_STYLE_FOLDED[className]
				: FACE_STYLE_FLAT[className]);
			apply_style(svg_faces[i], attributes[className]);
		});

  const facesInOrder = (orderIsCertain
    ? faces_sorted_by_layer(graph[S.faces_re_layer]).map(i => svg_faces[i])
    : svg_faces);
	facesInOrder.forEach(face => group.appendChild(face));
	
	Object.defineProperty(group, "front", {
		get: () => svg_faces.filter((_, i) => faceDir[i]),
	});
	Object.defineProperty(group, "back", {
		get: () => svg_faces.filter((_, i) => !faceDir[i]),
	});

	apply_style(group, isFolded ? GROUP_STYLE_FOLDED : GROUP_STYLE_FLAT);
	return group;
};

export const faces_vertices_polygon = (graph, attributes = {}) => {
	const g = root.svg.g();
	if (!graph || !graph.vertices_coords || !graph.faces_vertices) { return g; }
  const svg_faces = graph.faces_vertices
    .map(fv => fv.map(v => [0, 1].map(i => graph.vertices_coords[v][i])))
    .map(face => root.svg.polygon(face));
  svg_faces.forEach((face, i) => face.setAttributeNS(null, S.index, i)); // `${i}`));
	g.setAttributeNS(null, "fill", "white");
  return finalize_faces(graph, svg_faces, g, attributes);
};

export const faces_edges_polygon = function (graph, attributes = {}) {
	const g = root.svg.g();
  if (!graph
    || S.faces_edges in graph === false
    || S.edges_vertices in graph === false
    || S.vertices_coords in graph === false) {
    return g;
  }
  const svg_faces = graph[S.faces_edges]
    .map(face_edges => face_edges
      .map(edge => graph[S.edges_vertices][edge])
      .map((vi, i, arr) => {
        const next = arr[(i + 1) % arr.length];
        return (vi[1] === next[0] || vi[1] === next[1] ? vi[0] : vi[1]);
      // }).map(v => graph[S.vertices_coords][v]))
      }).map(v => [0, 1].map(i => graph[S.vertices_coords][v][i])))
    .map(face => root.svg.polygon(face));
  svg_faces.forEach((face, i) => face.setAttributeNS(null, S.index, i)); // `${i}`));
	g.setAttributeNS(null, "fill", "white");
  return finalize_faces(graph, svg_faces, g, attributes);
};
