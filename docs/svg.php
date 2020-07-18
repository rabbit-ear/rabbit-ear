<?php include 'header.php';?>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.7/ace.js"></script>
<script type="text/javascript" src="js/svg.ace.js"></script>
<script type="text/javascript" src="js/toolkit.js"></script>
<script type="text/javascript" src="include/katex/katex.min.js"></script>
<link rel="stylesheet" href="include/katex/katex.min.css">

<h3 class="chapter">&nbsp;</h3>
<h1 class="chapter">SVG</h1>

<div id="canvas-svg-parabola"></div>

<pre class="code"><code><f>var</f> svg <key>=</key> <f>ear</f>.<f>svg</f>()</code></pre>

<p>
  SVGs are natively 2D, vector-based, and great for interoperability with pen plotters and laser cutters.
</p>

<p>
  Rabbit Ear comes with a pretty robust Javascript SVG library. It's a separate module, you have to include it.
</p>

<pre class="code"><code><c>// somewhere at the top of your project</c><br><f>ear</f>.<f>use</f>(SVG)</code></pre>
<pre class="code"><code><f>ear</f>.<f>use</f>(FoldToSvg)</code></pre>

<p>
  You'll probably want to include FoldToSvg as well. This allows you to export all your origami objects to SVGs by simply calling .svg()
</p>

<h3>Viewbox</h3>

<p>
  SVG viewboxes allow us to zoom and translate the view space. This allows us to continue working in a unit-square-sized space and visualize full-screen, without having to multiply everything by 100.
</p>

<pre class="code"><code>svg.<f>setViewBox</f>(<n>-1</n>, <n>-1</n>, <n>2</n>, <n>2</n>)<br><c>// (top left corner) x, y, width, height</code></pre>

<div class="equation" id="math-coordinate-equations"></div>

<div class="full" id="canvas-svg-math"></div>

<pre class="code"><code>svg.mouseMoved <key>=</key> <f>function</f> (<arg>mouse</arg>) { }<br> ↳ <span id="span-svg-math-coordinate">{ <str>x</str>: ,<str>y</str>: }</span></code></pre>

<p class="explain">
  Because of the computer standard, the SVG y-axis increases downwards.
</p>

<h3>Y-Axis</h3>

<div class="full" id="canvas-svg-math-inverted"></div>

<p>
  It's very easy to invert the y-axis, but that decision is up to you.
</p>
<pre class="code"><code>svg.<f>setAttribute</f>(<str>"transform"</str>, <str>"matrix(1 0 0 -1 0 0)"</str>);</code></pre>

<h2>Introduction</h2>

<div id="canvas-albers"></div>

<p>
  This command creates an SVG element; and if run on a browser will automatically append the SVG to the document.
</p>

<pre class="code"><code><f>var</f> svg <key>=</key> <f>RabbitEar</f>.<f>svg</f>()</code></pre>

<p>
  Drawing a shape is as simple as:
</p>

<pre class="code"><code><f>var</f> svg <key>=</key> <f>RabbitEar</f>.<f>svg</f>();
svg.<f>circle</f>(<n>0</n>, <n>1</n>, <n>2</n>);
</code></pre>


<p>
  My peferred initialization waits for DOM loading, and wraps code following Javascript's function-scoping.
</p>

<pre class="code"><code><f>RabbitEar</f>.<f>svg</f>((<arg>svg</arg>) <f>=&gt;</f> {
  svg.<f>circle</f>(<n>0</n>, <n>1</n>, <n>2</n>);
});</code></pre>

<p>
  This optional function parameter will be called after the page has finished loading.
</p>


<h2>Style</h2>

<div id="canvas-svg-mask"></div>

<p>
  Style is applied functionally, each function name relates to an SVG attribute.
</p>

<pre class="code"><code>svg.<f>ellipse</f>(<n>40</n>, <n>30</n>, <n>20</n>, <n>10</n>)
  .<f>fill</f>(<str>"crimson"</str>)
  .<f>stroke</f>(<str>"#fcd"</str>)
  .<f>strokeDasharray</f>(<str>"5 10"</str>)
  .<f>strokeWidth</f>(<n>5</n>);</code></pre>

<p>
  kebab-case converts to camelCase.
</p>

<h2>Interactivity</h2>

<p>
  draw on this canvas:
</p>

<div id="canvas-svg-draw"></div>

<pre class="code"><code><f>var</f> points <key>=</key> [];
<f>var</f> shape <key>=</key> svg.<f>polygon</f>()

svg.mouseMoved <key>=</key> <f>function</f> (<arg>mouse</arg>) {
  points.<f>push</f>(mouse);
  <key>if</key> (points.length <key>&gt;</key> <n>100</n>) { points.<f>shift</f>(); }
  shape.<f>setPoints</f>(points);
};
</code></pre>

<p>
  This library makes it as easy as possible to make your SVG interactive.
</p>

<p>
  There are three touch handlers
</p>

<ul>
  <li>mouseMoved</li>
  <li>mousePressed</li>
  <li>mouseReleased</li>
</ul>

<p>
  Each time the event handler fires you get the location of the touch. The coordinates of the touch are in the viewbox space.
</p>

<div id="canvas-svg-touch"></div>

<pre class="code"><code><span id="svg-draw-touch">event <key>=</key> {
  position: {x: <n>0.000</n>, y: <n>0.000</n>}
  previous: {x: <n>0.000</n>, y: <n>0.000</n>}
  isPressed: <n>false</n>
  pressed: {x: <n>0.000</n>, y: <n>0.000</n>}
  drag: {x: <n>0.000</n>, y: <n>0.000</n>}
}</span></code></pre>

<p>
  Mice and trackpads allow movement without being pressed. Touchscreens will always be pressed when moved.
</p>

<h2>Drawing</h2>

<h3>Primitives</h3>

  <pre class="title"><code>SVG()</code></pre>
  <div class="sketch-1"></div>

  <pre class="title"><code>line(<arg>x1</arg>, <arg>y1</arg>, <arg>x2</arg>, <arg>y2</arg>)</code></pre>
  <div class="sketch-2"></div>

  <pre class="title"><code>circle(<arg>x</arg>, <arg>y</arg>, <arg>radius</arg>)</code></pre>
  <div class="sketch-3"></div>

  <pre class="title"><code>ellipse(<arg>x</arg>, <arg>y</arg>, <arg>rx</arg>, <arg>ry</arg>)</code></pre>
  <div class="sketch-4"></div>

  <pre class="title"><code>rect(<arg>x</arg>, <arg>y</arg>, <arg>width</arg>, <arg>height</arg>)</code></pre>
  <div class="sketch-5"></div>

  <pre class="title"><code>polygon(<arg>pointsArray</arg>)</code></pre>
  <div class="sketch-6"></div>

  <pre class="title"><code>polyline(<arg>pointsArray</arg>)</code></pre>
  <div class="sketch-7"></div>

  <pre class="title"><code>path()</code></pre>
  <div class="sketch-8"></div>

  <pre class="title"><code>text(<arg>textString</arg>, <arg>x</arg>, <arg>y</arg>)</code></pre>
  <div class="sketch-9"></div>

<h3>Layers and Masks</h3>

  <pre class="title"><code>g()</code></pre>
  <div class="sketch-10"></div>

  <pre class="title"><code>clipPath()</code></pre>
  <div class="sketch-11"></div>
  
  <pre class="title"><code>mask()</code></pre>
  <div class="sketch-12"></div>

<h3>Outside the Specification</h3>

  <pre class="title"><code>regularPolygon(<arg>cX</arg>, <arg>cY</arg>, <arg>radius</arg>, <arg>sides</arg>)</code></pre>
  <div class="sketch-13"></div>

  <pre class="title"><code>parabola(<arg>x</arg>, <arg>y</arg>, <arg>width</arg>, <arg>height</arg>)</code></pre>
  <div class="sketch-14"></div>

  <pre class="title"><code>curve(<arg>x1</arg>, <arg>y1</arg>, <arg>x2</arg>, <arg>y2</arg>, <arg>bend</arg>)</code></pre>
  <div class="sketch-15"></div>

  <pre class="title"><code>arc(<arg>x</arg>, <arg>y</arg>, <arg>radius</arg>, <arg>angleA</arg>, <arg>angleB</arg>)</code></pre>
  <div class="sketch-16"></div>

  <pre class="title"><code>wedge(<arg>x</arg>, <arg>y</arg>, <arg>radius</arg>, <arg>angleA</arg>, <arg>angleB</arg>)</code></pre>
  <div class="sketch-17"></div>

<h3>Events</h3>

  <pre class="title"><code>onMove, onPress, onRelease</code></pre>
  <div class="sketch-18"></div>

  <pre class="title"><code>animate</code></pre>
  <div class="sketch-19"></div>



<h2>Special</h2>

<h3>Paths</h3>

<p>
  The Path object is like a pen tool, each command is a function, stacking one after another.
</p>

<pre class="code"><code>path().moveTo(50, 50)
  .lineTo(100, 150)
  .curveTo(200, 200, 300, 0)</code></pre>

<h3>Arrows</h3>

<p>
  Arrows are like special lines, with a functional set of modifiers. The <b>head</b> and <b>tail</b> define the options (and existence of) the arrow's pointy bits.
</p>

<h2>Controls</h2>

<p>
  Sometimes it's important to establish an anchor point that persists beyond the life of the handler. These are called <em>controls</em>.
</p>

<div id="canvas-svg-controls"></div>

<pre class="code"><code>svg.controls(4)
    .svg(function () { return RabbitEar.svg.circle(0, 0, svg.getWidth() * 0.05).fill("#e53"); })
    .position(function () { return [random(svg.getWidth()), random(svg.getHeight())]; })
    .parent(back)
    .onChange(function () {
      l1.setPoints(this[0], this[1]);
      l2.setPoints(this[3], this[2]);
      curve.clear().moveTo(this[0]).curveTo(this[1], this[2], this[3]);
    }, true);
</code></pre>


<div id="canvas-svg-astroid"></div>

<div id="canvas-svg-arrows"></div>

<div id="canvas-animated-noise"></div>

<p>
  This library is essentially a wrapper for creating SVG elements.
</p>

<pre class="code"><code>mySVG.<f>rect</f>(<n>10</n>, <n>10</n>, <n>280</n>, <n>130</n>)</code></pre>

<p>
  Calling the line above is the same as writing
</p>

<pre class="code"><code><f>var</f> rect <key>=</key> <f>document</f>.createElementNS(<str>"http://www.w3.org/2000/svg"</str>, <str>"rect"</str>)
rect.<f>setAttribute</f>(<str>"x"</str>, <n>10</n>)
rect.<f>setAttribute</f>(<str>"y"</str>, <n>10</n>)
rect.<f>setAttribute</f>(<str>"width"</str>, <n>280</n>)
rect.<f>setAttribute</f>(<str>"height"</str>, <n>130</n>)
mySVG.<f>appendChild</f>(rect)</code></pre>

<p>
  `RabbitEar.svg` is the global namespace. It's also a constructor. It makes an &lt;svg&gt; element.
</p>

<pre class="code"><code><f>var</f> mySVG <key>=</key> <f>RabbitEar</f>.svg()</code></pre>

<p>
  This library does a few things well:
</p>

<ol>
  <li>Wrap W3C methods in a more convenient way to create and manipulate svgs, drawing primitives, groups, masks, etc..</li>
  <li>Nice event handling (touches, animation).</li>
</ol>

<h2>Appendix</h2>

<h3>container and header types</h3>

<pre><code>group()
defs()
clipPath()
mask()
createElement(tagName) // create any element under the svg namespace
</code></pre>

<h3>geometry primitives</h3>

<pre><code>line(x1, y1, x2, y2)
circle(x, y, radius)
ellipse(x, y, radiusX, radiusY)
rect(x, y, width, height)
polygon(pointsArray)
polyline(pointsArray)
bezier(fromX, fromY, c1X, c1Y, c2X, c2Y, toX, toY)
text(textString, x, y)
arc(x, y, radius, startAngle, endAngle)
wedge(x, y, radius, startAngle, endAngle)
arcEllipse(x, y, radiusX, radiusY, startAngle, endAngle)
wedgeEllipse(x, y, radiusX, radiusY, startAngle, endAngle)
parabola(x, y, width, height)
regularPolygon(cX, cY, radius, sides)
roundRect(x, y, width, height, cornerRadius)
straightArrow(start, end, options)
arcArrow(start, end, options)
</code></pre>

svg: optional initializers

* 2 numbers: width *then* height
* DOM object, this will be the parent to attach the SVG

```javascript
let mySVG = SVG(640, 480, parent_element);
```

<h3>Methods on an SVG</h3>

<pre><code>
save(svg, filename = "image.svg")
load(filename, callback)

removeChildren()
appendTo(parent)
setAttributes(attributeObject)
addClass(className)
removeClass(className)
setClass(className)
setID(idName)

translate(tx, ty)
rotate(degrees)
scale(sx, sy)

getViewBox()
setViewBox(x, y, w, h)
convertToViewBox(x, y)
translateViewBox(dx, dy)
scaleViewBox(scale, origin_x = 0, origin_y = 0)

getWidth()
getHeight()
setWidth(w)
setHeight(h)
background(color)
size(width, height)
size(x, y, width, height)
</code></pre>

<h3>Methods for interaction</h3>

<pre><code>
// a property of an SVG (not a method), the current location of the pointer
mouse

// event handlers
mouseMoved = function (event) { }
mousePressed = function (event) { }
mouseReleased = function (event) { }
scroll = function (event) { }
animate = function (event) { }

// clear all event handlers
clear()
</code></pre>

the mouse event is

```javascript
{
  isPressed: false, // is the mouse button pressed (y/n)
  position: [0,0],  // the current position of the mouse [x,y]
  pressed: [0,0],   // the last location the mouse was pressed
  drag: [0,0],      // vector, displacement from start to now
  prev: [0,0],      // on mouseMoved, the previous location
  x: 0,             //
  y: 0              // -- x and y, these are the same as position
}
```

the animate event is

```javascript
{
  time: 0.0, // in seconds
  frame: 0  // integer
}
```

<div id="canvas-ten-print"></div>


<script type="text/javascript" src="../ui-tests/svg_parabola.js"></script>
<script type="text/javascript" src="../ui-tests/svg_math.js"></script>
<script type="text/javascript" src="../ui-tests/svg_math_inverted.js"></script>
<script type="text/javascript" src="../ui-tests/svg_albers.js"></script>
<script type="text/javascript" src="../ui-tests/svg_astroid.js"></script>
<script type="text/javascript" src="../ui-tests/svg_draw.js"></script>
<script type="text/javascript" src="../ui-tests/svg_touch.js"></script>
<script type="text/javascript" src="../ui-tests/svg_controls.js"></script>
<script type="text/javascript" src="../ui-tests/svg_arrows.js"></script>
<script type="text/javascript" src="../ui-tests/svg_ten_print.js"></script>
<script type="text/javascript" src="../ui-tests/svg_mask.js"></script>
<!-- <script type="text/javascript" src="../ui-tests/svg_animated_noise.js"></script> -->

<script type="text/javascript">
katex.render("y = x, \\sqrt{x}, x^2, x^3", document.getElementById("math-coordinate-equations"));
</script>
<script type="text/javascript">
svgMathCallback = function(e) {
  if (e == null || e.x == null) { return; }
  var string = "{ <str>x</str>: <n>" + e.x.toFixed(2) + "</n>, <str>y</str>: <n>" + e.y.toFixed(2) + "</n> }";
  document.querySelector("#span-svg-math-coordinate").innerHTML = string;
}
</script>

<script>
// 0: 122.0703125
// 1: 48.046875
// isPressed: false
// position: (2) [122.0703125, 48.046875, x: 122.0703125, y: 48.046875]
// pressed: (2) [0, 0]
// drag: (2) [0, 0]
// prev: (2) [121.2890625, 50.390625, x: 121.2890625, y: 50.390625]
// x: 122.0703125
// y: 48.046875    
svgTouchCallback = function (e) {
  var string = "event <key>=</key> {<br>  "
    + "position: {x: <n>" + e.position.x.toFixed(3)
      + "</n>, y: <n>" + e.position.y.toFixed(3) + "</n>}<br>  "
    + "previous: {x: <n>" + e.previous.x.toFixed(3)
      + "</n>, y: <n>" + e.previous.y.toFixed(3) + "</n>}<br>  "
    + "isPressed: <n>" + (e.isPressed ? "true" : "false") + "</n><br>  "
    + "pressed: {x: <n>" + e.pressed.x.toFixed(3)
      + "</n>, y: <n>" + e.pressed.y.toFixed(3) + "</n>}<br>  "
    + "drag: {x: <n>" + e.drag.x.toFixed(3)
      + "</n>, y: <n>" + e.drag.y.toFixed(3) + "</n>}<br>"
    + "}";
  document.querySelector("#svg-draw-touch").innerHTML = string;
}
</script>

<script>
var examples = [
  "window.svg1 = SVG(document.querySelector('#svg-parent'));\n\nsvg1.size(-2, -1, 4, 2);\nsvg1.background('black');\n\nsvg1.circle(1).fill('white');",
  "svg2.line(20, 20, 280, 130)\n  .stroke('black');\n\nsvg2.line([20, 130], [280, 20])\n  .stroke('#000')\n  .strokeWidth(12)\n  .strokeDasharray('16 4 36');",
  "svg3.circle(75, 150, 75)",
  "for (var i = 0; i < 100; i += 10) {\n  svg4.ellipse(100-i, 75, 150, 75)\n    .fill('#000' + i/10);\n}",
  "svg5.rect(250, 100, 25, 25);",
  "svg6.polygon(10, 10, 300, 50, 180, 150)\n  .fill('black');\n\nvar points = [\n  [200,20],\n  [200,120],\n  [100,20],\n  [100,100]];\n\nsvg6.polygon(points)\n  .fill('crimson');\n",
  "svg7.polyline(0, 10, 280, 0, 260, 140, 10, 150)\n\nvar p = svg7.polyline()\n  .stroke('crimson')\n  .fill('none')\n  .strokeWidth(10);\n\nfor (var x = 0; x < 300; x += 20) {\n  p.addPoint(x, Math.random() * 150);\n}",
  "svg8.path()\n  .stroke('crimson')\n  .strokeWidth(10)\n  .fill('none')\n  .Move(250, 100)\n  .Line(60, 10)\n  .curve(-20, 100, 300, 0, 200, 100)\n  .ellipse(50, 50, 0, 0, 1, -80, -80);",
  "svg9.text('abc あいう 🥰🤩🥳', 0, 100)\n  .fill('gold')\n  .fontSize('34px');",
  "var layer = svg10.g().fill('crimson');\n\nsvg10.rect(130, 0, 40, 150).fill('black');\n\nlayer.rect(0, 55, 300, 40);",
  "var clip = svg11.clipPath();\nclip.text('clipping', 0, 95)\n  .fontSize('80px');\n\nsvg11.line(0, 75, 300, 75)\n  .stroke('black')\n  .strokeWidth(20)\n  .clipPath(clip);\n\nsvg11.line(0, 30, 300, 120)\n  .stroke('crimson')\n  .strokeWidth(20)\n  .clipPath(clip);",
  "svg12.rect(300, 30, 0, 90).fill('crimson');\nsvg12.fontWeight(900)\n  .fontSize('100px');\n\nvar m = svg12.mask();\nm.text('MASK', 0, 100).fill('white');\nm.text('MASK', 5, 102).fill('black');\nsvg12.rect(300, 150, 0, 0)\n  .fill('black')\n  .mask(m);",
  "svg13.strokeWidth(10)\n  .stroke('black')\n  .fill('crimson');\n\nsvg13.regularPolygon(150, 75, 72, 10);\nsvg13.regularPolygon(150, 75, 48, 5);",
  "svg14.parabola(0, 150, 300, -150)\n  .fill('crimson');",
  "for (var i = 0; i < 1.25; i += 0.1) {\n  svg15.curve(0, 150, 300, 150, i)\n    .stroke('crimson')\n    .fill('none');\n}",
  "svg16.arc(150, 75, 65, Math.PI/2, Math.PI*7/4)\n  .fill('crimson')\n  .stroke('black')\n  .strokeWidth(10);",
  "svg17.wedge(150, 75, 65, Math.PI/2, Math.PI*7/4)\n  .fill('crimson')\n  .stroke('black')\n  .strokeWidth(10);",
  "svg18.onMove = function (mouse) {\n  svg18.circle(mouse.x, mouse.y, 10)\n    .fill('#0001');\n};",
  "var c = svg19.circle(150, 75, 25);\n\nsvg19.play = function (e) {\n  c.setCenter(Math.sin(e.time) * 100 + 150, 75);\n};\n",
];


document.addEventListener("DOMContentLoaded", function () {
  examples.forEach(function(code, i) {
    var app = LiveCode(document.querySelectorAll(".sketch-" + (i+1))[0]);

    app.editor.renderer.setShowGutter(false);

    var svg;

    if (i+1 === 1) {
      app.dom.canvas.setAttribute("id", "svg-parent");
    } else {
      svg = window["svg" + (i+1)] = RabbitEar.svg(app.dom.canvas, 300, 150);
      svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    }
    app.injectCode(code);

    app.didPause = function (paused) { };
    app.didUpdate = function () { };
    app.didBeginUpdate = function () {
      if (i+1 === 1) {
        if (window.svg1) {
          window.svg1.remove();
        }
        svg = null;
      }
      if (svg == null) { return };

      var keepThese = ["version", "xmlns", "class", "width", "height"];
      while (svg.lastChild) { svg.removeChild(svg.lastChild); }
      Array.from(svg.attributes)
        .filter(function (a) { return keepThese.indexOf(a.nodeName) === -1; })
        .forEach(function(attr) { svg.removeAttribute(attr.nodeName); });
      svg.off();
      svg.stop();
      svg.size(0, 0, 300, 150);
    };
  });
});

</script>
<?php include "footer.php";?>
