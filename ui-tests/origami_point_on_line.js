// RabbitEar.Origami().addEventListener("mousedown", function (mouse) {
// 	console.log(mouse.position);
//   const nearest = this.nearest(mouse.position);
//   this.cp.addVertexOnEdge(mouse.x, mouse.y, nearest.edge.index);
// });

const origami = RabbitEar.Origami();
origami.preferences.debug = true;

origami.onMouseDown = function (mouse) {
  const nearest = origami.nearest(mouse);

  re.core.add_vertex_on_edge(origami.cp, mouse.x, mouse.y, nearest.edge.index);
  // console.log(origami.cp);
  origami.draw();
  // origami.cp.addVertexOnEdge(mouse.x, mouse.y, nearest.edge.index);
};
