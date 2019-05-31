/**
 * this returns a copy of the graph with new crease lines.
 * does not modify input graph's geometry, but does append "re:" data
 * any additional non-standard-FOLD data will be copied over as well.
 */
// for now, this uses "faces_re:layer", todo: use faceOrders

import math from "../../include/math";

import {
  clone,
} from "../fold_format/object";

import {
  split_convex_polygon,
} from "../graph/planargraph";

import {
  fold_vertices_coords,
  foldLayers,
} from "./fold";

import {
  faces_count,
  face_containing_point,
  two_furthest_points,
} from "../graph/query";

import {
  faces_coloring,
  make_faces_matrix,
  faces_matrix_coloring,
  face_center_pt_average,
} from "../graph/make";

import {
  construction_frame,
} from "./diagram";


export default function(
  graph,
  point,
  vector,
  face_index,
  crease_direction = "V"
){
  let opposite_crease = (crease_direction === "M" || crease_direction === "m"
    ? "V" : "M");
  if (face_index == null) {
    // an unset face will be the face under the point. or if none, index 0
    let containing_point = face_containing_point(graph, point);
    // todo, if it's still unset, find the point 
    face_index = (containing_point === undefined) ? 0 : containing_point;
  }

  prepare_extensions(graph);
  prepare_to_fold(graph, point, vector, face_index);

  let folded = clone(graph);

  // one by one, pair up each face with each (reflected) crease line,
  // if they intersect, chop the face into 2, 
  // becoming an array of {} or undefined, whether the face was split or not
  // because split_convex_polygon() calls Graph.remove_faces() we need to
  // iterate through the faces in reverse order.
  let faces_split = Array.from(Array(faces_count(graph)))
    .map((_,i) => i)
    .reverse()
    .map(i => {
      let diff = split_convex_polygon(
        folded, i,
        folded["faces_re:creases"][i][0],
        folded["faces_re:creases"][i][1],
        folded["faces_re:coloring"][i] ? crease_direction : opposite_crease
      );
      if (diff == null || diff.faces == null) { return undefined; }
      // console.log("diff", diff);
      diff.faces.replace.forEach(replace => 
        replace.new.map(el => el.index)
          .map(index => index + diff.faces.map[index])
            // new indices post-face removal
          .forEach(i => {
            folded["faces_re:center"][i] = face_center_pt_average(folded, i);
            folded["faces_re:sidedness"][i] = get_face_sidedness(
              graph["faces_re:creases"][replace.old][0],
              graph["faces_re:creases"][replace.old][1],
              folded["faces_re:center"][i],
              graph["faces_re:coloring"][replace.old]
            );
            folded["faces_re:layer"][i] = graph["faces_re:layer"][replace.old];
            folded["faces_re:preindex"][i] =
              graph["faces_re:preindex"][replace.old];
          })
      );
      return {
        index: i,
        length: diff.edges.new[0].length,
        edge: diff.edges.new[0].vertices.map(v => folded.vertices_coords[v])
      };
    }).reverse(); // reverse a reverse. back to ordering 0,1,2,3,4...

  // get new face layer ordering
  folded["faces_re:layer"] =
    foldLayers(folded["faces_re:layer"], folded["faces_re:sidedness"]);

  // build new face matrices for the folded state. use face 0 as reference
  // we need its original matrix, and if face 0 was split we need to know
  // which of its two new faces doesn't move as the new faces matrix
  // calculation requires we provide the one face that doesn't move.
  let face_0_newIndex = (faces_split[0] === undefined
    ? 0
    : folded["faces_re:preindex"]
        .map((pre,i) => ({pre, new:i}))
        .filter(obj => obj.pre === 0)
        .filter(obj => folded["faces_re:sidedness"][obj.new])
        .shift().new);
  // only if face 0 lies on the not-flipped side (sidedness is false),
  // and it wasn't creased-through, can we use its original matrix.
  // if face 0 lies on the flip side (sidedness is true), or it was split,
  // face 0 needs to be multiplied by its crease's reflection matrix
  let face_0_preMatrix = 
    (faces_split[0] === undefined && !graph["faces_re:sidedness"][0]
      ? graph["faces_re:matrix"][0]
      : math.core.multiply_matrices2(
          graph["faces_re:matrix"][0],
          math.core.make_matrix2_reflection(
            graph["faces_re:creases"][0][1],
            graph["faces_re:creases"][0][0]
          )
        )
    );
  // build our new faces_matrices using face 0 as the starting point,
  // setting face 0 as the identity matrix, then multiply every
  // face's matrix by face 0's actual starting matrix
  let folded_faces_matrix = make_faces_matrix(folded, face_0_newIndex)
    .map(m => math.core.multiply_matrices2(face_0_preMatrix, m));
  // faces coloring is useful for determining if a face is flipped or not
  folded["faces_re:coloring"] = faces_matrix_coloring(folded_faces_matrix);
  // "construction" section that includes:
  // - what type of operation occurred: valley / mountain fold, flip over
  // - the edge that draws the fold-line, useful for diagramming
  // - the direction of the fold or flip
  let crease_0 = math.core.multiply_line_matrix2(
    graph["faces_re:creases"][0][0],
    graph["faces_re:creases"][0][1],
    face_0_preMatrix
  );
  let fold_direction = math.core.normalize([crease_0[1][1], -crease_0[1][0]]);
  // faces_split contains the edges that clipped each of the original faces
  // gather them all together, and reflect them using the original faces'
  // matrices so the lines lie on top of one another
  // use that to get the longest-spanning edge that clips through all faces
  let split_points = faces_split
    .map((el, i) => el === undefined ? undefined : el.edge.map(p =>
      math.core.multiply_vector2_matrix2(p, graph["faces_re:matrix"][i])
    )).filter(a => a !== undefined)
    .reduce((a,b) => a.concat(b), []);


  folded["re:construction"] = (split_points.length === 0
    ? construction_frame("flip", {direction: fold_direction})
    : construction_frame(opposite_crease === "M" ? "valley":"mountain", {
        direction: fold_direction,
        edge: two_furthest_points(split_points)
      })
    );

  let folded_frame = {
    vertices_coords: fold_vertices_coords(
      folded,
      face_0_newIndex,
      folded_faces_matrix
    ),
    frame_classes: ["foldedForm"],
    frame_inherit: true,
    frame_parent: 0, // this is not always the case. maybe shouldn't imply
    // "face_re:stationary": new_face_stationary,
    "faces_re:matrix": folded_faces_matrix
  };

  folded.file_frames = [folded_frame];

  // let need_to_remove = [
  //  "faces_re:center",
  //  "faces_re:coloring",
  //  "faces_re:creases",
  //  "faces_re:layer",
  //  "faces_re:matrix",
  //  "faces_re:preindex",
  //  "faces_re:sidedness",
  //  "faces_re:to_move"
  // ];

  return folded;
}


const prepare_to_fold = function(graph, point, vector, face_index) {
  let faceCount = faces_count(graph);
  graph["faces_re:preindex"] = Array.from(Array(faceCount)).map((_,i)=>i);
  // graph["faces_re:coloring"] = faces_coloring(graph, face_index);
  // do we need to rebuild faces matrices? can we grab it from the frame?
  let frame0ContainsMatrices = (graph.file_frames != null
    && graph.file_frames.length > 0
    && graph.file_frames[0]["faces_re:matrix"] != null
    && graph.file_frames[0]["faces_re:matrix"].length === faceCount);
  graph["faces_re:matrix"] = frame0ContainsMatrices
    ? clone(graph.file_frames[0]["faces_re:matrix"])
    : make_faces_matrix(graph, face_index);
  graph["faces_re:coloring"] =
    faces_matrix_coloring(graph["faces_re:matrix"]);
  // crease lines are calculated using each face's INVERSE matrix
  graph["faces_re:creases"] = graph["faces_re:matrix"]
    .map(mat => math.core.make_matrix2_inverse(mat))
    .map(mat => math.core.multiply_line_matrix2(point, vector, mat));
  graph["faces_re:center"] = Array.from(Array(faceCount))
    .map((_, i) => face_center_pt_average(graph, i));
  graph["faces_re:sidedness"] = Array.from(Array(faceCount))
    .map((_, i) => get_face_sidedness(
      graph["faces_re:creases"][i][0],
      graph["faces_re:creases"][i][1],
      graph["faces_re:center"][i],
      graph["faces_re:coloring"][i]
    ));
}

const prepare_extensions = function(graph) {
  let facesCount = faces_count(graph);
  if (graph["faces_re:layer"] == null) {
    // valid solution only when there is 1 face
    graph["faces_re:layer"] = Array.from(Array(facesCount)).map(_ => 0);
  }
  // if (graph["face_re:stationary"] == null) {
  //  graph["face_re:stationary"] = 0;
  // }
  if (graph["faces_re:to_move"] == null) {
    graph["faces_re:to_move"] = Array.from(Array(facesCount)).map(_ => false);
  }
}

/**
 * this establishes which side a point (face_center) is from the
 * crease line (point, vector). because this uses a +/- determinant
 * calculation, we also consider the face_color (t/f) whether the face is
 * upright or flipped, the determinant calculation will be reversed.
 */
const get_face_sidedness = function(point, vector, face_center, face_color) {
  let vec2 = [face_center[0] - point[0], face_center[1] - point[1]];
  let det = vector[0] * vec2[1] - vector[1] * vec2[0];
  return face_color ? det > 0 : det < 0;
}


