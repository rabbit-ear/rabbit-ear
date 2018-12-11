<?php include 'header.php';?>


<h1>EUCLIDEAN GEOMETRY</h1>

<section>
	<div id="canvas-bisect"></div>
	<p>This library includes a suite of geometry tools that can be leveraged independently of the rest of the origami related code.</p>
	<p class="explain">It's possible to import only this math library and leave out all origami related code. All operations are performed on basic number types and arrays.</p>

</section>

<section id="types">
	<h2>PRIMITIVES</h2>
	<h3>Points</h3>
	<p>A point is represented by its components in 2D space: x and y. We call this class object an <b>XY</b>.</p>
	<div id="canvas-clipping"></div>
	<div class="centered">
		<pre><code><key>let</key> point <key>=</key> <key>new</key> <v>XY</v>(<n>0.5</n>, <n>0.666</n>)</code></pre>
	</div>

<h3>Lines, Rays, Segments</h3>
	<p><b>Mathematical lines</b> extend infinitely in both directions, <b>rays</b> extend infinitely in one direction, and line segments, or <b>edges</b> are bound by two endpoints.</p>

	<div id="canvas-intersection"></div>

	<div class="centered">
		<pre><code><key>let</key> segment <key>=</key> <key>new</key> <v>Edge</v>(<span id="intersect-all-edge"></span>)<br><key>let</key> ray <key>=</key> <key>new</key> <v>Ray</v>(<span id="intersect-all-ray"></span>)<br><key>let</key> line <key>=</key> <key>new</key> <v>Line</v>(<span id="intersect-all-line"></span>)</code></pre>
	</div>
	
	<p class="quote">Four arguments describe two points <b>(x1, y1, x2, y2)</b>.</p>

	<p><b>Edges</b> and <b>lines</b> are defined by two collinear points, <b>rays</b> however are defined by an <b>origin</b> and a <b>direction vector</b>.</p>

<h3>Polygon</h3>

	<p>A <b>ConvexPolygon</b> object is defined its <b>edges</b>, it contains the classic convex hull algorithm, and can clip <b>lines</b>, <b>rays</b>, and <b>edges</b> into a new edge which fits within its boundary.</p>

	<div id="canvas-convex-hull"></div>

	<p class="quote">The convex hull algorithm performed on a collection of points</p>
	
	<div class="centered">
		<pre><code><key>let</key> polygon <key>=</key> <key>new</key> <v>ConvexPolygon</v>()</code></pre>
	</div>

	<div id="canvas-clip-line"></div>

	<div id="canvas-clip-poly"></div>

	<div class="centered">
		<pre><code><key>let</key> clipped <key>=</key> polygon.<f>clipEdge</f>( <key>new</key> <v>Edge</v>(<n>0.5</n>, <n>0</n>, <n>0.5</n>, <n>1</n>) )</code></pre>
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
		<pre><code><key>let</key> matrix <key>=</key> edge.<v>reflectionMatrix</v>()</code></pre>
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

<script type="text/javascript" src="../tests/bisect.js"></script>
<script type="text/javascript" src="../tests/clipping.js"></script>
<script type="text/javascript" src="../tests/clip_line.js"></script>
<script type="text/javascript" src="../tests/clip_poly.js"></script>
<script type="text/javascript" src="../tests/reflection.js"></script>
<script type="text/javascript" src="../tests/convex_hull.js"></script>
<script type="text/javascript" src="../tests/polygon_contains.js"></script>
<script type="text/javascript" src="../tests/polygon_overlaps.js"></script>
<script type="text/javascript" src="../tests/intersection.js"></script>

<?php include 'footer.php';?>
