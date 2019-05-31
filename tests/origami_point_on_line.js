RabbitEar.Origami().addEventListener("mousedown", function (mouse) {
  const nearest = this.nearest(mouse);
  this.cp.addVertexOnEdge(mouse.x, mouse.y, nearest.edge.index);
});
