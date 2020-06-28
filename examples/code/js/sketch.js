document.addEventListener("DOMContentLoaded", function () {
  var app = LiveCode(document.querySelector("#app"));

  var cp = RabbitEar.cp();
  let svg;

  app.didPause = function (paused) { };
  app.didUpdate = function () {
    while (app.dom.canvas.firstChild) {
      app.dom.canvas.removeChild(app.dom.canvas.firstChild);
    }
    if (typeof cp.svg === "function") {
      svg = cp.svg({
        padding: 0.05,
        output: "svg",
        attributes: {
          edges: {
            mountain: { stroke: "#158" },
            valley: { stroke: "#e53" }
          }
        }
      });
      app.dom.canvas.appendChild(svg);
    }
  };
  app.reset = function () {
    cp.clear();
  };


  const downloadInBrowser = function (filename, contentsAsString) {
    const blob = new window.Blob([contentsAsString], { type: "text/plain" });
    const a = window.document.createElement("a");
    a.setAttribute("href", window.URL.createObjectURL(blob));
    a.setAttribute("download", filename);
    window.document.body.appendChild(a);
    a.click();
    window.document.body.removeChild(a);
  };

  app.dom.download.onclick = function () {
    if (!cp.isClean) {
      cp.fragment();
      cp.populate();
    }

    const file = JSON.parse(JSON.stringify(cp));
    file["re:code"] = app.code;
    downloadInBrowser("origami.fold", JSON.stringify(file, null, "\t"));
  };

  var pts = [];

  // origami.svg.mouseMoved = function (mouse) {
  //   var nearest = origami.nearest(mouse);
  //   console.log(nearest);

  // };

  // origami.svg.mousePressed = function (mouse) {
  //   pts.push(mouse);
  //   if (pts.length === 2) {
  //     var param = [pts[0][0], pts[0][1], pts[1][0], pts[1][1]].map(n => n.toFixed(5)).join(", ");
  //     app.injectCode(`origami.segment(${param});\n`);
  //     // origami.segment(pts);
  //     pts = [];
  //   }
  // };

  window.app = app;
  window.cp = cp;

  app.injectCode(`// cp.load(RabbitEar.bases.square);

// parameters
let rv = 0.25;
const clipRadius = 3;

const a24 = 1 / 24 * Math.PI * 2;
const edge = Math.cos(Math.PI/12);

const draw = () => {
  let pts = Array.from(Array(12)).map((_,i) => {
    let a = i / 12 * Math.PI * 2 + a24;
    let inout = (i % 2);
    let radius = inout ? 1 + rv : 1 - rv;
    let x1 = Math.cos(a) * radius;
    let y1 = Math.sin(a) * radius;
    return [x1, y1];
  });
  
  const drawTile = (x, y) => {
    pts.forEach((p,i) => {
      const nextP = pts[(i+1)%pts.length];
      cp.valley(x + p[0], y + p[1], x + nextP[0], y + nextP[1]);
    });
    for (let i = 0; i < 6; i++) {
      const func = ["valley", "mountain"][i%2];
      const res = cp[func](
        pts[i+0][0] + x,
        pts[i+0][1] + y,
        pts[i+6][0] + x,
        pts[i+6][1] + y
      );
      // console.log(res)
      // get edge, set fold angle after being added
    }
  };

  var a = Math.PI/2*3;//-(rv - 1.0) * Math.PI/16;
  var r = rv*0.5;//(rv - 1.0)*0.16;

  for (let col = -4; col < 4; col++) {
    for (let row = -4; row < 4; row++) {
      const rowA = 0;
      const colA = Math.PI/3*2;
      const rowX = edge*2*Math.cos(rowA) + r*Math.cos(rowA+a);
      const rowY = edge*2*Math.sin(rowA) + r*Math.sin(rowA+a);
      const colX = edge*2*Math.cos(colA) + r*Math.cos(colA+a);
      const colY = edge*2*Math.sin(colA) + r*Math.sin(colA+a);
      const x = rowX*row + colX*col;
      const y = rowY*row + colY*col;
      if (Math.sqrt((x ** 2) + (y ** 2)) < clipRadius){
        drawTile(x, y);
      }
    }
  }

};

draw();

cp.clean(0.1);
cp.makeBoundary();
`);


  setTimeout(() => {
    app.editor.getSession().foldAll(0, 5);
  }, 500);
  // editor.getSession().unfold(2, true);


// RabbitEar.use(FoldtoThree);
});
