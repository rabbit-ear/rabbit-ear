var options = {
  touchFold: true,
  padding: 0.1,
  attributes: { faces: { front: { fill: "white" }, back: { fill: "lightgray" }}}
};

RabbitEar.origami(document.querySelectorAll(".grid-0")[0], options).fold();
RabbitEar.origami.rectangle(2, 1, document.querySelectorAll(".grid-1")[0], options).fold();
RabbitEar.origami.regularPolygon(3, 1, document.querySelectorAll(".grid-2")[0], options).fold();
RabbitEar.origami.regularPolygon(5, 1, document.querySelectorAll(".grid-3")[0], options).fold();
RabbitEar.origami.regularPolygon(100, 1, document.querySelectorAll(".grid-4")[0], options).fold();
const strip = RabbitEar.origami.rectangle(1, 10, document.querySelectorAll(".grid-5")[0], options).fold();
