const body = document.querySelectorAll("body")[0];
const div2d = document.createElement("div");
div2d.setAttribute("class", "origami-2d");
const div3d = document.createElement("div");
div3d.setAttribute("class", "origami-3d");
body.appendChild(div2d);
body.appendChild(div3d);

const origami2d = RabbitEar.Origami(div2d);

const origami3d = OrigamiSimulator({
  backgroundColor: "eee",
  color1: "e64e1e",
  append: div3d
});

origami2d.svg.onMouseUp = function () {
  const fold = JSON.parse(origami2d.export());
  if ("edges_foldAngle" in fold === true) {
    // fold.edges_foldAngle = fold.edges_foldAngle.map(a => a / 180 * Math.PI);
    fold.edges_foldAngle = fold.edges_foldAngle.map(a => 0);
  }
  origami3d.pattern.setFoldData(fold);
};
