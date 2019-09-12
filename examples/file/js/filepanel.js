const initFilePanel = function (parent) {
  const panel = document.createElement("div");
  panel.setAttribute("class", "grid-info panel");
  if (parent != null) { parent.appendChild(panel); }

  // info box tools
  const loadButton = document.createElement("a");
  loadButton.setAttribute("class", "button");
  loadButton.setAttribute("id", "load-file");
  loadButton.innerHTML = "Open File";
  panel.appendChild(loadButton);
  const filenameInfo = document.createElement("span");
  filenameInfo.setAttribute("class", "filename");
  panel.appendChild(filenameInfo);

  // conversion info
  const conversionInfo = document.createElement("p");
  conversionInfo.setAttribute("class", "conversion");
  panel.appendChild(conversionInfo);
  conversionInfo.innerHTML = "";

  const epsilonSlider = document.createElement("input");
  epsilonSlider.setAttribute("class", "epsilon-slider");
  epsilonSlider.setAttribute("type", "range");
  epsilonSlider.setAttribute("min", "0");
  epsilonSlider.setAttribute("max", "1000");
  epsilonSlider.setAttribute("value", "0");
  panel.appendChild(epsilonSlider);

  const epsilonContainer = document.createElement("div");
  epsilonContainer.setAttribute("class", "epsilon-container");
  panel.appendChild(epsilonContainer);
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
  panel.appendChild(exportSection);
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

  panel.appendChild(document.createElement("hr"));
  // info paragraphs
  const inspectorParagraph = document.createElement("p");
  inspectorParagraph.setAttribute("class", "inspector");
  panel.appendChild(inspectorParagraph);
  const infoParagraph = document.createElement("p");
  infoParagraph.setAttribute("class", "info");
  panel.appendChild(infoParagraph);

  return panel;
};

const FilePanel = function (parent) {
  const panel = initFilePanel(parent);

  const updateNearest = function (nearest) {
    const vertexInfo = nearest.vertex === undefined ? ""
      : `vertex (#${nearest.vertex.index}): <b>${nearest.vertex.coords}</b>`;
    const edgeInfo = nearest.edge === undefined ? ""
      : `edge (#${nearest.edge.index}): <b>${nearest.edge.vertices}</b>`;
    const faceInfo = nearest.face === undefined ? ""
      : `face (#${nearest.face.index}): <b>${nearest.face.vertices}</b>`;
    panel.querySelectorAll(".inspector")[0].innerHTML = `${vertexInfo}<br>${edgeInfo}<br>${faceInfo}`;
  };

  const load = function (origami, filename, fileExtension) {
    panel.querySelectorAll(".filename")[0].innerHTML = filename;
    panel.querySelectorAll(".conversion")[0].innerHTML = fileExtension === "fold" ? "showing raw .fold contents" : "conversion from .svg";

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

  return {
    div: panel,
    load,
    updateNearest
  };
};
