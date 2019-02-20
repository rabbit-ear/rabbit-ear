<?php include 'header.php';?>

<h1>EUCLIDEAN GEOMETRY</h1>

<section>
	<div id="canvas-bisect"></div>
	<p>This library includes a suite of geometry tools capable of being used independently of any origami calculations.</p>
	<div class="centered">
		<pre><code><f>RabbitEar</f>.math</code></pre>
	</div>
	<p class="explain">Include this math library in your own projects: <a href="https://github.com/robbykraft/Geometry">code is here</a>.</p>
</section>

<section id="types">
	<h2>PRIMITIVES</h2>
	<h3>Points / Vector</h3>
	<p>A vector is represented by its components in 2D space: x and y. We call this class object a <b>vector</b>.</p>
	<div id="canvas-vector-labels"></div>
	<div class="centered">
		<pre><code><f>let</f> point <key>=</key> <f>Vector</f>(<span id="vec-sketch-vector"><n>0.5</n>, <n>0.666</n></span>)<br>point.<f>normalize</f>() <span style="color:#e44f2a">// normalized vector</span><br>point.<f>dot</f>() <span style="color:#ecb233">// dot product</span><br>point.<f>cross</f>([<n>0</n>,<n>0</n>,<n>1</n>]) <span style="color:#6096bb">// cross product with +Z</span></code></pre>
	</div>
	<p class="explain">The vector object capable of being generalized to n-dimensions.</p>

	<!-- <h4>Linear Interpolation</h4> -->
	<div id="canvas-lerp"></div>
	<div class="centered">
		<pre><code><span style="color:#6096bb">blue1</span> = <span style="color:#e44f2a">red1</span>.lerp(<span style="color:#e44f2a">red2</span>, t)<br><span style="color:#6096bb">blue2</span> = <span style="color:#e44f2a">red2</span>.lerp(<span style="color:#e44f2a">red3</span>, t)<br><span style="color:#ecb233">yellow</span> = <span style="color:#6096bb">blue1</span>.lerp(<span style="color:#6096bb">blue2</span>, t)</code></pre>
	</div>

	<h3><span style="color:#ecb233">Lines</span>, <span style="color:#195783">Rays</span>, <span style="color:#e44f2a">Segments</span></h3>

	<div id="canvas-line-ray-edge"></div>

	<p><b>Mathematical lines</b> extend infinitely in both directions, <b>rays</b> extend infinitely in one direction, and line segments, or <b>edges</b> are bound by two endpoints.</p>

	<div id="canvas-intersection"></div>

	<div class="centered">
		<pre><code><f>let</f> segment <key>=</key> <f>Edge</f>(<span id="intersect-all-edge"></span>)<br><f>let</f> ray <key>=</key> <f>Ray</f>(<span id="intersect-all-ray"></span>)<br><f>let</f> line <key>=</key> <f>Line</f>(<span id="intersect-all-line"></span>)</code></pre>
	</div>

	<div id="nearest-point"></div>

	<div class="centered">
		<pre><code><f>let</f> segment <key>=</key> <f>Edge</f>(<span id="intersect-all-edge"></span>)<br><f>let</f> ray <key>=</key> <f>Ray</f>(<span id="intersect-all-ray"></span>)<br><f>let</f> line <key>=</key> <f>Line</f>(<span id="intersect-all-line"></span>)</code></pre>
	</div>


	<div id="canvas-clipping"></div>
	
	<p class="quote">Four arguments describe two points <b>(x1, y1, x2, y2)</b>.</p>

	<p><b>Edges</b> and <b>lines</b> are defined by two collinear points, <b>rays</b> however are defined by an <b>origin</b> and a <b>direction vector</b>.</p>

<h3>Polygon</h3>

	<p>A <b>ConvexPolygon</b> object is defined its <b>edges</b>, it contains the classic convex hull algorithm, and can clip <b>lines</b>, <b>rays</b>, and <b>edges</b> into a new edge which fits within its boundary.</p>

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

<section>
<h3>Distance</h3>

	<p>The nearest point on a line to another point can be located if you draw a normal vector that passes through the point.</p>

	<p>In the case of line segments, the normal might lie beyond the endpoints. The shortest point is now one of the two endpoints.</p>

	<div class="centered">
		<canvas id="canvas-point-normal" class="half" resize></canvas>
		<canvas id="canvas-point-nearest" class="half" resize></canvas>
	</div>

	<p>The sketch on the left determines the nearest point only using a normal vector and the sketch on the right includes the endpoints in the calculation.</p>

</section>

<script type="text/javascript" src="../tests/line_ray_edge.js"></script>
<script type="text/javascript" src="../tests/line_nearest_point.js"></script>
<script type="text/javascript" src="../tests/sector_bisect.js"></script>
<script type="text/javascript" src="../tests/vector_lerp.js"></script>
<script type="text/javascript" src="../tests/vector_labels.js"></script>
<script type="text/javascript" src="../tests/clipping.js"></script>
<script type="text/javascript" src="../tests/polygon_split1.js"></script>
<script type="text/javascript" src="../tests/polygon_split2.js"></script>
<script type="text/javascript" src="../tests/matrix_reflection.js"></script>
<script type="text/javascript" src="../tests/polygon_convex_hull.js"></script>
<script type="text/javascript" src="../tests/polygon_contains.js"></script>
<script type="text/javascript" src="../tests/polygon_overlaps.js"></script>
<script type="text/javascript" src="../tests/line_intersection.js"></script>


<script type="text/javascript">
vecSketchCallback = function(event){
	if (event.vector != null){
		let pointString = "<n>" + (event.vector[0]).toFixed(2) + "</n>, " + "<n>" + (event.vector[1]).toFixed(2) + "</n>";
		document.getElementById("vec-sketch-vector").innerHTML = pointString;
	}
}
</script>


<?php include 'footer.php';?>
