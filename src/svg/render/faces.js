/**
 * fold to svg (c) Robby Kraft
 */
import * as K from "../keys";
import math from "../../math";

import SVG from "../../extensions/svg";
const Libraries = { SVG };

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

const finalize_faces = function (graph, svg_faces, group) {
  const isFoldedForm = typeof graph.frame_classes === K.object
    && graph.frame_classes !== null
    && !(graph.frame_classes.includes(K.creasePattern));
  // todo: include other ways of determining faces_ordering
  const orderIsCertain = graph[K.faces_re_layer] != null
    && graph[K.faces_re_layer].length === graph[K.faces_vertices].length;
  const classNames = [ [K.front], [K.back] ]
    // .map(arr => {
    //   if (isFoldedForm) { arr.push("foldedForm"); }
    //   return arr;
    // })
		.map(arr => arr.join(" "));
  const faceDir = get_faces_winding(graph).map(c => c < 0)
  faceDir.map(w => (w ? classNames[0] : classNames[1]))
    .forEach((className, i) => svg_faces[i][K.setAttributeNS](null, K._class, className));
	
	Object.defineProperty(group, "front", {
		get: () => svg_faces.filter((_, i) => faceDir[i]),
	});
	Object.defineProperty(group, "back", {
		get: () => svg_faces.filter((_, i) => !faceDir[i]),
	});

  const facesInOrder = (orderIsCertain
    ? faces_sorted_by_layer(graph[K.faces_re_layer]).map(i => svg_faces[i])
    : svg_faces);

	facesInOrder.forEach(face => group[K.appendChild](face));
	return group;
};

export const faces_vertices_polygon = function (graph) {
	const g = Libraries.SVG.g();
  if (K.faces_vertices in graph === false
    || K.vertices_coords in graph === false) {
    return g;
  }
  const svg_faces = graph[K.faces_vertices]
    // .map(fv => fv.map(v => graph[K.vertices_coords][v]))
    .map(fv => fv.map(v => [0, 1].map(i => graph[K.vertices_coords][v][i])))
    .map(face => Libraries.SVG.polygon(face));
  svg_faces.forEach((face, i) => face[K.setAttributeNS](null, K.index, i)); // `${i}`));
	g[K.setAttributeNS](null, "fill", "white");
  return finalize_faces(graph, svg_faces, g);
};

export const faces_edges_polygon = function (graph) {
	const g = Libraries.SVG.g();
  if (K.faces_edges in graph === false
    || K.edges_vertices in graph === false
    || K.vertices_coords in graph === false) {
    return g;
  }
  const svg_faces = graph[K.faces_edges]
    .map(face_edges => face_edges
      .map(edge => graph[K.edges_vertices][edge])
      .map((vi, i, arr) => {
        const next = arr[(i + 1) % arr.length];
        return (vi[1] === next[0] || vi[1] === next[1] ? vi[0] : vi[1]);
      // }).map(v => graph[K.vertices_coords][v]))
      }).map(v => [0, 1].map(i => graph[K.vertices_coords][v][i])))
    .map(face => Libraries.SVG.polygon(face));
  svg_faces.forEach((face, i) => face[K.setAttributeNS](null, K.index, i)); // `${i}`));
	g[K.setAttributeNS](null, "fill", "white");
  return finalize_faces(graph, svg_faces, g);
};

