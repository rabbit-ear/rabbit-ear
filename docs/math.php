<?php include 'header.php';?>

<h3 style="text-align:center;margin-top:3em;">CHAPTER I.</h3>

<h1>EUCLIDEAN GEOMETRY</h1>

<section>
	<div id="canvas-junction-bisect"></div>
	<p>The mathematics of ancient Greece, compass-straight edge geometry, finds a contemporary home in origami math.</p>
	<div class="centered">
		<pre><code><f>RabbitEar</f>.math</code></pre>
	</div>
	<p>Origami makes use of the familiar math of today, like graphs, affine transformations, line intersections - though often presenting them from a new perspective.</p>
	<p class="explain">This math presented here is now its own Javascript library, open-source and available <a href="https://github.com/robbykraft/Geometry">here</a>.</p>
</section>

<section id="types">
	<h2>PRIMITIVES</h2>
	<h3>Point / Vector</h3>
	<p>Consider this object from two perspectives (spoiler, they are the same):</p>
	<ul>
		<li>a point in space, as measured from the origin (0,0)</li>
		<li>a translation away from another point in space</li>
	</ul>
	<p>We call this object a <b>vector</b>.</p>
	<div id="canvas-vector-labels"></div>
	<div class="centered">
		<pre><code><f>let</f> point <key>=</key> <f>Vector</f>(<span id="vec-sketch-vector"><n>0.5</n>, <n>0.666</n></span>)<br>point.<f>normalize</f>() <span style="color:#e44f2a">// normalized vector</span><br>point.<f>dot</f>() <span style="color:#ecb233">// dot product</span><br>point.<f>cross</f>([<n>0</n>,<n>0</n>,<n>1</n>]) <span style="color:#6096bb">// cross product with +Z</span></code></pre>
	</div>
	<p>Notice the y axis is positive in the downwards direction. <b>I did not make this decision</b> it's a computer graphics standard, I've learned that fighting against it just causes more problems.</p>
	<p class="explain">This vector object is not limited to 2D, it works in n-dimensions.</p>

	<!-- <h4>Linear Interpolation</h4> -->
	<div id="canvas-lerp"></div>
	<div class="centered">
		<pre><code><span style="color:#6096bb">blue1</span> = <span style="color:#e44f2a">red1</span>.lerp(<span style="color:#e44f2a">red2</span>, t)<br><span style="color:#6096bb">blue2</span> = <span style="color:#e44f2a">red2</span>.lerp(<span style="color:#e44f2a">red3</span>, t)<br><span style="color:#ecb233">yellow</span> = <span style="color:#6096bb">blue1</span>.lerp(<span style="color:#6096bb">blue2</span>, t)</code></pre>
	</div>

<h3><span style="color:#ecb233">Lines</span>, <span style="color:#195783">Rays</span>, <span style="color:#e44f2a">Segments</span></h3>

	<div id="canvas-line-ray-edge-intersection"></div>

	<p><b>Mathematical lines</b> extend infinitely in both directions, <b>rays</b> extend infinitely in one direction, and line segments, or <b>edges</b> are bound by two endpoints.</p>

	<div class="centered">
		<pre><code><f>let</f> segment <key>=</key> <f>Edge</f>(<span id="intersect-all-edge"></span>)<br><f>let</f> ray <key>=</key> <f>Ray</f>(<span id="intersect-all-ray"></span>)<br><f>let</f> line <key>=</key> <f>Line</f>(<span id="intersect-all-line"></span>)</code></pre>
	</div>

	<p>Lines, rays, and edges all contain a point and a vector.</p>

	<div class="centered">
		<pre><code><c>// one line</c><br>line.<f>point</f><br>line.<f>vector</f><br><c>// one edge</c><br>edge.<f>point</f><br>edge.<f>vector</f></code></pre>
	</div>

	<p>Edges are unique, an edge's endpoints can be accessed with array syntax.</p>

	<div class="centered">
		<pre><code>edge[<n>0</n>] <c>// endpoint 1</c><br>edge[<n>1</n>] <c>// endpoint 2</c></code></pre>
	</div>

	<p>We can ask two lines to <b>bisect</b>. This method returns an array of two lines (if the lines are not parallel), always sorting the yellow first, the smaller interior angle solution when the dot product is > 0.</p>

	<p>This operation is essentially origami axiom #3.</p>

	<div id="canvas-line-bisect"></div>

	<div class="centered">
		<pre><code>line_a.<f>bisect</f>(line_b)</code></pre>
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


<section id="matrix">

<h2>MATRIX</h2>

	<div class="quote large">
		<div class="inline" id="matrix-2"></div><div class="inline" id="matrix-3"></div>
	</div>


	<p>Matrices are the dark arts of geometric transformations. Inside of one matrix can contain instructions for any number of rotations, translations, reflections, scaling, shearing (mathematically speaking some of those are redundant).</p>

	<div id="canvas-matrix-basis"></div>

	<div class="quote large">
		<div id="matrix-2"></div>
	</div>

	<p>A matrix for 2D transformations needs 6 numbers: 4 for rotation, scaling, and reflection operations, and 2 for translation.</p>

<h3 id="reflection">Reflection</h3>

	<p>A 2x2 matrix is sufficient to represent a reflection line that goes through the origin. For all lines, an additional 1x2 column is required.</p>

	<div id="canvas-reflection"></div>

	<div class="quote large">
		<div id="matrix-1"></div>
	</div>

	<p class="quote">Any line type (Line, Ray, Edge) can be turned into a reflection matrix.</p>

	<div class="centered">
		<pre><code><f>let</f> matrix <key>=</key> edge.<v>reflectionMatrix</v>()</code></pre>
	</div>

</section>

	<div class="centered">
		<pre><code><f>function</f> <v>magnitude</v>()
<f>function</f> <v>normalize</v>()
<f>function</f> <v>dot</v>(<arg>vector</arg>)
<f>function</f> <v>cross</v>(<arg>vector</arg>)
<f>function</f> <v>distanceTo</v>(<arg>vector</arg>)
<f>function</f> <v>transform</v>(<arg>matrix</arg>)
<f>function</f> <v>add</v>(<arg>vector</arg>)
<f>function</f> <v>subtract</v>(<arg>vector</arg>)
<f>function</f> <v>rotateZ</v>(<arg>angle</arg>, <arg>origin</arg>)
<f>function</f> <v>rotateZ90</v>()
<f>function</f> <v>rotateZ180</v>()
<f>function</f> <v>rotateZ270</v>()
<f>function</f> <v>reflect</v>(<arg>line</arg>)
<f>function</f> <v>lerp</v>(<arg>vector</arg>, <arg>magnitude</arg>)
<f>function</f> <v>isEquivalent</v>(<arg>vector</arg>)
<f>function</f> <v>isParallel</v>(<arg>vector</arg>)
<f>function</f> <v>scale</v>(<arg>magnitude</arg>)
<f>function</f> <v>midpoint</v>(<arg>vector</arg>)
<f>function</f> <v>bisect</v>(<arg>vector</arg>)</code></pre>
	</div>

<script type="text/javascript" src="../tests/junction_bisect.js"></script>
<script type="text/javascript" src="../tests/line_ray_edge_intersection.js"></script>
<script type="text/javascript" src="../tests/line_bisect.js"></script>
<script type="text/javascript" src="../tests/line_nearest_point.js"></script>
<script type="text/javascript" src="../tests/sector_bisect.js"></script>
<script type="text/javascript" src="../tests/vector_lerp.js"></script>
<script type="text/javascript" src="../tests/vector_labels.js"></script>
<script type="text/javascript" src="../tests/clipping.js"></script>
<script type="text/javascript" src="../tests/circle_line.js"></script>
<script type="text/javascript" src="../tests/polygon_split1.js"></script>
<script type="text/javascript" src="../tests/polygon_split2.js"></script>
<script type="text/javascript" src="../tests/polygon_convex_hull.js"></script>
<script type="text/javascript" src="../tests/polygon_contains.js"></script>
<script type="text/javascript" src="../tests/polygon_overlaps.js"></script>
<script type="text/javascript" src="../tests/matrix_reflection.js"></script>
<script type="text/javascript" src="../tests/matrix_basis.js"></script>

<script type="text/javascript">
vecSketchCallback = function(event){
	if (event.vector != null){
		let pointString = "<n>" + (event.vector[0]).toFixed(2) + "</n>, " + "<n>" + (event.vector[1]).toFixed(2) + "</n>";
		document.getElementById("vec-sketch-vector").innerHTML = pointString;
	}
}
nearestPointCallback = function(event) {
	if (event.mouse != null) {
		let pointString = "<n>" + (event.mouse[0]).toFixed(2) + "</n>, " + "<n>" + (event.mouse[1]).toFixed(2) + "</n>";
		document.getElementById("nearest-point-mouse").innerHTML = pointString;
	}
}
</script>

<?php include 'footer.php';?>
