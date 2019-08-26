const { RabbitEar, jsonView } = window;

const buildPage = function (container) {
  const panels = [
    "grid-info panel",
    "grid-json code",
    "grid-folded",
    "grid-cp",
    "grid-simulator"
  ].map((c) => {
    const div = document.createElement("div");
    div.setAttribute("class", c);
    container.appendChild(div);
    return div;
  });
  // info box tools
  const loadButton = document.createElement("a");
  loadButton.setAttribute("class", "button");
  loadButton.setAttribute("id", "load-file");
  loadButton.innerHTML = "Open File";
  panels[0].appendChild(loadButton);
  const filenameInfo = document.createElement("span");
  filenameInfo.setAttribute("class", "filename");
  panels[0].appendChild(filenameInfo);

  // conversion info
  const conversionInfo = document.createElement("p");
  conversionInfo.setAttribute("class", "conversion");
  panels[0].appendChild(conversionInfo);
  conversionInfo.innerHTML = "";

  const epsilonSlider = document.createElement("input");
  epsilonSlider.setAttribute("class", "epsilon-slider");
  epsilonSlider.setAttribute("type", "range");
  epsilonSlider.setAttribute("min", "0");
  epsilonSlider.setAttribute("max", "1000");
  epsilonSlider.setAttribute("value", "0");
  panels[0].appendChild(epsilonSlider);

  const epsilonContainer = document.createElement("div");
  epsilonContainer.setAttribute("class", "epsilon-container");
  panels[0].appendChild(epsilonContainer);
  const epsilonParagraph = document.createElement("p");
  epsilonParagraph.setAttribute("class", "epsilon-info");
  epsilonContainer.appendChild(epsilonParagraph);

  const importButton = document.createElement("a");
  importButton.setAttribute("class", "button outline");
  importButton.setAttribute("id", "re-import-button");
  importButton.innerHTML = "re-import";
  epsilonContainer.appendChild(importButton);

  // export info
  const exportSection = document.createElement("div");
  exportSection.setAttribute("class", "export");
  panels[0].appendChild(exportSection);
  const exportSVG = document.createElement("a");
  const exportFOLD = document.createElement("a");
  const explainP = document.createElement("span");
  exportSVG.setAttribute("class", "button");
  exportSVG.setAttribute("id", "export-svg");
  exportFOLD.setAttribute("class", "button");
  exportFOLD.setAttribute("id", "export-fold");
  exportSVG.innerHTML = "SVG";
  exportFOLD.innerHTML = "FOLD";
  explainP.innerHTML = "download&nbsp;&nbsp;";
  exportSection.appendChild(explainP);
  exportSection.appendChild(exportSVG);
  exportSection.appendChild(exportFOLD);

  panels[0].appendChild(document.createElement("hr"));
  // info paragraphs
  const inspectorParagraph = document.createElement("p");
  inspectorParagraph.setAttribute("class", "inspector");
  panels[0].appendChild(inspectorParagraph);
  const infoParagraph = document.createElement("p");
  infoParagraph.setAttribute("class", "info");
  panels[0].appendChild(infoParagraph);

  // json code section
  const pre = document.createElement("pre");
  const code = document.createElement("code");
  const div = document.createElement("div");
  // code.setAttribute("class", "root");
  div.setAttribute("class", "root");
  // div.innerHTML = "FOLD representation";
  // code.appendChild(div);
  // pre.appendChild(code);
  pre.appendChild(div);
  panels[1].appendChild(pre);

  const newHTML = code.innerHTML.replace(/\>\s+\</g, "");
  code.innerHTML = newHTML;

  panels.push(epsilonSlider);
  return panels;
};

const App = function () {
  const [
    infoPanel,
    jsonPanel,
    foldedPanel,
    cpPanel,
    simulatorPanel,
    slider
  ] = buildPage(document.querySelectorAll(".app")[0]);

  let epsilon = 0.000001;

  const origami = RabbitEar.Origami(cpPanel, {
    padding: 0.02,
    style: ".boundary { fill: white; } .foldedForm polygon { fill: rgba(255, 255, 255, 0.1); }"
  });
  const folded = RabbitEar.Origami(foldedPanel, {
    padding: 0.02,
    style: ".foldedForm polygon { fill: rgba(255, 255, 255, 0.1); }"
  });
  folded.fold();

  document.querySelector("#export-svg").onclick = function () {
    const contents = origami.snapshot.svg();
    downloadInBrowser("origami.svg", contents);
  };
  document.querySelector("#export-fold").onclick = function () {
    const contents = origami.snapshot.fold();
    downloadInBrowser("origami.fold", contents);
  };
  document.querySelector("#re-import-button").onclick = function () {
    reload();
  };
  // document.querySelectorAll(".app")[0].appendChild(slider);

  const sliderUpdate = function (event) {
    const { value } = event.target;
    const places = parseFloat(value / 100) - 6;
    epsilon = Math.pow(10, places);
    const epsilonString = epsilon.toFixed(places < 0 ? -places + 1 : 0);
    document.querySelectorAll(".epsilon-info")[0].innerHTML = `epsilon: ${epsilonString}`;
  };
  slider.oninput = sliderUpdate;

  const downloadInBrowser = function (filename, contentsAsString) {
    const blob = new window.Blob([contentsAsString], { type: "text/plain" });
    const a = document.createElement("a");
    a.setAttribute("href", window.URL.createObjectURL(blob));
    a.setAttribute("download", filename);
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const updateFileInfo = function (blob, fileExtension) {
    let fileTypeInfo;
    switch (fileExtension) {
      case "svg": fileTypeInfo = svgTest(); break;
      case "fold": break;
      case "oripa": fileTypeInfo = oripaTest(); break;
      default: break;
    }
    const innerHTML = [
      getFileInformation(origami),
      foldTest(),
      fileTypeInfo,
    ].filter(a => a !== undefined).join("<br><br>");
    document.querySelectorAll(".info")[0].innerHTML = innerHTML;
  };

  const updateInfoNearest = function (nearest) {
    const vertexInfo = nearest.vertex === undefined ? ""
      : `vertex (#${nearest.vertex.index}): <b>${nearest.vertex.coords}</b>`;
    const edgeInfo = nearest.edge === undefined ? ""
      : `edge (#${nearest.edge.index}): <b>${nearest.edge.vertices}</b>`;
    const faceInfo = nearest.face === undefined ? ""
      : `face (#${nearest.face.index}): <b>${nearest.face.vertices}</b>`;
    infoPanel.querySelectorAll(".inspector")[0].innerHTML = `${vertexInfo}<br>${edgeInfo}<br>${faceInfo}`;
  };

  origami.svg.onMouseMove = function (event) {
    /** highlight */
    ["vertices", "edges", "faces"]
      .map(key => origami[key])
      .forEach(b => b.map(a => a.svg)
        .filter(a => a !== undefined)
        .forEach((svg) => { svg.style = ""; }));
    const nearest = origami.nearest(event);
    if (nearest.vertex && nearest.vertex.svg) {
      nearest.vertex.svg.style = "fill:#357;stroke:#357";
    }
    if (nearest.edge && nearest.edge.svg) {
      nearest.edge.svg.style = "stroke:#ec3";
    }
    if (nearest.face && nearest.face.svg) {
      nearest.face.svg.style = "fill:#e53";
    }
    updateInfoNearest(nearest);
    /** highlight end */
  };

  let lastFileLoaded = {
    blob: undefined,
    filename: undefined,
    fileExtension: undefined
  };

  const load = function (blob, filename, fileExtension) {
    lastFileLoaded = { blob, filename, fileExtension };
    origami.load(blob, { epsilon });
    folded.load(origami);
    folded.fold();
    // sliderUpdate({ target: { value: 0 } });
    // slider.value = 0;
    // make the display JSON nice
    const data = JSON.parse(origami.export.json());
    delete data["faces_re:matrix"];
    delete data["faces_re:layer"];
    const codeWindow = document.querySelectorAll(".root")[0];
    while (codeWindow.children.length > 0) {
      codeWindow.removeChild(codeWindow.children[0]);
    }
    jsonView.format(JSON.stringify(data), ".root");
    const first = document.querySelectorAll(".root")[0].childNodes[0];
    if (first) {
      first.querySelectorAll(".json-type")[0].innerHTML = "FOLD representation";
      first.querySelectorAll(".json-size")[0].innerHTML = "";
    }

    // folded.cp = origami.cp.copy();
    // folded.fold();
    infoPanel.querySelectorAll(".filename")[0].innerHTML = filename;
    infoPanel.querySelectorAll(".conversion")[0].innerHTML = fileExtension === "fold" ? "showing raw .fold contents" : "conversion from .svg";
    updateFileInfo(blob, fileExtension);
    // sliderUpdate({ target: { value: 0 } });
    // const sliderHidden = (origami.file_frames == null) ? "none" : "initial";
    // slider.setAttribute("style", `display: ${sliderHidden}`);
  };

  const reload = function () {
    load(lastFileLoaded.blob, lastFileLoaded.filename, lastFileLoaded.fileExtension);
  };

  sliderUpdate({ target: { value: 0 } });

  return {
    origami,
    folded,
    load
  };
};

const app = App();

function fileDidLoad(blob, mimeType, filename, fileExtension) {
  app.load(blob, filename, fileExtension);
}

// window.onload = function () {
//   fetch("https://robbykraft.github.io/Origami/files/fold/crane.fold").then(blob => blob.json()).then(json => app.load(json, "crane.fold"));
// };

window.onload = function () {
  fetch("../../files/fold/crane.fold").then(blob => blob.json()).then(json => app.load(json, "crane.fold", "fold"));
};
