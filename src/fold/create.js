import math from "../../include/math"; // only to get { clean_number }

const file_spec = 1.1;
const file_creator = "Rabbit Ear";

const metadata = function (complete = false) {
  return !complete
    ? {
      file_spec,
      file_creator
    }
    : {
      file_spec,
      file_creator,
      file_author: "",
      file_title: "",
      file_description: "",
      file_classes: [],
      file_frames: [],
      frame_description: "",
      frame_attributes: [],
      frame_classes: [],
      frame_unit: "",
    };
};

const default_re_extensions = function (number_faces = 1) {
  return {
    "faces_re:layer": Array.from(Array(number_faces)).map((_, i) => i),
    "faces_re:matrix": Array.from(Array(number_faces)).map(() => [1, 0, 0, 1, 0, 0])
  };
};

const cp_type = function () {
  return {
    file_classes: ["singleModel"],
    frame_attributes: ["2D"],
    frame_classes: ["creasePattern"],
  };
};

const square_graph = function () {
  return {
    vertices_coords: [[0, 0], [1, 0], [1, 1], [0, 1]],
    vertices_vertices: [[1, 3], [2, 0], [3, 1], [0, 2]],
    vertices_faces: [[0], [0], [0], [0]],
    edges_vertices: [[0, 1], [1, 2], [2, 3], [3, 0]],
    edges_faces: [[0], [0], [0], [0]],
    edges_assignment: ["B", "B", "B", "B"],
    edges_foldAngle: [0, 0, 0, 0],
    edges_length: [1, 1, 1, 1],
    faces_vertices: [[0, 1, 2, 3]],
    faces_edges: [[0, 1, 2, 3]],
    // faces_faces: [[]],
  };
};

export const empty = function (prototype = null) {
  return Object.assign(
    Object.create(prototype),
    metadata()
  );
};

export const square = function (prototype = null) {
  return Object.assign(
    Object.create(prototype),
    metadata(),
    cp_type(),
    square_graph(),
    default_re_extensions(1)
  );
};

export const rectangle = function (width = 1, height = 1) {
  const graph = square_graph();
  graph.vertices_coords = [[0, 0], [width, 0], [width, height], [0, height]];
  graph.edges_length = [width, height, width, height];
  return Object.assign(
    Object.create(null),
    metadata(),
    cp_type(),
    graph,
    default_re_extensions(1)
  );
};

export const regular_polygon = function (sides, radius = 1) {
  const arr = Array.from(Array(sides));
  const angle = 2 * Math.PI / sides;
  const sideLength = math.core.clean_number(Math.sqrt(
    ((radius - radius * Math.cos(angle)) ** 2)
    + ((radius * Math.sin(angle)) ** 2),
  ));
  const graph = {
    // vertices_
    vertices_coords: arr.map((_, i) => angle * i).map(a => [
      math.core.clean_number(radius * Math.cos(a)),
      math.core.clean_number(radius * Math.sin(a)),
    ]),
    vertices_vertices: arr
      .map((_, i) => [(i + 1) % arr.length, (i + arr.length - 1) % arr.length]),
    vertices_faces: arr.map(() => [0]),
    // edges_
    edges_vertices: arr.map((_, i) => [i, (i + 1) % arr.length]),
    edges_faces: arr.map(() => [0]),
    edges_assignment: arr.map(() => "B"),
    edges_foldAngle: arr.map(() => 0),
    edges_length: arr.map(() => sideLength),
    // faces_
    faces_vertices: [arr.map((_, i) => i)],
    faces_edges: [arr.map((_, i) => i)],
  };
  return Object.assign(
    Object.create(null),
    metadata(),
    cp_type(),
    graph,
    default_re_extensions(1)
  );
};
