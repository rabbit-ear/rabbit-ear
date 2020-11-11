/**
 * FOLD THROUGH ALL LAYERS
 * the basic valley / mountain fold operation
 *
 * provide a FOLD object with unfolded vertices_coords. a creasePattern state.
 *
 * this returns a copy of the graph with new crease lines.
 * does not modify input graph's geometry, but does append "re:" data
 * any additional non-standard-FOLD data will be copied over as well.
 */

// for now, this uses "faces_re:layer", todo: use faceOrders

import math from "../../math";
import split_convex_polygon from "../add/split_face";
import { foldLayers } from "./faces_layer";
import { clone } from "../javascript";
import Count from "../count";
import { face_containing_point } from "../nearest";

import {
  make_faces_matrix,
  make_faces_center,
  make_faces_coloring_from_matrix,
  make_vertices_coords_folded,
} from "../make";

import {
  construction_flip,
  // construction_fold,
} from "./construction_frame";

/**
 * this establishes which side a point (face_center) is from the
 * crease line (point, vector). because this uses a +/- determinant
 * calculation, we also consider the face_color (t/f) whether the face is
 * upright or flipped, the determinant calculation will be reversed.
 */
const get_face_sidedness = (vector, origin, face_center, face_color) => {
  const vec2 = [face_center[0] - origin[0], face_center[1] - origin[1]];
  const det = vector[0] * vec2[1] - vector[1] * vec2[0];
  return face_color ? det > 0 : det < 0;
};

/**
 * for quickly determining which side of a crease a face lies
 * this uses point average, not centroid, faces must be convex
 * and again it's not precise, only use this for sided-ness calculation
 */
const make_face_center_fast = (graph, face_index) => {
  // console.log("make_face_center_fast", graph.faces_vertices.length, face_index);
  if (!graph.faces_vertices[face_index]) { return [0, 0]; }
  return graph
  .faces_vertices[face_index]
  .map(v => graph.vertices_coords[v])
  .reduce((a, b) => [a[0] + b[0], a[1] + b[1]], [0, 0])
  .map(el => el / graph.faces_vertices[face_index].length);
};
// const prepare_graph_crease = function (graph, vector, point, face_index) {
//   const faceCount = Count.faces(graph);
//   graph["faces_re:preindex"] = Array.from(Array(faceCount)).map((_, i) => i);
//   // graph["faces_re:coloring"] = faces_coloring(graph, face_index);
//   // do we need to rebuild faces matrices? can we grab it from the frame?
//   // const frame0ContainsMatrices = (graph.file_frames != null
//   //   && graph.file_frames.length > 0
//   //   && graph.file_frames[0].faces_matrix != null
//   //   && graph.file_frames[0].faces_matrix.length === faceCount);
//   // graph.faces_matrix = frame0ContainsMatrices
//   //   ? clone(graph.file_frames[0].faces_matrix)
//   //   : make_faces_matrix(graph, face_index);

//   // todo: we need to make sure matrices match face length
//   if ("faces_re:matrix" in graph === false) {
//     graph.faces_matrix = make_faces_matrix(graph, face_index);
//   }
//   graph["faces_re:coloring"] = make_faces_coloring_from_matrix(graph);
//   // crease lines are calculated using each face's INVERSE matrix
//   graph["faces_re:creases"] = graph.faces_matrix
//     .map(mat => math.core.invert_matrix3(mat))
//     .map(mat => math.core.multiply_matrix3_line3(mat, vector, point));
//   graph["faces_re:center"] = Array.from(Array(faceCount))
//     .map((_, i) => make_face_center_fast(graph, i));
//   graph["faces_re:sidedness"] = Array.from(Array(faceCount))
//     .map((_, i) => get_face_sidedness(
//       graph["faces_re:creases"][i].vector,
//       graph["faces_re:creases"][i].origin,
//       graph["faces_re:center"][i],
//       graph["faces_re:coloring"][i]
//     ));
// };

const prepare_graph_crease = (graph, vector, point, face_index) => {
  const faceCount = Count.faces(graph);
  const faceCountArray = Array.from(Array(faceCount));
  graph["faces_re:layer"] = Array(faceCount).fill(0);
  graph["faces_re:preindex"] = faceCountArray.map((_, i) => i);
  graph.faces_matrix = make_faces_matrix(graph, face_index);
  graph.faces_coloring = make_faces_coloring_from_matrix(graph);
  // crease lines are calculated using each face's INVERSE matrix
  graph["faces_re:creases"] = graph.faces_matrix
    .map(mat => math.core.invert_matrix3(mat))
    .map(mat => math.core.multiply_matrix3_line3(mat, vector, point));
  graph.faces_center = faceCountArray
    .map((_, i) => make_face_center_fast(graph, i));
  graph["faces_re:sidedness"] = faceCountArray
    .map((_, i) => get_face_sidedness(
      graph["faces_re:creases"][i].vector,
      graph["faces_re:creases"][i].origin,
      graph.faces_center[i],
      graph.faces_coloring[i]
    ));
};

// const prepare_extensions = function (graph) {
//   const facesCount = Count.faces(graph);
//   if (graph["faces_re:layer"] == null) {
//     // valid solution only when there is 1 face
//     graph["faces_re:layer"] = Array(facesCount).fill(0);
//   }
//   // if (graph["face_re:stationary"] == null) {
//   //  graph["face_re:stationary"] = 0;
//   // }
//   // if (graph["faces_re:to_move"] == null) {
//   //   graph["faces_re:to_move"] = Array(facesCount).fill(false);
//   // }
// };

/**
 * quick bounding box approach to find the two furthest points in a collection
 *
 */
const two_furthest_points = function (points) {
  let top = [0, -Infinity];
  let left = [Infinity, 0];
  let right = [-Infinity, 0];
  let bottom = [0, Infinity];
  points.forEach((p) => {
    if (p[0] < left[0]) { left = p; }
    if (p[0] > right[0]) { right = p; }
    if (p[1] < bottom[1]) { bottom = p; }
    if (p[1] > top[1]) { top = p; }
  });
  // handle vertical and horizontal lines cases
  const t_to_b = Math.abs(top[1] - bottom[1]);
  const l_to_r = Math.abs(right[0] - left[0]);
  return t_to_b > l_to_r ? [bottom, top] : [left, right];
};

const toFoldAngle = {
  M: -180,
  m: -180,
  V: 180,
  v: 180,
};

const opposite_assignment = { "M":"V", "m":"V", "V":"M", "v":"M" };

// if it's a mark, this will be too.
const opposingCrease = assign => opposite_assignment[assign] || assign;

const fold_through = function (
  graph,
  vector,
  point,
  face_index,
  assignment = "V"
) {
  const opposite_crease = opposingCrease(assignment);
  if (face_index == null) {
    // an unset face will be the face under the point. or if none, index 0
    const containing_point = face_containing_point(graph, point);
    // todo, if it's still unset, find the point
    face_index = (containing_point === undefined) ? 0 : containing_point;
  }

  vector = math.core.resize(3, vector);
  point = math.core.resize(3, point);

  // prepare_extensions(graph);
  prepare_graph_crease(graph, vector, point, face_index);

  // console.log("done preparing", JSON.parse(JSON.stringify(graph)));

  const folded = clone(graph);

  folded.vertices_coords.forEach(coord => coord.splice(2));

  // console.log('graph["faces_re:creases"]', graph["faces_re:creases"]);
  // console.log("graph.faces_matrix", graph.faces_matrix);

  // one by one, pair up each face with each (reflected) crease line,
  // if they intersect, chop the face into 2,
  // becoming an array of {} or undefined, whether the face was split or not
  // because split_convex_polygon() calls Graph.remove_faces() we need to
  // iterate through the faces in reverse order.
  const faces_split = Array.from(Array(Count.faces(graph)))
    .map((_, i) => i)
    .reverse()
    .map((i) => {
      // todo, moved this up here as a quick fix. the graph is probably being modified
      // differently from before. are other properties needing similar treatment?
      // faces_center?
      const face_color = folded.faces_coloring[i];
      const diff = split_convex_polygon(
        folded, i,
        folded["faces_re:creases"][i].vector,
        folded["faces_re:creases"][i].origin,
      );
      // console.log("split convex polygon diff", diff);
      if (diff === undefined) { return undefined; }
      // todo: assign the new edge this assignment
      // folded.faces_coloring[i] ? assignment : opposite_crease
      if (diff.edges.new && diff.edges.new.length) {
        const new_edge = diff.edges.new[0];
        folded.edges_assignment[new_edge] = face_color
          ? assignment
          : opposite_crease;
        folded.edges_foldAngle[new_edge] = face_color
          ? toFoldAngle[assignment] || 0
          : toFoldAngle[opposite_crease] || 0;
      }

      // console.log("diff", diff);
      diff.faces.replace.forEach(replace => replace.new
        // .map(el => el.index)
        // seems like i don't need this anymore, split_face already does this
        // .map(index => index + diff.faces.map[index])
        // new indices post-face removal
        .forEach((i) => {
          folded.faces_center[i] = make_face_center_fast(folded, i);
          folded["faces_re:sidedness"][i] = get_face_sidedness(
            graph["faces_re:creases"][replace.old].vector,
            graph["faces_re:creases"][replace.old].origin,
            folded.faces_center[i],
            graph.faces_coloring[replace.old]
          );
          folded["faces_re:layer"][i] = graph["faces_re:layer"][replace.old];
          folded["faces_re:preindex"][i] =
            graph["faces_re:preindex"][replace.old];
        }));
      return {
        index: i,
        // length: diff.edges.new[0].length,
        edge: folded.edges_vertices[diff.edges.new[0]]
          .map(v => folded.vertices_coords[v])
      };
    })
    .reverse(); // reverse a reverse. back to ordering 0,1,2,3,4...


  // console.log(folded);
  // return graph;

  // get new face layer ordering
  folded["faces_re:layer"] = foldLayers(
    folded["faces_re:layer"],
    folded["faces_re:sidedness"]
  );

  // build new face matrices for the folded state. use face 0 as reference
  // we need its original matrix, and if face 0 was split we need to know
  // which of its two new faces doesn't move as the new faces matrix
  // calculation requires we provide the one face that doesn't move.
  const face_0_newIndex = (faces_split[0] === undefined
    ? 0
    : folded["faces_re:preindex"]
      .map((pre, i) => ({ pre, new: i }))
      .filter(obj => obj.pre === 0)
      .filter(obj => folded["faces_re:sidedness"][obj.new])
      .shift().new);
  // only if face 0 lies on the not-flipped side (sidedness is false),
  // and it wasn't creased-through, can we use its original matrix.
  // if face 0 lies on the flip side (sidedness is true), or it was split,
  // face 0 needs to be multiplied by its crease's reflection matrix, but
  // only for valley or mountain folds, mark folds need to copy the matrix
  let face_0_preMatrix = graph.faces_matrix[0];
  // if mark, skip this. if valley or mountain, do it
  if (assignment === "M" || assignment === "m"
    || assignment === "V" || assignment === "v") {
    face_0_preMatrix = (faces_split[0] === undefined
      && !graph["faces_re:sidedness"][0]
      ? graph.faces_matrix[0]
      : math.core.multiply_matrices3(
        graph.faces_matrix[0],
        math.core.make_matrix3_reflectZ(
          graph["faces_re:creases"][0].vector,
          graph["faces_re:creases"][0].origin
        )
      )
    );
  }
  // build our new faces_matrices using face 0 as the starting point,
  // setting face 0 as the identity matrix, then multiply every
  // face's matrix by face 0's actual starting matrix
  const folded_faces_matrix = make_faces_matrix(folded, face_0_newIndex)
    .map(m => math.core.multiply_matrices3(face_0_preMatrix, m));
  // faces coloring is useful for determining if a face is flipped or not
  folded.faces_coloring = make_faces_coloring_from_matrix(
    { faces_matrix: folded_faces_matrix }
  );
  // "construction" section that includes:
  // - what type of operation occurred: valley / mountain fold, flip over
  // - the edge that draws the fold-line, useful for diagramming
  // - the direction of the fold or flip
  const crease_0 = math.core.multiply_matrix3_line3(
    face_0_preMatrix,
    graph["faces_re:creases"][0].vector,
    graph["faces_re:creases"][0].origin,
  );
  // const fold_direction = math.core
  //   .normalize([crease_0.vector[1], -crease_0.vector[0]]);
  const fold_direction = math.core.normalize(math.core.rotate270(crease_0.vector));
  // faces_split contains the edges that clipped each of the original faces
  // gather them all together, and reflect them using the original faces'
  // matrices so the lines lie on top of one another
  // use that to get the longest-spanning edge that clips through all faces
  const split_points = faces_split
    .map((el, i) => (el === undefined ? undefined : el.edge.map(p => math.core
      .multiply_matrix3_vector3(graph.faces_matrix[i], p))))
    .filter(a => a !== undefined)
    .reduce((a, b) => a.concat(b), []);

  folded["re:construction"] = (split_points.length === 0
    ? construction_flip(fold_direction)
    : {
      type: "fold",
      assignment,
      direction: fold_direction,
      edge: two_furthest_points(split_points)
    });

  // const folded_frame = {
  //   vertices_coords: make_vertices_coords_folded(
  //     folded,
  //     face_0_newIndex,
  //     folded_faces_matrix
  //   ),
  //   frame_classes: ["foldedForm"],
  //   frame_inherit: true,
  //   frame_parent: 0, // this is not always the case. maybe shouldn't imply
  // };
  // folded.file_frames = [folded_frame];

  // this was a fix, moving this up here
  folded.faces_matrix = folded_faces_matrix;
  // console.log("faces_matrix", folded.faces_matrix);

  folded["vertices_re:foldedCoords"] = make_vertices_coords_folded(
    folded,
    face_0_newIndex,
    folded_faces_matrix
  );

  folded.faces_matrix = folded_faces_matrix;
  // folded.faces_matrix = folded_faces_matrix.map(m => m.map(n => math.core.clean_number(n, 14)));

  // delete graph["faces_re:to_move"];
  // delete folded["faces_re:to_move"];
  delete graph["faces_re:creases"];
  delete folded["faces_re:creases"];
  delete graph["faces_re:sidedness"];
  delete folded["faces_re:sidedness"];
  delete graph["faces_re:preindex"];
  delete folded["faces_re:preindex"];
  delete graph.faces_coloring;
  delete folded.faces_coloring;
  delete graph.faces_center;
  delete folded.faces_center;

  return folded;
};

export default fold_through;
