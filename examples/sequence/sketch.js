var STEPS = 10;
var page = document.querySelector("#folding-sequence");
// this is the origami to be folded
var origami = RabbitEar.origami({ view: null });

var style = {
  edges: {
    "stroke-linecap": "round",
    mountain: { stroke: "black" },
    valley: { stroke: "black", "stroke-dasharray": "0.01" },
  },
  faces: {
    front: { fill: "white" },
    back: { fill: "#fb3" }
  }
};

for (var i = 0; i < STEPS; i += 1) {
  // create html components
  var lineHeader = document.createElement("h1");
  lineHeader.innerHTML = String(i + 1);
  page.appendChild(lineHeader);
  var row = document.createElement("div");
  row.className = "row";
  page.appendChild(row);

  // get the coordinates of the current folded form
  origami.fold();
  var bounds = origami.bounds;
  origami.unfold();

  // generate the geometry for a random crease line
  var origin = [
    bounds.origin.x + Math.random() * bounds.width,
    bounds.origin.y + Math.random() * bounds.height
  ];
  var angle = Math.random() * Math.PI * 2;
  var vec = [Math.cos(angle), Math.sin(angle)];

  // crease origami paper
  origami.fold(origin, vec);

  // new svgs, fill them with the crease pattern
  RabbitEar.origami(row, origami.copy(), { attributes: style });
  var folded = RabbitEar.origami(row, origami.copy(), { attributes: style });
  folded.fold();
}
