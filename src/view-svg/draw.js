import math from "../../include/math";
import { bounding_rect } from "../FOLD/boundary";
// import { get_delaunay_faces_vertices } from "../delaunay";

// export const drawDelaunay = function (graph, group) {
//   if ("faces_vertices" in graph === false
//   || "edges_vertices" in graph === false
//   || "vertices_coords" in graph === false) { return; }
//   const triangle_vertices = get_delaunay_faces_vertices(graph);
//   triangle_vertices.forEach((tv) => {
//     const points = tv.map(v => graph.vertices_coords[v]);
//     // group.polygon(points).stroke("black").fill("#0003");
//     group.polygon(points).setAttribute("style", "stroke:black; fill:#0003; stroke-width:0.003");
//   });
// };

export const drawLabels = function (graph, group) {
  if ("faces_vertices" in graph === false
  || "edges_vertices" in graph === false
  || "vertices_coords" in graph === false) { return; }
  const r = bounding_rect(graph);
  const vmin = r[2] > r[3] ? r[3] : r[2];
  const fSize = vmin * 0.04;
  const labels_style = {
    vertices: `fill:#27b;font-family:sans-serif;font-size:${fSize}px;`,
    edges: `fill:#e53;font-family:sans-serif;font-size:${fSize}px;`,
    faces: `fill:black;font-family:sans-serif;font-size:${fSize}px;`,
  };
  const m = [fSize * 0.33, fSize * 0.4];
  // vertices
  graph.vertices_coords
    .map((c, i) => group.text(`${i}`, c[0] - m[0], c[1] + m[1]))
    .forEach(t => t.setAttribute("style", labels_style.vertices));
  // edges
  graph.edges_vertices
    .map(ev => ev.map(v => graph.vertices_coords[v]))
    .map(verts => math.core.average(verts))
    .map((c, i) => group.text(`${i}`, c[0] - m[0], c[1] + m[1]))
    .forEach(t => t.setAttribute("style", labels_style.edges));
  // faces
  graph.faces_vertices
    .map(fv => fv.map(v => graph.vertices_coords[v]))
    .map(verts => math.core.average(verts))
    .map((c, i) => group.text(`${i}`, c[0] - m[0], c[1] + m[1]))
    .forEach(t => t.setAttribute("style", labels_style.faces));
};

export const drawDebug = function (graph, group) {
  const r = bounding_rect(graph);
  const vmin = r[2] > r[3] ? r[3] : r[2];
  const strokeW = vmin * 0.005;
  const debug_style = {
    faces_vertices: `fill:#555;stroke:none;stroke-width:${strokeW};`,
    faces_edges: `fill:#aaa;stroke:none;stroke-width:${strokeW};`,
  };
  graph.faces_vertices
    .map(fv => fv.map(v => graph.vertices_coords[v]))
    .map(face => math.convexPolygon(face).scale(0.666).points)
    .map(points => group.polygon(points))
    .forEach(poly => poly.setAttribute("style", debug_style.faces_vertices));
  graph.faces_edges
    .map(face_edges => face_edges
      .map(edge => graph.edges_vertices[edge])
      .map((vi, i, arr) => {
        const next = arr[(i + 1) % arr.length];
        return (vi[1] === next[0] || vi[1] === next[1] ? vi[0] : vi[1]);
      }).map(v => graph.vertices_coords[v]))
    .map(face => math.convexPolygon(face).scale(0.333).points)
    .map(points => group.polygon(points))
    .forEach(poly => poly.setAttribute("style", debug_style.faces_edges));
};

export const drawDiagram = function (graph, group, preferences = {}) {
  const r = bounding_rect(graph);
  const vmin = r[2] > r[3] ? r[3] : r[2];
  const diagrams = graph["re:diagrams"];
  if (diagrams == null) { return; }
  diagrams
    .map(d => d["re:diagram_arrows"])
    .filter(a => a != null)
    .forEach(arrow => arrow
      .map(a => a["re:diagram_arrow_coords"])
      .filter(a => a.length > 0)
      .map((p) => {
        // console.log("arrow", p);
        // learn arrow so the arc is always "up". if the two X parameters
        // are too close to each other, lean the arrow to center of paper.
        let side = p[0][0] < p[1][0];
        if (Math.abs(p[0][0] - p[1][0]) < 0.1) { // xs are ~ the same
          side = p[0][1] < p[1][1]
            ? p[0][0] < 0.5
            : p[0][0] > 0.5;
        }
        if (Math.abs(p[0][1] - p[1][1]) < 0.1) { // if ys are the same
          side = p[0][0] < p[1][0]
            ? p[0][1] > 0.5
            : p[0][1] < 0.5;
        }
        const prefs = {
          side,
          // head: { width: vmin * 0.035, height: vmin * 0.09, visible: true },
          // length: vmin * 0.09,
          // width: vmin * 0.035,
          // fill: "black",
          strokeWidth: vmin * 0.02,
          // curve: 0.3
        };
        if (preferences.arrowColor) { prefs.color = preferences.arrowColor; }
        // todo, those parameters aren't generalized beyond a unit square
        return group.arrow(p[0], p[1], prefs)
          .curve(0.3)
          .head({ width: vmin * 0.035, height: vmin * 0.09 })
          .fill("black")
          .stroke("black");
      }));
};

// if ("re:construction" in graph === false) { return; }
// let construction = graph["re:construction"];
// let diagram = constructon_to_diagram(construction);
