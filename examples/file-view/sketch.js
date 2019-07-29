const origamiDiv = document.querySelectorAll(".origami")[0];
const foldedDiv = document.querySelectorAll(".folded")[0];
const origami = RabbitEar.Origami(origamiDiv, { padding: 0.05 });
const folded = RabbitEar.Origami(foldedDiv, { frame: 1, padding: 0.05 });
const slider = document.querySelector("#frame-slider");
const frameInfo = document.querySelector("#frame-span");

origami.update = function () {
  sliderUpdate({ target: { value: 0 } });
  slider.value = 0;
  const data = JSON.stringify(origami.cp);
  const codeWindow = document.querySelectorAll(".root")[0];
  while (codeWindow.children.length > 0) {
    codeWindow.removeChild(codeWindow.children[0]);
  }
  jsonView.format(data, ".root");
  folded.cp = origami.cp.copy();
  folded.fold();
};

origami.onMouseMove = function (event) {
  // update returns all components back to their original color
  // origami.draw();
  origami.color(event);
};

origami.color = function (event) {
  // get all the nearest components to the cursor
  // var nearest = origami.nearest(event);
  // if(nearest.vertex) { nearest.vertex.svg.addClass('fill-yellow'); }
  // if(nearest.crease) { nearest.crease.svg.addClass('stroke-yellow'); }
  // if(nearest.face) { nearest.face.svg.addClass('fill-red'); }

  // origami.vertices.forEach(v => v.svg.style = "");
  origami.edges.forEach((e) => { e.svg.style = ""; });
  origami.faces.forEach((f) => { f.svg.style = ""; });
  // get all the nearest components to the cursor
  var nearest = origami.nearest(event);

  // if (nearest.vertex) { nearest.vertex.svg.style = "fill:#357;stroke:#357"; }
  if (nearest.edge) { nearest.edge.svg.style = "stroke:#ec3"; }
  if (nearest.face) { nearest.face.svg.style = "fill:#e53"; }

};

fileDidLoad = function (blob, mimeType, fileExtension) {
  origami.load(blob, function (cp) {
    origami.update();
  });
};

const sliderUpdate = function (event) {
  const { value } = event.target;
  const fraction = parseFloat(value / 1000);
  const frameCount = origami.frames.length - 1;
  const frame = parseInt(fraction * frameCount, 10);
  origami.frame = frame;
  frameInfo.innerHTML = `frame ${frame}/${frameCount}`;
};
slider.oninput = sliderUpdate;

const makeDownloadBlob = function (text, filename, mimeType) {
  const blob = new Blob([text], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
};

document.getElementById("download-cp-svg")
  .addEventListener("click", function (e) {
    e.preventDefault();
    const svg = origami.cp.svg();
    const svgBlob = (new document.XMLSerializer()).serializeToString(svg);
    makeDownloadBlob(svgBlob, "origami", "image/svg+xml");
  });

document.getElementById("download-cp-fold")
  .addEventListener("click", function (e) {
    e.preventDefault();
    makeDownloadBlob(origami.cp.json, "origami", "application/json");
  });

// document.getElementById("download-cp-opx")
//  .addEventListener("click", function (e) {
//  e.preventDefault();
//  var oripa = origami.cp.oripa();
//  makeDownloadBlob(oripa, "origami", "text/xml");
// });

// origami.load("https://raw.githubusercontent.com/robbykraft/Origami/master/files/fold/crane.fold", function () {
//  origami.update();
// });

origami.load("../../files/fold/crawfish.fold", function () {
  origami.update();
});
