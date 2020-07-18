<?php include 'header.php';?>

<script type="text/javascript" src="include/threejs/three.min.js"></script>
<script type="text/javascript" src="include/threejs/THREE.MeshLine.js"></script>
<script type="text/javascript" src="include/threejs/THREE.OrbitControls.js"></script>

<h3 class="chapter">&nbsp;</h3>
<h1 class="chapter">Origami</h1>

<div id="canvas-origami-fold"></div>

<p class="quote">
  grab
</p>

<pre class="code"><code>&lt;!<key>DOCTYPE</key> html&gt;
&lt;<key>title</key>&gt;Rabbit Ear&lt;/<key>title</key>&gt;
&lt;<key>script</key> <v>src</v>=<str>"rabbit-ear.js"</str>&gt;&lt;/<key>script</key>&gt;
&lt;<key>script</key>&gt;
<f>ear</f>.<f>origami</f>({ <str>"touchFold"</str>: <n>true</n> });
&lt;/<key>script</key>&gt;
</code></pre>

<p>
  This simple app creates the sketch above - a square sheet of paper that you can fold.
</p>

<p>
  When you fold an origami, it keeps track of the crease pattern.
</p>

<div id="div-origami-with-cp" class="grid-2"></div>

<pre class="code"><code><f>var</f> origami <key>=</key> <f>ear</f>.<f>origami</f>({ <str>"touchFold"</str>: <n>true</n> });</code></pre>

<p class="quote">
  The origami object <b>is</b> the crease pattern. Learn more in <a href="graph.php">Chapters II. and IV.</a>.
</p>

<p>
  The reverse is possible too. Input an SVG of a flat-foldable crease pattern and this library will fold it.
</p>

<div id="div-folded-crane" class="grid-2"></div>

<pre class="code"><code><f>var</f> origami <key>=</key> <f>ear</f>.<f>origami</f>();<br>origami.<f>load</f>(<str>"crane.svg"</str>);<br>origami.<f>fold</f>();</code></pre>

<p class="quote">
  Determining layer order can be difficult sometimes. When Rabbit Ear is unsure it draws translucent faces.
</p>

<p>
  A flat-foldable crease pattern will always be two-colorable.
</p>

<div id="canvas-face-coloring"></div>

<pre class="code"><code><f>ear</f>.core.make_faces_coloring(origami)
  .<f>map</f>(<arg>color</arg> <f>=></f> color <key>?</key> <str>"#158"</str> <key>:</key> <str>"#fb3"</str>)
  .<f>forEach</f>((<arg>c</arg>, <arg>i</arg>) <f>=></f> origami.faces[i].<f>fill</f>(c));</code></pre>

<p class="quote">
  Read more about drawing, coloring, and touch-interaction in the <a href="svg.php">SVG Appendix</a>.
</p>

<h2>Example Apps</h2>

<p>
  Check out these apps that have been built with early versions of Rabbit Ear.
</p>

<ul>
  <li><a href="//finder.origami.tools/">Reference Finder</a></li>
  <li><a href="//svg.rabbitear.org/">SVG code</a></li>
  <li><a href="https://convert.rabbitear.org/">File Converter</a></li>
  <li><a href="https://beta.rabbitear.org/diagram/">Fold and Diagram</a></li>
</ul>

<h2>Developers</h2>

<p>
  Rabbit Ear is available in its beta form from npm, and the <a href="https://github.com/robbykraft/Origami">source code</a> is online too.
</p>

<pre class="code"><code><c class="no-select">&gt; </c>npm i rabbit-ear</code></pre>

<p>
  Rabbit Ear is suite of packages which can be used independently. Each is available as its own separate node package.
</p>

<p>
  The suite includes a <a href="https://github.com/robbykraft/Math">math library</a>, <a href="https://github.com/robbykraft/SVG">svg-drawing library</a>, and file-conversion from <a href="https://github.com/robbykraft/fold-to-svg">FOLD to SVG</a> and <a href="https://github.com/robbykraft/svg-to-fold">back</a>.
</p>

<pre class="code"><code><c class="no-select">&gt; </c>npm i rabbit-ear-math</code></pre>
<pre class="code"><code><c class="no-select">&gt; </c>npm i rabbit-ear-svg</code></pre>
<pre class="code"><code><c class="no-select">&gt; </c>npm i fold-to-svg</code></pre>
<pre class="code"><code><c class="no-select">&gt; </c>npm i svg-to-fold</code></pre>
<pre class="code"><code><c class="no-select">&gt; </c>npm i svg-segmentize</code></pre>

<section id="footer" style="font-size: 80%; margin: 2rem 0">
  <hr>
  <p>This project is <a href="http://github.com/robbykraft/Origami/">open source</a>.</p>

<script>
var sketchW = (window.innerWidth < window.innerHeight)
  ? 1 : window.innerWidth / window.innerHeight;
var sketchH = (window.innerWidth < window.innerHeight)
  ? window.innerHeight / window.innerWidth : 1;
RabbitEar.origami("canvas-origami-fold", {
  touchFold: true,
  autofit: false,
  padding: 0.1,
  attributes: {
    faces: {
      front: { fill: "#fb3" },
      back: { fill: "white" }
    }
  }
}, sketchW * window.innerWidth, sketchH * window.innerWidth, function(origami) {
  var points = [
    RabbitEar.vector(1, 0),
    RabbitEar.vector(0.7 - Math.random() * 0.3, 0.2 + Math.random() * 0.45)
  ];
  var midpoint = points[0].midpoint(points[1]);
  var vector = points[1].subtract(points[0]);
  origami.fold(midpoint, vector.rotateZ90());
  origami.fold();
});
</script>

<script>
RabbitEar.origami("div-origami-with-cp", {
  touchFold: true,
  autofit: false,
  padding: 0.1,
  attributes: {
    faces: {
      front: { fill: "#fb3" },
      back: { fill: "white" }
    }
  }
}, function(origami) {
  var points = [
    RabbitEar.vector(1, 0),
    RabbitEar.vector(0.7 - Math.random() * 0.3, 0.2 + Math.random() * 0.45)
  ];
  var midpoint = points[0].midpoint(points[1]);
  var vector = points[1].subtract(points[0]);
  origami.fold(midpoint, vector.rotateZ90());
  origami.fold();

  var creasePattern = RabbitEar.origami("div-origami-with-cp", {
    padding: 0.1,
    attributes: {
      edges: {
        mountain: { stroke: "black" },
        valley: { stroke: "black", "stroke-dasharray": "0.02 0.01" }
      }
    }
  });
  creasePattern.load(origami);
  creasePattern.unfold();

  origami.svg.mouseMoved = function () {
    creasePattern.load(origami);
    creasePattern.unfold();
  };
});
</script>

<script>
fetch("../files/svg/crane.svg")
  .then(function(response) { return response.text(); })
  .then(function(svgString) {
    var parent = document.querySelector("#div-folded-crane");
    RabbitEar.svg(parent, function (svg) {
      svg.load(svgString);
      svg.setViewBox(-12, -12, 600 + 12*2, 600 + 12*2);

      RabbitEar.origami(parent, {attributes:{faces:{fill:"#0001"}}}, function (craneFold) {
        craneFold.load(svgString, "svg");
        craneFold.scale(1, -1);
        craneFold.fold();
      });
    });
  });
</script>

<script>
RabbitEar.origami("canvas-face-coloring",
  {vertices_coords:[[0,0],[1,0],[1,1],[0,1],[0.5,0.5],[0.2071,0.5],[0.5,0.2071],[0.7928,0.5],[0.5,0.7928],[0.5,0],[0.5,1],[1,0.5],[0,0.5],[0.3535,0.3535],[0.6464,0.3535],[0.6464,0.6464],[0.3535,0.6464],[0.8535,0.3535],[0.6464,0.1464],[0.3535,0.8535],[0.1464,0.6464],[0.4170,0.9170],[0.4365,0.8191],[0.3535,0.7637],[0.2362,0.6464],[0.1808,0.5634],[0.0829,0.5829],[0.9170,0.4170],[0.7637,0.3535],[0.6464,0.2362],[0.5829,0.0829],[0.5634,0.1808],[0.8191,0.4365],[0.3535,0.5],[0.5,0.64644],[0.4267,0.5732],[0.4267,0.4267],[0.5,0.3535],[0.6464,0.5],[0.5732,0.4267],[0.5732,0.5732],[0.3964,0.1642],[0.2803,0.2803],[0.1642,0.3964],[0.3964,0],[0,0.3964],[0.2542,0.2542],[0.3595,0],[0,0.3595],[0.75,0.8964],[0.8964,0.75]],
  faces_vertices:[[8,10,21,22],[10,8,49],[11,2,50],[7,11,50],[11,7,32,27],[13,6,37,36],[6,13,42,41],[14,1,28],[1,14,29],[6,14,39,37],[14,6,31,29],[14,7,38,39],[7,14,28,32],[15,2,49],[2,15,50],[15,7,50],[7,15,40,38],[18,1,29],[1,18,30],[17,1,27],[1,17,28],[3,20,24],[20,3,26],[3,19,21],[19,3,23],[3,21,10],[22,21,19],[16,23,3],[23,16,8,22],[24,16,3],[16,24,25,5],[20,25,24],[25,20,26],[5,25,26,12],[1,30,9],[11,27,1],[28,17,32],[18,29,31],[30,18,31],[31,6,9,30],[32,17,27],[5,33,35,16],[33,5,13,36],[33,4,35],[4,33,36],[4,34,35],[34,4,40],[34,8,16,35],[8,34,40,15],[36,37,4],[4,37,39],[4,38,40],[38,4,39],[23,22,19],[26,3,12],[2,10,49],[8,15,49],[13,5,43,42],[0,43,48],[43,0,46],[0,41,46],[41,0,47],[6,41,44,9],[5,12,45,43],[42,43,46],[41,42,46],[44,41,47],[43,45,48]]},
  { edges: false, boundaries: false },
  function (twoColor) {
    RabbitEar.core.make_faces_coloring(twoColor, 0)
      .map(function (color) { return color ? "#158" : "#fb3"; })
      .forEach(function (color, i) {
        twoColor.svg.faces[i].setAttribute("fill", color);
      });
  });
</script>

<script>
// let view3D = RabbitEar.origami3D("twist-3d");
// view3D.load("../files/fold/square-twist.fold", function(){
//  view3D.frame = 5;
// });
// document.querySelector("#twist-3d-input").oninput = function(event) {
//  let fraction = parseFloat(event.target.value / 500);
//  let frame = parseInt(fraction * (view3D.frames.length-1));
//  view3D.frame = frame;
// }
</script>

<?php include 'footer.php';?>
