// build page
const body = document.querySelectorAll("body")[0];
const div2d = document.createElement("div");
div2d.setAttribute("class", "origami-2d");
const div3d = document.createElement("div");
div3d.setAttribute("class", "origami-3d");
body.appendChild(div2d);
body.appendChild(div3d);
const toolbar = document.createElement("div");
toolbar.setAttribute("class", "toolbar");
const foldUnfold = document.createElement("a");
foldUnfold.setAttribute("class", "button");
foldUnfold.innerHTML = "unfold";
toolbar.appendChild(foldUnfold);
const slider = document.createElement("input");
slider.setAttribute("type", "range");
toolbar.appendChild(slider);
body.appendChild(toolbar);

// origami code
const origami2d = RabbitEar.Origami(div2d, {
  touchFold: true,
  autofit: false,
  padding: 0.15,
});
origami2d.fold();

const origami3d = OrigamiSimulator({
  backgroundColor: "158",
  color1: "e64e1e",
  parent: div3d
});

origami2d.svg.onMouseUp = function () {
  const fold = JSON.parse(origami2d.export());
  if ("edges_foldAngle" in fold === true) {
    fold.edges_foldAngle = fold.edges_foldAngle.map(a => a / 180 * Math.PI);
    // fold.edges_foldAngle = fold.edges_foldAngle.map(a => 0);
  }
  origami3d.pattern.setFoldData(fold);
};

foldUnfold.onclick = function () {
  if (origami2d.isFolded()) {
    origami2d.unfold();
  } else {
    origami2d.fold();
  }
  foldUnfold.innerHTML = origami2d.isFolded() ? "unfold" : "fold";
};

slider.oninput = function (e) {
  origami3d.foldPercent = parseInt(e.target.value, 10) / 100.0;
  // document.querySelector("#fold-percent-label").innerHTML = e.target.value;
};
