// example
// mouse hover over vertices, edges, faces to highlight them

// todo: bring back sectors

const origami = re.Origami({ padding: 0.05 });
origami.vertices.visible = true;
origami.load("https://raw.githubusercontent.com/robbykraft/Origami/master/files/fold/crane.fold");

origami.onMouseMove = function (event) {
  origami.vertices.forEach(function (v) { v.svg.style = ""; });
  origami.edges.forEach(function (e) { e.svg.style = ""; });
  origami.faces.forEach(function (f) { f.svg.style = ""; });

  // get all the nearest components to the cursor
  const nearest = origami.nearest(event);

  // console.log(nearest);

  if (nearest.vertex) { nearest.vertex.svg.style = "fill:#357;stroke:#357"; }
  if (nearest.edge) { nearest.edge.svg.style = "stroke:#ec3"; }
  if (nearest.face) { nearest.face.svg.style = "fill:#e53"; }
};
