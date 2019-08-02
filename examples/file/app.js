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
  // info paragraphs
  const infoParagraph = document.createElement("p");
  infoParagraph.setAttribute("class", "info");
  panels[0].appendChild(infoParagraph);
  const inspectorParagraph = document.createElement("p");
  inspectorParagraph.setAttribute("class", "inspector");
  panels[0].appendChild(inspectorParagraph);

  const exportSection = document.createElement("div");
  exportSection.setAttribute("class", "export");
  panels[0].appendChild(exportSection);
  const explainP = document.createElement("span");
  explainP.innerHTML = "save as&nbsp;&nbsp;";
  exportSection.appendChild(explainP);
  const exportSVG = document.createElement("a");
  exportSVG.setAttribute("class", "button");
  exportSVG.setAttribute("id", "export-svg");
  exportSVG.innerHTML = "SVG";
  const exportFOLD = document.createElement("a");
  exportFOLD.setAttribute("class", "button");
  exportFOLD.setAttribute("id", "export-fold");
  exportFOLD.innerHTML = "FOLD";
  exportSection.appendChild(exportSVG);
  exportSection.appendChild(exportFOLD);

  // <input id="frame-slider" type="range" min="0" max="1000" value="0">
  // <span id="frame-span">FOLD frame 0/0</span>

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

  const slider = document.createElement("input");
  slider.setAttribute("id", "frame-slider");
  slider.setAttribute("type", "range");
  slider.setAttribute("min", "0");
  slider.setAttribute("max", "1000");
  slider.setAttribute("value", "0");

  panels.push(slider);
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
  document.querySelectorAll(".app")[0].appendChild(slider);

  const sliderUpdate = function (event) {
    const { value } = event.target;
    const fraction = parseFloat(value / 1000);
    if (origami.file_frames == null) { return; }
    // const frameCount = origami.file_frames.length - 1;
    // const frame = parseInt(fraction * frameCount, 10);
    // origami.frame = frame;
    // frameInfo.innerHTML = `frame ${frame}/${frameCount}`;
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

  const updateFileInfo = function () {
    // v e f count
    const vCount = RabbitEar.core.vertices_count(origami);
    const eCount = RabbitEar.core.edges_count(origami);
    const fCount = RabbitEar.core.faces_count(origami);
    const innerCount = `vertices / edges / faces:<br><b>${vCount} / ${eCount} / ${fCount}</b>`;
    // merge info
    const mergeCount = 0;
    const innerEpsilon = "";
    // mountain valley mark border count
    const assignmentCounts = [
      ["M", "m"],
      ["V", "v"],
      ["B", "b"],
      ["F", "f"],
      ["U", "u"]
    ].map(options => origami.edges_assignment.filter(e => options.includes(e)));
    const assignmentInfo = `
      mountain: <b>${assignmentCounts[0].length}</b><br>
      valley: <b>${assignmentCounts[1].length}</b><br>
      boundary: <b>${assignmentCounts[2].length}</b><br>
      mark: <b>${assignmentCounts[3].length}</b><br>
      unassigned: <b>${assignmentCounts[4].length}</b><br>`;
    const innerHTML = [
      innerCount,
      assignmentInfo,
      innerEpsilon,
    ].join("<br><br>");
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

  const load = function (blob, filename) {
    origami.load(blob);
    folded.load(origami);
    folded.fold();
    // sliderUpdate({ target: { value: 0 } });
    // slider.value = 0;
    const data = origami.export();
    const codeWindow = document.querySelectorAll(".root")[0];
    while (codeWindow.children.length > 0) {
      codeWindow.removeChild(codeWindow.children[0]);
    }
    jsonView.format(data, ".root");
    const first = document.querySelectorAll(".root")[0].childNodes[0];
    if (first) {
      first.querySelectorAll(".json-type")[0].innerHTML = "FOLD representation";
      first.querySelectorAll(".json-size")[0].innerHTML = "";
    }

    // folded.cp = origami.cp.copy();
    // folded.fold();
    infoPanel.querySelectorAll(".filename")[0].innerHTML = filename;
    updateFileInfo();
    sliderUpdate({ target: { value: 0 } });
    const sliderHidden = (origami.file_frames == null) ? "none" : "initial";
    slider.setAttribute("style", `display: ${sliderHidden}`);
  };

  return {
    origami,
    folded,
    load
  };
};

const app = App();

function fileDidLoad(blob, mimeType, filename, fileExtension) {
  app.load(blob, filename);
}

window.onload = function () {
  fetch("https://robbykraft.github.io/Origami/files/fold/crane.fold").then(blob => blob.json()).then(json => app.load(json, "crane.fold"));
};
