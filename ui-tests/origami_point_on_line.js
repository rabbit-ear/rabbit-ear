// RabbitEar.origami().addEventListener("mousedown", function (mouse) {
// 	console.log(mouse.position);
//   const nearest = this.nearest(mouse.position);
//   this.cp.addVertexOnEdge(mouse.x, mouse.y, nearest.edge.index);
// });

const origami = RabbitEar.origami();
origami.preferences.debug = true;

origami.onMouseDown = function (mouse) {
  const nearest = origami.nearest(mouse);

  RabbitEar.core.split_edge(origami.cp, mouse.x, mouse.y, nearest.edge.index);
  // console.log(origami.cp);
  origami.draw();
  // origami.cp.addVertexOnEdge(mouse.x, mouse.y, nearest.edge.index);
};
