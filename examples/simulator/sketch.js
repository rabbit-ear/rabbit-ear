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
const toolbarLeft = document.createElement("div");
toolbarLeft.setAttribute("class", "toolbar-left");
const toolbarRight = document.createElement("div");
toolbarRight.setAttribute("class", "toolbar-right");
toolbar.appendChild(toolbarLeft);
toolbar.appendChild(toolbarRight);
const foldUnfold = document.createElement("a");
foldUnfold.setAttribute("class", "button");
foldUnfold.innerHTML = "unfold";
toolbarLeft.appendChild(foldUnfold);
const pause = document.createElement("a");
pause.setAttribute("id", "button-pause");
pause.setAttribute("class", "button");
pause.innerHTML = "on";
toolbarRight.appendChild(pause);
const strain = document.createElement("a");
strain.setAttribute("id", "button-material-strain");
strain.setAttribute("class", "button");
strain.innerHTML = "strain";
toolbarRight.appendChild(strain);
// const grab = document.createElement("a");
// grab.setAttribute("id", "button-control-grab");
// grab.setAttribute("class", "button");
// toolbarRight.appendChild(grab);
const slider = document.createElement("input");
slider.setAttribute("type", "range");
slider.setAttribute("id", "fold-percent-slider");
slider.setAttribute("min", "0");
slider.setAttribute("max", "100");
toolbarRight.appendChild(slider);
const sliderPercentLabel = document.createElement("span");
sliderPercentLabel.setAttribute("id", "fold-percent-label");
toolbarRight.appendChild(sliderPercentLabel);
body.appendChild(toolbar);

// origami code
const origami2d = RabbitEar.origami(div2d, {
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
  const fold = JSON.parse(origami2d.snapshot.json());
  // origami simulator in radians not degrees
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
  origami3d.foldPercent = 1.0 - parseInt(e.target.value, 10) / 100.0;
  document.querySelector("#fold-percent-label").innerHTML = `Fold: ${e.target.value}%`;
};

document.querySelector("#button-pause").onclick = function (e) {
  origami3d.simulationRunning = !origami3d.simulationRunning;
  e.target.setAttribute("class", origami3d.simulationRunning ? "button" : "button red");
  e.target.innerHTML = origami3d.simulationRunning ? "on" : "paused";
};

document.querySelector("#button-material-strain").onclick = function (e) {
  origami3d.strain = !origami3d.strain;
  e.target.setAttribute("class", origami3d.strain ? "button red" : "button");
};

window.onload = function () {
  origami3d.pattern.setFoldData(JSON.parse(origami2d.snapshot.json()));
  slider.oninput({ target: { value: 50 } });
};
