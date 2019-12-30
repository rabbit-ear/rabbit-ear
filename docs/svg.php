<?php include 'header.php';?>
<script type="text/javascript" src="js/toolkit.js"></script>
<script type="text/javascript" src="include/katex/katex.min.js"></script>
<link rel="stylesheet" href="include/katex/katex.min.css">

<h3>CHAPTER II.</h3>

<h1>SVG</h1>

<div id="canvas-svg-parabola"></div>

<p>
  SVGs are natively 2D, vector-based, and great for interoperability with pen plotters and laser cutters.
</p>

<h3>Viewbox</h3>

<p class="explain">
  SVG viewboxes allow us to zoom and translate the view space. This allows us to continue working in a unit-square-sized space and visualize full-screen, without having to multiply everything by 100.
</p>

<pre class="code"><code>svg.<f>setAttribute</f>(<str>"viewbox"</str>, <str>"-1 -1 2 2"</str>)</code></pre>

<div class="equation" id="math-coordinate-equations"></div>

<div class="full" id="canvas-svg-math"></div>

<pre class="code"><code>svg.mouseMoved <key>=</key> <f>function</f> (<arg>mouse</arg>) { }<br> ↳ <span id="span-svg-math-coordinate">{ <str>x</str>: ,<str>y</str>: }</span></code></pre>

<h3>Y-Axis</h3>

<p class="explain">
  Because of the computer standard, the SVG y-axis increases downwards.
</p>

<div class="full" id="canvas-svg-math-inverted"></div>

<p>
  It's very easy to invert the y-axis, but we leave that up to you.
</p>
<pre class="code"><code>svg.<f>setAttribute</f>(<str>"transform"</str>, <str>"matrix(1 0 0 -1 0 0)"</str>);</code></pre>

<h2>Drawing</h2>

<div id="canvas-albers"></div>

<p>
  `RabbitEar.svg` creates an &lt;svg&gt; element.
</p>

<pre class="code"><code><f>var</f> svg <key>=</key> <f>RabbitEar</f>.svg()</code></pre>

<p>
  Drawing a shape is as simple as:
</p>

<pre class="code"><code><f>var</f> svg <key>=</key> <f>RabbitEar</f>.svg();
svg.<f>circle</f>(<n>0</n>, <n>1</n>, <n>2</n>);
</code></pre>


<p>
  My peferred initialization waits for DOM loading, and wraps code to follow Javascript's function-scope.
</p>

<pre class="code"><code><f>RabbitEar</f>.svg((<arg>svg</arg>) <f>=&gt;</f> {
  svg.<f>circle</f>(<n>0</n>, <n>1</n>, <n>2</n>);
});</code></pre>

<p>
  If you supply a function as a parameter, it will be called after the page loads using DOMContentLoaded.
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

<h2>Primitives</h2>

  <h3>Drawing</h3>

  <div class="grid-2">
    <div>
      <pre class="code"><code>svg.<f>line</f>(<arg>x1</arg>, <arg>y1</arg>, <arg>x2</arg>, <arg>y2</arg>)</code></pre>
      <p class="returns">&gt; creates one <a href="https://www.w3.org/TR/SVG/shapes.html#LineElement">&lt;line&gt;</a> element</p>
    </div>
    <div id="svg-example-line"></div>
  </div>
<hr>
  <div class="grid-2">
    <div>
      <pre class="code"><code>svg.<f>circle</f>(<arg>x</arg>, <arg>y</arg>, <arg>radius</arg>)</code></pre>
      <p class="returns">&gt; creates one <a href="https://www.w3.org/TR/SVG/shapes.html#CircleElement">&lt;circle&gt;</a> element</p>
      <p class="description">the x, y is the circle's center.</p>
    </div>
    <div id="svg-example-circle"></div>
  </div>
<hr>
  <div class="grid-2">
    <div>
      <pre class="code"><code>svg.<f>ellipse</f>(<arg>x</arg>, <arg>y</arg>, <arg>rx</arg>, <arg>ry</arg>)</code></pre>
      <p class="returns">&gt; creates one <a href="https://www.w3.org/TR/SVG/shapes.html#EllipseElement">&lt;ellipse&gt;</a> element</p>
      <p class="description">an ellipse has 2 radii, along the X and Y axes.</p>
    </div>
    <div id="svg-example-ellipse"></div>
  </div>
<hr>
  <div class="grid-2">
    <div>
      <pre class="code"><code>svg.<f>rect</f>(<arg>x</arg>, <arg>y</arg>, <arg>width</arg>, <arg>height</arg>)</code></pre>
      <p class="returns">&gt; creates one <a href="https://www.w3.org/TR/SVG/shapes.html#RectElement">&lt;rect&gt;</a> element</p>
      <p class="description">the x, y is top left corner.</p>
    </div>
    <div id="svg-example-rect"></div>
  </div>
<hr>
  <div class="grid-2">
    <div>
      <pre class="code"><code>svg.<f>polygon</f>(<arg>pointsArray</arg>)</code></pre>
      <p class="returns">&gt; creates one <a href="https://www.w3.org/TR/SVG/shapes.html#PolygonElement">&lt;polygon&gt;</a> element</p>
      <p class="description">A polygon is a closed shape defined by a series of points.</p>
      <p class="description">Accepts points as arrays or {x:, y:} objects.</p>
      <ul class="description">
        <li><pre>[[0.5, 1.0], [3.5, 2.5]]</pre></li>
        <li><pre>{x:0.5, y:1.0}, {x:3.5, y:2.5}</pre></li>
        <li><pre>0.5, 1.0, 3.5, 2.5, 10, 10</pre></li>
      </ul>
    </div>
    <div id="svg-example-polygon"></div>
  </div>
<hr>
  <div class="grid-2">
    <div>
      <pre class="code"><code>svg.<f>regularPolygon</f>(<arg>cX</arg>, <arg>cY</arg>, <arg>radius</arg>, <arg>sides</arg>)</code></pre>
      <p class="returns">&gt; creates one <a href="https://www.w3.org/TR/SVG/shapes.html#PolygonElement">&lt;polygon&gt;</a> element</p>
      <p class="description">creates regular polygons of n number of sides (3 = eq. triangle), centered at point (cX, cY), with a circumscribed radius.</p>
    </div>
    <div id="svg-example-regularPolygon"></div>
  </div>
<hr>
  <div class="grid-2">
    <div>
      <pre class="code"><code>svg.<f>polyline</f>(<arg>pointsArray</arg>)</code></pre>
      <p class="returns">&gt; creates one <a href="https://www.w3.org/TR/SVG/shapes.html#PolylineElement">&lt;polyline&gt;</a> element</p>
      <p class="description">just like the polygon but the beginning and end aren't connected.</p>
    </div>
    <div id="svg-example-polyline"></div>
  </div>
<hr>
  <div class="grid-2">
    <div>
      <pre class="code"><code>svg.<f>text</f>(<arg>textString</arg>, <arg>x</arg>, <arg>y</arg>)</code></pre>
      <p class="returns">&gt; creates one <a href="https://www.w3.org/TR/SVG/text.html#TextElement">&lt;text&gt;</a> element</p>
      <p class="description">the x and y describe the location of the left most point along the baseline. the text sits above the point in the y direction. if defined at (0,0) the text will sit above the top of the frame.</p>
    </div>
    <div id="svg-example-text"></div>
  </div>

  <h3>Path and Curves</h3>

  <div class="grid-2">
    <div>
      <pre class="code"><code>svg.<f>arc</f>(<arg>x</arg>, <arg>y</arg>, <arg>radius</arg>, <arg>angleA</arg>, <arg>angleB</arg>)</code></pre>
      <p class="returns">&gt; creates one <a href="https://www.w3.org/TR/SVG/paths.html#PathElement">&lt;path&gt;</a> element</p>
      <p class="description">an arc is the curve along the boundary of a circle.</p>
    </div>
    <div id="svg-example-arc"></div>
  </div>
<hr>
  <div class="grid-2">
    <div>
      <pre class="code"><code>svg.<f>wedge</f>(<arg>x</arg>, <arg>y</arg>, <arg>radius</arg>, <arg>angleA</arg>, <arg>angleB</arg>)</code></pre>
      <p class="returns">&gt; creates one <a href="https://www.w3.org/TR/SVG/paths.html#PathElement">&lt;path&gt;</a> element</p>
      <p class="description">a wedge is a filled arc, like a slice of a pie that includes the center of the circle.</p>
    </div>
    <div id="svg-example-wedge"></div>
  </div>
<hr>
  <div class="grid-2">
    <div>
      <pre class="code"><code>svg.<f>bezier</f>(<arg>fromX</arg>, <arg>fromY</arg>, <arg>c1X</arg>, <arg>c1Y</arg>, <arg>c2X</arg>, <arg>c2Y</arg>, <arg>toX</arg>, <arg>toY</arg>)</code></pre>
      <p class="returns">&gt; creates one <a href="https://www.w3.org/TR/SVG/paths.html#PathElement">&lt;path&gt;</a> element</p>
      <p class="description">a bezier curve is defined between two points (fromX, fromY) and (toX, toY) with two control points (c1X, c1Y) and (c2X, c2Y). The arguments are arranged in order of appearance when tracing the line from start to finish.</p>
    </div>
    <div id="svg-example-bezier"></div>
  </div>
<hr>
  <div class="grid-2">
    <div>
      <pre class="code"><code>svg.<f>parabola</f>(<arg>x</arg>, <arg>y</arg>, <arg>width</arg>, <arg>height</arg>)</code></pre>
      <p class="returns">&gt; creates one <a href="https://www.w3.org/TR/SVG/shapes.html#PolylineElement">&lt;polyline&gt;</a> element</p>
      <p class="description">This creates a polyline approximation of the curve y=x², centered on the y-axis. The parameters define the rectangle that encloses the curve.</p>
    </div>
    <div id="svg-example-parabola"></div>
  </div>

  <h3>Layering and Clipping</h3>

  <div class="grid-2">
    <div>
      <pre class="code"><code><f>group</f>()</code></pre>
      <p class="returns">&gt; creates one <a href="https://www.w3.org/TR/SVG/struct.html#Groups">&lt;group&gt;</a> element</p>
      <p class="description">like a layer in Photoshop, a group is a container. it's useful for z-ordering. it doesn't show up visually, but if you style it, the style will apply to all its children.</p>
    </div>
    <div id="svg-example-group"></div>
  </div>
<hr>
  <div class="grid-2">
    <div>
      <pre class="code"><code><f>clipPath</f>()</code></pre>
      <p class="returns">&gt; creates one <a href="https://drafts.fxtf.org/css-masking-1/#ClipPathElement">&lt;clip-path&gt;</a> element</p>
      <p class="description">A clip path sits in the header, like style. Append closed-geometry elements to it and they will become a clipping mask. Clip another element by styling its clip-path attribute:</p>
      <ul class="description"><li><code><f>const</f> clip <key>=</key> <f>clipPath</f>();<br>shape.<f>clipPath</f>(clip);</code></li></ul>
      <p class="description">which will automatically perform a call like this, matching the url id name parameter.</p>
      <ul class="description"><li><code>shape.<f>setAttribute</f>(<str>"clip-path"</str>, <str>"url(#id_name)"</str>);</code></li></ul>
    </div>
    <div id="svg-example-clipPath"></div>
  </div>
<hr>
  <div class="grid-2">
    <div>
      <pre class="code"><code><f>mask</f>()</code></pre>
      <p class="returns">&gt; creates one <a href="https://drafts.fxtf.org/css-masking-1/#MaskElement">&lt;mask&gt;</a> element</p>
      <p class="description">A mask is similar to a clip path but instead of a path, a mask is a black and white image. Fill the mask layer with black and white shapes (or gray for transparency). Clip another element by setting its mask attribute:</p>
      <ul class="description"><li><code><f>const</f> m <key>=</key> <f>mask</f>();<br>shape.<f>mask</f>(m);</code></li></ul>
      <p class="description">which will automatically perform a call like this, matching the url id name parameter.</p>
      <ul class="description"><li><code>shape.<f>setAttribute</f>(<str>"mask"</str>, <str>"url(#id_name)"</str>);</code></li></ul>
    </div>
    <div id="svg-example-mask"></div>
  </div>
<hr>
  <div class="grid-2">
    <div>
      <pre class="code"><code><f>stylesheet</f>()</code></pre>
      <p class="returns">&gt; creates one <a href="https://www.w3.org/TR/SVG/styling.html#StyleElement">&lt;style&gt;</a> element</p>
      <p class="description">A style section contain CSS text (on property .innerHTML). CSS is helpful for selecting multiple objects and styling them with one definition.</p>
      <p class="description">This is not advised. Even if a stylesheet is inside one SVG, it applies to all SVGs on the same HTML page.</p>
      <p class="description">But be careful! Style sections affect the global space. Multiple SVG images on the same HTML document all inherit each other's style sections.</p>
    </div>
    <div id="svg-example-stylesheet"></div>
  </div>
<hr>
  <div class="grid-2">
    <div>
      <pre class="code"><code><f>defs</f>()</code></pre>
      <p class="returns">&gt; creates one <a href="https://www.w3.org/TR/SVG/struct.html#DefsElement">&lt;defs&gt;</a> element</p>
      <p class="description">It's typical that everything mentioned in this section is a child in the defs() element: style, clip paths, and masks (though, it appears to not be required). Any drawing primitives appended to the defs <b>will not be drawn</b>.</p>
    </div>
    <div id="svg-example-defs"></div>
  </div>

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
RabbitEar.svg(document.querySelector("#svg-example-line"), (svg) => {
  svg.line(20, 20, 280, 130)
    .stroke("black");
  svg.line(20, 130, 280, 20)
    .stroke("sienna")
    .strokeWidth(7)
    .strokeDasharray("7 5");
});
RabbitEar.svg(document.querySelector("#svg-example-circle"), (svg) => {
  svg.circle(150, 75, 50)
    .fill("peru");
});
RabbitEar.svg(document.querySelector("#svg-example-ellipse"), (svg) => {
  svg.ellipse(150, 75, 100, 50)
    .fill("chocolate");
});
RabbitEar.svg(document.querySelector("#svg-example-rect"), (svg) => {
  svg.rect(100, 50, 100, 50)
    .fill("steelblue");
});
RabbitEar.svg(document.querySelector("#svg-example-polygon"), (svg) => {
  svg.polygon(10, 10, 150, 50, 80, 90)
    .fill("thistle");
  var points = [
    [240,20],
    [250,120],
    [150,20],
    [170,100]];
  svg.polygon(points)
    .fill("sienna");
});
RabbitEar.svg(document.querySelector("#svg-example-regularPolygon"), (svg) => {
  svg.regularPolygon(100, 75, 65, 5)
    .fill("forestgreen");
  svg.regularPolygon(200, 75, 40, 7)
    .fill("black");
});
RabbitEar.svg(document.querySelector("#svg-example-polyline"), (svg) => {
  svg.polyline(40, 40, 100, 140, 150, 30, 250, 140)
    .stroke("tomato")
    .strokeWidth(10);
});
RabbitEar.svg(document.querySelector("#svg-example-text"), (svg) => {
  svg.text("abc あいう 🥰🤩🥳", 20, 75)
    .fill("black")
    .fontSize("30px");
});
RabbitEar.svg(document.querySelector("#svg-example-arc"), (svg) => {
  svg.arc(150, 75, 65, Math.PI/2, Math.PI*7/4)
    .fill("darkolivegreen")
    .stroke("yellowgreen")
    .strokeWidth(10);
});
RabbitEar.svg(document.querySelector("#svg-example-wedge"), (svg) => {
  svg.wedge(150, 75, 65, Math.PI/2, Math.PI*7/4)
    .fill("darkolivegreen")
    .stroke("yellowgreen")
    .strokeWidth(10);
});
RabbitEar.svg(document.querySelector("#svg-example-bezier"), (svg) => {
  svg.bezier(40, 40, 100, 140, 150, 30, 250, 140)
    .stroke("tomato")
    .strokeWidth(10);
});
RabbitEar.svg(document.querySelector("#svg-example-parabola"), (svg) => {
  svg.parabola(50, 20, 130, 130)
    .fill("crimson");
  svg.parabola(200, 120, 40, -80)
    .fill("gold");
});
RabbitEar.svg(document.querySelector("#svg-example-group"), (svg) => {
  var g = svg17.group().fill("dodgerblue");
  svg17.rect(140, 0, 20, 150).fill("white");
  g.rect(0, 65, 300, 20);
});
RabbitEar.svg(document.querySelector("#svg-example-clipPath"), (svg) => {
  var clip = svg.clipPath();
  clip.text("clipping", 0, 95)
    .fontSize("80px");
  svg.line(0, 75, 300, 75)
    .stroke("orchid")
    .strokeWidth(20)
    .clipPath(clip);
  svg.line(0, 30, 300, 120)
    .stroke("forestgreen")
    .strokeWidth(20)
    .clipPath(clip);
});
RabbitEar.svg(document.querySelector("#svg-example-mask"), (svg) => {
  svg.line(0, 70, 300, 70).strokeWidth(20).stroke("lightgray");
  var m = svg.mask();
  m.text("MASK", 20, 95)
    .fill("white")
    .fontWeight(900)
    .fontSize("80px");
  m.text("MASK", 25, 97)
    .fill("black")
    .fontWeight(900)
    .fontSize("80px");
  svg.rect(0, 0, 300, 150)
    .strokeWidth(20)
    .fill("orchid")
    .mask(m);
});
RabbitEar.svg(document.querySelector("#svg-example-stylesheet"), (svg) => {
  svg.setClass("styled");
  var css = ".styled rect { fill: crimson }";
  var s = svg.stylesheet(css);
  svg.rect(100, 25, 100, 100);
});
RabbitEar.svg(document.querySelector("#svg-example-defs"), (svg) => {
// this example does not visualize anything
  var d = svg.defs();
  var t = SVG.createElement("title");
  t.innerHTML = "metadata";
  d.appendChild(t);
  d.rect(20, 20, 100, 100);
});
</script>

<?php include "footer.php";?>
