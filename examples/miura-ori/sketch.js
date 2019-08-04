const OrigamiAndCode = function (origamiID, codeID, consoleID) {
  const origami = RabbitEar.Origami(origamiID, { padding: 0.05 });
  const consoleDiv = document.querySelector(`#${consoleID}`);
  let editor;

  const editorDidUpdate = function (delta) {
    try {
      origami.reset();
      eval(editor.getValue());
      origami.draw();
      consoleDiv.innerHTML = "";
      if (origami.codeDidUpdate !== undefined) { origami.codeDidUpdate(); }
    } catch (err) {
      consoleDiv.innerHTML = `<p>${err}</p>`;
    }
  };
  const reset = function () {
    origami.load(RabbitEar.bases.square);
  };
  const injectCode = function (text) {
    editor.session.insert({
      row: editor.session.getLength(),
      column: 0
    }, text);
  };

  try {
    editor = ace.edit(codeID);
  } catch (err) {
    throw new Error("bad internet connection. or Ace CDN moved-see index.html");
  }
  editor.setTheme("ace/theme/monokai");
  editor.setKeyboardHandler("ace/keyboard/sublime");
  editor.session.setMode("ace/mode/javascript");
  editor.session.on("change", editorDidUpdate);


  origami.svg.onMouseMove = function (event) {
    /** highlight */
    // origami.vertices.forEach(function (v) { v.svg.style = ""; });
    origami.edges.forEach(function (e) { e.svg.style = ""; });
    origami.faces.forEach(function (f) { f.svg.style = ""; });

    // get all the nearest components to the cursor
    const nearest = origami.nearest(event);
    // console.log(nearest);

    // if (nearest.vertex) { nearest.vertex.svg.style = "fill:#357;stroke:#357"; }
    if (nearest.edge) { nearest.edge.svg.style = "stroke:#ec3"; }
    if (nearest.face) { nearest.face.svg.style = "fill:#e53"; }
    /** highlight end */
  };

  Object.defineProperty(origami, "injectCode", { value: injectCode });
  Object.defineProperty(origami, "editor", { get: function() {return editor;} });
  // origami.editor = editor;
  origami.reset = reset; // allow it to be overwritten
  origami.codeDidUpdate = undefined; // to be called on non-error text change
  return origami;
};

let SLIDER = 0.5;
const origami = OrigamiAndCode("origami-cp", "editor", "console");
const folded = RabbitEar.Origami("origami-fold", { padding: 0.05 });

document.querySelector("#interp-slider").oninput = function (event) {
  let v = parseFloat((event.target.value / 1000).toFixed(2));
  if (v < 0) { v = 0; }
  document.getElementById("interp-value").innerHTML = v;
  SLIDER = v;
  origami.reset();
};

origami.miuraOri = function (points) {
  const boundary = RabbitEar.convexPolygon([[0, 0], [1, 0], [1, 1], [0, 1]]);
  points.forEach((row, j) => {
    row.forEach((point, i) => {
      // crease zig zag rows
      if (i < row.length - 1) {
        const nextHorizPoint = row[(i + 1) % row.length];
        const clip = boundary.clipEdge(point, nextHorizPoint);
        if (clip !== undefined) {
          const assignment = j % 2 === 0 ? "V" : "M";
          origami.mark(clip[0], clip[1], assignment);
        }
      }
      // crease lines connecting between zig zag rows
      if (j < points.length - 1) {
        const nextRow = points[(j + 1) % points.length];
        const nextVertPoint = nextRow[i];
        const clip = boundary.clipEdge(point, nextVertPoint);
        if (clip !== undefined) {
          const assignment = (i + j) % 2 === 0 ? "M" : "V";
          origami.mark(clip[0], clip[1], assignment);
        }
      }
    });
  });
  origami.rebuild();
  delete origami.edges_foldAngle;
  delete origami.edges_length;
  delete origami["faces_re:matrix"];
  delete origami["faces_re:layer"];
  origami.complete();
};

origami.reset = function () {
  origami.load(RabbitEar.bases.square);
  // get points from code window
  const points = eval(origami.editor.getValue());
  if (points === undefined || points.constructor !== Array) { return; }

  // delete origami.cp.onchange[0];
  while (origami.didChange.length > 0) { origami.didChange.shift(); }
  origami.miuraOri(points);
  // origami.cp.onchange[0] = function () { origami.draw(); };
  origami.didChange.push(() => { origami.svg.draw(); });
  origami.svg.draw();

  folded.load(origami.copy());
  folded.fold();
};

origami.reset();

const download = function (text, filename, mimeType) {
  const blob = new Blob([text], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
};

document.querySelector("#download-code").onclick = function (event) {
  const sliderText = `// let SLIDER = ${SLIDER};\n`;
  const text = sliderText + origami.editor.getValue();
  download(text, "miura-ori-code.txt", "text/plain");
};

document.querySelector("#download-svg").onclick = function (event) {
  const svg = origami.cp.svg();
  const svgBlob = (new XMLSerializer()).serializeToString(svg);
  download(svgBlob, "origami.svg", "image/svg+xml");
};

document.querySelector("#download-fold").onclick = function (event) {
  download(origami.cp.json, "origami.fold", "application/json");
};
