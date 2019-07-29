const OrigamiAndCode = function (origamiID, codeID, consoleID) {
  const origami = re.Origami(origamiID, { padding: 0.05 });
  const consoleDiv = document.querySelector(`#${consoleID}`);

  const editorDidUpdate = function (delta) {
    try {
      origami.reset();
      eval(origami.editor.getValue());
      origami.draw();
      consoleDiv.innerHTML = "";
      if (origami.codeDidUpdate !== undefined) { origami.codeDidUpdate(); }
    } catch (err) {
      consoleDiv.innerHTML = `<p>${err}</p>`;
    }
  };
  const reset = function () {
    origami.cp = re.bases.square;
  };
  const injectCode = function (text) {
    origami.editor.session.insert({
      row: origami.editor.session.getLength(),
      column: 0
    }, text);
  };

  try {
    origami.editor = ace.edit(codeID);
  } catch (err) {
    throw new Error("bad internet connection. or Ace CDN moved-see index.html");
  }
  origami.editor.setTheme("ace/theme/monokai");
  origami.editor.setKeyboardHandler("ace/keyboard/sublime");
  origami.editor.session.setMode("ace/mode/javascript");
  origami.editor.session.on("change", editorDidUpdate);

  origami.onMouseDown = function (mouse) {
    const nearest = origami.nearest(mouse);
    const keys = Object.keys(nearest);
    const consoleString = keys
      .filter(key => nearest[key] != null)
      .map(key => `origami.cp.${key}[${nearest[key].index}]`)
      .map((objStr, i) => keys[i]
        + ": <a href='#' onclick='origami.injectCode(\""
        + objStr + "\")'>" + objStr + "</a><br>")
      .reduce((a, b) => a + b, "");
    consoleDiv.innerHTML = `<p>${consoleString}</p>`;
  };

  Object.defineProperty(origami, "injectCode", { value: injectCode });
  origami.reset = reset; // allow it to be overwritten
  origami.codeDidUpdate = undefined; // to be called on non-error text change
  return origami;
};

let SLIDER = 0.5;
const origami = OrigamiAndCode("origami-cp", "editor", "console");
const folded = re.Origami("origami-fold", { padding: 0.05 });

document.querySelector("#interp-slider").oninput = function (event) {
  let v = parseFloat((event.target.value / 1000).toFixed(2));
  if (v < 0) { v = 0; }
  document.getElementById("interp-value").innerHTML = v;
  SLIDER = v;
  origami.reset();
};

origami.miuraOri = function (points) {
  let boundary = re.convexPolygon([[0, 0], [1, 0], [1, 1], [0, 1]]);
  points.forEach((row, j) => {
    row.forEach((point, i) => {
      // crease zig zag rows
      if (i < row.length - 1) {
        const nextHorizPoint = row[(i + 1) % row.length];
        const clip = boundary.clipEdge(point, nextHorizPoint);
        if (clip !== undefined) {
          const crease = this.cp.creaseSegment(clip[0], clip[1]);
          if (crease != null) {
            if (j % 2 === 0) { crease.valley(); }
            else { crease.mountain(); }
          }
        }
      }
      // crease lines connecting between zig zag rows
      if (j < points.length - 1) {
        const nextRow = points[(j + 1) % points.length];
        const nextVertPoint = nextRow[i];
        const clip = boundary.clipEdge(point, nextVertPoint);
        if (clip !== undefined) {
          const crease = this.cp.creaseSegment(clip[0], clip[1]);
          if (crease != null) {
            if ((i + j) % 2 === 0) { crease.mountain(); }
            else { crease.valley(); }
          }
        }
      }
    });
  });
  this.cp.clean();
};

origami.reset = function () {
  origami.cp = re.bases.square;
  // get points from code window
  const points = eval(origami.editor.getValue());
  if (points === undefined || points.constructor !== Array) { return; }

  delete origami.cp.onchange[0];
  origami.miuraOri(points);
  origami.cp.onchange[0] = function () { origami.draw(); };
  origami.draw();

  folded.cp = origami.cp.copy();
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
