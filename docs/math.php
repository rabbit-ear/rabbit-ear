<?php include 'header.php';?>
<script type="text/javascript" src="include/katex/katex.min.js"></script>
<link rel="stylesheet" href="include/katex/katex.min.css">


<span style="color:#e44f2a"></span>
<span style="color:#ecb233"></span>
<span style="color:#6096bb"></span>

<h3 style="text-align:center;margin-top:3em;">CHAPTER I.</h3>

<h1>EUCLIDEAN GEOMETRY</h1>

<section>
	<div id="canvas-junction-bisect"></div>
	<p>The mathematics of ancient Greece: Euclid and compass-straight edge geometry, finds a contemporary home in the mathematics of origami.</p>
	<p>Including other familiar math as well, often presented in a fresh perspective.</p>
	<div class="centered">
		<pre><code><f>RabbitEar</f>.math</code></pre>
	</div>
	<p class="quote">Every operation described below is found under this subheading.</p>
	<p class="explain">This Javascript math library is its own <a href="https://github.com/robbykraft/Geometry">open-source and free library</a>.</p>
</section>

<section id="types">
	<h2>PRIMITIVES</h2>
	<!-- <p>This library contains a growing list of about ten primitives.</p> -->
	<div class="centered">
		<pre class="compact"><code><f>RabbitEar</f>.math
┃
┣━ <v>Vector</v>
┣━ <v>Matrix2</v>
┣━ <v>Line</v>
┣━ <v>Ray</v>
┣━ <v>Edge</v>
┣━ <v>Junction</v>
┣━ <v>Sector</v>
┣━ <v>Rectangle</v>
┣━ <v>Circle</v>
┣━ <v>Polygon</v>
┣━ <v>ConvexPolygon</v>
┗━ core</code></pre>
	</div>
</section>

<section id="vector">
	<h3>Point / Vector</h3>
	<p>Consider this object from two perspectives:</p>
	<ul>
		<li>a point in space, as measured from the origin (0,0)</li>
		<li>a translation away from another point in space</li>
	</ul>
	<p>We call this object a <b>vector</b>.</p>

	<div id="canvas-vector-labels"></div>
	<div class="centered">
		<pre><code><f>let</f> point <key>=</key> <f>Vector</f>(<span id="vec-sketch-vector"><n>0.5</n>, <n>0.666</n></span>)<br><span id="vec-sketch-normal"></span>point.<f>normalize</f>() <br>point.<f>cross</f>([<n>0</n>,<n>0</n>,<n>1</n>]) <span style="color:#6096bb">// cross product with +Z</span></code></pre>
	</div>
	<p>Notice the y axis is positive in the downwards direction. <b>I did not make this decision</b> it's a computer graphics standard, I've learned that fighting against it just causes more problems.</p>
	<p class="explain">This vector object is not limited to 2D, it works in n-dimensions.</p>
	<!-- <h4>Linear Interpolation</h4> -->
	<div id="canvas-lerp"></div>
	<div class="centered">
		<pre><code><span style="color:#6096bb">blue1</span> = <span style="color:#e44f2a">red1</span>.lerp(<span style="color:#e44f2a">red2</span>, t)<br><span style="color:#6096bb">blue2</span> = <span style="color:#e44f2a">red2</span>.lerp(<span style="color:#e44f2a">red3</span>, t)<br><span style="color:#ecb233">yellow</span> = <span style="color:#6096bb">blue1</span>.lerp(<span style="color:#6096bb">blue2</span>, t)</code></pre>
	</div>

	<p>This vector object is <b>immutable</b>.</p>
	<p>Each vector operation returns a <b>new, transformed vector</b>. This approach generally applies to the entire library.</p>

	<div class="centered">
<pre><code><c>// return a bool</c>
<f>function</f> <v>isEquivalent</v>(<arg>vector</arg>)
<f>function</f> <v>isParallel</v>(<arg>vector</arg>)</code></pre>

<pre><code><c>// return a number</c>
<f>function</f> <v>dot</v>(<arg>vector</arg>)
<f>function</f> <v>cross</v>(<arg>vector</arg>) <c>// vector, in 3D+</c>
<f>function</f> <v>magnitude</v>()
<f>function</f> <v>distanceTo</v>(<arg>vector</arg>)</code></pre>

<pre><code><c>// return a vector</c>
<f>function</f> <v>add</v>(<arg>vector</arg>)
<f>function</f> <v>subtract</v>(<arg>vector</arg>)

<f>function</f> <v>normalize</v>()
<f>function</f> <v>scale</v>(<arg>magnitude</arg>)
<f>function</f> <v>midpoint</v>(<arg>vector</arg>)
<f>function</f> <v>lerp</v>(<arg>vector</arg>, <arg>magnitude</arg>)

<f>function</f> <v>transform</v>(<arg>matrix</arg>)
<f>function</f> <v>reflect</v>(<arg>line</arg>)
<f>function</f> <v>rotateZ</v>(<arg>angle</arg>, <arg>origin</arg>)
<f>function</f> <v>rotateZ90</v>()
<f>function</f> <v>rotateZ180</v>()
<f>function</f> <v>rotateZ270</v>()
<f>function</f> <v>bisect</v>(<arg>vector</arg>)</code></pre>
</div>

	<p>Keep in mind these two takes on the same object, <b>point</b> and <b>vector</b>. A point might not use magnitude() often, whereas a vector might never use distanceTo().</p>

</section>

<section id="matrix">

<h3>MATRIX</h3>

	<div class="quote">
		<div id="matrix-1"></div>
	</div>

	<p>Matrices are a powerful representation for geometric transformations. Inside of one matrix can contain instructions for any number of rotations, translations, reflections, scaling, shearing.</p>

	<div id="canvas-matrix-basis"></div>

	<div class="quote">
		<div id="matrix-2"></div>
	</div>

	<p>When a sheet of paper is folded, one side is <b>reflected</b> across the crease line.</p>

	<div id="canvas-fold-poly"></div>


	<p>A matrix for 2D transformations needs 6 numbers: 4 for rotation, scaling, and reflection operations, and 2 for translation.</p>

<h3 id="reflection">Reflection</h3>

	<p>A 2x2 matrix is sufficient to represent a reflection line that goes through the origin. For all lines, an additional 1x2 column is required.</p>

	<div id="canvas-reflection"></div>
<!-- 
	<div class="quote large">
		<div id="matrix-1"></div>
	</div> -->

	<p class="quote">Any line type (Line, Ray, Edge) can be turned into a reflection matrix.</p>

	<div class="centered">
		<pre><code><f>let</f> matrix <key>=</key> edge.<v>reflectionMatrix</v>()</code></pre>
	</div>

</section>

<section id="line">
<h3><span style="color:#ecb233">Lines</span>, <span style="color:#195783">Rays</span>, <span style="color:#e44f2a">Segments</span></h3>

	<div id="canvas-line-ray-edge-intersection"></div>

	<p><b><span style="color:#ecb233">Lines</span></b> extend infinitely in both directions, <b><span style="color:#347298">rays</span></b> extend infinitely in one direction, and line segments, or <b><span style="color:#e44f2a">edges</span></b> are bound by two endpoints.</p>


	<div class="centered">
		<pre><code><f>let</f> line <key>=</key> <f>Line</f>(<span id="intersect-all-line"></span>)<br><f>let</f> ray <key>=</key> <f>Ray</f>(<span id="intersect-all-ray"></span>)<br><f>let</f> segment <key>=</key> <f>Edge</f>(<span id="intersect-all-edge"></span>)</code></pre>
	</div>


	<p>Line and Ray are initialized with two arguments:</p>
		
	<div class="centered">
		<pre><code><f>Line</f>(<arg>origin_point</arg>, <arg>direction_vector</arg>)</code></pre>
	</div>

	<p>Edge however is initialized with two endpoints:</p>

	<div class="centered">
		<pre><code><f>Edge</f>(<arg>point_1</arg>, <arg>point_2</arg>)</code></pre>
	</div>

	<p>Lines, rays, and edges all contain a point and a vector. An Edges's endpoints can be accessed with array syntax:</p>

	<div class="centered">
		<pre><code><c>// line, ray, edge</c><br>line.<f>point</f><br>line.<f>vector</f><br><c>// edge only</c><br>edge[<n>0</n>]<br>edge[<n>1</n>]</code></pre>
	</div>

	<p>We can ask two lines to <b>bisect</b>. This method returns an array of two lines (if the lines are not parallel), always sorting the yellow first, the smaller interior angle solution when the dot product is > 0.</p>

	<p>This operation is essentially origami axiom #3.</p>

	<div id="canvas-line-bisect"></div>

	<div class="centered">
		<pre><code>yellow.<f>bisect</f>(red)</code></pre>
	</div>

	<p>The nearest point on a line to another point can be located if you draw a normal vector that passes through the point.</p>

	<p>In the case of line segments, the normal might lie beyond the endpoints. The shortest point is now one of the two endpoints.</p>

	<div id="nearest-point"></div>

	<div class="centered">
		<pre><code><f>let</f> point <key>=</key> edge.<f>nearestPoint</f>(<span id="nearest-point-mouse"></span>)</code></pre>
	</div>

<h3>Circle</h3>

	<div id="canvas-circle-line"></div>

<h3>Polygon</h3>

	<p>A <b>Polygon</b> is a ordered set of <b>points</b> which defines the boundary. This <b>ConvexPolygon</b> is built using the convex hull algorithm, and it can clip <b>lines</b>, <b>rays</b>, and <b>edges</b>.</p>

	<div id="canvas-convex-hull"></div>

	<p class="quote">The convex hull algorithm performed on a collection of points</p>
	
	<div class="centered">
		<pre><code><f>let</f> polygon <key>=</key> <f>Polygon</f>()</code></pre>
	</div>

	<div id="canvas-clip-line"></div>

	<div id="canvas-split-poly"></div>

	<div class="centered">
		<pre><code><f>let</f> clipped <key>=</key> polygon.<f>clipEdge</f>( <f>Edge</f>(<n>0.5</n>, <n>0</n>, <n>0.5</n>, <n>1</n>) )</code></pre>
	</div>

	<p class="quote">Clipping functions return an edge with a new set of endpoints.</p>
	
	<div id="canvas-polygon-contains"></div>

	<div id="canvas-polygon-overlaps"></div>

</section>

<section id="angles">

<h2>ANGLES</h2>

	<p>The space between two vectors creates two interior angles. It's important to distinguish between vectors <b>a</b> and <b>b</b> the <b>clockwise</b> or the <b>counter-clockwise</b> interior angle.</p>

<h3>Bisect</h3>

	<div id="canvas-bisect"></div>

	<p>Two vectors bisected results in two answers. This function will return the bisection of the smaller interior angle first.</p>

	<div class="centered">
		<canvas id="canvas-sector-bisect" resize></canvas>
	</div>

	<div class="centered">
		<pre><code>[<v>XY</v>,<v>XY</v>] <key>=</key> <v>bisect</v>(<arg>a</arg><key>:</key><v>XY</v>, <arg>b</arg><key>:</key><v>XY</v>) </code></pre>
	</div>

</section>


<section>

<h2>APPENDIX</h2>

	<div class="centered">
		<pre class="compact"><code><f>RabbitEar</f>.math
┃
┣━ Circle
┣━ ConvexPolygon
┣━ ...
┗━ <v>core</v></code></pre>
</section>

<p>contains methods like:</p>

<p>centroid, convex_hull, cross, dot, multiply_vector2_matrix2, signed_area, split_polygon, among many, many more.</p>

<p>These methods are also available as properties on the primitives, but here they all are laid out and it's easier to spot them.</p>

<script type="text/javascript" src="../tests/junction_bisect.js"></script>
<script type="text/javascript" src="../tests/line_ray_edge_intersection.js"></script>
<script type="text/javascript" src="../tests/line_bisect.js"></script>
<script type="text/javascript" src="../tests/line_nearest_point.js"></script>
<script type="text/javascript" src="../tests/sector_bisect.js"></script>
<script type="text/javascript" src="../tests/vector_lerp.js"></script>
<script type="text/javascript" src="../tests/vector_labels.js"></script>
<script type="text/javascript" src="../tests/circle_line.js"></script>
<script type="text/javascript" src="../tests/polygon_fold.js"></script>
<script type="text/javascript" src="../tests/polygon_split1.js"></script>
<script type="text/javascript" src="../tests/polygon_split2.js"></script>
<script type="text/javascript" src="../tests/polygon_convex_hull.js"></script>
<script type="text/javascript" src="../tests/polygon_contains.js"></script>
<script type="text/javascript" src="../tests/polygon_overlaps.js"></script>
<script type="text/javascript" src="../tests/matrix_reflection.js"></script>
<script type="text/javascript" src="../tests/matrix_basis.js"></script>
<script type="text/javascript">
katex.render("\\begin{bmatrix} a & c & tx \\\\ b & d & ty \\end{bmatrix}", document.getElementById("matrix-1"));
katex.render("\\begin{Bmatrix} a & c \\\\ b & d \\end{Bmatrix}", document.getElementById("matrix-2"));
// katex.render("\\begin{Bmatrix} tx \\\\ ty \\end{Bmatrix}", document.getElementById("matrix-3"));
</script>
<script type="text/javascript">
vecTextSketchCallback = function(event){
	if (event.vector != null){
		let pointString = "<n>" + (event.vector[0]).toFixed(2) + "</n>, " + "<n>" + (event.vector[1]).toFixed(2) + "</n>";
		document.getElementById("vec-sketch-vector").innerHTML = pointString;
		let normalString = "<n>" + (event.normalized[0]).toFixed(2) + "</n>, " + "<n>" + (event.normalized[1]).toFixed(2) + "</n>";
		document.getElementById("vec-sketch-normal").innerHTML = "[" + normalString + "] <key>=</key> ";
	}
}
nearestPointCallback = function(event) {
	if (event.mouse != null) {
		let pointString = "<n>" + (event.mouse[0]).toFixed(2) + "</n>, " + "<n>" + (event.mouse[1]).toFixed(2) + "</n>";
		document.getElementById("nearest-point-mouse").innerHTML = pointString;
	}
}
basisVecSketchCallback = function(event) {
	if (event.axes == null) { return; }
	
	katex.render("\\begin{Bmatrix} "+event.axes[0][0].toFixed(1)+" & "+event.axes[1][0].toFixed(1)+" \\\\ "+event.axes[0][1].toFixed(1)+" & "+event.axes[1][1].toFixed(1)+" \\end{Bmatrix}", document.getElementById("matrix-2"));
}
</script>

<?php include 'footer.php';?>
