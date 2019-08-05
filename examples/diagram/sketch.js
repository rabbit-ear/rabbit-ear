
const origami = RabbitEar.Origami("origami", {
  touchFold: true,
  padding: 0.1,
  autofit: false
});
origami.fold();

// const patternStyle = `.boundary{fill:white;}`;
const patternStyle = `
.creasePattern .mountain,
.creasePattern .valley {
  stroke: white;
}
.boundary {
  fill: none;
  stroke: white;
}`;

const pattern = RabbitEar.Origami("pattern", { padding: 0.1, style: patternStyle });

const STARTER = JSON.parse(JSON.stringify(origami));

origami.alreadyFaded = false;
let intervalId = undefined;

let steps = [JSON.parse(JSON.stringify(STARTER))];

origami.fitView = function (rect, w, h, pad = 0.15) {
  const sideAspect = (w / 2) / h;
  const vb = [];
  vb[0] = sideAspect < 1 ? 0 : -(sideAspect - 1) / 2;
  vb[1] = sideAspect < 1 ? -(1 / sideAspect - 1) / 2 : 0;
  vb[2] = sideAspect < 1 ? 1 * 2 : sideAspect * 2;
  vb[3] = sideAspect < 1 ? 1 / sideAspect : 1;
  vb[0] -= pad;
  vb[1] -= pad;
  vb[2] += pad * 2 * 2; // due to half screen calc
  vb[3] += pad * 2;
  origami.svg.setAttribute("viewBox", vb.join(" "));
};

origami.fitViewInRect = function (rect, w, h, pad = 0.1) {
  const rectAspect = rect.width / rect.height;
  const r = [rect.x / h, rect.y / h, rect.width / h, rect.height / h];

  const vb = [];
  vb[0] = rectAspect < 1 ? -r[0] * 2 : -r[0] * 2 - (rectAspect - 1) / 2;
  vb[1] = rectAspect < 1 ? -r[1] * 2 - (1 / rectAspect - 1) / 2 : -r[1];
  vb[2] = rectAspect < 1 ? 1 * (w / rect.width) : rectAspect * (w / rect.width);
  vb[3] = rectAspect < 1 ? 1 / rectAspect * (h / rect.height) : 1 * (h / rect.height);
  vb[0] -= pad;
  vb[1] -= pad;
  vb[2] += pad * 2 * (w / rect.width); // due to half screen calc
  vb[3] += pad * 2 * (h / rect.height);
  origami.svg.setAttribute("viewBox", vb.join(" "));
};

window.onresize = function (e) {
  origami.fitViewInRect(
    document.querySelectorAll(".placeholder")[0].getBoundingClientRect(),
    e.target.innerWidth, e.target.innerHeight
  );
};

const fadeInCreasePattern = function () {
  if (origami.alreadyFaded) { return; }
  if (intervalId !== undefined) { clearInterval(intervalId); }
  intervalId = setInterval(function () {
    const div = document.querySelector("#pattern");
    let opacity = parseFloat(div.style.opacity) + 0.05;
    if (opacity >= 1.0) {
      opacity = 1.0;
      clearInterval(intervalId);
      intervalId = undefined;
    }
    div.style.opacity = opacity;
    const div2 = document.querySelector("#save-button");
    div2.style.opacity = opacity;
  }, 15);

  origami.alreadyFaded = true;
};

origami.svg.onMouseMove = function (mouse) {
  if (mouse.isPressed) {
    fadeInCreasePattern();
    pattern.load(JSON.parse(JSON.stringify(origami)));
    pattern.unfold();
    // pattern.cp = origami.cp;
  }
};

origami.reset = function () {
  origami.alreadyFaded = false;
  intervalId = undefined;
  // origami.cp = JSON.parse(JSON.stringify(STARTER));
  // pattern.cp = JSON.parse(JSON.stringify(STARTER));
  origami.load(JSON.parse(JSON.stringify(STARTER)));
  pattern.load(JSON.parse(JSON.stringify(STARTER)));
  pattern.unfold();
  steps = [JSON.parse(JSON.stringify(STARTER))];
  document.querySelector("#pattern").style.opacity = 0;
  document.querySelector("#save-button").style.opacity = 0;
  origami.fitViewInRect(
    document.querySelectorAll(".placeholder")[0].getBoundingClientRect(),
    window.innerWidth, window.innerHeight
  );
};

origami.fitViewInRect(
  document.querySelectorAll(".placeholder")[0].getBoundingClientRect(),
  window.innerWidth, window.innerHeight
);

origami.svg.onMouseUp = function () {
  // steps.push(JSON.parse(JSON.stringify(origami.cp)));
  steps.push(JSON.parse(origami.export.fold()));
};

const buildDiagramStepFold = function (steps_array) {
  console.log("steps_array", steps_array);
  // steps = steps.slice(1);
  // transfer construction info into diagram info on previous step
  const diagrams = Array.from(Array(steps_array.length - 1))
    .map((_, i) => i + 1)
    .map(i => RabbitEar.core.build_diagram_frame(steps_array[i]));
  steps_array.forEach(cp => delete cp["re:diagrams"]); // clear old data if exists
  Array.from(Array(steps_array.length - 1))
    .map((_, i) => steps_array[i])
    .forEach((cp, i) => { cp["re:diagrams"] = [diagrams[i]]; });
  // add final instruction step
  steps_array[steps_array.length - 1]["re:diagrams"] = [{
    "re:diagram_instructions": {
      en: "finished"
    }
  }];
  // add diagrams class to each frame_classes. this means include this step in the diagrams
  steps_array.forEach((step, i) => {
    steps_array[i].frame_classes = steps_array[i].frame_classes
      .filter(a => a !== "diagrams");
    steps_array[i].frame_classes.push("diagrams");
  });

  // append a final step, just the crease pattern not to be included in steps.
  const final = JSON.parse(JSON.stringify(steps_array[steps_array.length - 1]));
  final.frame_classes = ["singleModel", "creasePattern"];
  final.vertices_coords = final["vertices_re:unfoldedCoords"];
  steps_array.push(final);

  return {
    file_spec: 1.1,
    file_author: "",
    file_title: "Origami",
    file_description: "2019",
    file_classes: ["diagrams"],
    file_creator: "Rabbit Ear",
    file_frames: steps_array
  };
};


const printHTML = function (htmlContents) {
  const printFrame = document.createElement("iframe");
  printFrame.setAttribute("id", "print-frame");
  printFrame.setAttribute("style",
    "visibility:hidden; height:0; width:0; position:absolute;");
  printFrame.srcdoc = htmlContents;
  printFrame.onload = function () {
    try {
      printFrame.focus();
      printFrame.contentWindow.print();
    } catch (error) {
      console.warn(error);
    } finally {
      document.getElementsByTagName("body")[0].removeChild(printFrame);
    }
  };
  document.getElementsByTagName("body")[0].appendChild(printFrame);
};

const downloadInBrowser = function (filename, contentsAsString) {
  const blob = new window.Blob([contentsAsString], { type: "text/plain" });
  const a = document.createElement("a");
  a.setAttribute("href", window.URL.createObjectURL(blob));
  a.setAttribute("download", filename);
  document.body.appendChild(a);
  a.click();
  a.remove();
};

const saveButton = document.querySelector("#save-button");
if (saveButton != null) {
  saveButton.onclick = function () {
    const fold_file = buildDiagramStepFold(steps);
    downloadInBrowser("origami.fold", JSON.stringify(fold_file));
  };
}

document.querySelector("#reset-button").onclick = function () {
  origami.reset();
};
document.querySelector("#print-button").onclick = function () {
  const fold_file = buildDiagramStepFold(steps);
  const diagramHTML = OrigamiDiagrams(fold_file);
  // downloadInBrowser("origami.html", diagramHTML);
  printHTML(diagramHTML);
};

origami.reset();
