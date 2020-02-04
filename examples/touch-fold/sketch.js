RabbitEar.origami({
  touchFold: true,
  autofit: false,
  padding: 0.1,
  attributes: {
    faces: {
      front: { fill: "#fb3" },
      back: { fill: "white" }
    }
  }
}, function(origami) {
  var points = [
    RabbitEar.vector(1, 0),
    RabbitEar.vector(0.7 - Math.random() * 0.3, 0.2 + Math.random() * 0.45)
  ];
  var midpoint = points[0].midpoint(points[1]);
  var vector = points[1].subtract(points[0]);
  origami.fold(midpoint, vector.rotateZ90());
  origami.fold();

  var creasePattern = RabbitEar.origami({
    padding: 0.1,
    attributes: {
      edges: {
        mountain: { stroke: "black" },
        valley: { stroke: "black", "stroke-dasharray": "0.02 0.01" }
      }
    }
  });
  creasePattern.load(origami);
  creasePattern.unfold();

  origami.svg.mouseMoved = function () {
    creasePattern.load(origami);
    creasePattern.unfold();
  };
});