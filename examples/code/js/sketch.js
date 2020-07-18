
const frame = `var canvasWidth = 670;
// svg.size(canvasWidth, canvasWidth);
// svg.strokeWidth(5);
// 2.5
// 1.25
// 72 points per inch
// var frameRadius = ((1/Math.cos(Math.PI/SIDES))*2.5/2 + 0.333*2) * 72;
// var frameRadius = (1.414*2.5/2 + 0.25*2) * 72;
// var wall = 1.333 * 72;
// var thick = 0.25 * 72;

// 2.75 across 1.5 tall
var SIDES = 6;
var frameRadius = (2.75/2+0.75) * 72;
var wall = 0.85 * 72;
var thick = 0.5 * 72;

// var SIDES = 6;
// var frameRadius = (2.875/2+0.5) * 72;
// var wall = 0.75 * 72;
// var thick = 0.25 * 72;

// 12 flat frame
// var SIDES = 12;
// var frameRadius = 2.5 * 72;
// var wall = 0.25 * 72;
// var thick = 0.75 * 72;

const boundary = [];

for (var i = 0; i < SIDES; i += 1) {
  var a = i * Math.PI*2 / SIDES;
  var a2 = (i+1) * Math.PI*2 / SIDES;
  var a3 = (i+0.5) * Math.PI*2 / SIDES;
  var a4 = a3 + Math.PI*0.5;
  var a290 = Math.PI*0.5 - (a2) + Math.PI;
  var aNext = (i-0.5) * Math.PI*2/SIDES + Math.PI;

  var left = {
    x: canvasWidth/2 + frameRadius*Math.cos(a),
    y: canvasWidth/2 + frameRadius*Math.sin(a)
  };
  var right = {
    x: canvasWidth/2 + frameRadius*Math.cos(a2),
    y: canvasWidth/2 + frameRadius*Math.sin(a2)
  };
  var l1 = {
    x: left.x + wall*Math.cos(a3),
    y: left.y + wall*Math.sin(a3)
  };
  var r1 = {
    x: right.x + wall*Math.cos(a3),
    y: right.y + wall*Math.sin(a3)
  };
  var poly_angle = Math.PI/SIDES;
  var clip_hypotenuse = 1/Math.cos(poly_angle);
  var clip_side_length = Math.tan(poly_angle);
  var l2 = {
    x: left.x + wall*Math.cos(a3) + thick*Math.cos(a3),
    y: left.y + wall*Math.sin(a3) + thick*Math.sin(a3),
  };
  var r2 = {
    x: right.x + (wall + thick)*Math.cos(a3),
    y: right.y + (wall + thick)*Math.sin(a3)
  };
  var l2_clip = {
    x: left.x + wall*Math.cos(a3) + (clip_hypotenuse)*thick*Math.cos(a3 + poly_angle),
    y: left.y + wall*Math.sin(a3) + (clip_hypotenuse)*thick*Math.sin(a3 + poly_angle),
  };
  var r2_clip = {
    x: right.x + (wall + thick)*Math.cos(a3) - clip_side_length*thick*Math.cos(a4),
    y: right.y + (wall + thick)*Math.sin(a3) - clip_side_length*thick*Math.sin(a4)
  };
  var l3 = {
    x: l2.x + wall*Math.cos(a3),
    y: l2.y + wall*Math.sin(a3)
  };
  var r3 = {
    x: r2.x + wall*Math.cos(a3) - clip_side_length*thick*Math.cos(a4),
    y: r2.y + wall*Math.sin(a3) - clip_side_length*thick*Math.sin(a4)
  };
  var l3_clip = {
    x: l2_clip.x + wall*Math.cos(a3),
    y: l2_clip.y + wall*Math.sin(a3)
  };
  var l4_clip = {
    x: l2_clip.x + (wall+thick)*Math.cos(a3),
    y: l2_clip.y + (wall+thick)*Math.sin(a3)
  };
  var r4_clip = {
    x: r3.x + thick*Math.cos(a3),
    y: r3.y + thick*Math.sin(a3)
  };

  var tabA = (i+0.5) * Math.PI*2 / SIDES - Math.PI*0.5; // 90 degrees
  var tab0 = {
    x: left.x + (wall+thick)*Math.cos(tabA),
    y: left.y + (wall+thick)*Math.sin(tabA)
  };
  var tab_half = {
    x: l1.x - clip_side_length*wall*Math.cos(a4),
    y: l1.y - clip_side_length*wall*Math.sin(a4)
  };
  var tab_half_2 = {
    x: left.x - wall*Math.cos(a4),
    y: left.y - wall*Math.sin(a4)
  };
  var tab1 = {
    x: l1.x + (wall+thick)*Math.cos(tabA),
    y: l1.y + (wall+thick)*Math.sin(tabA)
  };
  // if (SIDES > 4) {
    // tab0 = left;
    // var crop_a = Math.PI*2 / SIDES;
    // var crop_len = Math.min(Math.tan(crop_a) * wall, (wall*2+thick));
    tab1 = {
      x: left.x - wall*Math.cos(aNext),
      y: left.y - wall*Math.sin(aNext)
    };
  // }
  
  var r2_tab = {
    x: r2_clip.x + thick*Math.cos(a4),
    y: r2_clip.y + thick*Math.sin(a4),
  };
  // line(r1.x, r1.y, r3_tab.x, r3_tab.y).stroke("purple").strokeWidth(5);
  var cx = 0.0;//1.0;
  var cy = 0.0;//-1.0;
  cp.segment(cx+left.x, cy+left.y, cx+l1.x, cy+l1.y).valley(60);
  cp.segment(cx+left.x, cy+left.y, cx+right.x, cy+right.y).valley(90);
  cp.segment(cx+l1.x, cy+l1.y, cx+r1.x, cy+r1.y).valley(90);
  cp.segment(cx+l2_clip.x, cy+l2_clip.y, cx+r2_clip.x, cy+r2_clip.y).valley(90);
  cp.segment(cx+l3_clip.x, cy+l3_clip.y, cx+r3.x, cy+r3.y).valley(90);

  boundary.unshift(
    [right.x, right.y],
    [r1.x, r1.y],
    [r2_tab.x, r2_tab.y],
    [r2_clip.x, r2_clip.y],
    [r4_clip.x, r4_clip.y],
    [l4_clip.x, l4_clip.y],
    [l3_clip.x, l3_clip.y],
    [l3.x, l3.y],
    [l2.x, l2.y],
    [l2_clip.x, l2_clip.y],
    [l1.x, l1.y],
    [tab_half.x, tab_half.y],
    [tab1.x, tab1.y],
  );
  
    // [tab0.x, tab0.y],
    // [tab_half_2.x, tab_half_2.y],
    // [left.x, left.y],
}

const b = cp.polygon(boundary).boundary();
`;

document.addEventListener("DOMContentLoaded", function () {
  var app = LiveCode(document.querySelector("#app"));

  var cp = RabbitEar.cp.square();
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
            mountain: { stroke: "#e53" },
            valley: { stroke: "#158" },
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
      cp.clean();
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

  app.injectCode(frame);
//   app.injectCode(`cp.load(ear.bases.square);
// cp.clipping = true;

// cp.segment(0,0,1,1);
// cp.segment(1,0,0,1).mountain(90);
// cp.segment(0, 1, 0.414213562373095, 0)
//   .valley();
// cp.segment(0, 1, 1, 1-0.414213562373095)
//   .valley();

// const sq = Math.sqrt(2)/2 - 0.414213562373095;
// cp.rect(0.414213562373095, 0.414213562373095, sq, sq);

// // cp.circle(Math.sqrt(2)/2 - (1-0.414213)/2);
// // cp.circle(Math.sqrt(2)/2 - (1-0.414213)/2, 1, 1);

// cp.circle(Math.sqrt(2)/2, 1, 0);
// cp.circle(1 - Math.sqrt(2)/2);

// cp.circle(Math.sqrt(2)/2, 0, 1);
// cp.circle(1 - Math.sqrt(2)/2, 1, 1);

// `);


  setTimeout(() => {
    app.editor.getSession().foldAll(0, 5);
  }, 500);
  // editor.getSession().unfold(2, true);


// RabbitEar.use(FoldtoThree);
});


const good = `cp.load(ear.bases.square);

cp.segment(0,0,1,1);
cp.segment(1,0,0,1).mountain(90);
cp.segment(0, 1, 0.414213562373095, 0)
  .valley();
cp.segment(0, 1, 1, 1-0.414213562373095)
  .valley();
`;



