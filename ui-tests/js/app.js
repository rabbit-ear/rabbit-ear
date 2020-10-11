document.addEventListener("DOMContentLoaded", function () {
  var app = LiveCode(document.querySelector("#app"));
  var SVG = window.SVG;
  var queryCode = QueryWatcher("code"); // attach as early as possible
  var zoom = false;

  var svg = SVG(app.dom.canvas, 300, 150, { window: true });
  window.svg = svg;

  var buttons = [ { title: "Help", class: "question-button" },
    { title: "Download", class: "download-button" },
    { title: "Share", class: "share-button" },
    { title: "Load an example", class: "random-button" },
  ].map(function(el) {
    var b = document.createElement("div");
    Object.keys(el).forEach(function(key) { b.setAttribute(key, el[key]); });
    document.querySelector("#app").appendChild(b);
    return b;
  });

  var shuffle = function shuffle(array) {
    for (var i = array.length - 1; i > 0; i -= 1) {
      var j = Math.floor(Math.random() * i);
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  };

  var exampleFilenames = [
    "circle-line.js",
    "circle-segment.js",
    "line-bisect.js",
    "line-nearest-point.js",
    "matrix-reflection.js",
    "origami-split-edge.js",
    // "origami-split-face.js",
    "origami-two-coloring.js",
    "sector.js",
    "vector.js",
    "vector-lerp.js",
  ];
  shuffle(exampleFilenames);
  var examples = [];
  var exampleIndex = 0;

  var loadExamples = function loadExamples(callback) {
    exampleFilenames.forEach(function (file, i) {
      var iteration = i;
      fetch("./" + file, {cache: "no-store"}).then(function (data) {
        return data.text();
      }).then(function (result) {
        examples.push(result);
        if (examples.length === exampleFilenames.length) {
          examples = examples.filter(function (e) { return e != null; });
          callback(examples);
        }
      }).catch(function(error) {
        app.dom.console.innerHTML = "<p>examples require a localhost server. instead, run examples here: https://svg.rabbitear.org</p>";
      });
    });
  };

  var boot = function boot() {
    var url = new URL(window.location.href);
    var paramExampleFilename = url.searchParams.get("example");
    var bootQueryValue = queryCode.value;
    if (paramExampleFilename) {
      if (paramExampleFilename.substring(paramExampleFilename.length - 3) !== ".js") {
        paramExampleFilename += ".js";
      }
      fetch("./" + paramExampleFilename, {cache: "no-store"}).then(function (data) {
        if (!data.ok) { throw new Error(data.statusText); }
        return data.text();
      }).then(function (result) {
        app.injectCode(result);
      }).catch(function (error) {
        app.dom.console.innerHTML = `<p>error ${paramExampleFilename} not found</p>`;
        app.injectCode(`svg.size(100, 100);\nsvg.background('transparent');\n`);
      });
    } else if (bootQueryValue !== null && bootQueryValue !== "") {
      app.injectCode(bootQueryValue);
      queryCode.value = undefined;
    } else {
      app.injectCode(`svg.size(100, 100);\nsvg.background('transparent');\n`);
    }
  };
  boot();

  // help button
  buttons[0].onclick = function () {
    var win = window.open("//robbykraft.github.io/SVG/docs/", "_blank");
    win.focus();
  };

  //download button
  buttons[1].onclick = function () {
    // inject the code into a new section in the header
    var defs = svg.getElementsByTagName("defs");
    if (defs.length === 0) {
      defs = [document.createElementNS(SVG.NS, "defs")];
      svg.prepend(defs[0]);
    }
    var codes = defs[0].getElementsByTagName("code");
    var code = codes.length === 0
      ? document.createElementNS(SVG.NS, "code")
      : codes[0];
    code.innerHTML = "";
    var cdata = new window.DOMParser().parseFromString("<root></root>", "text/xml")
      .createCDATASection("\n" + app.code + "\n");
    code.appendChild(cdata);
    defs[0].prepend(code);
    svg.save();
  };

  // share button
  buttons[2].onclick = function () {
    var url = queryCode.makeURLWithQueryValue(app.editor.getValue());
    navigator.clipboard.writeText(url).then(function () {
      alert("✓ Shareable link copied to clipboard.");
    }, function (err) {
      return alert(err);
    });
  };

  // random button
  buttons[3].onclick = function () {
    if (examples.length === 0) {
      // first boot
      loadExamples(function (examples) {
        if (app.paused) { app.paused = false; }
        app.clear();
        exampleIndex = (exampleIndex + 1) % examples.length;
        return app.injectCode(examples[exampleIndex]);
      });
    } else {
      if (app.paused) { app.paused = false; }
      app.clear();
      exampleIndex = (exampleIndex + 1) % examples.length;
      return app.injectCode(examples[exampleIndex]);
    }
  };

  app.didPause = function (paused) { };
  app.didUpdate = function () { };
  app.didBeginUpdate = function () {
    // console.log("did begin called");
    // app.dom.canvas.removeAttribute("style");

    if (svg !== undefined) {
      svg.removeChildren();
      Array.from(svg.attributes).filter(function (a) {
        return ["version", "xmlns"].indexOf(a.nodeName) === -1;
      }).forEach(function(attr) { svg.removeAttribute(attr.nodeName); });
      // while (svg.attributes.length > 0) {
      //   svg.removeAttribute(svg.attributes[0].nodeName);
      // }

      // remove any Timer functions. handlers will get cleaned up automatically
      // svg.freeze();
      // svg.clearTransforms();
      svg.off();
      svg.stop();
      svg.size(300, 150);
      // svg.fps = 60;
    }
  };

  window.app = app;
});
