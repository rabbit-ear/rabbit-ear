const kite = {
  vertices_coords: [[0, 0], [0.4142, 0], [1, 0], [1, 0.5857], [1, 1], [0, 1]],
  edges_vertices: [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [5, 1], [3, 5], [5, 2]
  ],
  edges_assignment: ["B", "B", "B", "B", "B", "B", "V", "V", "F"],
};

const origami = RabbitEar.origami(kite);
origami.preferences.debug = true;

origami.onMouseDown = function (mouse) {
  const nearest = origami.nearest(mouse);

  let d = RabbitEar.core.split_edge_run(origami.cp, mouse.x, mouse.y, nearest.edge.index);
  console.log(JSON.stringify(d));
  RabbitEar.core.apply_run(origami.cp, d);
  // console.log(origami.cp);
  origami.draw();
};

let solution = {
  remove: { edges: [2] },
  update: [null, null, {"vertices_vertices":[7,5,1],"faces_vertices":[6,5,2,7,3],"faces_edges":[8,7,10,11,9]}, {"vertices_vertices":[7,4,6]}
  ],
  new: {
    "vertices": [
      {"vertices_coords":[0.8714991807937622,0.38385501503944397],"vertices_vertices":[2,3],"vertices_faces":[2]}
    ],
    "edges": [
      {"edges_vertices":[2,7],"edges_assignment":"B","edges_faces":[2]},{"edges_vertices":[3,7],"edges_assignment":"B","edges_faces":[2]}
    ],
    "faces": [
    ]
  }
}

const one = {
  remove: { edges: [7] },
  update: [null, null, { faces_vertices: [6, 5, 2,3], faces_edges: [9,8,2,10]}, { vertices_vertices: [2,4,6],faces_vertices:[5,6,3,4], faces_edges: [9,10,3,4]},null,{ vertices_vertices: [0,1,2,6,4]}
  ],
  new: {
    vertices: [
      { vertices_coords: [0.6639209389686584, 0.622734785079956], vertices_vertices: [5,3], vertices_faces: [2,3]}
    ],
    edges: [
      { edges_vertices: [5,6], edges_assignment: "V", edges_faces: [2,3]},
      { edges_vertices: [3,6], edges_assignment: "V", edges_faces: [2,3]}
    ],
    faces: []
  }
};

const two = {
  remove: { edges: [2] },
  update: [null, null, {  vertices_vertices: [7, 5, 1],faces_vertices:[6,5,2,7,3], faces_edges: [8,7,10,11,9]},
    { vertices_vertices: [7,4,6]}
  ],
  new: {
    vertices: [{ vertices_coords: [0.8714991807937622, 0.38385501503944397], vertices_vertices: [2,3],"vertices_faces":[2]}
    ],
    edges: [
      { edges_vertices: [2,7], edges_assignment: "B", edges_faces: [2]},
      { edges_vertices: [3,7], edges_assignment: "B", edges_faces: [2]}
    ],
    faces: []
  }
};

const three = RabbitEar.core.merge_run(origami.cp, one, two);
console.log(JSON.stringify(one));
