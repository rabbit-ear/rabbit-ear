<?php include 'header.php';?>
<script type="text/javascript" src="include/katex/katex.min.js"></script>
<link rel="stylesheet" href="include/katex/katex.min.css">

<h3>CHAPTER I.</h3>

<h1>ORIGAMI MATH</h1>

<div id="canvas-junction-bisect"></div>

<p>When origami is digitized, we encode it in Euclidean space.</p>

<p>Folded origami requires 3D space, but idealized crease patterns are typically in 2D and benefit from the wealth and (sometimes) simplicity of 2D geometry algorithms.</p>

<p>This means our math library needs to excell in linear algebra and 3D and especially 2D geometry.</p>

<h2 id="vector">Vector / Point</h2>
	<p>This fundamental linear algebra type works in any dimension.</p>

	<div class="full" id="canvas-vector-labels"></div>
	<pre class="code"><code><f>var</f> point <key>=</key> <f>vector</f>(<span id="vec-sketch-vector"><n>0.5</n>, <n>0.666</n></span>)<br>point.<f>normalize</f>()<br> ↳ <span id="vec-sketch-normal"></span></code></pre>

	<!-- <h4>Linear Interpolation</h4> -->
	<div id="canvas-lerp"></div>
	<pre class="code"><code><span style="color:#6096bb">blue1</span> = <span style="color:#e44f2a">red1</span>.lerp(<span style="color:#e44f2a">red2</span>, <span id="lerp-time-1">t</span>)<br><span style="color:#6096bb">blue2</span> = <span style="color:#e44f2a">red2</span>.lerp(<span style="color:#e44f2a">red3</span>, <span id="lerp-time-2">t</span>)<br><span style="color:#ecb233">yellow</span> = <span style="color:#6096bb">blue1</span>.lerp(<span style="color:#6096bb">blue2</span>, <span id="lerp-time-3">t</span>)</code></pre>

	<p>
		This vector object is <b>immutable</b>. Each vector operation returns a new, transformed vector.
	</p>

	<p>
		This immutability pattern is generally reflected throughout the entire library.
	</p>

	<p>
		The vector is actually a Javascript array of numbers
	</p>

	<pre class="code"><code>vector[<n>0</n>] <c>// x value</c><br>vector[<n>1</n>] <c>// y</c><br>vector[<n>2</n>] <c>// z</c><br><c>// [3], [4] for 4-dimensional, 5-dimensional</c></code></pre>

	<p>
		Equivalent to
	</p>

	<pre class="code"><code>vector.x<br>vector.y<br>vector.z</code></pre>

	<p class="explain">
		Some methods like dot product, normalize, add/subtract work for vectors of any dimension. Others like cross product, reflect, transform are hard coded for 2D or 3D space.
	</p>

<h2 id="matrix">MATRIX</h2>

	<div class="equation" id="matrix-1"></div>

	<p>
		Matrices are powerful representations of geometric transformations. Inside of one matrix can contain instructions for any number of rotations, translations, reflections, scaling, shearing; and it can tell you things like whether a polygon has been flipped over.
	</p>

	<div class="full" id="canvas-matrix-basis"></div>

	<div class="equation" id="matrix-2"></div>

	<p>
		A 2x3 matrix encodes 2D space, its columns from left to right:
	</p>

	<ul>
		<li>x-axis basis vector</li>
		<li>y-axis basis vector</li>
		<li>translation vector</li>
	</ul>

	<h3 id="reflection">Reflection</h3>

	<p>
			One transform in particular is especially useful to origami: <b>reflection</b>. Simulating a fold is two steps:
	</p>
	<ol>
		<li>Split the polygon along the fold line into multiple polygons.</li>
		<li>Gather all faces from one side of the line and <b>reflect</b> them across the fold line, positioning them in z-space on top.</li>
	</ol>

	<div id="canvas-fold-poly"></div>

	<p>
		This library makes it as easy as possible to generate a reflection matrix.
	</p>

	<div class="full" id="canvas-reflection"></div>
	<div class="equation" id="matrix-3"></div>

	<p>
		Any line type (Line, Ray, Segment) can be turned into a reflection matrix.
	</p>

	<pre class="code"><code><f>var</f> matrix <key>=</key> <f>segment</f>(<span id="reflection-segment-params"></span>).<f>reflection</f>()</code></pre>

	<h3 id="reflection">3D</h3>

<!-- <h2><span style="color:#ecb233">Lines</span>, <span style="color:#195783">Rays</span>, <span style="color:#e44f2a">Segments</span></h2> -->
<h2 id="line">Lines, Rays, Segments</h2>

	<div class="full" id="canvas-line-ray-edge-intersection"></div>

	<p>
		<b><span style="color:#ea3">lines</span></b> extend infinitely in both directions</p>
	<p>
		<b><span style="color:#379">rays</span></b> extend infinitely in one direction</p>
	<p>
		line <b><span style="color:#e53">segments</span></b> are bound by two endpoints
	</p>

	<p>
		Only two of these, lines and rays, are created similarly in code, by specifying an <b>origin</b> and a <b>direction</b>.</p>
	<p>
		Segments are uniquely initialized with two <b>endpoints.</b>
	</p>

	<pre class="code"><code><f>var</f> l <key>=</key> <f>line</f>(<arg>origin</arg>, <arg>vector</arg>)<br><f>var</f> r <key>=</key> <f>ray</f>(<arg>origin</arg>, <arg>vector</arg>)<br><f>var</f> s <key>=</key> <f>segment</f>(<arg>point_a</arg>, <arg>point_b</arg>)</code></pre>
	
	<p>
		A large hurdle designing this library was how to treat these three types as similarly as possible. All three types contain an origin and a vector.
	</p>

	<pre class="code"><code><c>// a is line, ray, or segment</c><br>a.<f>origin</f><br>a.<f>vector</f></code></pre>

	<p>
		The line segment is the most unique, it's actually an array of points:
	</p>

	<pre class="code"><code>segment[<n>0</n>] <c>// first endpoint</c><br>segment[<n>1</n>] <c>// second endpoint</c></code></pre>

	<p>
		Here's a fun operation: we can <b>bisect</b> two lines.
	</p>

	<p>
		In the unique case these lines are parallel there is only one solution. Otherwise, this method will always return two lines.
	</p>

	<div class="full" id="canvas-line-bisect"></div>

	<pre class="code"><code>lineA.<f>bisect</f>(lineB)</code></pre>

	<p class="quote">
		This is origami axiom #3.
	</p>

	<p>
		The order of these solutions will always sort first the smaller interior angle, when the lines are similar directions, and similar directions means the dot product is > 0.
	</p>

	<hr>

	<p>
		The <b>nearest point</b> on a line can be located by projecting the point down to the line, along the line's normal.
	</p>

	<p>
		In the case of rays and segments, the projection might lie beyond the endpoints. The nearest point is set to that endpoint.
	</p>

	<div id="nearest-point"></div>

	<pre class="code"><code><f>var</f> point <key>=</key> segment.<f>nearestPoint</f>(<span id="nearest-point-mouse"></span>)</code></pre>

<!-- 	<p>
		This is a useful tool for visualizing the dot product, which is a <b>projection</b> onto another vector.
	</p>

	<div id="canvas-vector-dot"></div>
	<div id="canvas-vector-dot-key"></div>

	<pre class="code"><code><f>var</f> dotProduct <key>=</key> vec1.<f>dot</f>(vec2)</code></pre>
    var line = RabbitEar.line([0, 0], pointA));
		line.nearestPoint(pointB)

	<pre class="code"><code>line.<f>nearestPoint</f>(pointB)</code></pre>
 -->
<h2>Circle</h2>

	<p>
		A preliminary step in uniaxial-base origami design is circle-packing.
	</p>

	<div id="canvas-circle-packing"></div>

	<p>
		In many cases circle math is a retrospective on the math of ancient Greece. Circles can intersect lines and find tangent points.
	</p>

<h2>Polygon</h2>

	<p>
		A <b>Polygon</b> is a ordered set of <b>points</b> which defines the boundary. This <b>ConvexPolygon</b> is built using the convex hull algorithm, and it can <b>clip</b> lines, rays, and segments.
	</p>

	<div id="canvas-convex-hull"></div>

	<pre class="code"><code><f>var</f> polygon <key>=</key> <f>Polygon</f>.<f>convexHull</f>(pointA, pointB, ...)</code></pre>
	
	<p>
		A <b>straight skeleton</b> is unique polygon. It's a Voronoi diagram of the edges of the polygon. Both the <a href="//erikdemaine.org/foldcut/#skeleton">fold-and-one-cut algorithm</a> and the origami <a href="//langorigami.com/article/treemaker/">universal molecule</a> rely on the straight skeleton.
	</p>

	<div id="canvas-origami-molecule"></div>

	<p class="explain">
		contribute to the straight skeleton code <a href="https://github.com/robbykraft/Origami/blob/master/src/fold/origami.js">here</a>
	</p>

	<h3>Intersections</h3>

	<p>
		Let's revisit the folding simulator example that uses a reflection matrix. We need to be able to <b>split a polygon</b> with a line.
	</p>

	<p>
		The intersection between a line and a convex polygon can result in these number of intersections:
	</p>
	<ul>
		<li><b>0</b>: no intersection</li>
		<li><b>1</b>: collinear to a point</li>
		<li><b>2</b>: intersects the polygon</li>
		<li><b>Infinity</b>: collinear to an segment</li>
	</ul>

	<div class="diptych">
		<div id="canvas-clip-line"></div>
		<div id="canvas-clip-segment"></div>
	</div>

	<pre class="code"><code><span id="clip-line-result"></span> <key>=</key> poly.<f>clipline</f>(line)</code></pre>

	<p>
		Edges and rays can result in a similar set, but one difference:
	</p>
	<ul>
		<li><b>1</b>: it's possible one point is inside and one outside</li>
	</ul>

	<pre class="code"><code><f>var</f> clipped <key>=</key> polygon.<f>clipSegment</f>( <f>Edge</f>(<n>0.5</n>, <n>0</n>, <n>0.5</n>, <n>1</n>) )</code></pre>
	
	<p class="quote">
		A non-convex polygon cannot make such guarantees.
	</p>

<h2 id="angles">ANGLES</h2>

	<p>
		The space between two vectors creates two interior angles. It's important to distinguish between vectors <b>a</b> and <b>b</b> the <b>clockwise</b> or the <b>counter-clockwise</b> interior angle.
	</p>

<h3>Bisect</h3>

	<p>
		Two vectors bisected results in two answers. This function will return the bisection of the smaller interior angle first.
	</p>

	<div id="canvas-sector-bisect"></div>

	<pre class="code"><code><f>bisect</f>(<arg>vec1</arg>, <arg>vec2</arg>)</code></pre>

	<p>
		Kawasaki's theorem, a fundamental measurement of flat-foldability, relies on the measurement of angles.
	</p>

	<p>
		An oddly non-trivial problem is we need to be able to measure the angle between two vectors.
	</p>

<h2 id="appendix">APPENDIX</h2>

<h3>Vector()</h3>

<pre>
<lc>// properties</lc>
float magnitude

<lc>// methods</lc>
function isEquivalent (...) -> boolean
function isParallel (...) -> boolean
function dot (...) -> number
function cross (...) -> number
function distanceTo (...) -> number
function normalize () -> vector
function transform (...) -> vector
function add (...) -> vector
function subtract (...) -> vector
function rotateZ (angle, origin) -> vector
function rotateZ90 () -> vector
function rotateZ180 () -> vector
function rotateZ270 () -> vector
function reflect (...) -> vector
function lerp (vector, pct) -> vector
function scale (mag) -> vector
function midpoint (...) -> vector
function bisect (...) -> vector
</pre>

<h3>Matrix2() (two-dimensional)</h3>
<pre>
function multiply (...)
function determinant ()
function inverse ()
function translate (x, y)
function scale (...)
function rotate (...)
function reflect (...)
function transform (...)
function transformVector (vector)
function transformLine (origin, vector)
</pre>

<h3>Matrix() (three-dimensional)</h3>
<pre>
function multiply (...)
function determinant ()
function inverse ()
function translate (x, y, z)
function rotateX (angle_radians)
function rotateY (angle_radians)
function rotateZ (angle_radians)
function rotate (angle_radians, vector, origin)
function scale (amount)
function reflectZ (vector, origin)
function transform (...)
function transformVector (vector)
function transformLine (origin, vector)
</pre>


<h3>Line()</h3>
<pre>
function isParallel (line, epsilon)
function isDegenerate ()
function reflection ()
function nearestPoint (...)
function intersect (other)
function intersectLine (...)
function intersectRay (...)
function intersectSegment (...)
function bisectLine (...)
function bisectRay (...)
function bisectSegment (...)
function transform (...)
</pre>

<h3>Ray()</h3>
<pre>
(include Line)
function rotate180 ()
</pre>

<h3>Segment()</h3>
<pre>
(include Line)
function vector ()
function midpoint ()
function magnitude ()
</pre>

<h3>Polygon()</h3>
<pre>
function area ()
function midpoint ()
function enclosingRectangle ()
function sectors ()
function contains (...)
function polyCentroid ()
function nearest (...)
function clipSegment (...)
function clipLine (...)
function clipRay (...)
function split (...)
function scale (magnitude, center)
function rotate (angle, centerPoint)
function translate (...)
function transform (...)
</pre>


<h3>ConvexPolygon()</h3>
<pre>
  (including above)
function overlaps (...)
</pre>


<h3>Rectangle</h3>
<pre>
function scale (magnitude, center_point)
function rotate (...)
function transform (...)
</pre>


<h3>Circle</h3>
<pre>
function intersectionLine (...)
function intersectionRay (...)
function intersectionSegment (...)
</pre>


<h2 id="links">Links</h2>

	<p>
		This stand-alone library is <a href="https://github.com/robbykraft/Math">available here</a>.
	</p>

	<p>
		The source code is <a href="https://github.com/robbykraft/Math">available</a> as well.
	</p>

	<div id="canvas-polygon-overlaps"></div>


<script type="text/javascript" src="../ui-tests/junction_bisect.js"></script>
<script type="text/javascript" src="../ui-tests/vector_lerp.js"></script>
<script type="text/javascript" src="../ui-tests/vector_labels.js"></script>
<!-- <script type="text/javascript" src="../ui-tests/vector_dot.js"></script> -->
<!-- <script type="text/javascript" src="../ui-tests/vector_dot_2.js"></script> -->
<script type="text/javascript" src="../ui-tests/matrix_reflection.js"></script>
<script type="text/javascript" src="../ui-tests/matrix_basis.js"></script>
<script type="text/javascript" src="../ui-tests/line_ray_edge_intersection.js"></script>
<script type="text/javascript" src="../ui-tests/line_bisect.js"></script>
<script type="text/javascript" src="../ui-tests/line_nearest_point.js"></script>
<script type="text/javascript" src="../ui-tests/circle_packing.js"></script>
<script type="text/javascript" src="../ui-tests/polygon_fold.js"></script>
<script type="text/javascript" src="../ui-tests/polygon_clip_line.js"></script>
<script type="text/javascript" src="../ui-tests/polygon_clip_segment.js"></script>
<script type="text/javascript" src="../ui-tests/polygon_convex_hull.js"></script>
<!-- <script type="text/javascript" src="../ui-tests/polygon_overlaps.js"></script> -->
<script type="text/javascript" src="../ui-tests/polygon_skeleton.js"></script>
<script type="text/javascript" src="../ui-tests/sector_bisect.js"></script>

<!-- <script type="text/javascript" src="../tests/polygon_contains.js"></script> -->

<script type="text/javascript">
katex.render("\\begin{bmatrix} a & c & tx \\\\ b & d & ty \\end{bmatrix}", document.getElementById("matrix-1"));
katex.render("\\begin{bmatrix} a & c \\\\ b & d \\end{bmatrix}", document.getElementById("matrix-2"));
katex.render("\\begin{bmatrix} a & c & tx \\\\ b & d & ty \\end{bmatrix}", document.getElementById("matrix-3"));
</script>
<script type="text/javascript">
vectorTextCallback = function(event){
	if (event.vector != null){
		var pointString = "<n>" + (event.vector[0]).toFixed(2) + "</n>, " + "<n>" + (event.vector[1]).toFixed(2) + "</n>";
		document.getElementById("vec-sketch-vector").innerHTML = pointString;
		// var normalString = "<n>" + (event.normalized[0]).toFixed(2) + "</n>, " + "<n>" + (event.normalized[1]).toFixed(2) + "</n>";
		var normalString = "" + (event.normalized[0]).toFixed(2) + ", " + "" + (event.normalized[1]).toFixed(2) + "";
		document.getElementById("vec-sketch-normal").innerHTML = "[" + normalString + "]";
	}
}
lerpsCallback = function(event) {
	if(event.t != null) {
		var timeString = "<n>" + event.t.toFixed(2) + "</n>";
		document.getElementById("lerp-time-1").innerHTML = timeString;
		document.getElementById("lerp-time-2").innerHTML = timeString;
		document.getElementById("lerp-time-3").innerHTML = timeString;
	}
}
nearestPointCallback = function(event) {
	if (event.mouse != null) {
		var pointString = "<n>" + (event.mouse[0]).toFixed(2) + "</n>, " + "<n>" + (event.mouse[1]).toFixed(2) + "</n>";
		document.getElementById("nearest-point-mouse").innerHTML = pointString;
	}
}
basisVecSketchCallback = function(event) {
	if (event.axes == null) { return; }
	katex.render("\\begin{bmatrix} "+event.axes[0][0].toFixed(1)+" & "+event.axes[1][0].toFixed(1)+" & "+event.origin[0].toFixed(1)+" \\\\ "+event.axes[0][1].toFixed(1)+" & "+event.axes[1][1].toFixed(1)+" & "+event.origin[1].toFixed(1)+" \\end{bmatrix}", document.getElementById("matrix-2"));
}
matrixReflectCallback = function(event) {
	if (event.matrix == null) { return; }
	katex.render("\\begin{bmatrix} "+event.matrix[0].toFixed(1)+" & "+event.matrix[2].toFixed(1)+" & "+event.matrix[4].toFixed(1) +" \\\\ "+event.matrix[1].toFixed(1)+" & "+event.matrix[3].toFixed(1)+" & "+event.matrix[5].toFixed(1) +" \\end{bmatrix}", document.getElementById("matrix-3"));
	document.getElementById("reflection-segment-params").innerHTML = "<n>"
		+ parseInt(event.segment[0].x) + "</n>, <n>"
		+ parseInt(event.segment[0].y) + "</n>, <n>"
		+ parseInt(event.segment[1].x) + "</n>, <n>"
		+ parseInt(event.segment[1].y) + "</n>";
}
clipLineCallback = function(event) {
	var e = event.edge == null ? [] : event.edge.slice(0, 2);
	var ps = e.map((p, i) => "[<n>" + e[i][0].toFixed(0) + "</n>, <n>" + e[i][1].toFixed(0) + "</n>]")
		.join(", ");
	document.getElementById("clip-line-result").innerHTML = ps;
}
// clipSegmentCallback = function(event) { }

</script>

<?php include 'footer.php';?>
