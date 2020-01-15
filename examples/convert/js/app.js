const App = function () {
  const { RabbitEar } = window;

  // DOM elements
  ["grid-folded", "grid-cp",
    // "grid-simulator"
  ].forEach((c) => {
    const div = document.createElement("div");
    div.setAttribute("class", c);
    document.querySelectorAll(".app")[0].appendChild(div);
  });
  const filePanel = FilePanel(document.querySelectorAll(".app")[0]);
  const jsonPanel = JSONPanel(document.querySelectorAll(".app")[0]);
  const origami = RabbitEar.origami(document.querySelectorAll(".grid-cp")[0], {
    padding: 0.02,
    style: ".boundary { fill: white; } .foldedForm polygon { fill: rgba(255, 255, 255, 0.1); }"
  });
  const folded = RabbitEar.origami(document.querySelectorAll(".grid-folded")[0], {
    padding: 0.02,
    style: ".foldedForm polygon { fill: rgba(255, 255, 255, 0.1); }"
  });
  folded.fold();

  // environment variables
  let epsilon = 0.000001;

  // event handlers
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
  const sliderUpdate = function (event) {
    const { value } = event.target;
    const places = parseFloat(value / 100) - 6;
    epsilon = Math.pow(10, places);
    const epsilonString = epsilon.toFixed(places < 0 ? -places + 1 : 0);
    document.querySelectorAll(".epsilon-info")[0].innerHTML = `epsilon: ${epsilonString}`;
  };
  document.querySelectorAll(".epsilon-slider")[0].oninput = sliderUpdate

  const downloadInBrowser = function (filename, contentsAsString) {
    const blob = new window.Blob([contentsAsString], { type: "text/plain" });
    const a = document.createElement("a");
    a.setAttribute("href", window.URL.createObjectURL(blob));
    a.setAttribute("download", filename);
    document.body.appendChild(a);
    a.click();
    a.remove();
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
    filePanel.updateNearest(nearest);
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
    jsonPanel.load(origami.export.json());
    filePanel.load(origami, filename, fileExtension);
  };

  const reload = function () {
    load(lastFileLoaded.blob, lastFileLoaded.filename, lastFileLoaded.fileExtension);
  };

  sliderUpdate({ target: { value: 0 } });

  // origami.load({
  //   vertices_coords: [],
  //   edges_vertices: [],
  //   faces_edges: [],
  //   faces_vertices: []
  // });
  // origami.load({});

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

window.onload = function () {
//   fetch("https://robbykraft.github.io/Origami/files/fold/crane.fold").then(blob => blob.json()).then(json => app.load(json, "crane.fold"));
  // fetch("../../files/fold/crane.fold").then(blob => blob.json()).then(json => app.load(json, "crane.fold", "fold"));
  app.load({}, "empty", "fold");
};
