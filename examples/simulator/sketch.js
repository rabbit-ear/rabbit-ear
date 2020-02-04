window.onload = function () {
  // build page
  var body = document.querySelectorAll("body")[0];
  var container2D = document.createElement("div");
  var container3D = document.createElement("div");
  var toolbar = document.createElement("div");
  var toolbarLeft = document.createElement("div");
  var toolbarRight = document.createElement("div");
  container2D.setAttribute("class", "origami-2d");
  container3D.setAttribute("class", "origami-3d");
  toolbar.setAttribute("class", "toolbar");
  toolbarLeft.setAttribute("class", "toolbar-left");
  toolbarRight.setAttribute("class", "toolbar-right");
  body.appendChild(container2D);
  body.appendChild(container3D);
  toolbar.appendChild(toolbarLeft);
  toolbar.appendChild(toolbarRight);
  body.appendChild(toolbar);

  var pause = document.createElement("a");
  pause.setAttribute("id", "button-pause");
  pause.setAttribute("class", "button");
  pause.innerHTML = "on";
  toolbarRight.appendChild(pause);
  var strain = document.createElement("a");
  strain.setAttribute("id", "button-material-strain");
  strain.setAttribute("class", "button");
  strain.innerHTML = "strain";
  toolbarRight.appendChild(strain);
  // var grab = document.createElement("a");
  // grab.setAttribute("id", "button-control-grab");
  // grab.setAttribute("class", "button");
  // toolbarRight.appendChild(grab);
  var slider = document.createElement("input");
  slider.setAttribute("type", "range");
  slider.setAttribute("id", "fold-percent-slider");
  slider.setAttribute("min", "0");
  slider.setAttribute("max", "100");
  toolbarRight.appendChild(slider);
  var sliderPercentLabel = document.createElement("span");
  sliderPercentLabel.setAttribute("id", "fold-percent-label");
  toolbarRight.appendChild(sliderPercentLabel);

  // origami code
  var origami2D = RabbitEar.origami(container2D, {
    touchFold: true,
    autofit: false,
    padding: 0.15,
    attributes: {
      faces: {
        back: { fill: "white" },
        front: { fill: "#e53" }
      }
    }
  });

  var origami3D = OrigamiSimulator({
    backgroundColor: "158",
    color1: "e53",
    parent: container3D
  });

  origami2D.svg.mouseReleased = function () {
    origami2D.unfold()
    var fold = JSON.parse(origami2D.export());
    origami2D.fold();
    origami3D.pattern.setFoldData(fold);
  };

  slider.oninput = function (e) {
    origami3D.foldPercent = parseInt(e.target.value, 10) / 100.0;
    document.querySelector("#fold-percent-label").innerHTML = `Fold: ${e.target.value}%`;
  };

  document.querySelector("#button-pause").onclick = function (e) {
    origami3D.simulationRunning = !origami3D.simulationRunning;
    e.target.setAttribute("class", origami3D.simulationRunning ? "button" : "button red");
    e.target.innerHTML = origami3D.simulationRunning ? "on" : "paused";
  };

  document.querySelector("#button-material-strain").onclick = function (e) {
    origami3D.strain = !origami3D.strain;
    e.target.setAttribute("class", origami3D.strain ? "button red" : "button");
  };

  // set initial conditions
  origami2D.fold();
  origami3D.pattern.setFoldData(JSON.parse(origami2D.export()));
  slider.oninput({ target: { value: 50 } });
};
